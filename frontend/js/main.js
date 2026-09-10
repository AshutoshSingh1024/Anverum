const API_BASE = "/api";

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

async function getJSON(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
    }
    return response.json();
}

function articleCard(article) {
    return `
        <a class="article-card" href="article.html?id=${encodeURIComponent(article.id)}">
            <div>
                <div class="meta">${escapeHtml(article.date)}</div>
                <h2>${escapeHtml(article.title)}</h2>
            </div>
            <p>${escapeHtml(article.summary)}</p>
        </a>
    `;
}

async function loadArticles() {
    const container = document.getElementById("articles");
    if (!container) return;

    try {
        const articles = await getJSON(`${API_BASE}/articles`);
        document.getElementById("article-count").textContent =
            `${articles.length} question${articles.length === 1 ? "" : "s"}`;
        container.innerHTML = articles.map(articleCard).join("");
    } catch (error) {
        container.innerHTML = '<p class="error">The questions are temporarily unreachable.</p>';
        console.error(error);
    }
}

function renderArticle(article) {
    document.title = `Anverum | ${article.title}`;

    const page = document.getElementById("article-page");
    page.innerHTML = `
        <header class="article-header">
            <div class="meta">${escapeHtml(article.date)}</div>
            <h1>${escapeHtml(article.title)}</h1>
            <p class="article-intro">${escapeHtml(article.intro)}</p>
        </header>

        <section class="article-body">
            ${article.body.map(paragraph => `<p>${escapeHtml(paragraph)}</p>`).join("")}
        </section>

        <details class="sources">
            <summary>Sources / proof</summary>
            ${article.sources.map((source, index) => `
                <div class="source">
                    <div class="source-label">Source ${index + 1}</div>
                    <a href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer">
                        ${escapeHtml(source.title)}
                    </a>
                </div>
            `).join("")}
        </details>

        <section class="continue">
            <div class="continue-label">Continue wondering?</div>
            <a href="article.html?id=${encodeURIComponent(article.next_id)}">
                ${escapeHtml(article.next_title)} →
            </a>
        </section>
    `;
}

async function loadArticle() {
    const page = document.getElementById("article-page");
    if (!page) return;

    const id = new URLSearchParams(window.location.search).get("id");

    if (!id) {
        page.innerHTML = '<p class="error">No question was specified.</p>';
        return;
    }

    try {
        const article = await getJSON(`${API_BASE}/articles/${encodeURIComponent(id)}`);
        renderArticle(article);
    } catch (error) {
        page.innerHTML = '<p class="error">That question could not be found.</p>';
        console.error(error);
    }
}
async function loadRandomArticle() {
    try {
        const articles = await getJSON(`${API_BASE}/articles`);

        if (!articles.length) {
            return;
        }

        const randomIndex = Math.floor(Math.random() * articles.length);
        const randomArticle = articles[randomIndex];

        window.location.href =
            `article.html?id=${encodeURIComponent(randomArticle.id)}`;
    } catch (error) {
        console.error("Could not load a random question:", error);
    }
}
const whyButton = document.getElementById("why-button");

if (whyButton) {
    whyButton.addEventListener("click", (event) => {
        event.preventDefault();
        loadRandomArticle();
    });
}
loadArticles();
loadArticle();
