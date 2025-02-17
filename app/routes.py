from flask import Blueprint, render_template, request, logging, jsonify
from .models import *

bp = Blueprint("main", __name__)

@bp.route("/")
def dashboard():
    page = request.args.get('page', 1, type=int)
    teams = Team.query.all()
    students = Student.query.all()
    
    total_students = len(students)
    total_teams = len(teams)
    # Check if the request is for HTML or JSON
    if request.accept_mimetypes.best == 'application/json':
        # Return the teams data as JSON for API requests
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
        # Otherwise, return the team page in HTML
        return render_template("index.html", teams=teams, total_time=total_time, total_students=total_students, total_teams=total_teams)

@bp.route("/team")
def team():
    page = request.args.get('page', 1, type = int)
    teams = Team.query.all()
    # Check if the request is for HTML or JSON
    if request.accept_mimetypes.best == 'application/json':
        # Return the teams data as JSON for API requests
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
        # Otherwise, return the team page in HTML
        return render_template("team.html", teams=teams, total_time=total_time)


@bp.route("/students")
def student():
    page = request.args.get('page', 1, type = int)
    students = Student.query.all() 
    #Check if the request is for HTML or JSON
    if request.accept_mimetypes.best == 'application/json':
        # Return the teams data as JSON for API requests
        students_data = [
            {
                "teamid": student.team_id,
                "team": student.name,
                "timeSpent": student.time_out(),
                "totalTime": total_time,
            }
            for student in students
        ]
        return jsonify(students_data)
    else:
        # Otherwise, return the team page in HTML
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
                "status" : Student.status()
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


@bp.route("/template_route")
def template():
    render_template("hello.html")