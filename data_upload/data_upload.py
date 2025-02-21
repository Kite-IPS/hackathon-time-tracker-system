import csv
from app import db
from app.models import Team, Student, Venue, HardwareUnit  # Adjust import based on your project structure
from datetime import datetime

def load_teams(csv_file):
    """Load teams from CSV."""
    with open(csv_file, mode='r') as file:
        reader = csv.DictReader(file)
        for row in reader:
            team = Team.query.filter_by(name=row['name']).first()
            if not team:
                team = Team(name=row['name'])
                db.session.add(team)
    db.session.commit()
    print(f"Teams loaded from {csv_file}")

def load_students(csv_file):
    """Load students from CSV."""
    with open(csv_file, mode='r') as file:
        reader = csv.DictReader(file)
        for row in reader:
            team = Team.query.filter_by(name=row['team']).first()
            if team:
                student = Student.query.filter_by(rfid_num=row['rfid_num']).first()
                if not student:
                    student = Student(
                        rfid_num=row['rfid_num'],
                        name=row['name'],
                        roll_num=row['roll_num'],
                        team_id=team._id
                    )
                    db.session.add(student)
    db.session.commit()
    print(f"Students loaded from {csv_file}")

def load_venues(csv_file):
    """Load venues from CSV."""
    with open(csv_file, mode='r') as file:
        reader = csv.DictReader(file)
        for row in reader:
            venue = Venue.query.filter_by(name=row['name']).first()
            if not venue:
                venue = Venue(name=row['name'], total_capacity=int(row['total_capacity']))
                db.session.add(venue)
    db.session.commit()
    print(f"Venues loaded from {csv_file}")

def load_hardware_units(csv_file):
    """Load hardware units from CSV."""
    with open(csv_file, mode='r') as file:
        reader = csv.DictReader(file)
        for row in reader:
            venue = Venue.query.filter_by(name=row['venue']).first()
            if venue:
                hardware_unit = HardwareUnit.query.filter_by(key=row['key']).first()
                if not hardware_unit:
                    hardware_unit = HardwareUnit(
                        name=row['name'],
                        venue=row['venue'],
                        key=row['key']
                    )
                    db.session.add(hardware_unit)
    db.session.commit()
    print(f"Hardware Units loaded from {csv_file}")

if __name__ == '__main__':
    # Load all data from the CSV files
    load_teams('teams.csv')
    load_students('students.csv')
    load_venues('venues.csv')
    load_hardware_units('hardware_units.csv')
