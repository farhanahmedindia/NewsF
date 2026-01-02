// --------------------
// GLOBAL STATE
// --------------------

const briefsContainer = document.getElementById('briefs-container');
const searchInput = document.getElementById('search-input');
const filterToggle = document.getElementById('filter-toggle');
const filterOptions = document.getElementById('filter-options');
const loading = document.getElementById('loading');
const emptyState = document.getElementById('empty-state');
const newsletterForm = document.getElementById('newsletter-form');
const toast = document.getElementById('toast');
const timeNavItems = document.querySelectorAll('.time-nav-item');

const today = new Date();

let activeFilters = {
  categories: [],
  risk: null,
  search: '',
  timePeriod: 'all'
};

// --------------------
// INIT
// --------------------

document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  loadSavedReactions();
});

// --------------------
// EVENT LISTENERS
// --------------------

function setupEventListeners() {

  searchInput.addEventListener('input', (e) => {
    activeFilters.search = e.target.value.toLowerCase();
    renderBriefsByTime();
  });

  filterToggle.addEventListener('click', () => {
    filterOptions.style.display =
      filterOptions.style.display === 'none' ? 'flex' : 'none';
    filterToggle.classList.toggle('active');
  });

  document.querySelectorAll('.filter-option input').forEach(cb => {
    cb.addEventListener('change', (e) => {
      const value = e.target.value;

      if (value === 'high') {
        activeFilters.risk = e.target.checked ? 'high' : null;
      } else {
        if (e.target.checked) {
          activeFilters.categories.push(value);
        } else {
          activeFilters.categories =
            activeFilters.categories.filter(c => c !== value);
        }
      }
      renderBriefsByTime();
    });
  });

  timeNavItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();

      timeNavItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      activeFilters.timePeriod = item.dataset.period;
      renderBriefsByTime();
    });
  });
}

// --------------------
// TIME COUNTS
// --------------------

function updateTimeCounts() {
  const counts = {
    all: briefsData.length,
    today: 0,
    week: 0,
    month: 0,
    older: 0
  };

  briefsData.forEach(brief => {
    const diff = Math.floor((today - brief.date) / 86400000);

    if (diff === 0) {
      counts.today++; counts.week++; counts.month++;
    } else if (diff <= 7) {
      counts.week++; counts.month++;
    } else if (diff <= 30) {
      counts.month++;
    } else {
      counts.older++;
    }
  });

  Object.keys(counts).forEach(k => {
    document.getElementById(`count-${k}`).textContent = counts[k];
  });
}

// --------------------
// RENDERING
// --------------------

function renderBriefsByTime() {

  briefsContainer.style.display = 'none';
  emptyState.style.display = 'none';
  loading.style.display = 'flex';

  setTimeout(() => {

    loading.style.display = 'none';

    let filtered = briefsData;

    if (activeFilters.search) {
      filtered = filtered.filter(b =>
        b.title.toLowerCase().includes(activeFilters.search) ||
        b.summary.toLowerCase().includes(activeFilters.search)
      );
    }

    if (activeFilters.categories.length) {
      filtered = filtered.filter(b =>
        activeFilters.categories.includes(b.category)
      );
    }

    if (activeFilters.risk) {
      filtered = filtered.filter(b => b.risk === activeFilters.risk);
    }

    if (!filtered.length) {
      emptyState.style.display = 'block';
      return;
    }

    const grouped = groupBriefsByTime(filtered);
    let html = '';

    if (activeFilters.timePeriod === 'all') {
      html += renderSection('Today', grouped.today, true);
      html += renderSection('This Week', grouped.week);
      html += renderSection('This Month', grouped.month);
      html += renderSection('Older', grouped.older);
    } else {
      html += renderSection(
        activeFilters.timePeriod,
        grouped[activeFilters.timePeriod]
      );
    }

    briefsContainer.innerHTML = html;
    briefsContainer.style.display = 'block';

    loadSavedReactions();

  }, 250);
}

// --------------------
// HELPERS
// --------------------

function groupBriefsByTime(list) {
  const g = { today: [], week: [], month: [], older: [] };

  list.forEach(b => {
    const d = Math.floor((today - b.date) / 86400000);
    if (d === 0) g.today.push(b);
    else if (d <= 7) g.week.push(b);
    else if (d <= 30) g.month.push(b);
    else g.older.push(b);
  });

  return g;
}

function renderSection(title, items, showNew = false) {
  if (!items.length) return '';

  return `
  <div class="brief-section">
    <div class="brief-section-header">
      <h2 class="brief-section-title">${title}</h2>
      <span class="brief-section-count">${items.length} briefs</span>
    </div>
    <div class="briefs-grid">
      ${items.map(b => renderCard(b, showNew)).join('')}
    </div>
  </div>`;
}

function renderCard(b, showNew) {
  return `
  <div class="card">
    <h3 class="card-title">${b.title}</h3>
    <p>${b.summary}</p>
    <a href="/brief.html?id=${b.id}" class="read-more">Read full brief</a>
  </div>`;
}

// --------------------
// REACTIONS
// --------------------

function toggleReaction(id, type) {
  const key = `reaction_${id}_${type}`;
  localStorage.setItem(key, "1");
}

function loadSavedReactions() {
  document.querySelectorAll(".reaction").forEach(btn => {
    const id = btn.closest(".reactions")?.dataset.briefId;
    if (!id) return;

    const type = btn.dataset.reaction;
    if (localStorage.getItem(`reaction_${id}_${type}`)) {
      btn.classList.add("active");
    }
  });
}
