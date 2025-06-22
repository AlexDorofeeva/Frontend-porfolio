// ========================================
// CARD HOVER EFFECTS
// ========================================
const cards = document.querySelectorAll(".info-card");

cards.forEach((card) => {
  const hoverColor = card.getAttribute("data-hover-color");
  card.style.setProperty("--hover-color", hoverColor);
});

// ========================================
// SCROLL PARALLAX EFFECTS
// ========================================
window.addEventListener("scroll", function () {
  const header = document.querySelector(".header");
  const profilePhoto = document.querySelector(".profile-photo");
  const textContent = document.querySelector(".text-content");

  let scrollPosition = window.scrollY;

  textContent.style.transform = `translateY(${scrollPosition * 0.5}px)`;
  profilePhoto.style.transform = `translateX(50px) translateY(${
    scrollPosition * 0.3
  }px)`;

  if (scrollPosition > 100) {
    header.classList.add("parallax");
  } else {
    header.classList.remove("parallax");
  }
});

// ========================================
// PROJECT CAROUSEL FUNCTIONALITY
// ========================================
const projectCards = document.querySelectorAll(".project-card");
const projectsGrid = document.querySelector(".projects-grid");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
let activeCardIndex = 0;

let isDragging = false;
let startPos = 0;
let currentTranslate = 0;
let prevTranslate = 0;

// Update carousel position and active card
function updateCarousel() {
  const cardWidth = projectCards[0].offsetWidth;
  const gap = parseFloat(getComputedStyle(projectsGrid).gap);
  const containerWidth = projectsGrid.parentElement.offsetWidth;

  const activeCard = projectCards[activeCardIndex];
  const activeCardRect = activeCard.getBoundingClientRect();
  const activeCardCenter = activeCardRect.left + activeCardRect.width / 2;

  const containerRect = projectsGrid.parentElement.getBoundingClientRect();
  const containerCenter = containerRect.left + containerRect.width / 2;

  const centerDifference = containerCenter - activeCardCenter;

  currentTranslate = currentTranslate + centerDifference;

  projectsGrid.style.transform = `translateX(${currentTranslate}px)`;

  projectCards.forEach((card, index) => {
    if (index === activeCardIndex) {
      card.classList.add("active");
    } else {
      card.classList.remove("active");
    }
  });

  prevBtn.disabled = activeCardIndex === 0;
  nextBtn.disabled = activeCardIndex === projectCards.length - 1;
}

// Initialize carousel
if (projectCards.length > 0) {
  projectCards[activeCardIndex].classList.add("active");
  updateCarousel();

  const images = projectsGrid.querySelectorAll("img");
  let imagesLoaded = 0;
  images.forEach((img) => {
    if (img.complete) {
      imagesLoaded++;
    } else {
      img.addEventListener("load", () => {
        imagesLoaded++;
        if (imagesLoaded === images.length) {
          updateCarousel();
        }
      });
    }
  });
  if (imagesLoaded === images.length) {
    updateCarousel();
  }
}

// ========================================
// DRAG FUNCTIONALITY (MOUSE & TOUCH)
// ========================================
projectsGrid.addEventListener("mousedown", dragStart);
projectsGrid.addEventListener("mouseup", dragEnd);
projectsGrid.addEventListener("mouseleave", dragEnd);
projectsGrid.addEventListener("mousemove", drag);

projectsGrid.addEventListener("touchstart", dragStart);
projectsGrid.addEventListener("touchend", dragEnd);
projectsGrid.addEventListener("touchmove", drag);

// Start dragging
function dragStart(event) {
  isDragging = true;
  startPos =
    event.type === "touchstart" ? event.touches[0].clientX : event.clientX;
  projectsGrid.style.transition = "none";
  prevTranslate = currentTranslate;
  document.body.classList.add("dragging");
}

// End dragging and snap to closest card
function dragEnd() {
  isDragging = false;
  projectsGrid.style.transition = "transform 0.5s ease";
  document.body.classList.remove("dragging");

  const containerCenter =
    projectsGrid.parentElement.getBoundingClientRect().left +
    projectsGrid.parentElement.offsetWidth / 2;
  let closestCardIndex = 0;
  let minDistance = Infinity;

  projectCards.forEach((card, index) => {
    const cardRect = card.getBoundingClientRect();
    const cardCenter = cardRect.left + cardRect.width / 2;
    const distanceToCenter = Math.abs(cardCenter - containerCenter);

    if (distanceToCenter < minDistance) {
      minDistance = distanceToCenter;
      closestCardIndex = index;
    }
  });

  activeCardIndex = closestCardIndex;
  updateCarousel();
}

// Handle dragging movement
function drag(event) {
  if (!isDragging) return;
  event.preventDefault();
  const currentPos =
    event.type === "touchmove" ? event.touches[0].clientX : event.clientX;
  const moveAmount = currentPos - startPos;

  const minTranslate =
    -(projectCards.length - 1) *
      (projectCards[0].offsetWidth +
        parseFloat(getComputedStyle(projectsGrid).gap)) +
    (projectsGrid.parentElement.offsetWidth / 2 -
      projectCards[0].offsetWidth / 2);
  const maxTranslate =
    projectsGrid.parentElement.offsetWidth / 2 -
    projectCards[0].offsetWidth / 2;

  currentTranslate = prevTranslate + moveAmount;
  currentTranslate = Math.max(currentTranslate, minTranslate);
  currentTranslate = Math.min(currentTranslate, maxTranslate);

  projectsGrid.style.transform = `translateX(${currentTranslate}px)`;
}

// ========================================
// CAROUSEL NAVIGATION BUTTONS
// ========================================
prevBtn.addEventListener("click", () => {
  activeCardIndex = Math.max(activeCardIndex - 1, 0);
  updateCarousel();
});

nextBtn.addEventListener("click", () => {
  activeCardIndex = Math.min(activeCardIndex + 1, projectCards.length - 1);
  updateCarousel();
});

// Update carousel on window resize
window.addEventListener("resize", updateCarousel);

// ========================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ========================================
const animatedElements = document.querySelectorAll(
  "section, .skill-category, .contact-item"
);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");
      }
    });
  },
  {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }
);

animatedElements.forEach((element) => {
  observer.observe(element);
});

// ========================================
// TEXT SCRAMBLE ANIMATION
// ========================================
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = "!<>-_\\/[]{}—=+*^?#________";
    this.update = this.update.bind(this);
  }

  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => (this.resolve = resolve));
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || "";
      const to = newText[i] || "";
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      this.queue.push({ from, to, start, end });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }

  update() {
    let output = "";
    let complete = 0;
    for (let i = 0, n = this.queue.length; i < n; ++i) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `<span class="dud">${char}</span>`;
      } else {
        output += from;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }

  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

// Initialize text scramble effect
const phrases = ["Creative Developer", "Digital Artist", "Problem Solver"];
const el = document.querySelector(".glitch-text");
const fx = new TextScramble(el);

let counter = 0;
const next = () => {
  fx.setText(phrases[counter]).then(() => {
    setTimeout(next, 2000);
  });
  counter = (counter + 1) % phrases.length;
};

if (el) {
  next();
}
