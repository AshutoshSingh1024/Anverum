# Anverum

Anverum is a curiosity-focused website built around questions, investigation, and sources.

## Current structure

- `frontend/` - HTML, CSS, JavaScript, and static assets
- `backend/` - Flask application and API
- `backend/data/articles.json` - initial article data
- `requirements.txt` - Python dependencies

## Run locally

1. Create and activate a virtual environment if desired.
2. Install dependencies:

   `pip install -r requirements.txt`

3. Start the application:

   `python backend/app.py`

4. Open:

   `http://127.0.0.1:5000`

The frontend is served by Flask, and article data is exposed through:

- `/api/articles`
- `/api/articles/<article_id>`

## Adding an article

Add another object to `backend/data/articles.json` with:

- `id`
- `title`
- `date`
- `summary`
- `intro`
- `body`
- `sources`
- `next_id`
- `next_title`

This is deliberately JSON-based for the first version. A database can be introduced later when the content actually justifies one.
