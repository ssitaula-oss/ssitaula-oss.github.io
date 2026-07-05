const body = document.body;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const SECTIONS = ["home", "about", "skills", "projects", "experience", "contact"];

/* ---------- Theme ---------- */
const themeToggle = document.querySelector(".theme-toggle");
const themeIcon = document.querySelector(".theme-icon");

function setTheme(theme) {
  const light = theme === "light";
  body.classList.toggle("light", light);
  themeIcon.textContent = light ? "☀" : "☾";
  localStorage.setItem("portfolio-theme", theme);
}

const savedTheme = localStorage.getItem("portfolio-theme");
const systemPrefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
setTheme(savedTheme || (systemPrefersLight ? "light" : "dark"));

themeToggle.addEventListener("click", () => {
  setTheme(body.classList.contains("light") ? "dark" : "light");
});

document.getElementById("year").textContent = new Date().getFullYear();

/* ---------- Mobile nav drawer ---------- */
const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const navAnchors = document.querySelectorAll(".nav-links a");

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  navToggle.classList.toggle("open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navAnchors.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

/* ---------- Scroll: header state, scroll-spy, progress bar ---------- */
const sections = document.querySelectorAll("main section[id]");
const progressBar = document.getElementById("scrollProgress");

window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 20);

  let currentSection = "";
  sections.forEach((section) => {
    if (window.scrollY >= section.offsetTop - 140) currentSection = section.id;
  });
  navAnchors.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${currentSection}`);
  });

  if (progressBar) {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = `${docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0}%`;
  }
});

/* ---------- Reveal on scroll ---------- */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

/* ---------- Animated stats (decimal-aware) ---------- */
const statsSection = document.querySelector(".stats-grid");
let statsStarted = false;

function runCounters() {
  if (statsStarted) return;
  statsStarted = true;
  document.querySelectorAll("[data-count]").forEach((counter) => {
    const target = Number(counter.dataset.count);
    const decimals = Number(counter.dataset.decimals || 0);
    const duration = 1100;
    const start = performance.now();
    const format = (v) => (decimals > 0 ? v.toFixed(decimals) : String(Math.floor(v)));

    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = format(target * eased);
      if (progress < 1) requestAnimationFrame(update);
      else counter.textContent = format(target);
    }

    if (prefersReducedMotion) counter.textContent = format(target);
    else requestAnimationFrame(update);
  });
}

if (statsSection) {
  const statsObserver = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        runCounters();
        statsObserver.disconnect();
      }
    },
    { threshold: 0.35 }
  );
  statsObserver.observe(statsSection);
}

/* ---------- Project filtering ---------- */
const filterButtons = document.querySelectorAll(".filter-button");
const projectCards = document.querySelectorAll(".project-card");
const filterStatus = document.getElementById("filterStatus");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    const filter = button.dataset.filter;
    let visibleCount = 0;

    projectCards.forEach((card) => {
      const categories = card.dataset.category.split(" ");
      const shouldShow = filter === "all" || categories.includes(filter);
      card.classList.toggle("hidden", !shouldShow);
      if (shouldShow) visibleCount += 1;
    });

    if (filterStatus) {
      filterStatus.textContent = `Showing ${visibleCount} project${visibleCount === 1 ? "" : "s"}.`;
    }
  });
});

/* ---------- Contact form (with honeypot) ---------- */
const contactForm = document.getElementById("contactForm");

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(contactForm);
  if (formData.get("company")) return; // honeypot

  const name = formData.get("name").trim();
  const email = formData.get("email").trim();
  const subject = formData.get("subject").trim();
  const message = formData.get("message").trim();

  const emailBody = `Hi Siddhartha,%0D%0A%0D%0A${encodeURIComponent(message)}%0D%0A%0D%0AFrom: ${encodeURIComponent(name)} (${encodeURIComponent(email)})`;
  const mailto = `mailto:siddharthasitaula7@gmail.com?subject=${encodeURIComponent(subject)}&body=${emailBody}`;

  window.location.href = mailto;
});

/* ---------- Copy email ---------- */
(function initCopyEmail() {
  const button = document.getElementById("copyEmail");
  const label = document.getElementById("copyEmailLabel");
  if (!button || !label) return;

  const email = "siddharthasitaula7@gmail.com";
  const defaultText = label.textContent;

  button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch (err) {
      const temp = document.createElement("textarea");
      temp.value = email;
      document.body.appendChild(temp);
      temp.select();
      document.execCommand("copy");
      document.body.removeChild(temp);
    }
    button.classList.add("copied");
    label.textContent = "Copied!";
    setTimeout(() => {
      button.classList.remove("copied");
      label.textContent = defaultText;
    }, 2000);
  });
})();

/* ---------- Hero cursor glow ---------- */
(function initHeroGlow() {
  const hero = document.querySelector(".hero");
  if (!hero || prefersReducedMotion || window.matchMedia("(pointer: coarse)").matches) return;

  hero.addEventListener("pointermove", (event) => {
    const rect = hero.getBoundingClientRect();
    hero.style.setProperty("--mx", `${((event.clientX - rect.left) / rect.width) * 100}%`);
    hero.style.setProperty("--my", `${((event.clientY - rect.top) / rect.height) * 100}%`);
    hero.classList.add("glow-active");
  });

  hero.addEventListener("pointerleave", () => hero.classList.remove("glow-active"));
})();

/* ---------- Terminal access gate ---------- */
(function initTerminalGate() {
  const gate = document.getElementById("terminalGate");
  const gateBody = document.getElementById("terminalBody");
  const gateInput = document.getElementById("terminalInput");
  const gateSkip = document.getElementById("terminalSkip");
  if (!gate || !gateBody || !gateInput || !gateSkip) return;

  if (sessionStorage.getItem("portfolio-gate-passed") === "1") return;

  const bootLines = [
    { text: "[ OK ] booting portfolio_os v2.6 ...", type: "ok" },
    { text: "[ OK ] mounting /home/siddhartha ...", type: "ok" },
    { text: "[ OK ] loading languages: java, c, python, javascript", type: "ok" },
    { text: "[ OK ] indexing projects ... 6 found", type: "ok" },
    { text: "[ OK ] starting IT Academic Technologies daemon", type: "ok" },
    { text: "[WARN] coffee levels low, continuing anyway", type: "warn" },
    { text: "[ OK ] all systems nominal", type: "ok" },
    { text: "", type: "dim" },
    { text: "Welcome. This gate is just for fun.", type: "accent" },
    { text: "Type 'help' for commands, or press Enter to walk right in.", type: "dim" },
  ];

  const jokes = [
    "Why do programmers prefer dark mode? Because light attracts bugs.",
    "There are 10 kinds of people: those who understand binary, and those who don't.",
    "A SQL query walks into a bar, sees two tables, and asks: 'may I join you?'",
    "I'd tell you a UDP joke, but you might not get it.",
  ];

  const staticCommands = {
    help: () => [
      { text: "navigation:", type: "accent" },
      { text: "  home | about | skills | projects | experience | contact", type: "dim" },
      { text: "  open <section>   jump straight to that section", type: "dim" },
      { text: "other commands:", type: "accent" },
      { text: "  whoami   who you're about to meet", type: "dim" },
      { text: "  ls       list portfolio sections", type: "dim" },
      { text: "  coffee   brew some focus", type: "dim" },
      { text: "  joke     a small programmer joke", type: "dim" },
      { text: "  date     current date and time", type: "dim" },
      { text: "  hack     a totally harmless fake hack sequence", type: "dim" },
      { text: "  clear    clear the screen", type: "dim" },
      { text: "  access   let me in", type: "dim" },
    ],
    whoami: () => [
      { text: "guest — about to meet Siddhartha Sitaula,", type: "dim" },
      { text: "CS student @ UNM and Java/algorithms enthusiast.", type: "dim" },
    ],
    ls: () => [{ text: SECTIONS.join("  "), type: "dim" }],
    coffee: () => [
      { text: "☕ brewing ...", type: "dim" },
      { text: "done. focus +10%, patience +5%.", type: "ok" },
    ],
    joke: () => [{ text: jokes[Math.floor(Math.random() * jokes.length)], type: "dim" }],
    date: () => [{ text: new Date().toString(), type: "dim" }],
    hack: () => [
      { text: "initiating totally-legit-hack.sh ...", type: "warn" },
      { text: "[####------] 40%", type: "dim" },
      { text: "[########--] 80%", type: "dim" },
      { text: "[##########] 100%", type: "ok" },
      { text: "access was already yours. nice try though.", type: "accent" },
    ],
  };

  body.classList.add("gate-lock");
  gate.classList.add("active");

  function addLine(text, type) {
    const line = document.createElement("div");
    line.className = `terminal-line${type ? " " + type : ""}`;
    line.textContent = text;
    gateBody.appendChild(line);
    gateBody.scrollTop = gateBody.scrollHeight;
  }

  function typeLine(text, type, speed) {
    return new Promise((resolve) => {
      if (prefersReducedMotion) {
        addLine(text, type);
        resolve();
        return;
      }
      const line = document.createElement("div");
      line.className = `terminal-line${type ? " " + type : ""}`;
      gateBody.appendChild(line);
      let i = 0;
      const interval = setInterval(() => {
        line.textContent = text.slice(0, i + 1);
        i += 1;
        gateBody.scrollTop = gateBody.scrollHeight;
        if (i >= text.length) {
          clearInterval(interval);
          resolve();
        }
      }, speed || 10);
    });
  }

  async function runBoot() {
    for (const line of bootLines) {
      await typeLine(line.text, line.type, 6);
      await new Promise((r) => setTimeout(r, prefersReducedMotion ? 0 : 60));
    }
    gateInput.focus();
  }

  function grantAccess(finalMessage, targetSection) {
    addLine(finalMessage || "ACCESS GRANTED — welcome, guest.", "accent");
    gateInput.disabled = true;
    setTimeout(
      () => {
        gate.classList.add("closing");
        sessionStorage.setItem("portfolio-gate-passed", "1");
        setTimeout(
          () => {
            gate.classList.remove("active", "closing");
            body.classList.remove("gate-lock");
            if (targetSection && SECTIONS.includes(targetSection)) {
              document.getElementById(targetSection).scrollIntoView({
                behavior: prefersReducedMotion ? "auto" : "smooth",
              });
            } else {
              const main = document.getElementById("main-content");
              if (main) main.focus({ preventScroll: true });
            }
          },
          prefersReducedMotion ? 0 : 480
        );
      },
      prefersReducedMotion ? 0 : 500
    );
  }

  gateInput.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    const raw = gateInput.value.trim();
    const value = raw.toLowerCase();
    addLine(raw, "echo");
    gateInput.value = "";

    const openMatch = value.match(/^open\s+(.+)$/);
    const navTarget = openMatch ? openMatch[1].trim() : value;

    if (value === "" || value === "access") {
      grantAccess();
    } else if (SECTIONS.includes(navTarget)) {
      grantAccess(`Jumping to ${navTarget}...`, navTarget);
    } else if (openMatch) {
      addLine(`unknown section: ${openMatch[1]}`, "warn");
      addLine(`try: ${SECTIONS.join(", ")}`, "dim");
    } else if (value === "clear") {
      gateBody.innerHTML = "";
    } else if (value.startsWith("sudo")) {
      grantAccess("Nice try. Permission granted out of respect.");
    } else if (staticCommands[value]) {
      staticCommands[value]().forEach((l) => addLine(l.text, l.type));
    } else {
      addLine(`command not found: ${raw}`, "warn");
      addLine("type 'help', or just press Enter to continue.", "dim");
    }
  });

  gateSkip.addEventListener("click", () => grantAccess("Skipped — welcome, guest."));

  runBoot();
})();

/* ---------- Terminal keystroke sound (opt-in, muted by default) ---------- */
(function initTerminalSound() {
  const soundButton = document.getElementById("terminalSound");
  const gateInput = document.getElementById("terminalInput");
  if (!soundButton || !gateInput) return;

  let enabled = false;
  let audioCtx = null;

  function beep() {
    if (!enabled) return;
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      audioCtx = new AudioContextClass();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "square";
    osc.frequency.value = 620 + Math.random() * 60;
    gain.gain.value = 0.03;
    osc.connect(gain).connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.03);
  }

  soundButton.addEventListener("click", () => {
    enabled = !enabled;
    soundButton.classList.toggle("on", enabled);
    soundButton.setAttribute("aria-pressed", String(enabled));
    soundButton.textContent = enabled ? "🔊" : "🔇";
  });

  gateInput.addEventListener("keydown", (event) => {
    if (event.key.length === 1 || event.key === "Backspace" || event.key === "Enter") beep();
  });
})();

/* ---------- Case study modal ---------- */
(function initCaseStudyModal() {
  const backdrop = document.getElementById("caseStudyBackdrop");
  const modal = document.getElementById("caseStudyModal");
  if (!backdrop || !modal) return;

  const caseStudies = {
    chess: {
      title: "Chess Game with Minimax AI",
      tags: ["Java", "Minimax", "Game AI", "GUI"],
      sections: [
        {
          heading: "The problem",
          body:
            "Chess has an enormous branching factor, so an AI opponent needs to look several " +
            "moves ahead without freezing the interface or making obviously weak trades.",
        },
        {
          heading: "The approach",
          body:
            "A minimax search with alpha-beta pruning explores future positions move by move, " +
            "scoring each resulting board with a material-based evaluation function once the " +
            "search reaches its depth limit (3 plies). Move generation validates king safety " +
            "before any move reaches the player or the AI, and the Swing UI shows legal-move " +
            "hints, chess clocks, and captured pieces.",
        },
        {
          heading: "What I'd do differently",
          body:
            "Add a transposition table and iterative deepening so the search can go deeper in " +
            "the same amount of time, and extend the evaluation beyond material counting with " +
            "positional factors like piece placement and king safety.",
        },
      ],
    },
  };

  let lastTrigger = null;

  function render(id) {
    const data = caseStudies[id];
    if (!data) return false;
    const tagsHtml = data.tags.map((tag) => `<span>${tag}</span>`).join("");
    const sectionsHtml = data.sections
      .map((s) => `<div class="case-modal-section"><h4>${s.heading}</h4><p>${s.body}</p></div>`)
      .join("");
    modal.innerHTML = `
      <button class="case-modal-close" id="caseStudyClose" type="button" aria-label="Close case study">✕</button>
      <p class="eyebrow">Case study</p>
      <h3 id="caseStudyTitle">${data.title}</h3>
      <div class="tag-row">${tagsHtml}</div>
      ${sectionsHtml}
    `;
    document.getElementById("caseStudyClose").addEventListener("click", close);
    return true;
  }

  function open(id, trigger) {
    if (!render(id)) return;
    lastTrigger = trigger || null;
    backdrop.classList.add("active");
    body.classList.add("gate-lock");
    modal.focus();
  }

  function close() {
    backdrop.classList.remove("active");
    body.classList.remove("gate-lock");
    if (lastTrigger) lastTrigger.focus();
  }

  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-case-study]");
    if (trigger) {
      event.preventDefault();
      open(trigger.dataset.caseStudy, trigger);
      return;
    }
    if (event.target === backdrop) close();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && backdrop.classList.contains("active")) close();
  });
})();
