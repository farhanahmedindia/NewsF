let briefsData = [];

fetch("/data/briefs.json")
  .then(res => res.json())
  .then(data => {
    briefsData = data.map(b => ({
      ...b,
      date: new Date(b.date),
      url: `/brief.html?id=${b.id}`
    }));
    updateTimeCounts();
    renderBriefsByTime();
  })
  .catch(err => console.error("Failed to load briefs", err));
