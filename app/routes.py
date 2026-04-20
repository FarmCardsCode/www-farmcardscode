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
    pathway_intro = {
        "headline": "Cybersecurity Pathway",
        "subtitle": (
            "Students progress through a sequence of computer science and "
            "cybersecurity courses that leads to preparation for the "
            "CompTIA Security+ certification exam."
        )
    }

    steps = [
        {
            "step": "Step 1",
            "title": "Intro to Computer Science",
            "body": (
                "Build foundational knowledge in computing, programming, "
                "problem solving, and how software systems work."
            )
        },
        {
            "step": "Step 2",
            "title": "IT & Security",
            "body": (
                "Develop understanding of operating systems, networking, "
                "hardware, and core information security concepts."
            )
        },
        {
            "step": "Step 3",
            "title": "Cybersecurity",
            "body": (
                "Apply security principles through deeper study of threats, "
                "defensive strategies, secure systems, and hands-on technical practice."
            )
        },
        {
            "step": "Step 4",
            "title": "CompTIA Security+",
            "body": (
                "Complete the pathway by preparing for and passing the "
                "CompTIA Security+ certification exam."
            )
        },
    ]

    outcomes = [
        "Understand core computing, networking, and security fundamentals",
        "Develop technical problem-solving and analytical skills",
        "Gain preparation for an industry-recognized certification",
        "Build readiness for college, career, and further cybersecurity study",
    ]

    completion = (
        "A student completes the Cybersecurity Pathway by successfully completing "
        "Intro to Computer Science, IT & Security, and Cybersecurity, and then "
        "earning the CompTIA Security+ certification."
    )


    return render_template(
        "pathway.html",
        pathway_intro=pathway_intro,
        steps=steps,
        outcomes=outcomes,
        completion=completion,
    )

@bp.get("/news")
def news():
    return render_template("news.html")

