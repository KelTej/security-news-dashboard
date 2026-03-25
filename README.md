# Security News Dashboard

An AI-powered cybersecurity news dashboard built with Python, Flask, and the Anthropic Claude API.

## What it does

Fetches the latest cybersecurity news and uses AI to analyze each article, providing:
- Threat category (Malware, Data Breach, Vulnerability, Ransomware, Phishing, Nation State)
- Severity rating (Critical, High, Medium, Low)
- Plain-English summary of each article
- Key takeaway for security professionals
- Live stats on total articles, critical threats, and data breaches

## Why I built this

The purpose of this tool is to help Security professionals stay on top of the latest threats despite the lack of available time to search for current articles. This dashboard uses AI to triage and summarize cybersecurity news in real time, making threat intelligence more accessible.

## Tech stack

- Python, Flask
- Anthropic Claude API (claude-haiku)
- NewsAPI for live cybersecurity headlines
- HTML, CSS, JavaScript

## How to run it locally

1. Clone this repository
2. Install dependencies: `pip3 install anthropic flask requests`
3. Get a free API key from newsapi.org
4. Add your Anthropic API key and NewsAPI key to `app.py`
5. Run the server: `python3 app.py`
6. Open `http://127.0.0.1:5500` in your browser

## Skills demonstrated

- Python backend development
- Flask web framework
- Multiple API integrations
- AI-powered content analysis
- Prompt engineering
- Full stack development (Python + HTML/CSS/JS)
- Data visualization and dashboard design

## Author

Kelvin — Forensic Case Manager transitioning into Cybersecurity
M.S. Cybersecurity & Applied AI student at Capella University
GitHub: https://github.com/KelTej