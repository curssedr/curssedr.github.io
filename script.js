const nav = document.querySelector(".nav-links");
const menuToggle = document.querySelector(".menu-toggle");

menuToggle.addEventListener("click", () => {
  nav.classList.toggle("open");
});

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", event => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    event.preventDefault();
    nav.classList.remove("open");
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      if (entry.target.classList.contains("skills-board")) {
        entry.target.querySelectorAll(".skill-line").forEach(item => item.classList.add("visible"));
      }
    }
  });
}, { threshold: 0.14 });

document.querySelectorAll(".reveal").forEach(item => revealObserver.observe(item));

const counters = document.querySelectorAll("[data-count]");
let countersStarted = false;

function runCounters() {
  if (countersStarted) return;
  const metrics = document.querySelector(".hero-metrics");
  if (!metrics || metrics.getBoundingClientRect().top > window.innerHeight) return;
  countersStarted = true;

  counters.forEach(counter => {
    const target = Number(counter.dataset.count);
    const duration = 1100;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      counter.textContent = Math.floor(target * progress);
      if (progress < 1) requestAnimationFrame(tick);
      else counter.textContent = target;
    }

    requestAnimationFrame(tick);
  });
}

window.addEventListener("scroll", runCounters, { passive: true });
runCounters();

const canvas = document.querySelector("#heroCanvas");
const ctx = canvas.getContext("2d");
let width = 0;
let height = 0;
let particles = [];

function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const count = Math.max(44, Math.min(90, Math.floor(width / 18)));
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.42,
    vy: (Math.random() - 0.5) * 0.42,
    size: 1 + Math.random() * 2.2
  }));
}

function drawCanvas() {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "rgba(255,255,255,0.75)";

  particles.forEach((particle, index) => {
    particle.x += particle.vx;
    particle.y += particle.vy;

    if (particle.x < -20) particle.x = width + 20;
    if (particle.x > width + 20) particle.x = -20;
    if (particle.y < -20) particle.y = height + 20;
    if (particle.y > height + 20) particle.y = -20;

    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();

    for (let next = index + 1; next < particles.length; next += 1) {
      const other = particles[next];
      const dx = particle.x - other.x;
      const dy = particle.y - other.y;
      const distance = Math.hypot(dx, dy);

      if (distance < 130) {
        const alpha = 1 - distance / 130;
        ctx.strokeStyle = `rgba(43, 217, 255, ${alpha * 0.22})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(other.x, other.y);
        ctx.stroke();
      }
    }
  });

  requestAnimationFrame(drawCanvas);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
drawCanvas();
