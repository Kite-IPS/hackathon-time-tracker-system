from flask import Blueprint, render_template, request
from .models import *

bp = Blueprint("main", __name__)

@bp.route("/")
def dashboard():
    return render_template('index.html')

@bp.route("/team")
def team():
    page = request.args.get('page', 1, type = int)
    teams = Team.query.all()
    return render_template('team.html', teams=teams )

@bp.route("/students")
def student():
    page = request.args.get('page', 1, type = int)
    students = Student.query.all() 
    return render_template('students.html', students=students)

@bp.route("/team-details")
def teamDetails():
    page = request.args.get('page', 1, type = int)
    teams = Team.query.all()
    return render_template('teamDetails.html', teams= teams)