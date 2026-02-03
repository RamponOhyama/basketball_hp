const HOME_TEAM_NAME = 'Keio Basketball Tech';

const DataStore = (() => {
  const cache = {};
  async function fetchJSON(path) {
    if (cache[path]) return cache[path];
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Failed to load ${path}`);
    const data = await res.json();
    cache[path] = data;
    return data;
  }
  async function getGames() {
    const games = await fetchJSON('data/games.json');
    return games.sort((a, b) => new Date(b.date) - new Date(a.date));
  }
  async function getNews() {
    const news = await fetchJSON('data/news.json');
    return news.sort((a, b) => new Date(b.date) - new Date(a.date));
  }
  return { getGames, getNews };
})();

function initNav() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav-links');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => {
    nav.classList.toggle('open');
  });
}

function setActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach((link) => {
    const linkPath = link.getAttribute('href');
    if ((path === '' && linkPath === 'index.html') || path === linkPath || (path === 'index.html' && linkPath === '/')) {
      link.classList.add('active');
    }
  });
}

function createNewsCard(item) {
  const article = document.createElement('article');
  article.className = 'news-card';
  article.innerHTML = `
    <p class="muted">${item.date}</p>
    <h3>${item.title}</h3>
    <div>${item.tags.map((tag) => `<span class="tag">${tag}</span>`).join('')}</div>
    <p>${item.excerpt}</p>
    <a class="btn btn-ghost" href="news-article.html?slug=${item.slug}">続きを読む</a>
  `;
  return article;
}

function createGameCard(game) {
  const article = document.createElement('article');
  const isWin = game.score_for > game.score_against;
  const badge = isWin ? '<span class="badge-win">WIN</span>' : '<span class="badge-lose">LOSE</span>';
  article.className = 'game-card';
  article.innerHTML = `
    <p class="muted">${game.date}｜${game.competition} ${game.round}</p>
    <h3>${HOME_TEAM_NAME} vs ${game.opponent}</h3>
    <div class="game-result">
      <div class="game-score">
        <div class="game-team game-team--home">
          <span class="game-team__name">${HOME_TEAM_NAME}</span>
          <span class="game-team__score">${game.score_for}</span>
        </div>
        <span class="result-divider">-</span>
        <div class="game-team">
          <span class="game-team__name">${game.opponent}</span>
          <span class="game-team__score">${game.score_against}</span>
        </div>
      </div>
      ${badge}
    </div>
    <p>${game.recap}</p>
    <a class="btn btn-ghost" href="game.html?slug=${game.slug}">詳細を見る</a>
  `;
  return article;
}

async function renderLatestNews(limit = 3) {
  const container = document.getElementById('latest-news');
  if (!container) return;
  const news = await DataStore.getNews();
  news.slice(0, limit).forEach((item) => container.appendChild(createNewsCard(item)));
}

async function renderLatestGames(limit = 3) {
  const container = document.getElementById('latest-games');
  if (!container) return;
  const games = await DataStore.getGames();
  games.slice(0, limit).forEach((game) => container.appendChild(createGameCard(game)));
}

async function renderGamesTable() {
  const tableContainer = document.getElementById('games-table');
  if (!tableContainer) return;
  const games = await DataStore.getGames();
  const byYear = games.reduce((acc, game) => {
    const year = new Date(game.date).getFullYear();
    acc[year] = acc[year] || [];
    acc[year].push(game);
    return acc;
  }, {});
  const years = Object.keys(byYear).sort((a, b) => b - a);
  years.forEach((year) => {
    const section = document.createElement('section');
    section.className = 'section';
    section.innerHTML = `<h3>${year} SEASON</h3>`;
    const wrapper = document.createElement('div');
    wrapper.className = 'table-scroll';
    const table = document.createElement('table');
    table.innerHTML = `
      <thead>
        <tr>
          <th>日付</th>
          <th>大会</th>
          <th>ラウンド</th>
          <th>相手</th>
          <th>スコア</th>
          <th>会場</th>
          <th>詳細</th>
        </tr>
      </thead>
      <tbody>
        ${byYear[year]
          .map(
            (game) => `
              <tr>
                <td>${game.date}</td>
                <td>${game.competition}</td>
                <td>${game.round}</td>
                <td>${game.opponent}</td>
                <td>${game.score_for}-${game.score_against}</td>
                <td>${game.venue}</td>
                <td><a href="game.html?slug=${game.slug}">レポート</a></td>
              </tr>
            `
          )
          .join('')}
      </tbody>
    `;
    wrapper.appendChild(table);
    section.appendChild(wrapper);
    tableContainer.appendChild(section);
  });
}

function getQuerySlug() {
  const params = new URLSearchParams(window.location.search);
  return params.get('slug');
}

async function renderGameDetail() {
  const detail = document.getElementById('game-detail');
  if (!detail) return;
  const slug = getQuerySlug();
  const games = await DataStore.getGames();
  const game = games.find((g) => g.slug === slug) || games[0];
  detail.innerHTML = `
    <p>${game.date}｜${game.competition} ${game.round}</p>
    <h2>${game.opponent} 戦</h2>
    <div class="game-result">
      <div class="game-score">
        <div class="game-team game-team--home">
          <span class="game-team__name">${HOME_TEAM_NAME}</span>
          <span class="game-team__score">${game.score_for}</span>
        </div>
        <span class="result-divider">-</span>
        <div class="game-team">
          <span class="game-team__name">${game.opponent}</span>
          <span class="game-team__score">${game.score_against}</span>
        </div>
      </div>
      <span class="${game.score_for > game.score_against ? 'badge-win' : 'badge-lose'}">
        ${game.score_for > game.score_against ? 'WIN' : 'LOSE'}
      </span>
    </div>
    <p>${game.recap}</p>
    <div class="grid-two">
      <div class="panel">
        <h4>会場</h4>
        <p>${game.venue}</p>
      </div>
      <div class="panel">
        <h4>メディア</h4>
        <ul>
          ${game.media?.highlight_url ? `<li><a href="${game.media.highlight_url}" target="_blank">ハイライト動画</a></li>` : '<li>ハイライト準備中</li>'}
          ${game.media?.photos_url ? `<li><a href="${game.media.photos_url}" target="_blank">フォトギャラリー</a></li>` : ''}
        </ul>
      </div>
    </div>
    <div class="panel" style="margin-top:1.5rem;">
      <h4>次戦のご案内</h4>
      <p>最新のスケジュールは <a href="schedule.html">Schedule</a> ページをご確認ください。</p>
    </div>
  `;
}

async function renderNewsList() {
  const container = document.getElementById('news-list');
  if (!container) return;
  const news = await DataStore.getNews();
  news.forEach((item) => container.appendChild(createNewsCard(item)));
}

async function renderNewsDetail() {
  const detail = document.getElementById('news-detail');
  if (!detail) return;
  const slug = getQuerySlug();
  const news = await DataStore.getNews();
  const item = news.find((n) => n.slug === slug) || news[0];
  detail.innerHTML = `
    <p>${item.date}</p>
    <h1>${item.title}</h1>
    <div>${item.tags.map((tag) => `<span class="tag">${tag}</span>`).join('')}</div>
    <p>${item.body}</p>
    <p><a href="news.html">ニュース一覧へ戻る</a></p>
  `;
}

function initFAQ() {
  document.querySelectorAll('.faq-item').forEach((item) => {
    const button = item.querySelector('.faq-question');
    button?.addEventListener('click', () => item.classList.toggle('open'));
  });
}

async function initPage() {
  initNav();
  setActiveNav();
  const page = document.body.dataset.page;
  switch (page) {
    case 'home':
      await Promise.all([renderLatestNews(), renderLatestGames()]);
      break;
    case 'games':
      await renderGamesTable();
      break;
    case 'game-detail':
      await renderGameDetail();
      break;
    case 'news':
      await renderNewsList();
      break;
    case 'news-detail':
      await renderNewsDetail();
      break;
    default:
      break;
  }
  if (page === 'faq') {
    initFAQ();
  }
}

document.addEventListener('DOMContentLoaded', initPage);
