from flask import Flask, request, jsonify, send_from_directory
import anthropic
import requests
import json
import traceback

app = Flask(__name__)

ANTHROPIC_KEY = "YOUR_ANTHROPIC_KEY_HERE"
NEWS_API_KEY = "YOUR_NEWS_API_KEY_HERE"

anthropic_client = anthropic.Anthropic(api_key=ANTHROPIC_KEY)

@app.route("/")
def index():
    with open("index.html", "r") as f:
        content = f.read()
    from flask import Response
    return Response(content, mimetype="text/html")

@app.route("/static/<path:filename>")
def static_files(filename):
    return send_from_directory("static", filename)

@app.route("/fetch-news", methods=["GET"])
def fetch_news():
    try:
        url = f"https://newsapi.org/v2/everything?q=cybersecurity+hacking+malware&language=en&sortBy=publishedAt&pageSize=10&apiKey={NEWS_API_KEY}"
        response = requests.get(url)
        data = response.json()

        if data.get("status") != "ok":
            return jsonify({"error": "Failed to fetch news"}), 500

        articles = []
        for article in data["articles"]:
            if article.get("title") and article.get("description"):
                articles.append({
                    "title": article["title"],
                    "description": article["description"],
                    "url": article["url"],
                    "source": article["source"]["name"],
                    "publishedAt": article["publishedAt"]
                })

        return jsonify({"articles": articles})

    except Exception as e:
        print("ERROR:", traceback.format_exc())
        return jsonify({"error": str(e)}), 500

@app.route("/analyze-article", methods=["POST"])
def analyze_article():
    try:
        data = request.json
        title = data.get("title", "")
        description = data.get("description", "")

        prompt = f"""You are a cybersecurity analyst. Analyze this news article and return ONLY a valid JSON object with no extra text, no markdown, no backticks.

The JSON must follow this exact structure:
{{
  "category": one of "Malware", "Data Breach", "Vulnerability", "Ransomware", "Phishing", "Nation State", "Other",
  "severity": one of "Critical", "High", "Medium", "Low",
  "summary": "1-2 sentence plain English summary",
  "key_takeaway": "one actionable insight for security professionals"
}}

Article Title: {title}
Article Description: {description}"""

        message = anthropic_client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=500,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )

        raw_text = message.content[0].text.replace("```json", "").replace("```", "").strip()
        result = json.loads(raw_text)
        return jsonify(result)

    except Exception as e:
        print("ERROR:", traceback.format_exc())
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5500)