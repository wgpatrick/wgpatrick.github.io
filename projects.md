---
layout: page
title: Projects
permalink: /projects/
---

<div class="projects-container">
  <div class="projects-nav">
    <a href="#product" class="nav-link">Product</a>
    <a href="#art-design" class="nav-link">Art & Design</a>
    <a href="#structural" class="nav-link">Structural</a>
    <a href="#research" class="nav-link">Research</a>
  </div>

  <section id="product" class="project-section">
    <h2>Product</h2>
    
    <article class="project-entry">
      <div class="project-header" onclick="toggleProject(this)">
        <h3>Culture Biosciences</h3>
        <span class="expand-button">−</span>
      </div>
      
      <div class="project-content active">
        <p>Culture Biosciences is developing cloud-based bioprocess development technology. As founder and CEO for 8 years, I led the company from concept through multiple funding rounds, building a team of 60+ and serving customers across the biotechnology industry.</p>
        
        <div class="carousel">
          <div class="carousel-container">
            <figure class="carousel-slide">
              <img src="/assets/images/projects/culture/culture-1.png" alt="Culture Biosciences Bioreactors" class="carousel-image">
              <figcaption>Our cloud bioreactor facility in South San Francisco</figcaption>
            </figure>
            <figure class="carousel-slide">
              <img src="/assets/images/projects/culture/culture-2.png" alt="Culture Dashboard" class="carousel-image">
              <figcaption>Real-time bioprocess monitoring and control interface</figcaption>
            </figure>
            <figure class="carousel-slide">
              <img src="/assets/images/projects/culture/culture-3.png" alt="Culture Team" class="carousel-image">
              <figcaption>The Culture team in action</figcaption>
            </figure>
            <figure class="carousel-slide">
              <img src="/assets/images/projects/culture/culture-4.png" alt="Culture Lab" class="carousel-image">
              <figcaption>Our automated laboratory systems</figcaption>
            </figure>
          </div>
          <button class="carousel-button prev" onclick="moveCarousel(-1)">❮</button>
          <button class="carousel-button next" onclick="moveCarousel(1)">❯</button>
          <div class="carousel-dots"></div>
        </div>
      </div>
    </article>
  </section>
</div>

<style>
.projects-container {
  max-width: 800px;
  margin: 0 auto;
}

.projects-nav {
  margin: 20px 0;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.nav-link {
  margin-right: 20px;
  text-decoration: none;
  color: #333;
}

.project-section {
  margin: 40px 0;
}

.project-entry {
  margin: 20px 0;
  border: 1px solid #eee;
  border-radius: 4px;
}

.project-header {
  padding: 15px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f9f9f9;
}

.project-header h3 {
  margin: 0;
}

.project-content {
  display: none;
  padding: 15px;
}

.project-content.active {
  display: block;
}

.project-images {
  margin: 20px 0;
}

.project-images img {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.expand-button {
  font-size: 24px;
  color: #666;
}

.carousel {
  position: relative;
  width: 100%;
  margin: 20px 0;
  overflow: hidden;
}

.carousel-container {
  display: flex;
  transition: transform 0.5s ease-in-out;
  width: 100%;
}

.carousel-image {
  width: 100%;
  display: block;
  border-radius: 4px 4px 0 0;  /* Rounded corners only on top */
}

.carousel-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 16px;
  cursor: pointer;
  border-radius: 4px;
  font-size: 18px;
}

.carousel-button:hover {
  background: rgba(0, 0, 0, 0.7);
}

.prev {
  left: 10px;
}

.next {
  right: 10px;
}

.carousel-dots {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
}

.dot.active {
  background: white;
}

.carousel-slide {
  flex: 0 0 100%;
  margin: 0;
  position: relative;
}

figcaption {
  text-align: center;
  padding: 10px;
  color: #666;
  font-style: italic;
  font-size: 0.9em;
}
</style>

<script>
let currentSlide = 0;
let touchStartX = 0;
let touchEndX = 0;
const slides = document.querySelectorAll('.carousel-slide');

function initCarousel() {
  const dotsContainer = document.querySelector('.carousel-dots');
  dotsContainer.innerHTML = ''; // Clear existing dots
  slides.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.className = 'dot';
    dot.onclick = () => goToSlide(i);
    dotsContainer.appendChild(dot);
  });
  updateDots();
  
  // Add touch event listeners
  const carousel = document.querySelector('.carousel');
  carousel.addEventListener('touchstart', handleTouchStart, false);
  carousel.addEventListener('touchmove', handleTouchMove, false);
  carousel.addEventListener('touchend', handleTouchEnd, false);
}

function handleTouchStart(event) {
  touchStartX = event.touches[0].clientX;
}

function handleTouchMove(event) {
  touchEndX = event.touches[0].clientX;
  // Prevent page scrolling while swiping carousel
  event.preventDefault();
}

function handleTouchEnd() {
  const touchDiff = touchStartX - touchEndX;
  
  // Only register as swipe if moved more than 50 pixels
  if (Math.abs(touchDiff) > 50) {
    if (touchDiff > 0) {
      // Swiped left - next slide
      moveCarousel(1);
    } else {
      // Swiped right - previous slide
      moveCarousel(-1);
    }
  }
  
  // Reset touch coordinates
  touchStartX = 0;
  touchEndX = 0;
}

function moveCarousel(direction) {
  currentSlide = (currentSlide + direction + slides.length) % slides.length;
  updateCarousel();
}

function goToSlide(n) {
  currentSlide = n;
  updateCarousel();
}

function updateCarousel() {
  const container = document.querySelector('.carousel-container');
  container.style.transform = `translateX(-${currentSlide * 100}%)`;
  updateDots();
}

function updateDots() {
  const dots = document.querySelectorAll('.dot');
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlide);
  });
}

function toggleProject(header) {
  const content = header.nextElementSibling;
  const button = header.querySelector('.expand-button');
  
  if (content.classList.contains('active')) {
    content.classList.remove('active');
    button.textContent = '+';
  } else {
    content.classList.add('active');
    button.textContent = '−';
    // Initialize carousel when project is opened
    setTimeout(initCarousel, 0);
  }
}

// Initialize carousels when page loads
document.addEventListener('DOMContentLoaded', function() {
  const activeProjects = document.querySelectorAll('.project-content.active');
  activeProjects.forEach(() => setTimeout(initCarousel, 0));
});
</script>

**MIT Biomechatronics** (2014-2016)  
Developed novel prosthetic socket technologies in Hugh Herr's Biomechatronics group at the MIT Media Lab.  
![MIT Project](https://images.unsplash.com/photo-1530973428-5bf2db2e4d71?w=800&h=400&fit=crop)

**Project 3** (20XX-20XX)  
Brief compelling description of the project that captures the key accomplishment or innovation.  
![Project 3](https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=800&h=400&fit=crop)

**Project 4** (20XX-20XX)  
Brief compelling description of the project that captures the key accomplishment or innovation.  
![Project 4](https://images.unsplash.com/photo-1581094794329-c8112c4e5d44?w=800&h=400&fit=crop)

**Project 5** (20XX-20XX)  
Brief compelling description of the project that captures the key accomplishment or innovation.  
![Project 5](https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&h=400&fit=crop)

**Project 6** (20XX-20XX)  
Brief compelling description of the project that captures the key accomplishment or innovation.  
![Project 6](https://images.unsplash.com/photo-1581093588401-fdd3915c912f?w=800&h=400&fit=crop) 