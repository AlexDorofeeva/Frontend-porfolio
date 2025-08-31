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

// Clone cards for infinite scroll
function setupInfiniteCarousel() {
  if (projectCards.length === 0) return;

  // Clone first and last cards for seamless loop
  const firstCard = projectCards[0].cloneNode(true);
  const lastCard = projectCards[projectCards.length - 1].cloneNode(true);

  // Add cloned cards to the grid
  projectsGrid.appendChild(firstCard);
  projectsGrid.insertBefore(lastCard, projectCards[0]);

  // Update the cards reference to include clones
  const allCards = document.querySelectorAll(".project-card");

  // Set initial position to show the first real card
  activeCardIndex = 1; // Start at first real card (index 1 because we added clone at beginning)

  return allCards;
}

const allProjectCards = setupInfiniteCarousel();

let isDragging = false;
let startPos = 0;
let currentTranslate = 0;
let prevTranslate = 0;

// Update carousel position and active card
function updateCarousel() {
  const cardWidth = allProjectCards[0].offsetWidth;
  const gap = parseFloat(getComputedStyle(projectsGrid).gap);
  const containerWidth = projectsGrid.parentElement.offsetWidth;

  // Calculate the target position for the active card
  const targetTranslate =
    -(activeCardIndex * (cardWidth + gap)) +
    (containerWidth / 2 - cardWidth / 2);

  // Smooth transition to the target position
  currentTranslate = targetTranslate;
  projectsGrid.style.transform = `translateX(${currentTranslate}px)`;

  // Update active card styling
  allProjectCards.forEach((card, index) => {
    if (index === activeCardIndex) {
      card.classList.add("active");
    } else {
      card.classList.remove("active");
    }
  });

  // Handle infinite scroll transitions
  setTimeout(() => {
    // If we're at the cloned last card, jump to the real last card
    if (activeCardIndex === allProjectCards.length - 1) {
      activeCardIndex = 1; // Jump to first real card
      projectsGrid.style.transition = "none";
      updateCarousel();
      setTimeout(() => {
        projectsGrid.style.transition = "transform 0.5s ease";
      }, 10);
    }
    // If we're at the cloned first card, jump to the real first card
    else if (activeCardIndex === 0) {
      activeCardIndex = allProjectCards.length - 2; // Jump to last real card
      projectsGrid.style.transition = "none";
      updateCarousel();
      setTimeout(() => {
        projectsGrid.style.transition = "transform 0.5s ease";
      }, 10);
    }
  }, 500); // Wait for transition to complete

  // Ensure buttons are always enabled for infinite scrolling
  prevBtn.disabled = false;
  nextBtn.disabled = false;
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

  // Ensure the index stays within bounds for infinite scrolling
  if (closestCardIndex < 0) {
    closestCardIndex = projectCards.length - 1;
  } else if (closestCardIndex >= projectCards.length) {
    closestCardIndex = 0;
  }

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

  // Remove constraints for infinite scrolling
  // const minTranslate =
  //   -(projectCards.length - 1) *
  //     (projectCards[0].offsetWidth +
  //       parseFloat(getComputedStyle(projectsGrid).gap)) +
  //   (projectsGrid.parentElement.offsetWidth / 2 -
  //     projectCards[0].offsetWidth / 2);
  // const maxTranslate =
  //   projectsGrid.parentElement.offsetWidth / 2 -
  //   projectCards[0].offsetWidth / 2;

  currentTranslate = prevTranslate + moveAmount;
  // Remove min/max constraints for infinite scrolling
  // currentTranslate = Math.max(currentTranslate, minTranslate);
  // currentTranslate = Math.min(currentTranslate, maxTranslate);

  projectsGrid.style.transform = `translateX(${currentTranslate}px)`;
}

// ========================================
// CAROUSEL NAVIGATION BUTTONS
// ========================================
prevBtn.addEventListener("click", () => {
  // Infinite scroll - always go to previous
  activeCardIndex = activeCardIndex - 1;
  updateCarousel();
});

nextBtn.addEventListener("click", () => {
  // Infinite scroll - always go to next
  activeCardIndex = activeCardIndex + 1;
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
