const id = new URLSearchParams(window.location.search).get("id");

fetch(`/data/briefs/${id}.json`)
  .then(res => res.json())
  .then(data => {
    document.querySelector(".brief-title").textContent = data.title;
    // map sections safely (no layout change)
  });
