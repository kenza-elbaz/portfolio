(() => {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- Theme (dark by default, remembered per visitor) ----------
  document.querySelectorAll(".theme-toggle").forEach((btn) => {
    const sync = () => btn.setAttribute("aria-label", root.dataset.theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
    sync();
    btn.addEventListener("click", () => {
      root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
      try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
      sync();
    });
  });

  // ---------- Smooth scrolling ----------
  let lenis = null;
  if (window.Lenis && !reduceMotion) {
    lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const target = document.querySelector(a.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: -90 });
      else target.scrollIntoView({ behavior: "smooth" });
    });
  });

  // ---------- Intro ----------
  const loaded = () => document.body.classList.add("is-loaded");
  window.addEventListener("load", loaded);
  setTimeout(loaded, 1200);

  // ---------- Scroll reveals ----------
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-in");
      io.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  // ---------- Sliding highlight in the Work / Info pill ----------
  const pill = document.querySelector(".pill");
  if (pill) {
    const glow = pill.querySelector(".pill__glow");
    const current = pill.querySelector(".is-current");
    const moveTo = (el) => {
      glow.style.width = el.offsetWidth + "px";
      glow.style.transform = `translateX(${el.offsetLeft}px)`;
    };
    const reset = () => current && moveTo(current);
    glow.style.transition = "none";
    reset();
    requestAnimationFrame(() => (glow.style.transition = ""));
    pill.querySelectorAll("a").forEach((a) => a.addEventListener("mouseenter", () => moveTo(a)));
    pill.addEventListener("mouseleave", reset);
    window.addEventListener("resize", reset);
    document.fonts && document.fonts.ready.then(reset);
  }

  // ---------- Project details ----------
  const projects = {
    ats: {
      meta: "Torck · Software Engineering Intern · 2026",
      title: "Ask ATS",
      lead: "A natural-language analytics assistant for an applicant tracking system. Recruiters ask questions in plain language instead of building reports.",
      points: [
        "Built the assistant end to end so users get answers to their questions in plain language",
        "Implemented multi-turn conversational context so follow-up questions build on earlier ones",
      ],
      tags: ["NLP", "Analytics", "Conversational AI"],
    },
    enterprise: {
      meta: "Torck · Full-Stack Developer Intern (PFA) · 2025",
      title: "Enterprise Web Platform",
      lead: "An enterprise web application delivered in 8 weeks by an Agile team of 4, with weekly sprints and peer code reviews.",
      points: [
        "Designed and implemented a secure RESTful API with JWT authentication covering 12+ endpoints",
        "Optimized SQL queries against the relational database, reducing response times by 30%",
        "Modelled and integrated the relational database, wrote unit tests and deployed to staging",
      ],
      tags: ["Angular 16", ".NET 7", "SQL", "JWT", "Agile"],
    },
    cnn: {
      meta: "Deep learning project",
      title: "Brain Tumor Classification",
      lead: "A convolutional neural network that classifies brain tumors from a Kaggle MRI dataset.",
      points: [
        "Trained a CNN with convolutional, pooling and dense layers",
        "Built the preprocessing pipeline for the MRI images",
        "Evaluated with accuracy, loss and a confusion matrix, and reduced overfitting",
      ],
      tags: ["Python", "TensorFlow", "Keras", "Computer Vision"],
    },
    eda: {
      meta: "Data project",
      title: "Exploratory Data Analysis Pipeline",
      lead: "A reusable pipeline that takes large raw datasets to clean, analysis-ready features.",
      points: [
        "Cleaned large datasets with imputation and feature engineering",
        "Ran statistical EDA with distribution and correlation plots",
      ],
      tags: ["Python", "Pandas", "NumPy", "Matplotlib", "Seaborn"],
    },
    wumpus: {
      meta: "AI project",
      title: "Knowledge-Based Agent: Wumpus World",
      lead: "A classic AI problem: explore a cave full of pits and a Wumpus, using only what you can logically infer.",
      points: [
        "Implemented a logic-based agent that infers over a knowledge base",
        "Plans safe, goal-oriented exploration from breezes and stenches it perceives",
      ],
      tags: ["Propositional Logic", "Knowledge Representation", "Inference"],
    },
    web: {
      meta: "Full-stack projects",
      title: "Web Applications",
      lead: "Three full-stack apps built across different stacks.",
      points: [
        "Recipe platform with role-based authentication and full CRUD (Laravel, MySQL)",
        "Real-time weather dashboard single-page app (React, TypeScript)",
        "Sports club management app (Django)",
      ],
      tags: ["Laravel", "MySQL", "React", "TypeScript", "Django"],
    },
  };

  const sheet = document.querySelector(".sheet");
  if (sheet && typeof sheet.showModal === "function") {
    const el = (sel) => sheet.querySelector(sel);
    const open = (key) => {
      const p = projects[key];
      if (!p) return;
      el(".sheet__meta").textContent = p.meta;
      el("h3").textContent = p.title;
      el(".sheet__lead").textContent = p.lead;
      el(".sheet__list").replaceChildren(...p.points.map((t) => Object.assign(document.createElement("li"), { textContent: t })));
      el(".sheet__tags").replaceChildren(...p.tags.map((t) => Object.assign(document.createElement("span"), { textContent: t })));
      sheet.showModal();
      lenis && lenis.stop();
    };
    document.querySelectorAll("[data-project]").forEach((card) => {
      card.addEventListener("click", () => open(card.dataset.project));
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(card.dataset.project); }
      });
    });
    el(".sheet__close").addEventListener("click", () => sheet.close());
    sheet.addEventListener("click", (e) => { if (e.target === sheet) sheet.close(); });
    sheet.addEventListener("close", () => lenis && lenis.start());
  }

  // ---------- Scatter plot for the EDA card ----------
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

  document.querySelectorAll(".year").forEach((y) => (y.textContent = new Date().getFullYear()));
})();
