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

const marquee = document.querySelector(".marquee div");
if (marquee) {
  marquee.innerHTML += marquee.innerHTML;
}

const canvas = document.querySelector("#motionCanvas");
const ctx = canvas.getContext("2d");
let width = 0;
let height = 0;
let dots = [];
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

  const count = Math.max(38, Math.min(76, Math.floor(width / 22)));
  dots = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.34,
    vy: (Math.random() - 0.5) * 0.34,
    size: 1 + Math.random() * 2
  }));
}

function drawLine(a, b, distance, maxDistance, opacity) {
  const alpha = Math.max(0, 1 - distance / maxDistance) * opacity;
  ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.stroke();
}

function animateCanvas() {
  ctx.clearRect(0, 0, width, height);

  dots.forEach((dot, index) => {
    dot.x += dot.vx;
    dot.y += dot.vy;

    if (dot.x < -20) dot.x = width + 20;
    if (dot.x > width + 20) dot.x = -20;
    if (dot.y < -20) dot.y = height + 20;
    if (dot.y > height + 20) dot.y = -20;

    ctx.fillStyle = "rgba(255,255,255,0.62)";
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
    ctx.fill();

    for (let next = index + 1; next < dots.length; next += 1) {
      const other = dots[next];
      const distance = Math.hypot(dot.x - other.x, dot.y - other.y);
      if (distance < 140) drawLine(dot, other, distance, 140, 0.20);
    }

    if (pointer.active) {
      const pointerDistance = Math.hypot(dot.x - pointer.x, dot.y - pointer.y);
      if (pointerDistance < 170) drawLine(dot, pointer, pointerDistance, 170, 0.26);
    }
  });

  requestAnimationFrame(animateCanvas);
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
animateCanvas();
