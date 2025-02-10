from . import db
from datetime import datetime, timezone

total_time = 10800 # Per person 30 hrs

class Team(db.Model):

    _id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True)

    members = db.relationship("Student", backref="Team")
    
    @classmethod
    def team_time_out(self):
        return sum(member.time_spent_out() for member in self.members if member.time_spent_out is not None)

class Student(db.Model):
    rfid_num = db.Column(db.String(10), primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    roll_num = db.Column(db.String(10), unique=True, nullable=False)
    team_id = db.Column(db.Integer, db.ForeignKey("team._id"))
    
    @classmethod
    def time_out(cls, rfid_num):
        entries = Entry.query.filter_by(student=cls.rfid_num).order_by(Entry.timestamp).all()
        total_time_out = 0
        last_in_time = None
        
        for entry in entries:
            if entry._id % 2 != 0: # Check In
                last_in_time = entry.timestamp
            elif entry._id % 2 == 0 and last_in_time: # Check Out
                total_time_out += (entry.timestamp - last_in_time).total_seconds() // 60
                last_in_time = None
        
        return total_time_out
        
class Entry(db.Model):
    _id = db.Column(db.Integer, primary_key=True)
    student = db.Column(db.String(10), db.ForeignKey("student.rfid_num"))
    timestamp = db.Column(db.DateTime, nullable=False, default= lambda: datetime.now(timezone.tzname("Asia/Kolkata")))
    
    @classmethod # Do we need this?
    def in_out(cls, _id, student):
        return "in" if _id % 2 != 0 else "out"
    
    
