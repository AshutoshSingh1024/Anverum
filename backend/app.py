from pathlib import Path
import json

from flask import Flask, jsonify, send_from_directory

BASE_DIR = Path(__file__).resolve().parent
FRONTEND_DIR = BASE_DIR.parent / "frontend"
DATA_FILE = BASE_DIR / "data" / "articles.json"

app = Flask(__name__, static_folder=None)


def load_articles():
    with DATA_FILE.open("r", encoding="utf-8") as file:
        return json.load(file)


@app.get("/")
def index():
    return send_from_directory(FRONTEND_DIR, "index.html")


@app.get("/article.html")
def article_page():
    return send_from_directory(FRONTEND_DIR, "article.html")


@app.get("/css/<path:filename>")
def css(filename):
    return send_from_directory(FRONTEND_DIR / "css", filename)


@app.get("/js/<path:filename>")
def js(filename):
    return send_from_directory(FRONTEND_DIR / "js", filename)


@app.get("/assets/<path:filename>")
def assets(filename):
    return send_from_directory(FRONTEND_DIR / "assets", filename)


@app.get("/api/articles")
def articles():
    return jsonify(load_articles())


@app.get("/api/articles/<article_id>")
def article(article_id):
    articles = load_articles()

    for item in articles:
        if item["id"] == article_id:
            return jsonify(item)

    return jsonify({"error": "Article not found"}), 404


if __name__ == "__main__":
    app.run(debug=True)
