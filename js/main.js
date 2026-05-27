document.addEventListener("DOMContentLoaded", () => {
  // ── SCROLL PROGRESS
  const progressBar = document.getElementById("scroll-progress");
  if (progressBar) {
    window.addEventListener(
      "scroll",
      () => {
        const pct =
          (window.scrollY / (document.body.scrollHeight - window.innerHeight)) *
          100;
        progressBar.style.width = pct + "%";
      },
      { passive: true },
    );
  }

  // ── NAVBAR
  const navbar = document.getElementById("navbar");
  if (navbar) {
    window.addEventListener(
      "scroll",
      () => {
        navbar.classList.toggle("scrolled", window.scrollY > 60);
      },
      { passive: true },
    );
  }

  // ── THEME SWITCHER
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    // Check local storage or default to dark
    const savedTheme = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);
    const themeIcon = themeToggle.querySelector("i");
    if (themeIcon) {
      themeIcon.className =
        savedTheme === "dark" ? "fi fi-rr-moon" : "fi fi-rr-sun";
    }

    themeToggle.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme");
      const nextTheme = currentTheme === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", nextTheme);
      const icon = themeToggle.querySelector("i");
      if (icon) {
        icon.className =
          nextTheme === "dark" ? "fi fi-rr-moon" : "fi fi-rr-sun";
      }
      localStorage.setItem("theme", nextTheme);
    });
  }

  // ── HAMBURGER & MOBILE MENU
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");
  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("open");
      mobileMenu.classList.toggle("open");
    });

    mobileMenu.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        hamburger.classList.remove("open");
        mobileMenu.classList.remove("open");
      });
    });
  }

  // ── CURSOR (desktop only)
  const cursor = document.getElementById("cursor");
  if (cursor) {
    document.addEventListener("mousemove", (e) => {
      cursor.style.left = e.clientX + "px";
      cursor.style.top = e.clientY + "px";
    });

    document
      .querySelectorAll(
        "a, button, input, textarea, .project-card, .service-card",
      )
      .forEach((el) => {
        el.addEventListener("mouseenter", () => cursor.classList.add("hover"));
        el.addEventListener("mouseleave", () =>
          cursor.classList.remove("hover"),
        );
      });
  }

  // ── GSAP SETUP
  gsap.registerPlugin(ScrollTrigger);

  // ── GSAP SCROLL REVEAL
  gsap.utils.toArray(".reveal").forEach((el, i) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 36 },
      {
        opacity: 1,
        y: 0,
        duration: 0.65,
        delay: (i % 3) * 0.07,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          toggleActions: "play none none none",
        },
      },
    );
  });

  // ── TICKER STRIP BUILDER
  (async function buildTicker() {
    const items = [
      { label: "HTML", icon: "fi fi-brands-html5" },
      { label: "CSS", icon: "fi fi-brands-css3" },
      { label: "JavaScript", icon: "fi fi-brands-js" },
      { label: "Figma", icon: "fi fi-brands-figma" },
      {
        label: "React",
        // Inline SVG to avoid fetch issues when running locally
        svgInline:
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-50 -50 100 100" width="22" height="22" role="img" aria-label="React logo"><g fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><ellipse rx="30" ry="12" transform="rotate(0)" /><ellipse rx="30" ry="12" transform="rotate(60)" /><ellipse rx="30" ry="12" transform="rotate(120)" /></g><circle cx="0" cy="0" r="4" fill="currentColor"/></svg>',
      },
      { label: "GSAP", icon: "fi fi-rr-bolt" },
      { label: "Git", icon: "fi fi-brands-github" },
      { label: "VS Code", icon: "fi fi-rr-code-simple" },
    ];

    const track = document.getElementById("tickerTrack");
    if (!track) return;

    function iconAvailable(iconClass) {
      try {
        const probe = document.createElement("i");
        probe.className = iconClass;
        probe.style.position = "absolute";
        probe.style.visibility = "hidden";
        probe.style.pointerEvents = "none";
        document.body.appendChild(probe);
        const content = window
          .getComputedStyle(probe, "::before")
          .getPropertyValue("content");
        document.body.removeChild(probe);
        if (!content) return false;
        const cleaned = content.replace(/['"]/g, "");
        return cleaned !== "" && cleaned !== "none" && cleaned !== "normal";
      } catch (e) {
        return false;
      }
    }

    // build as DOM nodes so we can inline SVG when needed
    for (let pass = 0; pass < 2; pass++) {
      for (const item of items) {
        const wrap = document.createElement("div");
        wrap.className = "ticker-item";

        // choose icon: direct icon, desiredIcon (if available), or inline svg fallback
        if (item.icon) {
          const i = document.createElement("i");
          i.className = item.icon;
          wrap.appendChild(i);
        } else if (item.desiredIcon) {
          if (iconAvailable(item.desiredIcon)) {
            const i = document.createElement("i");
            i.className = item.desiredIcon;
            wrap.appendChild(i);
          } else if (item.svgSrc) {
            try {
              const resp = await fetch(item.svgSrc);
              if (resp.ok) {
                const svgText = await resp.text();
                const container = document.createElement("span");
                container.className = "ticker-svg";
                container.innerHTML = svgText;
                // ensure svg uses currentColor
                const svg = container.querySelector("svg");
                if (svg) {
                  svg.setAttribute("fill", "currentColor");
                  svg.setAttribute("width", "22");
                  svg.setAttribute("height", "22");
                }
                wrap.appendChild(container);
              }
            } catch (e) {
              // ignore
            }
          }
        }
        if (item.svgInline) {
          const container = document.createElement('span');
          container.className = 'ticker-svg';
          container.innerHTML = item.svgInline;
          const svg = container.querySelector('svg');
          if (svg) {
            svg.setAttribute('fill', 'currentColor');
            svg.setAttribute('width', '22');
            svg.setAttribute('height', '22');
          }
          wrap.appendChild(container);
        } else if (item.svgSrc) {
          try {
            const resp = await fetch(item.svgSrc);
            if (resp.ok) {
              const svgText = await resp.text();
              const container = document.createElement("span");
              container.className = "ticker-svg";
              container.innerHTML = svgText;
              const svg = container.querySelector("svg");
              if (svg) {
                svg.setAttribute("fill", "currentColor");
                svg.setAttribute("width", "22");
                svg.setAttribute("height", "22");
              }
              wrap.appendChild(container);
            }
          } catch (e) {
            // ignore
          }
        }

        const span = document.createElement("span");
        span.textContent = item.label;
        wrap.appendChild(span);

        const sep = document.createElement("div");
        sep.className = "ticker-sep";

        track.appendChild(wrap);
        track.appendChild(sep);
      }
    }
  })();

  // ── HERO ENTRANCE ANIMATIONS
  gsap.from(".hero-available", {
    opacity: 0,
    y: 20,
    duration: 0.55,
    delay: 0.15,
  });
  gsap.from(".hero-name", { opacity: 0, y: 30, duration: 0.65, delay: 0.3 });
  gsap.from(".hero-role", { opacity: 0, y: 20, duration: 0.55, delay: 0.45 });
  gsap.from(".hero-desc", { opacity: 0, y: 20, duration: 0.55, delay: 0.58 });
  gsap.from(".hero-btns", { opacity: 0, y: 20, duration: 0.55, delay: 0.7 });
  gsap.from(".hero-photo-wrap", {
    opacity: 0,
    scale: 0.9,
    duration: 0.75,
    delay: 0.35,
    ease: "back.out(1.4)",
  });
  gsap.from(".float-icon", {
    opacity: 0,
    scale: 0,
    duration: 0.5,
    stagger: 0.1,
    delay: 0.9,
    ease: "back.out(2)",
  });

  // ── TIMELINE SCROLL TRIGGER
  const timelineWrap = document.getElementById("timeline");
  const timelineLine = document.getElementById("timelineLine");
  if (timelineWrap && timelineLine) {
    ScrollTrigger.create({
      trigger: timelineWrap,
      start: "top 72%",
      end: "bottom 55%",
      scrub: 1.2,
      onUpdate: (self) => {
        timelineLine.style.height = self.progress * 100 + "%";
        [0, 1, 2].forEach((i, idx) => {
          if (self.progress >= (idx / 3) * 0.82) {
            document.getElementById("tl-dot-" + i)?.classList.add("visible");
            document
              .getElementById("tl-content-" + i)
              ?.classList.add("visible");
          }
        });
      },
    });
  }

  // ── STAT COUNTERS ANIMATION
  document.querySelectorAll(".about-stat-num").forEach((el) => {
    const target = parseInt(el.dataset.target);
    ScrollTrigger.create({
      trigger: el,
      start: "top 90%",
      onEnter: () => {
        let start = 0;
        const dur = 1200;
        const step = 16;
        const inc = target / (dur / step);
        const timer = setInterval(() => {
          start = Math.min(start + inc, target);
          el.textContent = Math.floor(start);
          if (start >= target) clearInterval(timer);
        }, step);
      },
    });
  });

  // ── DYNAMIC FOOTER YEAR
  const footerCopy = document.querySelector(".footer-copy");
  if (footerCopy) {
    footerCopy.innerHTML = footerCopy.innerHTML.replace(
      /\d{4}/,
      new Date().getFullYear(),
    );
  }

  // ── NATIVE SMOOTH SCROLL FALLBACK
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const targetId = a.getAttribute("href");
      if (targetId === "#") return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
});

// ── FORM SUBMISSION HANDLER
function handleSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const inputs = form.querySelectorAll("input, textarea");
  let hasError = false;

  inputs.forEach((input) => {
    if (!input.value.trim()) {
      input.style.borderColor = "#e05c5c";
      input.style.boxShadow = "0 0 0 3px rgba(224,92,92,.18)";
      hasError = true;
      input.addEventListener(
        "input",
        () => {
          input.style.borderColor = "";
          input.style.boxShadow = "";
        },
        { once: true },
      );
    }
  });

  if (hasError) return;

  const btn = form.querySelector("button[type=submit]");
  const originalText = btn.textContent;
  btn.textContent = "✓ mensagem enviada!";
  btn.style.background = "#4caf93";
  btn.disabled = true;

  setTimeout(() => {
    btn.textContent = originalText;
    btn.style.background = "";
    btn.disabled = false;
    form.reset();
  }, 3000);
}

// Bind handleSubmit globally to be callable from HTML onsubmit attribute
window.handleSubmit = handleSubmit;
