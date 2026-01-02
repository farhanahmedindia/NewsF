// GLOBAL – must exist before app.js uses it
window.briefsData = [];

fetch("/data/briefs.json")
  .then(res => {
    if (!res.ok) throw new Error("Failed to load briefs.json");
    return res.json();
  })
  .then(data => {
    window.briefsData = data.map(b => ({
      ...b,
      date: new Date(b.date)
    }));

    // now safe to call app logic
    updateTimeCounts();
    renderBriefsByTime();
  })
  .catch(err => {
    console.error("Briefs load error:", err);
  });
