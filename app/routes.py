from flask import Blueprint, render_template, request, logging, jsonify, flash, redirect, url_for
from .models import *
import logging

bp = Blueprint("main", __name__)

@bp.route("/")
def dashboard():
    page = request.args.get('page', 1, type=int)
    teams = Team.query.all()
    students = Student.query.all()
    
    total_students = len(students)
    total_teams = len(teams)

    if request.accept_mimetypes.best == 'application/json':
        
        teams_data = [
            {
                "teamid": team._id,
                "team": team.name,
                "timeSpent": team.team_time_out(),
                "totalTime": team.team_total_time(),
            }
            for team in teams
        ]
        return jsonify(teams_data)
    else:
        
        return render_template("index.html", teams=teams, total_time=total_time, total_students=total_students, total_teams=total_teams)

@bp.route("/team")
def team():
    page = request.args.get('page', 1, type = int)
    teams = Team.query.all()
    
    if request.accept_mimetypes.best == 'application/json':
        
        teams_data = [
            {
                "teamid": team._id,
                "team": team.name,
                "timeSpent": team.team_time_out(),
                "totalTime": total_time,
            }
            for team in teams
        ]
        return jsonify(teams_data)
    else:
        return render_template("team.html", teams=teams, total_time=total_time)


@bp.route("/students")
def student():
    page = request.args.get('page', 1, type = int)
    students = Student.query.all() 
    
    if request.accept_mimetypes.best == 'application/json':
        
        students_data = [
            {
                "teamid": student.team_id,
                "rollNum" : student.roll_num,
                "name": student.name,
                "timeSpent": student.time_out(),
                "totalTime": total_time,
            }
            for student in students
        ]
        return jsonify(students_data)
    else:
        return render_template("students.html", students=students, total_time=total_time)

@bp.route("/team-details", methods=["GET"])
def teamDetails():
    selected_team_id = request.args.get('teamid')

    if not selected_team_id:
        return jsonify({"error": "No team ID provided"}), 400

    team = Team.query.filter_by(_id=selected_team_id).first()
    students_in_team = Student.query.filter_by(team_id=selected_team_id).all()

    if not team:
        return jsonify({"error": "Team not found"}), 404
    
    students_data = []
    for student in students_in_team:
        students_data.append({
                "name": student.name,                    
                "rollNum" : student.roll_num,
                "timeSpent": student.time_out(),
                "totalTime": total_time,
                "status" : Student.status(student)
            })


    if request.accept_mimetypes.best == 'application/json':
        team_data = {
            "name":team.name,
            "timeSpent": team.team_time_out(),
            "totalTime": total_time
        }
        
        
        return jsonify({"team": team_data, "students": students_data})

    return render_template(
        'teamDetails.html',
        team_data=team,
        students_in_team=students_in_team,
        total_time=total_time
    )

@bp.route("/venue-management", methods=["GET", "POST"])
def venueManagement():
    if request.method == "POST":
        name = request.form.get("name")
        total_capacity = request.form.get("total_capacity")
        
        try:
            total_capacity = int(total_capacity)
            venue = Venue(name=name, total_capacity=total_capacity)
            db.session.add(venue)
            db.session.commit()
            
            flash("Venue added successfully!", "success")
        
        except ValueError:
            flash("Total Capacity must be a number", "danger")
        except Exception as e:
            flash(f"Error:{e}","danger")
            db.session.rollback()
    
    venues = Venue.query.all() 
    hardware_units = HardwareUnit.query.all()
    venues_data =[{
            "name": venue.name,
            "total_capacity": venue.total_capacity 
        } for venue in venues]
    hardware_unit = [{
        "id":hardware_unit._id,
        "name": hardware_unit.name,
        "venue": hardware_unit.venue,
        "key": hardware_unit.key
    } for hardware_unit in hardware_units
    ]
    
    return render_template("venueManagement.html", venues=venues_data, hardware_units=hardware_units)



@bp.route("/venue-management/slar", methods=["POST", "GET"])
def save_slar_unit():
    if request.method == "POST":
        data = request.get_json()
        name = data.get('slarName')
        venue = data.get('venue')
        key = data.get('expectedKey')
        try:
            if not name or not name or not key:
                raise ValueError("Missing required fields")
            
            # Check existing venue
            venue = Venue.query.filter_by(name=venue).first()
            if not venue:
                raise ValueError(f"Venue {venue} does not exist.")

            # Save SLAR Unit
            slar_unit = HardwareUnit(name= name, venue=venue, key=key)
            db.session.add(slar_unit)
            db.session.commit()

            return jsonify({"message": "SLAR unit saved successfully"}), 200

        except ValueError as e:
            flash(str(e), "danger")
            return jsonify({"error": str(e)}), 400
        except Exception as e:
            flash(f"Error: {str(e)}", "danger")
            return jsonify({"error": str(e)}), 500
    
    slar_units = HardwareUnit.query.all()
    slar_unit = [{
        "name": slar.name,
        "venue": slar.venue.name, 
        "key": slar.key
    } for slar in slar_units
    ]
    return render_template("venueManagement.html", slars=slar_units)

@bp.route("/endpoint", methods=["GET"])
def device_endpoint():
    rfid_num = request.args.get("rfid_num")
    device_key = request.args.get("device_key")
    if rfid_num == None or device_key == None:
        raise AssertionError
    Entry.make_entry(rfid_num, device_key)
    return "success"

@bp.route("/template_route")
def template():
    render_template("hello.html")
    
@bp.route("/venue")
def venue():
    venues = Venue.query.all()
    students = Student.query.all()
    teams = Team.query.all()
    
    venue_data = [{
        "name" : venue.name, 
        "total_capacity" : venue.total_capacity
    } for venue in venues
    ]

    # Retrieve teams and their venue details
    team_data = []
    for team in teams:
        latest_entry = (
            db.session.query(Entry, HardwareUnit)
            .join(HardwareUnit, Entry.device_key == HardwareUnit.key)
            .filter(Entry.student_rfid.in_([s.rfid_num for s in team.members]))
            .order_by(Entry.timestamp.desc())
            .first()
        )
        venue_name = latest_entry.HardwareUnit.venue if latest_entry else "No Venue Assigned"
        
        team_data.append({
            "team": team.name,
            "venue": venue_name,
            "members": [s.name for s in team.members]
        })

    # Retrieve students, their teams, and venue locations
    student_data = []
    for student in students:
        latest_entry = (
            db.session.query(Entry, HardwareUnit)
            .join(HardwareUnit, Entry.device_key == HardwareUnit.key)
            .filter(Entry.student_rfid == student.rfid_num)
            .order_by(Entry.timestamp.desc())
            .first()
        )
        venue_name = latest_entry.HardwareUnit.venue if latest_entry else "No Venue Assigned"

        student_data.append({
            "name": student.name,
            "roll_num": student.roll_num,
            "team": student.team.name if student.team else "No Team",
            "venue": venue_name
        })


    return render_template("venue.html",
        venues= venue_data,
        students = student_data,
        teams = team_data
    )
