function trackFullRead(id) {
  console.log("Full brief opened:", id);

  // Cloudflare Web Analytics auto-tracks pageviews
  // This is just for custom events later
}

document.querySelectorAll(".reaction").forEach(el => {
  el.addEventListener("click", () => {
    const reaction = el.dataset.reaction;
    console.log("Reaction:", reaction);

    // Phase 1: console only
    // Phase 2: send to backend / Cloudflare event
    el.innerText = "✔ " + el.innerText;
  });
});

document.querySelectorAll(".reactions").forEach(block => {
  const briefId = block.dataset.briefId;

  block.querySelectorAll(".reaction").forEach(btn => {
    const reactionType = btn.dataset.reaction;
    const key = `reaction_${briefId}_${reactionType}`;

    // Load saved state
    if (localStorage.getItem(key)) {
      btn.innerText = "✔ " + btn.innerText;
      btn.style.pointerEvents = "none";
      btn.style.opacity = "0.6";
    }

    btn.addEventListener("click", () => {
      localStorage.setItem(key, "true");

      btn.innerText = "✔ " + btn.innerText;
      btn.style.pointerEvents = "none";
      btn.style.opacity = "0.6";

      console.log("Saved reaction:", briefId, reactionType);
    });
  });
});
