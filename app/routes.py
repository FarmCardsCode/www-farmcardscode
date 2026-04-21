from flask import Blueprint, render_template, abort
from pathlib import Path
import json
from datetime import datetime

bp = Blueprint("main", __name__)

NEWS_DIR = Path(__file__).resolve().parent / "content" / "news"

def load_news_posts():
    posts = []

    if not NEWS_DIR.exists():
        return posts
    
    for file_path in NEWS_DIR.glob("*.json"):
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                post = json.load(f)

            # Skip unpublished posts
            if not post.get("published", False):
                continue

            # Basic required fields check
            required_fields = ["slug", "title", "date", "category", "summary", "body"]
            if not all(field in post for field in required_fields):
                continue

            # Parse date for sorting
            post["_date_obj"] = datetime.strptime(post["date"], "%Y-%m-%d")
            posts.append(post)

        except (json.JSONDecodeError, ValueError):
            # Skip malformed files
            continue
    posts.sort(key=lambda p: p["_date_obj"], reverse=True)

    return posts

def get_news_post_by_slug(slug):
    posts = load_news_posts()
    for post in posts:
        if post["slug"] == slug:
            return post
    return None

@bp.get("/")
def index():
    cards = [
        {
            "label": "STATUS",
            "title": "Under Construction",
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
    cards = [
        {
            "label": "CODE FOUNDATIONS",
            "title": "Intro to Computer Science",
            "body": (
                "Build a strong foundation in coding, computing, networking, and digital safety through hands-on projects and real-world technology concepts."
            ),
            "topics": [
                "Python Programming - build code, solve problems, and create interactive projects",
                "Computing and Networking Basics - understand computers, the client-server model, and how devices communicate",
                "Cybersecurity and Emerging Tech - explore digital safety, online threats, AI, and quantum computing",
            ]
        },
        {
            "label": "NETWORKING BASICS",
            "title": "IT & Security",
            "body": "Take a deeper dive into systems, networks, Linux, and security tools through practical labs and technical investigation.",
            "topics": [
                "Networks and Infrastructure - learn DHCP, DNS, ports, protocols, addressing, and packet flow",
                "Linux and Technical Tools - work with the command line, Wireshark, Nessus, and core IT workflows",
                "Security Operations - study attack vectors, SQL/SQLi concepts, logging, compliance, and layered defense",
            ],
        },
        {
            "label": "CYBER FUNDAMENTALS",
            "title": "Cybersecurity",
            "body": "Apply advanced security concepts through hands-on labs aligned to the CompTIA Security+ exam and real-world cybersecurity practice.",
            "topics": [
                "Offensive and Defensive Security - practice SQLi, Metasploit, pentesting concepts, and web app security",
                "Cryptography and Trust - learn PKI, certificates, encryption, and secure communications",
                "Security+ and Real-World Risk - connect governance, logging, GRC, physical security, and supply chain risk to Security+ preparation",
            ],
        },
    ]
    return render_template("classes.html", cards=cards)

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
    posts = load_news_posts()
    featured_post = next((post for post in posts if post.get("featured")), None)

    return render_template(
        "news.html",
        posts=posts,
        featured_post=featured_post,
    )

@bp.get("/news/<slug>")
def news_post(slug):
    post = get_news_post_by_slug(slug)

    if post is None:
        abort(404)

    return render_template("news_post.html", post=post)
