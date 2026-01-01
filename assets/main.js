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
