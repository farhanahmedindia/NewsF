document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("newsletter-form");
  if (!form) return; // safety: only runs on pages with newsletter

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const emailInput = form.querySelector("input");
    const msg = document.getElementById("newsletter-msg");

    msg.textContent = "Subscribing...";
    msg.style.color = "";

    try {
      const res = await fetch(
        "https://riskbrief-newsletter.farhanahmed2794.workers.dev/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: emailInput.value,
            source: "homepage"
          })
        }
      );

      const data = await res.json();
      msg.textContent = data.message;
      msg.style.color = "green";
      form.reset();

    } catch (err) {
      console.error(err);
      msg.textContent = "Subscription failed (check console)";
      msg.style.color = "red";
    }
  });
});
