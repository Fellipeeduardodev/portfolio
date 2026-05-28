// ── TOAST HELPER (global)
function showToast(msg, type = "success") {
  const container = document.getElementById("toast-container");
  if (!container) return;
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add("hide");
    toast.addEventListener("animationend", () => toast.remove());
  }, 2800);
}

document.addEventListener("DOMContentLoaded", () => {
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

    document.querySelectorAll("a, button, input, textarea").forEach((el) => {
      el.addEventListener("mouseenter", () => cursor.classList.add("hover"));
      el.addEventListener("mouseleave", () => cursor.classList.remove("hover"));
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

  // ── PROCESSO — PINNED ROAD SCROLL
  const processoSection = document.getElementById("processo");
  const processoPinWrap = document.getElementById("processoPinWrap");
  const roadPathFill = document.getElementById("roadPathFill");
  const processoHint = document.getElementById("processoHint");
  const steps = document.querySelectorAll(".processo-step");
  const pdots = document.querySelectorAll(".pdot");
  const TOTAL_STEPS = steps.length;

  if (
    processoSection &&
    processoPinWrap &&
    window.matchMedia("(min-width: 769px)").matches
  ) {
    // Mede o comprimento real do path para o dashoffset
    const roadLen = roadPathFill?.getTotalLength?.() || 1500;
    if (roadPathFill) {
      roadPathFill.style.strokeDasharray = roadLen;
      roadPathFill.style.strokeDashoffset = roadLen;
    }

    // Ativa step 0 ao entrar
    steps[0]?.classList.add("active");
    pdots[0]?.classList.add("active");

    ScrollTrigger.create({
      trigger: processoSection,
      start: "top top",
      end: "bottom bottom",
      pin: processoPinWrap,
      scrub: 0.6,
      onUpdate(self) {
        const p = self.progress;

        // Estrada: desenha o path conforme o scroll
        if (roadPathFill) {
          roadPathFill.style.strokeDashoffset =
            roadLen * (1 - Math.min(p * 1.1, 1));
        }

        // Ativa cada step
        const activeIndex = Math.min(
          Math.floor(p * TOTAL_STEPS),
          TOTAL_STEPS - 1,
        );
        steps.forEach((step, i) =>
          step.classList.toggle("active", i <= activeIndex),
        );
        pdots.forEach((dot, i) =>
          dot.classList.toggle("active", i <= activeIndex),
        );

        // Hint some após o primeiro avanço
        if (processoHint) processoHint.style.opacity = p > 0.08 ? "0" : "0.6";
      },
    });
  }

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
          const container = document.createElement("span");
          container.className = "ticker-svg";
          container.innerHTML = item.svgInline;
          const svg = container.querySelector("svg");
          if (svg) {
            svg.setAttribute("fill", "currentColor");
            svg.setAttribute("width", "22");
            svg.setAttribute("height", "22");
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

  // ── LIVE TIME
  const liveTimeEl = document.getElementById("liveTime");
  if (liveTimeEl) {
    function updateTime() {
      const now = new Date();
      const sp = now.toLocaleTimeString("pt-BR", {
        timeZone: "America/Sao_Paulo",
        hour: "2-digit",
        minute: "2-digit",
      });
      liveTimeEl.textContent = `• SP ${sp}`;
    }
    updateTime();
    setInterval(updateTime, 10000);
  }

  // ── COPY EMAIL ON CLICK
  const emailLink = document.getElementById("contactEmail");
  if (emailLink) {
    emailLink.addEventListener("click", (e) => {
      e.preventDefault();
      const email = emailLink.dataset.copy || "Fellipeeduardo1611@gmail.com";
      navigator.clipboard.writeText(email).then(() => {
        showToast("✓ Email copiado para a área de transferência!");
        const span = document.getElementById("emailText");
        if (span) {
          const orig = span.textContent;
          span.textContent = "copiado!";
          setTimeout(() => (span.textContent = orig), 2000);
        }
      });
    });
  }

  // ── HIRE ME MODAL
  const hireMeBtn = document.getElementById("hire-me-btn");
  const hireMeModal = document.getElementById("hire-me-modal");
  const hireMeClose = document.getElementById("hireMeClose");
  if (hireMeBtn && hireMeModal) {
    hireMeBtn.addEventListener("click", () =>
      hireMeModal.classList.toggle("open"),
    );
    hireMeClose?.addEventListener("click", () =>
      hireMeModal.classList.remove("open"),
    );
    hireMeModal.addEventListener("click", (e) => {
      if (e.target === hireMeModal) hireMeModal.classList.remove("open");
    });
  }

  // ── CURSOR TRAIL
  const trailCanvas = document.getElementById("cursor-trail");
  if (trailCanvas && window.matchMedia("(hover: hover)").matches) {
    const ctx = trailCanvas.getContext("2d");
    let W = (trailCanvas.width = window.innerWidth);
    let H = (trailCanvas.height = window.innerHeight);
    window.addEventListener("resize", () => {
      W = trailCanvas.width = window.innerWidth;
      H = trailCanvas.height = window.innerHeight;
    });

    const dots = [];
    const MAX = 18;
    let mx = -999,
      my = -999;

    document.addEventListener("mousemove", (e) => {
      mx = e.clientX;
      my = e.clientY;
      dots.push({ x: mx, y: my, r: 3.5, a: 0.55 });
      if (dots.length > MAX) dots.shift();
    });

    function getAccentColor() {
      return (
        getComputedStyle(document.documentElement)
          .getPropertyValue("--accent")
          .trim() || "#7eb8f7"
      );
    }

    function animateTrail() {
      ctx.clearRect(0, 0, W, H);
      const color = getAccentColor();
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        const progress = i / dots.length;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r * progress, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = d.a * progress * 0.6;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(animateTrail);
    }
    animateTrail();
  }

  // ── EASTER EGG CONSOLE
  const accent =
    getComputedStyle(document.documentElement)
      .getPropertyValue("--accent")
      .trim() || "#7eb8f7";
  console.log(
    `%c< Fellipe /> %c\n\nFoi mal, esse easter egg foi fácil de achar 😄\n\nMas já que você tá aqui...\n👀 Estou aberto a oportunidades!\n📧 Fellipeeduardo1611@gmail.com\n🔗 linkedin.com/in/fellipeeduardo\n\nFeito com ♥ e muito ☕`,
    `color: ${accent}; font-size: 1.4rem; font-weight: 900; font-family: monospace;`,
    `color: #aaa; font-size: 0.85rem; font-family: monospace; line-height: 1.8;`,
  );
  console.log(
    "%c💡 Dica: Se você inspeciona código de portfólio, provavelmente deveria trabalhar comigo.",
    `color: ${accent}; font-size: 0.75rem; font-family: monospace; font-style: italic;`,
  );

  // ── TYPING ANIMATION
  const typedEl = document.getElementById("typedText");
  if (typedEl) {
    const phrases = [
      "desenvolvedor front end",
      "designer ui/ux",
      "criador de interfaces",
      "entusiasta de css",
      "figma → código",
    ];
    let phraseIdx = 0;
    let charIdx = 0;
    let deleting = false;

    function type() {
      const current = phrases[phraseIdx];

      if (!deleting) {
        typedEl.textContent = current.slice(0, charIdx + 1);
        charIdx++;
        if (charIdx === current.length) {
          deleting = true;
          setTimeout(type, 1800);
          return;
        }
        setTimeout(type, 65 + Math.random() * 40);
      } else {
        typedEl.textContent = current.slice(0, charIdx - 1);
        charIdx--;
        if (charIdx === 0) {
          deleting = false;
          phraseIdx = (phraseIdx + 1) % phrases.length;
          setTimeout(type, 380);
          return;
        }
        setTimeout(type, 35 + Math.random() * 20);
      }
    }

    setTimeout(type, 900);
  }

  // ── BLOB MOUSE PARALLAX
  const blob1 = document.getElementById("heroBlob1");
  const blob2 = document.getElementById("heroBlob2");
  const heroSection = document.getElementById("hero");

  if (blob1 && blob2 && heroSection) {
    let targetX1 = 0,
      targetY1 = 0;
    let targetX2 = 0,
      targetY2 = 0;
    let currentX1 = 0,
      currentY1 = 0;
    let currentX2 = 0,
      currentY2 = 0;

    heroSection.addEventListener("mousemove", (e) => {
      const rect = heroSection.getBoundingClientRect();
      const cx = (e.clientX - rect.left) / rect.width - 0.5;
      const cy = (e.clientY - rect.top) / rect.height - 0.5;
      targetX1 = cx * 55;
      targetY1 = cy * 40;
      targetX2 = -cx * 35;
      targetY2 = -cy * 28;
      blob1.style.animationPlayState = "paused";
      blob2.style.animationPlayState = "paused";
    });

    heroSection.addEventListener("mouseleave", () => {
      targetX1 = targetY1 = targetX2 = targetY2 = 0;
      blob1.style.animationPlayState = "running";
      blob2.style.animationPlayState = "running";
    });

    (function lerpBlobs() {
      const ease = 0.055;
      currentX1 += (targetX1 - currentX1) * ease;
      currentY1 += (targetY1 - currentY1) * ease;
      currentX2 += (targetX2 - currentX2) * ease;
      currentY2 += (targetY2 - currentY2) * ease;
      blob1.style.transform = `translate(${currentX1}px, ${currentY1}px)`;
      blob2.style.transform = `translate(${currentX2}px, ${currentY2}px)`;
      requestAnimationFrame(lerpBlobs);
    })();
  }
});

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xkoekboy";

async function handleSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const inputs = form.querySelectorAll("input, textarea");
  let hasError = false;

  // ── Validação visual
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

  if (hasError) {
    showToast("⚠ Preencha todos os campos!", "error");
    return;
  }

  const btn = form.querySelector("button[type=submit]");
  const originalText = btn.textContent;
  btn.textContent = "enviando...";
  btn.disabled = true;

  // ── Coleta os dados do formulário
  const data = {
    name: document.getElementById("formName")?.value.trim(),
    email: document.getElementById("formEmail")?.value.trim(),
    subject: document.getElementById("formSubject")?.value.trim(),
    message: document.getElementById("formMessage")?.value.trim(),
  };

  try {
    const res = await fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      btn.textContent = "✓ mensagem enviada!";
      btn.style.background = "#4caf93";
      showToast("✓ Mensagem enviada! Respondo em breve 🚀");
      form.reset();
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = "";
        btn.disabled = false;
      }, 3500);
    } else {
      const json = await res.json().catch(() => ({}));
      const errMsg =
        json?.errors?.map((err) => err.message).join(", ") ||
        "Tente novamente.";
      throw new Error(errMsg);
    }
  } catch (err) {
    showToast(`✕ Erro ao enviar: ${err.message}`, "error");
    btn.textContent = originalText;
    btn.style.background = "";
    btn.disabled = false;
  }
}

// Bind handleSubmit globally to be callable from HTML onsubmit attribute
window.handleSubmit = handleSubmit;
