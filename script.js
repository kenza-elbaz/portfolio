(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Smooth scrolling
  let lenis = null;
  if (window.Lenis && !reduceMotion) {
    lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const target = document.querySelector(a.getAttribute("href"));
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: a.getAttribute("href") === "#top" ? 0 : -40 });
      });
    });
  }

  // Hero intro
  window.addEventListener("load", () => document.body.classList.add("is-loaded"));
  setTimeout(() => document.body.classList.add("is-loaded"), 1200);

  // Scroll reveals
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  // Hide nav on scroll down, show on scroll up
  const nav = document.querySelector(".nav");
  let lastY = window.scrollY;
  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    nav.classList.toggle("is-hidden", y > lastY && y > 200);
    lastY = y;
  }, { passive: true });

  // Custom "View" cursor over project cards
  const cursor = document.querySelector(".cursor");
  if (cursor && window.matchMedia("(hover: hover)").matches) {
    let x = -200, y = -200, cx = x, cy = y;
    window.addEventListener("mousemove", (e) => { x = e.clientX; y = e.clientY; });
    const loop = () => {
      cx += (x - cx) * 0.18;
      cy += (y - cy) * 0.18;
      cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      requestAnimationFrame(loop);
    };
    loop();
    document.querySelectorAll("[data-cursor]").forEach((el) => {
      el.addEventListener("mouseenter", () => cursor.classList.add("is-active"));
      el.addEventListener("mouseleave", () => cursor.classList.remove("is-active"));
    });
  } else {
    document.querySelectorAll(".card").forEach((c) => (c.style.cursor = "auto"));
  }

  // Scatter plot for the EDA card
  const g = document.querySelector(".scatter g");
  if (g) {
    let seed = 7;
    const rand = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
    for (let i = 0; i < 46; i++) {
      const px = 10 + rand() * 180;
      const py = 108 - (px / 190) * 85 + (rand() - 0.5) * 34;
      const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      c.setAttribute("cx", px.toFixed(1));
      c.setAttribute("cy", Math.max(6, Math.min(114, py)).toFixed(1));
      c.setAttribute("r", (2 + rand() * 3).toFixed(1));
      g.appendChild(c);
    }
  }

  // Footer year + Rabat local time
  document.getElementById("year").textContent = new Date().getFullYear();
  const clock = document.getElementById("clock");
  const tick = () => {
    clock.textContent = "Rabat " + new Date().toLocaleTimeString("en-GB", {
      timeZone: "Africa/Casablanca", hour: "2-digit", minute: "2-digit",
    });
  };
  tick();
  setInterval(tick, 30000);
})();
