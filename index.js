// Snowflakes creation
const snowflakesContainer = document.getElementById("snowflakes");

function createSnowflake() {
    const snowflake = document.createElement("div");
    snowflake.classList.add("snowflake");
    snowflake.textContent = "❄"; // Snowflake character

    // Randomize snowflake size, position, and speed
    const size = Math.random() * 15 + 20; // Snowflakes will be slightly larger
    snowflake.style.fontSize = `${size}px`;
    snowflake.style.left = `${Math.random() * 100}vw`; // Random horizontal position
    snowflake.style.animationDuration = `${Math.random() * 6 + 40}s`; // Slower speed
    snowflake.style.animationDelay = `${Math.random() * 20}s`; // Random delay

    snowflakesContainer.appendChild(snowflake);

    // Remove snowflake after animation ends
  snowflake.addEventListener("animationend", () => {
        snowflake.remove();
    });
}

// Generate snowflakes every 600ms
setInterval(createSnowflake, 600);

// Select all cards
const cards = document.querySelectorAll(".info-card");

// Add hover color dynamically based on the data-hover-color attribute
cards.forEach((card) => {
  const hoverColor = card.getAttribute("data-hover-color");
  card.style.setProperty("--hover-color", hoverColor);
});

window.addEventListener("scroll", function () {
  const header = document.querySelector(".header");
  const profilePhoto = document.querySelector(".profile-photo");
  const textContent = document.querySelector(".text-content");
  
    // Get the current scroll position
    let scrollPosition = window.scrollY;
  
    // Parallax effect: Move the photo and text based on scroll position
    textContent.style.transform = `translateY(${scrollPosition * 0.5}px)`; // Text moves slower
  profilePhoto.style.transform = `translateX(50px) translateY(${
    scrollPosition * 0.3
  }px)`; // Photo moves slower
  
    // Add parallax class for smooth transition effect
    if (scrollPosition > 100) {
      header.classList.add("parallax");
    } else {
      header.classList.remove("parallax");
    }
  });
  
// Project card hover effects - REMOVED as carousel handles appearance
/*
document.querySelectorAll('.project-card').forEach((card) => {
  card.addEventListener('mouseenter', () => {
    card.style.transform = 'scale(1.02)';
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'scale(1)';
  });
});
*/

// Carousel functionality for project cards
const projectCards = document.querySelectorAll(".project-card");
const projectsGrid = document.querySelector(".projects-grid");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
let activeCardIndex = 0;

let isDragging = false;
let startPos = 0;
let currentTranslate = 0;
let prevTranslate = 0;

function updateCarousel() {
  // Calculate the translateX value to center the active card
  const cardWidth = projectCards[0].offsetWidth; // Assuming all cards have the same width
  const gap = parseFloat(getComputedStyle(projectsGrid).gap); // Get the gap value
  const containerWidth = projectsGrid.parentElement.offsetWidth; // Get the width of the projects section/container

  // Calculate the current center position of the active card relative to the viewport
  const activeCard = projectCards[activeCardIndex];
  const activeCardRect = activeCard.getBoundingClientRect();
  const activeCardCenter = activeCardRect.left + activeCardRect.width / 2;

  // Calculate the center of the container relative to the viewport
  const containerRect = projectsGrid.parentElement.getBoundingClientRect();
  const containerCenter = containerRect.left + containerRect.width / 2;

  // Calculate the difference between the two centers
  const centerDifference = containerCenter - activeCardCenter;

  // The new translate value is the current translate plus the difference needed to center
  currentTranslate = currentTranslate + centerDifference;

  projectsGrid.style.transform = `translateX(${currentTranslate}px)`;

  projectCards.forEach((card, index) => {
    if (index === activeCardIndex) {
      card.classList.add("active");
    } else {
      card.classList.remove("active");
    }
  });

  // Disable/enable buttons at ends
  prevBtn.disabled = activeCardIndex === 0;
  nextBtn.disabled = activeCardIndex === projectCards.length - 1;
}

// Initialize the carousel
if (projectCards.length > 0) {
  projectCards[activeCardIndex].classList.add("active");
  // Call updateCarousel initially to set the correct position on load
  updateCarousel();
  // Recalculate and update after images load to ensure correct centering
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

// Mouse drag functionality
projectsGrid.addEventListener("mousedown", dragStart);
projectsGrid.addEventListener("mouseup", dragEnd);
projectsGrid.addEventListener("mouseleave", dragEnd);
projectsGrid.addEventListener("mousemove", drag);

// Touch drag functionality (for mobile)
projectsGrid.addEventListener("touchstart", dragStart);
projectsGrid.addEventListener("touchend", dragEnd);
projectsGrid.addEventListener("touchmove", drag);

function dragStart(event) {
  isDragging = true;
  startPos =
    event.type === "touchstart" ? event.touches[0].clientX : event.clientX;
  projectsGrid.style.transition = "none";
  prevTranslate = currentTranslate;
  // Add a class to body to indicate dragging, to prevent unwanted text selection
  document.body.classList.add("dragging");
}

function dragEnd() {
  isDragging = false;
  projectsGrid.style.transition = "transform 0.5s ease";
  // Remove dragging class from body
  document.body.classList.remove("dragging");

  // Determine which card is closest to the center after dragging ends
  const containerCenter =
    projectsGrid.parentElement.getBoundingClientRect().left +
    projectsGrid.parentElement.offsetWidth / 2;
  let closestCardIndex = 0; // Default to the first card
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
  updateCarousel(); // Update to the new active card and position
}

function drag(event) {
  if (!isDragging) return;
  event.preventDefault();
  const currentPos =
    event.type === "touchmove" ? event.touches[0].clientX : event.clientX;
  const moveAmount = currentPos - startPos;
  // Limit the drag movement to prevent scrolling past the ends of the carousel
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

// Navigation arrow functionality
prevBtn.addEventListener("click", () => {
  activeCardIndex = Math.max(activeCardIndex - 1, 0);
  updateCarousel();
});

nextBtn.addEventListener("click", () => {
  activeCardIndex = Math.min(activeCardIndex + 1, projectCards.length - 1);
  updateCarousel();
});

// Also update carousel on window resize to maintain centering
window.addEventListener("resize", updateCarousel);

// Observe all sections, skill categories, and contact items
const animatedElements = document.querySelectorAll(
  "section, .skill-category, .contact-item"
);

const observerOptions = {
  root: null,
  rootMargin: "0px",
  threshold: 0.1,
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe elements that need vertical animation
animatedElements.forEach((element) => observer.observe(element));

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });
  });
});

// Text scramble effect for the hero title
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
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `<span class="glitch">${char}</span>`;
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
const glitchText = document.querySelector(".hero h2"); // Target the h2 for the scramble effect
if (glitchText) {
  const fx = new TextScramble(glitchText);
  fx.setText(glitchText.textContent);
}

// Mobile navigation
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");

if (hamburger) {
    hamburger.addEventListener("click", () => {
        navLinks.classList.toggle("show");
    });
}

// Parallax effect for hero section
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  const hero = document.querySelector(".hero");
  if (hero) {
    hero.style.transform = `translateY(${scrolled * 0.5}px)`;
  }
});

// Add active class to navigation links based on scroll position
const sections = document.querySelectorAll("section");
const navItems = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (pageYOffset >= sectionTop - 200) {
      current = section.getAttribute("id");
    }
  });

  navItems.forEach((item) => {
    item.classList.remove("active");
    if (item.getAttribute("href").slice(1) === current) {
      item.classList.add("active");
    }
  });
});
