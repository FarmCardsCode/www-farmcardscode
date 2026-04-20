from flask import Blueprint, render_template

bp = Blueprint("main", __name__)

@bp.get("/")
def index():
    cards = [
        {
            "label": "STATUS",
            "title": "UNDER ACTIVE DEVELOPMENT",
            "body": "The site is now running as a Flask application and will expand into a full program portal."
        },
        {
            "label": "FOCUS",
            "title": "Programming + Cybersecurity",
            "body": "Course information, pathway guidance, Security+ preparation, and student-facing resources."
        },
        {
            "label": "NODE TIME",
            "title": "Live System Status",
            "body": "The platform is running live on Debian with Gunicorn and Cloudflare Tunnel."
        }
    ]

    return render_template("index.html", cards=cards)

@bp.get("/classes")
def classes():
    return render_template("classes.html")

@bp.get("/pathway")
def pathway():
    return render_template("pathway.html")

@bp.get("/news")
def news():
    return render_template("news.html")

