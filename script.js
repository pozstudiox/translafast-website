// ✅ Preloader kaldır
window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");
  if (preloader) {
    preloader.style.opacity = "0";
    preloader.style.pointerEvents = "none";
    setTimeout(() => preloader.remove(), 600);
  }
});

// ✅ Navbar küçült (shrink) efekti
const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    navbar.classList.add("shrink");
  } else {
    navbar.classList.remove("shrink");
  }
});

// ✅ Aktif menüyü işaretle
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".menu a");

window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === "#" + current) {
      link.classList.add("active");
    }
  });
});

// ✅ Accordion (Nasıl Çalışır adımları)
const steps = document.querySelectorAll(".steps li");

steps.forEach((step) => {
  step.addEventListener("click", () => {
    step.classList.toggle("active");
  });
});

// ✅ Fade-in animasyonlar
const fadeEls = document.querySelectorAll(".fade-in");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

fadeEls.forEach((el) => observer.observe(el));

// ✅ Hamburger Menü
const hamburgerBtn = document.getElementById("hamburgerMenu");
const hamburgerPanel = document.getElementById("hamburgerPanel");

hamburgerBtn.addEventListener("click", () => {
  hamburgerPanel.classList.toggle("active");
  hamburgerPanel.classList.remove("hidden"); // sadece ilk açılışta kaldırılır
});

// ESC tuşuyla kapatma
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    hamburgerPanel.classList.remove("active");
  }
});
