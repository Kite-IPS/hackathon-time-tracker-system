from . import db
from datetime import datetime, timezone


class Team(db.Model):

    _id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True)

    members = db.relationship("student", backref="team")

class Student(db.Model):
    
    rfid_num = db.Column(db.String(10), primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    roll_num = db.Column(db.String(10), unique=True, nullable=False)
    team_id = db.Column(db.Integer, db.ForeignKey("team._id"))

class Entry(db.Model):
    
    _id = db.Column(db.Integer, primary_key=True)
    student = db.Column(db.String(10), db.ForeignKey("student.rfid_num"))
    timestamp = db.Column(db.DateTime, nullable=False, default= lambda: datetime.now(timezone.tzname("Asia/Kolkata")))
