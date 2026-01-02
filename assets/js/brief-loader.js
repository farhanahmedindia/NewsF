const id = new URLSearchParams(window.location.search).get("id");

if (!id) {
  document.body.innerHTML = "<h2>Brief not found</h2>";
}

fetch(`/data/briefs/${id}.json`)
  .then(res => res.json())
  .then(data => {

    document.getElementById("brief-title").textContent = data.title;

    document.getElementById("brief-meta").innerHTML = `
      <span class="meta-tag">${data.location}</span>
      <span class="meta-tag">${data.category}</span>
      <span class="meta-tag risk-${data.risk}">${data.risk} risk</span>
      <span class="meta-tag">${data.date}</span>
    `;

    fillParagraphs("exec-summary", data.executive_summary);
    fillParagraphs("what-happened", data.what_happened);
    fillList("who-affected", data.who_is_affected);
    fillOrderedList("attack-flow", data.attack_flow);
    fillList("business-impact", data.business_impact);
    fillParagraphs("risk-assessment", [data.risk_reason]);
    fillList("common-mistakes", data.what_usually_goes_wrong);

    fillTier("actions-immediate", "Immediate", data.recommended_actions.immediate);
    fillTier("actions-short-term", "Short-term", data.recommended_actions.short_term);
    fillTier("actions-long-term", "Long-term", data.recommended_actions.long_term);

    fillList("not-mean", data.what_this_does_not_mean);

    document.getElementById("monitoring").innerHTML = `
      <strong>Signs:</strong>
      <ul>${data.monitoring.signs.map(i => `<li>${i}</li>`).join("")}</ul>
      <strong>Alerts:</strong>
      <ul>${data.monitoring.alerts.map(i => `<li>${i}</li>`).join("")}</ul>
    `;

    document.getElementById("sources").innerHTML =
      data.sources.map(s =>
        `<a href="${s.url}" target="_blank">${s.title}</a>`
      ).join("<br>");

    document.getElementById("reactions").dataset.briefId = data.id;

  });

function fillParagraphs(id, arr) {
  document.getElementById(id).innerHTML =
    arr.map(p => `<p>${p}</p>`).join("");
}

function fillList(id, arr) {
  document.getElementById(id).innerHTML =
    `<ul>${arr.map(i => `<li>${i}</li>`).join("")}</ul>`;
}

function fillOrderedList(id, arr) {
  document.getElementById(id).innerHTML =
    `<ol>${arr.map(i => `<li>${i}</li>`).join("")}</ol>`;
}

function fillTier(id, title, arr) {
  document.getElementById(id).innerHTML = `
    <h4>${title}</h4>
    <ul>${arr.map(i => `<li>${i}</li>`).join("")}</ul>
  `;
}
