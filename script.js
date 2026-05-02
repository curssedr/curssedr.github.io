const nav = document.querySelector(".nav");
const menuButton = document.querySelector(".menu-button");

menuButton.addEventListener("click", () => {
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

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll(".reveal").forEach(item => observer.observe(item));

const canvas = document.querySelector("#network");
const ctx = canvas.getContext("2d");
let width = 0;
let height = 0;
let particles = [];
const pointer = { x: 0, y: 0, active: false };

function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const amount = Math.max(44, Math.min(88, Math.floor(width / 18)));
  particles = Array.from({ length: amount }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.42,
    vy: (Math.random() - 0.5) * 0.42,
    size: 1 + Math.random() * 2.2
  }));
}

function connect(a, b, distance, color) {
  const alpha = Math.max(0, 1 - distance / 150);
  ctx.strokeStyle = color.replace("ALPHA", String(alpha * 0.24));
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.stroke();
}

function draw() {
  ctx.clearRect(0, 0, width, height);

  particles.forEach((particle, index) => {
    particle.x += particle.vx;
    particle.y += particle.vy;

    if (particle.x < -24) particle.x = width + 24;
    if (particle.x > width + 24) particle.x = -24;
    if (particle.y < -24) particle.y = height + 24;
    if (particle.y > height + 24) particle.y = -24;

    ctx.fillStyle = "rgba(255,255,255,0.72)";
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();

    for (let next = index + 1; next < particles.length; next += 1) {
      const other = particles[next];
      const distance = Math.hypot(particle.x - other.x, particle.y - other.y);
      if (distance < 150) connect(particle, other, distance, "rgba(124,111,247,ALPHA)");
    }

    if (pointer.active) {
      const distance = Math.hypot(particle.x - pointer.x, particle.y - pointer.y);
      if (distance < 170) connect(particle, pointer, distance, "rgba(53,213,255,ALPHA)");
    }
  });

  requestAnimationFrame(draw);
}

window.addEventListener("resize", resizeCanvas);
window.addEventListener("pointermove", event => {
  pointer.x = event.clientX;
  pointer.y = event.clientY;
  pointer.active = true;
});
window.addEventListener("pointerleave", () => {
  pointer.active = false;
});

resizeCanvas();
draw();
