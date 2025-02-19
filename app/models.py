from . import db
from datetime import datetime, timedelta
import sqlite3

total_time = 30 # Per person 30 hrs
class Team(db.Model):

    _id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True)

    members = db.relationship("Student", backref="Team")
    
    def team_time_out(self):

        members_time = [member.time_out() for member in self.members]
        delta = timedelta()
        
        for time in members_time:
            delta += timedelta(hours=time["hrs"], minutes=time["mins"])
        
        total_seconds = delta.total_seconds()
        hours = total_seconds // 3600  # 3600 seconds in an hour
        minutes = (total_seconds % 3600) // 60  # Remaining minutes after extracting hours
            
        return {"hrs": hours, "mins": minutes}
    
    def team_total_time(self):
        return total_time * len(self.members)
    

class Student(db.Model):
    rfid_num = db.Column(db.String(10), primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    roll_num = db.Column(db.String(10), unique=True, nullable=False)
    team_id = db.Column(db.Integer, db.ForeignKey("team._id"))
    
    team = db.relationship("Team", backref="Student")
    
    def time_out(self):
        entries = Entry.query.filter_by(student_rfid=self.rfid_num).order_by(Entry.timestamp).all()
        total_time_out = 0
        last_in_time = None
        
        for entry in entries:
            if entry._id % 2 != 0: # Check In
                last_in_time = entry.timestamp
            elif entry._id % 2 == 0 and last_in_time: # Check Out
                total_time_out += (entry.timestamp - last_in_time).total_seconds() //3600 # In hours
                last_in_time = None
        
        return total_time_out

    @classmethod
    def status(cls,student):
        return cls.in_out(student)
    
    @classmethod
    def in_out(cls, student):
        db.session.expire_all()
        total_entries = Entry.query.filter_by(student_rfid=student.rfid_num).count()
        return "IN" if total_entries % 2 != 0 else "OUT"

    def status(self):
        db.session.expire_all()
        total_entries = Entry.query.filter_by(student_rfid=self.rfid_num).count()
        return "IN" if total_entries % 2 != 0 else "OUT"

        
    @classmethod
    def get_venue(rfid_num):
        entry = db.session.query(Entry).filter_by(student_rfid = rfid_num).order_by(Entry.timestamp.desc()).first()
        if not entry:
            return "No entry records for this student"
        
        hardware = db.session.query(HardwareUnit).filter_by(key = entry.device_key).first()
        if not hardware:
            return "No hardware unit found for this device"
        
        return hardware.venue
    
class Entry(db.Model):
    _id = db.Column(db.Integer, primary_key=True)
    student_rfid = db.Column(db.String(10), db.ForeignKey("student.rfid_num"))
    timestamp = db.Column(db.DateTime, nullable=False, default= lambda: datetime.now(timezone.utc))
    device_key = db.Column(db.String(10), db.ForeignKey("hardware_unit.key"))

    @classmethod
    def make_entry(cls, rfid_num, device_key):
        entry = cls(student_rfid=rfid_num, device_key=device_key)
        db.session.add(entry)
        db.session.commit()

class Venue(db.Model):
    __tablename__ = 'venue'
    name = db.Column(db.String(100), primary_key=True)
    total_capacity = db.Column(db.Integer)

class HardwareUnit(db.Model):

    _id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    venue = db.Column(db.String(100), db.ForeignKey("venue.name"))
    key = db.Column(db.String(10), unique=True)
