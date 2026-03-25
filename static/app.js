const refreshBtn = document.getElementById("refreshBtn");
const dashboard = document.getElementById("dashboard");
const loading = document.getElementById("loading");
const stats = document.getElementById("stats");

refreshBtn.addEventListener("click", fetchNews);

async function fetchNews() {
  refreshBtn.textContent = "Loading...";
  refreshBtn.disabled = true;
  loading.style.display = "block";
  dashboard.innerHTML = "";
  stats.style.display = "none";

  try {
    const response = await fetch("/fetch-news");
    const data = await response.json();

    if (data.error) {
      alert("Failed to fetch news: " + data.error);
      return;
    }

    const articles = data.articles;
    const analyzed = [];

    for (const article of articles) {
      const result = await analyzeArticle(article);
      if (result) {
        analyzed.push({ ...article, ...result });
        renderCard({ ...article, ...result });
      }
    }

    updateStats(analyzed);
    stats.style.display = "grid";

  } catch (error) {
    alert("Something went wrong. Make sure the Python server is running.");
    console.error(error);
  } finally {
    refreshBtn.textContent = "Fetch Latest News";
    refreshBtn.disabled = false;
    loading.style.display = "none";
  }
}

async function analyzeArticle(article) {
  try {
    const response = await fetch("/analyze-article", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: article.title,
        description: article.description
      })
    });
    return await response.json();
  } catch (error) {
    console.error("Failed to analyze article:", error);
    return null;
  }
}

function renderCard(article) {
  const card = document.createElement("div");
  card.className = "article-card";

  const categoryClass = "category-" + article.category.toLowerCase().replace(" ", "-");
  const severityClass = "severity-" + article.severity.toLowerCase();

  card.innerHTML = `
    <div class="card-header">
      <span class="category-badge ${categoryClass}">${article.category}</span>
      <span class="severity-badge ${severityClass}">${article.severity}</span>
    </div>
    <div class="article-title">${article.title}</div>
    <div class="article-summary">${article.summary}</div>
    <div class="article-takeaway">${article.key_takeaway}</div>
    <div class="card-footer">
      <span class="article-source">${article.source}</span>
      <a class="read-more" href="${article.url}" target="_blank">Read more →</a>
    </div>
  `;

  dashboard.appendChild(card);
}

function updateStats(articles) {
  document.querySelector("#totalArticles .stat-value").textContent = articles.length;
  document.querySelector("#criticalCount .stat-value").textContent =
    articles.filter(a => a.severity === "Critical").length;
  document.querySelector("#highCount .stat-value").textContent =
    articles.filter(a => a.severity === "High").length;
  document.querySelector("#breachCount .stat-value").textContent =
    articles.filter(a => a.category === "Data Breach").length;
}