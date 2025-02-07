from flask import Blueprint, render_template
from .models import *

bp = Blueprint("main", __name__)

@bp.route("/")
def home():
    return "Success"