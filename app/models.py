from . import db
from .config import Config
from datetime import datetime, timedelta

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
        time = {f"hrs": hours, "mins": minutes}
            
        return time
    
    def team_total_time(self):
        return total_time * len(self.members)
    

class Student(db.Model):
    rfid_num = db.Column(db.String(10), primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    roll_num = db.Column(db.String(10), unique=True, nullable=False)
    team_id = db.Column(db.Integer, db.ForeignKey("team._id"))
    
    team = db.relationship("Team", backref="Student")
    
    def time_out(self):
        entries = db.session.query(Entry).filter_by(student_rfid=self.rfid_num)
        manual_entries = db.session.query(Entry).filter_by(roll_num=self.roll_num)
        entries = entries.union(manual_entries).order_by(Entry.timestamp).all()        

        # adding current time as last entry to make calculation easy
        tz = Config.get_timezone()
        entries = list((tz.localize(entry.timestamp) for entry in entries))
        entries.append(datetime.now(Config.get_timezone()))
        time_blocks = []

        for i in range(len(entries)-1):
            time_blocks.append(entries[i+1] - entries[i])
        
        time_spent = timedelta()
        for i in [block[1] for block in enumerate(time_blocks) if block[0] % 2 == 0]:
            time_spent += i

        max_time = timedelta(hours=total_time)
        if time_spent > max_time:
            time_spent = max_time
        
        total_seconds = time_spent.total_seconds()
        hours = total_seconds // 3600  # 3600 seconds in an hour
        minutes = (total_seconds % 3600) // 60  # Remaining minutes after extracting hours
            
        return {"hrs": hours, "mins": minutes}

    @classmethod
    def status(cls,student):
        return cls.in_out(student)
    
    @classmethod
    def in_out(cls, student):
        db.session.expire_all()
        entries = db.session.query(Entry).filter_by(student_rfid=student.rfid_num)
        manual_entries = db.session.query(Entry).filter_by(roll_num=student.roll_num)
        total_entries = entries.union(manual_entries).order_by(Entry.timestamp).count()        
        
        return "IN" if total_entries % 2 != 0 else "OUT"

    def status(self):
        db.session.expire_all()
        
        entries = db.session.query(Entry).filter_by(student_rfid=self.rfid_num)
        manual_entries = db.session.query(Entry).filter_by(roll_num=self.roll_num)
        total_entries = entries.union(manual_entries).order_by(Entry.timestamp).count()

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
    timestamp = db.Column(db.DateTime, nullable=False, default= lambda: datetime.now(Config.get_timezone()))
    device_key = db.Column(db.String(10), db.ForeignKey("hardware_unit.key"))
    roll_num = db.Column(db.String(10), db.ForeignKey("student.roll_num"))

    @classmethod
    def make_entry(cls, rfid_num, device_key):
        entry = cls(student_rfid=rfid_num, device_key=device_key)
        db.session.add(entry)
        db.session.commit()

    @classmethod
    def human_entry(cls, roll_num, device_key):
        entry = cls(roll_num=roll_num, device_key=device_key)
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
