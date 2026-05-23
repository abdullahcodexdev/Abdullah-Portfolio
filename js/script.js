/* =========================================================
   Muhammad Abdullah — Portfolio interactions
   ========================================================= */
(function () {
  "use strict";

  /* ---- Footer year ---- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Light / dark theme toggle (persisted) ---- */
  const themeToggle = document.getElementById("themeToggle");
  const root = document.documentElement;

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    if (themeToggle) themeToggle.setAttribute("aria-pressed", theme === "light");
  }
  // initial: saved choice, else system preference
  const saved = localStorage.getItem("theme");
  const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
  applyTheme(saved || (prefersLight ? "light" : "dark"));

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      applyTheme(next);
      localStorage.setItem("theme", next);
    });
  }

  /* ---- Navbar: shrink on scroll + back-to-top + progress bar ---- */
  const nav = document.getElementById("mainNav");
  const backToTop = document.getElementById("backToTop");
  const progress = document.getElementById("scrollProgress");

  function onScroll() {
    const y = window.scrollY;
    if (nav) nav.classList.toggle("scrolled", y > 40);
    if (backToTop) backToTop.classList.toggle("show", y > 500);
    if (progress) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Smooth scroll + close mobile menu on link click ---- */
  const navCollapse = document.getElementById("navLinks");
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", function (e) {
      const id = this.getAttribute("href");
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: "smooth" });
      // collapse mobile nav
      if (navCollapse && navCollapse.classList.contains("show")) {
        const bsCollapse = bootstrap.Collapse.getInstance(navCollapse) ||
          new bootstrap.Collapse(navCollapse, { toggle: false });
        bsCollapse.hide();
      }
    });
  });

  /* ---- Active nav link highlight on scroll (scrollspy) ---- */
  const sections = document.querySelectorAll("section[id], header[id]");
  const navLinks = document.querySelectorAll(".nav-link");
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach((l) =>
            l.classList.toggle("active", l.getAttribute("href") === "#" + id)
          );
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((s) => spy.observe(s));

  /* ---- Scroll reveal animations ---- */
  const revealEls = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => entry.target.classList.add("visible"), delay);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealEls.forEach((el) => revealObserver.observe(el));

  /* ---- Skill bars fill when in view ---- */
  const skillCards = document.querySelectorAll(".skill-card");
  const skillObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  skillCards.forEach((c) => skillObserver.observe(c));

  /* ---- Animated stat counters ---- */
  const counters = document.querySelectorAll(".stat-num");
  const countObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10) || 0;
        const duration = 1600;
        const start = performance.now();
        function tick(now) {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(eased * target);
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        obs.unobserve(el);
      });
    },
    { threshold: 0.6 }
  );
  counters.forEach((c) => countObserver.observe(c));

  /* ---- Typed effect in hero subtitle ---- */
  const typedEl = document.getElementById("typed");
  if (typedEl && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const words = ["UI Engineer", "Problem Solver", "Python Developer", "Creative Coder"];
    let wi = 0, ci = 0, deleting = false;
    function type() {
      const word = words[wi];
      typedEl.textContent = word.substring(0, ci);
      if (!deleting && ci < word.length) {
        ci++;
        setTimeout(type, 90);
      } else if (deleting && ci > 0) {
        ci--;
        setTimeout(type, 45);
      } else {
        if (!deleting) {
          deleting = true;
          setTimeout(type, 1400);
        } else {
          deleting = false;
          wi = (wi + 1) % words.length;
          setTimeout(type, 250);
        }
      }
    }
    type();
  } else if (typedEl) {
    typedEl.textContent = "UI Engineer";
  }

  /* ---- Contact form validation + Formspree submission ---- */
  const form = document.getElementById("contactForm");
  const success = document.getElementById("formSuccess");
  const errorBox = document.getElementById("formError");

  function showMsg(el) {
    [success, errorBox].forEach((b) => b && b.classList.remove("show"));
    if (el) {
      el.classList.add("show");
      setTimeout(() => el.classList.remove("show"), 6000);
    }
  }

  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      e.stopPropagation();

      if (!form.checkValidity()) {
        form.classList.add("was-validated");
        return;
      }
      form.classList.remove("was-validated");

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalHTML = submitBtn ? submitBtn.innerHTML : "";
      const endpoint = form.getAttribute("action") || "";

      // If the Formspree endpoint hasn't been configured yet, just show success locally.
      if (endpoint.includes("YOUR_FORM_ID")) {
        form.reset();
        showMsg(success);
        console.warn("Contact form: set the Formspree endpoint in index.html to receive real emails.");
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Sending...';
      }

      try {
        const res = await fetch(endpoint, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" },
        });
        if (res.ok) {
          form.reset();
          showMsg(success);
        } else {
          showMsg(errorBox);
        }
      } catch (err) {
        showMsg(errorBox);
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalHTML;
        }
      }
    });
    // live-clear invalid state as the user fixes a field
    form.querySelectorAll(".form-control").forEach((input) => {
      input.addEventListener("input", function () {
        if (form.classList.contains("was-validated") && this.checkValidity()) {
          this.classList.remove("is-invalid");
        }
      });
    });
  }
})();
