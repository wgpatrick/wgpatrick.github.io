---
layout: page
title: Projects
permalink: /projects/
---

<script>
document.body.classList.add('projects-page');
</script>

<link rel="stylesheet" href="/assets/css/projects.css">

<!-- Hide the default post header -->
<style>
  .post-header {
    display: none;
  }
</style>

<div class="projects-container">
  <div class="projects-nav-wrapper">
  <div class="projects-nav">
      <h2 class="nav-title">Projects</h2>
    <a href="#product" class="nav-link">Product</a>
      <a href="#research" class="nav-link">Research</a>
    <a href="#structural" class="nav-link">Structural</a>
      <a href="#design" class="nav-link">Design</a>
    </div>
  </div>

  <!-- Product Section -->
  <section id="product" class="project-section">
    <h2>Product</h2>

    <!-- Stratyx 250 -->
    <article class="project-entry">
      <div class="project-header" onclick="toggleProject(this)">
        <div class="header-content">
          <img src="/assets/images/projects/stratyx/stratyx-01.jpg" alt="Stratyx Preview" class="project-thumbnail">
          <div>
            <h3>Stratyx 250</h3>
            <div class="project-meta">Culture Biosciences • 2023-2025</div>
          </div>
        </div>
        <span class="expand-button">+</span>
      </div>
      
      <div class="project-content">
        <p>The Stratyx 250 was developed in response to consistent customer requests to purchase the bioreactor technology we had built for Culture's cloud bioreactor service. Development began in late 2023, with customer launch planned for 2025. The system's key innovation is its cloud connectivity, enabling remote control of bioprocesses and data access from any device—a significant departure from traditional systems that require on-site operation. Each unit ships with access to Console, our comprehensive bioprocess data management and analysis platform. Designed with rapid deployment in mind, the skid-mounted system helps fast-growing biotech companies quickly scale their operations without the lengthy installation times typical of traditional bioreactor systems.</p>
        
        <div class="carousel">
          <div class="carousel-container">
            <figure class="carousel-slide">
              <img src="/assets/images/projects/stratyx/stratyx-01.jpg" alt="Stratyx 250 System" class="carousel-image" />
            </figure>
            <figure class="carousel-slide">
              <img src="/assets/images/projects/stratyx/stratyx-02.jpg" alt="Stratyx Interface" class="carousel-image" />
            </figure>
            <figure class="carousel-slide">
              <img src="/assets/images/projects/stratyx/stratyx-03.jpg" alt="Stratyx Detail" class="carousel-image" />
            </figure>
            <figure class="carousel-slide">
              <img src="/assets/images/projects/stratyx/stratyx-04.jpg" alt="Stratyx Installation" class="carousel-image" />
            </figure>
          </div>
          <button class="carousel-button prev" onclick="moveCarousel(-1, this)">❮</button>
          <button class="carousel-button next" onclick="moveCarousel(1, this)">❯</button>
          <div class="carousel-dots"></div>
        </div>
      </div>
    </article>

    <!-- Cloud Bioreactor Service -->
    <article class="project-entry">
      <div class="project-header" onclick="toggleProject(this)">
        <div class="header-content">
          <img src="/assets/images/projects/cloud-bioreactor/cloud-bioreactor-01.jpg" alt="Cloud Bioreactor Preview" class="project-thumbnail">
          <div>
            <h3>Cloud Bioreactor Service</h3>
            <div class="project-meta">Culture Biosciences • 2018-2024</div>
          </div>
        </div>
        <span class="expand-button">+</span>
      </div>
      
      <div class="project-content">
        <p>Pioneered a "cloud biomanufacturing" platform that enables biotech companies to run their bioprocess experiments remotely, similar to how cloud computing allows companies to deploy code without building their own data centers. Since launching with four prototype bioreactors in late 2017, the service has grown to include over 200 small-scale 250mL bioreactors and custom-built 5L systems for larger-scale processes. The platform has supported over 75 companies, ranging from synthetic biology startups to large pharmaceutical firms, and successfully cultured hundreds of different organisms, including CHO cells, HEK cells producing AAVs, filamentous fungi, E. coli, and soil bacteria. Over time, we developed Console, a comprehensive software platform providing real-time access to experimental data and advanced analysis tools, making bioprocess development more accessible and efficient than ever before.</p>
        
        <div class="carousel">
          <div class="carousel-container">
            <figure class="carousel-slide">
              <img src="/assets/images/projects/cloud-bioreactor/cloud-bioreactor-01.jpg" alt="Cloud Bioreactor Facility" class="carousel-image" />
            </figure>
            <figure class="carousel-slide">
              <img src="/assets/images/projects/cloud-bioreactor/cloud-bioreactor-02.jpg" alt="Cloud Interface" class="carousel-image" />
            </figure>
            <figure class="carousel-slide">
              <img src="/assets/images/projects/cloud-bioreactor/cloud-bioreactor-03.jpg" alt="Automation Systems" class="carousel-image" />
            </figure>
            <figure class="carousel-slide">
              <img src="/assets/images/projects/cloud-bioreactor/cloud-bioreactor-04.jpg" alt="Bioreactor Detail" class="carousel-image" />
            </figure>
            <figure class="carousel-slide">
              <img src="/assets/images/projects/cloud-bioreactor/cloud-bioreactor-05.jpg" alt="Laboratory Setup" class="carousel-image" />
            </figure>
          </div>
          <button class="carousel-button prev" onclick="moveCarousel(-1, this)">❮</button>
          <button class="carousel-button next" onclick="moveCarousel(1, this)">❯</button>
          <div class="carousel-dots"></div>
        </div>
      </div>
    </article>

    <!-- Wing -->
    <article class="project-entry">
      <div class="project-header" onclick="toggleProject(this)">
        <div class="header-content">
          <img src="/assets/images/projects/wing/wing-01.jpg" alt="Wing Preview" class="project-thumbnail">
          <div>
            <h3>Wing</h3>
            <div class="project-meta">X, Alphabet • 2012-2013</div>
          </div>
        </div>
        <span class="expand-button">+</span>
      </div>
      
      <div class="project-content">
        <p>As a Rapid Evaluator at Google[x], I explored the potential of autonomous aerial vehicles for ultra-rapid package delivery, with a focus on emergency medical applications such as delivering automated external defibrillators (AEDs) during cardiac emergencies. Through iterative prototyping and testing, I developed a winching system for ground delivery that was subsequently implemented in the aircraft design. This work contributed to the early development of what would become Wing, Alphabet's autonomous delivery drone service.</p>
        
        <div class="carousel">
          <div class="carousel-container">
            <figure class="carousel-slide">
              <img src="/assets/images/projects/wing/wing-01.jpg" alt="Wing Prototype" class="carousel-image">
            </figure>
            <figure class="carousel-slide">
              <img src="/assets/images/projects/wing/wing-02.jpg" alt="Design Process" class="carousel-image">
            </figure>
            <figure class="carousel-slide">
              <img src="/assets/images/projects/wing/wing-03.jpg" alt="Testing" class="carousel-image">
            </figure>
          </div>
          <button class="carousel-button prev" onclick="moveCarousel(-1, this)">❮</button>
          <button class="carousel-button next" onclick="moveCarousel(1, this)">❯</button>
          <div class="carousel-dots"></div>
        </div>
      </div>
    </article>
  </section>

  <!-- Research Section -->
  <section id="research" class="project-section">
    <h2>Research</h2>

    <!-- 3D Printed Microfluidics -->
    <article class="project-entry">
      <div class="project-header" onclick="toggleProject(this)">
        <div class="header-content">
          <img src="/assets/images/projects/microfluidics/microfluidics-01.jpg" alt="Microfluidics Preview" class="project-thumbnail">
          <div>
            <h3>3D Printed Microfluidics</h3>
            <div class="project-meta">MIT Media Lab • 2013-2015</div>
          </div>
        </div>
        <span class="expand-button">+</span>
      </div>
      
      <div class="project-content">
        <p>Demonstrated new techniques for manufacturing microfluidic consumables using commercial 3D-printers. We achieved reactions in volumes as small as 490 nL with channel widths of 220 micrometers, while keeping per-unit microfluidic consumable costs between $0.61 and $5.71. This approach demonstrated how commodity digital fabrication tools could democratize production of microfluidic hardware. Read the full <a href="https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0143636">publication</a>.</p>
        
        <div class="carousel">
          <div class="carousel-container">
            <figure class="carousel-slide">
              <img src="/assets/images/projects/microfluidics/microfluidics-01.jpg" alt="Microfluidic Device" class="carousel-image" />
            </figure>
            <figure class="carousel-slide">
              <img src="/assets/images/projects/microfluidics/microfluidics-02.jpg" alt="Printing Process" class="carousel-image" />
            </figure>
            <figure class="carousel-slide">
              <img src="/assets/images/projects/microfluidics/microfluidics-03.jpg" alt="Testing Setup" class="carousel-image" />
            </figure>
            <figure class="carousel-slide">
              <img src="/assets/images/projects/microfluidics/microfluidics-04.jpg" alt="Device Detail" class="carousel-image" />
            </figure>
          </div>
          <button class="carousel-button prev" onclick="moveCarousel(-1, this)">❮</button>
          <button class="carousel-button next" onclick="moveCarousel(1, this)">❯</button>
          <div class="carousel-dots"></div>
        </div>
      </div>
    </article>

    <!-- 3D Printed Multimaterial Valve -->
    <article class="project-entry">
      <div class="project-header" onclick="toggleProject(this)">
        <div class="header-content">
          <img src="/assets/images/projects/multimaterial-valve/valve-01.jpg" alt="Multimaterial Valve Preview" class="project-thumbnail">
          <div>
            <h3>3D Printed Multimaterial Valve</h3>
            <div class="project-meta">MIT Media Lab • 2013-2015</div>
          </div>
        </div>
        <span class="expand-button">+</span>
      </div>
      
      <div class="project-content">
        <p>Led by Steven Keating, this project pioneered the development of multimaterial 3D printed microfluidic valves that combine rigid and flexible materials in a single print. We demonstrated a novel valve design where a flexible membrane, sandwiched between stiff flow and control channels, could be deformed under pressure to regulate fluid flow. This work enabled programmable fluid routing within 3D printed microfluidic devices, advancing beyond single-material limitations of previous approaches. The research was conducted in collaboration with Isabella Gariboldi, Will Patrick, Prof. Neri Oxman, and David Kong of MIT Lincoln Laboratory. Read the full <a href="https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0160624">publication</a>.</p>
        
        <div class="carousel">
          <div class="carousel-container">
            <figure class="carousel-slide">
              <img src="/assets/images/projects/multimaterial-valve/valve-01.jpg" alt="Multimaterial Valve Overview" class="carousel-image" />
            </figure>
            <figure class="carousel-slide">
              <img src="/assets/images/projects/multimaterial-valve/valve-02.jpg" alt="Valve Construction" class="carousel-image" />
            </figure>
            <figure class="carousel-slide">
              <img src="/assets/images/projects/multimaterial-valve/valve-03.jpg" alt="Valve Testing" class="carousel-image" />
            </figure>
          </div>
          <button class="carousel-button prev" onclick="moveCarousel(-1, this)">❮</button>
          <button class="carousel-button next" onclick="moveCarousel(1, this)">❯</button>
          <div class="carousel-dots"></div>
        </div>
      </div>
    </article>
  </section>

  <!-- Structural Section -->
  <section id="structural" class="project-section">
    <h2>Structural</h2>

    <!-- Santa Cruz Mountains Cabin -->
    <article class="project-entry">
      <div class="project-header" onclick="toggleProject(this)">
        <div class="header-content">
          <img src="/assets/images/projects/communal-structure/communal-structure-01.jpg" alt="Santa Cruz Mountains Cabin Preview" class="project-thumbnail">
          <div>
            <h3>Santa Cruz Mountains Cabin</h3>
            <div class="project-meta">Santa Cruz Mountains • 2022-2025</div>
          </div>
        </div>
        <span class="expand-button">+</span>
      </div>
      
      <div class="project-content">
        <p>Together with eight friends, I co-own a 30-acre property nestled in the redwoods. We're building a 1,200-square-foot communal structure that will serve as a shared kitchen and gathering space. The project embodies our vision of creating a place where we can spend quality time together, work on creative projects, and enjoy the spectacular natural setting. Since 2022, we've been designing, engineering, and constructing the building ourselves, recently completing the exterior work. This space represents our commitment to collaborative building and maintaining a connection to California's remarkable landscape.</p>
        
        <div class="carousel">
          <div class="carousel-container">
            <figure class="carousel-slide">
              <img src="/assets/images/projects/communal-structure/communal-structure-01.jpg" alt="Structure Overview" class="carousel-image" />
            </figure>
            <figure class="carousel-slide">
              <img src="/assets/images/projects/communal-structure/communal-structure-02.jpg" alt="Construction Process" class="carousel-image" />
            </figure>
            <figure class="carousel-slide">
              <img src="/assets/images/projects/communal-structure/communal-structure-03.jpg" alt="Site Location" class="carousel-image" />
            </figure>
            <figure class="carousel-slide">
              <img src="/assets/images/projects/communal-structure/communal-structure-04.jpg" alt="Building Progress" class="carousel-image" />
            </figure>
            <figure class="carousel-slide">
              <img src="/assets/images/projects/communal-structure/communal-structure-05.jpg" alt="Structural Details" class="carousel-image" />
            </figure>
            <figure class="carousel-slide">
              <img src="/assets/images/projects/communal-structure/communal-structure-06.jpg" alt="Interior Work" class="carousel-image" />
            </figure>
            <figure class="carousel-slide">
              <img src="/assets/images/projects/communal-structure/communal-structure-07.jpg" alt="Construction Team" class="carousel-image" />
            </figure>
            <figure class="carousel-slide">
              <img src="/assets/images/projects/communal-structure/communal-structure-08.jpg" alt="Site Context" class="carousel-image" />
            </figure>
          </div>
          <button class="carousel-button prev" onclick="moveCarousel(-1, this)">❮</button>
          <button class="carousel-button next" onclick="moveCarousel(1, this)">❯</button>
          <div class="carousel-dots"></div>
        </div>
      </div>
    </article>
  </section>

  <!-- Design Section -->
  <section id="design" class="project-section">
    <h2>Design</h2>

    <!-- Bad Hatter -->
    <article class="project-entry">
      <div class="project-header" onclick="toggleProject(this)">
        <div class="header-content">
          <img src="/assets/images/projects/bad-hatter/bad-hatter-01.jpg" alt="Bad Hatter Preview" class="project-thumbnail">
          <div>
            <h3>Bad Hatter</h3>
            <div class="project-meta">Burning Man • 2024</div>
          </div>
        </div>
        <span class="expand-button">+</span>
      </div>
      
      <div class="project-content">
        <p>The Bad Hatter is an interactive art installation created for Burning Man 2024 led by artists Winslow Porter and Neil Mendoza. The piece features a giant illuminated hat with over 3,000 LEDs, interactive shock sensors, and an integrated drum machine. When participants touch the electrified (and safe) brim of the hat, their reactions become part of a dynamic musical composition. I led the structural design and engineering of the installation, which needed to withstand harsh desert conditions while housing complex electronics, ventilation systems, and mechanical components. The project received an official Burning Man Art Honorarium and was installed on the playa in August 2024.</p>
        
        <div class="carousel">
          <div class="carousel-container">
            <figure class="carousel-slide">
              <img src="/assets/images/projects/bad-hatter/bad-hatter-01.jpg" alt="Bad Hatter Installation" class="carousel-image" />
            </figure>
            <figure class="carousel-slide">
              <img src="/assets/images/projects/bad-hatter/bad-hatter-02.jpg" alt="Bad Hatter Construction" class="carousel-image" />
            </figure>
          </div>
          <button class="carousel-button prev" onclick="moveCarousel(-1, this)">❮</button>
          <button class="carousel-button next" onclick="moveCarousel(1, this)">❯</button>
          <div class="carousel-dots"></div>
        </div>
      </div>
    </article>

    <!-- Farma -->
    <article class="project-entry">
      <div class="project-header" onclick="toggleProject(this)">
        <div class="header-content">
          <img src="/assets/images/projects/farma/farma-01.jpg" alt="Farma Preview" class="project-thumbnail">
          <div>
            <h3>Farma</h3>
            <div class="project-meta">Autodesk Artist in Residence • 2015</div>
          </div>
        </div>
        <span class="expand-button">+</span>
      </div>
      
      <div class="project-content">
        <p>Farma is a speculative design project exploring the future of distributed pharmaceutical production, created during my residency at the Autodesk Artist in Residence program. The piece features a home bioreactor that cultivates genetically modified Spirulina (a type of blue-green algae) to produce pharmaceutical compounds. The system automates the growing, monitoring, filtering, and drying processes needed to transform the Spirulina into consumable medication. Through this project, I aimed to provoke discussion about synthetic biology's role in our future, the democratization of drug production, and the implications of bringing engineered organisms into our homes.</p>
        
        <div class="carousel">
          <div class="carousel-container">
            <figure class="carousel-slide">
              <img src="/assets/images/projects/farma/farma-01.jpg" alt="Farma Device Overview" class="carousel-image">
            </figure>
            <figure class="carousel-slide">
              <img src="/assets/images/projects/farma/farma-02.jpg" alt="Farma Interface" class="carousel-image">
            </figure>
            <figure class="carousel-slide">
              <img src="/assets/images/projects/farma/farma-03.jpg" alt="Farma Components" class="carousel-image">
            </figure>
            <figure class="carousel-slide">
              <img src="/assets/images/projects/farma/farma-04.jpg" alt="Farma Process" class="carousel-image">
            </figure>
            <figure class="carousel-slide">
              <img src="/assets/images/projects/farma/farma-05.jpg" alt="Farma Detail" class="carousel-image">
            </figure>
            <figure class="carousel-slide">
              <img src="/assets/images/projects/farma/farma-06.jpg" alt="Farma Installation" class="carousel-image">
            </figure>
            <figure class="carousel-slide">
              <img src="/assets/images/projects/farma/farma-07.jpg" alt="Farma Context" class="carousel-image">
            </figure>
          </div>
          <button class="carousel-button prev" onclick="moveCarousel(-1, this)">❮</button>
          <button class="carousel-button next" onclick="moveCarousel(1, this)">❯</button>
          <div class="carousel-dots"></div>
        </div>
      </div>
    </article>

    <!-- Mushtari -->
    <article class="project-entry">
      <div class="project-header" onclick="toggleProject(this)">
        <div class="header-content">
          <img src="/assets/images/projects/mushtari/mushtari-01.jpg" alt="Mushtari Preview" class="project-thumbnail">
          <div>
            <h3>Mushtari</h3>
            <div class="project-meta">MIT Media Lab • 2013-2015</div>
          </div>
        </div>
        <span class="expand-button">+</span>
      </div>
      
      <div class="project-content">
        <p>A project exploring the intersection of wearable technology and synthetic biology, Mushtari features 58 meters of internal fluid channels designed to host living organisms. The wearable functions as a microbial factory, using synthetic biology to convert sunlight into useful products through a symbiotic relationship between photosynthetic microbes and compatible heterotrophs. Created using generative growth algorithms that mimic biological processes, the design was brought to life through innovative 3D printing techniques developed in collaboration with Stratasys. The project was directed by Neri Oxman and completed by the Mediated Matter Group at MIT, with Will Patrick as lead researcher.</p>
        
        <div class="carousel">
          <div class="carousel-container">
            <figure class="carousel-slide">
              <div class="video-wrapper">
                <iframe src="https://player.vimeo.com/video/131786000" 
                        width="100%" 
                        height="450" 
                        frameborder="0" 
                        allow="autoplay; fullscreen; picture-in-picture" 
                        allowfullscreen>
                </iframe>
              </div>
            </figure>
            <figure class="carousel-slide">
              <img src="/assets/images/projects/mushtari/mushtari-01.jpg" alt="Mushtari Full View" class="carousel-image" />
            </figure>
            <figure class="carousel-slide">
              <img src="/assets/images/projects/mushtari/mushtari-02.jpg" alt="Mushtari Detail" class="carousel-image" />
            </figure>
            <figure class="carousel-slide">
              <img src="/assets/images/projects/mushtari/mushtari-03.jpg" alt="Design Process" class="carousel-image" />
            </figure>
            <figure class="carousel-slide">
              <img src="/assets/images/projects/mushtari/mushtari-04.jpg" alt="Construction Detail" class="carousel-image" />
            </figure>
            <figure class="carousel-slide">
              <img src="/assets/images/projects/mushtari/mushtari-05.jpg" alt="Final Installation" class="carousel-image" />
            </figure>
          </div>
          <button class="carousel-button prev" onclick="moveCarousel(-1, this)">❮</button>
          <button class="carousel-button next" onclick="moveCarousel(1, this)">❯</button>
          <div class="carousel-dots"></div>
        </div>
      </div>
    </article>
  </section>
</div>

<script>
let carousels = new Map();

function initCarousel(carouselElement) {
  const slides = carouselElement.querySelectorAll('.carousel-slide');
  const dotsContainer = carouselElement.querySelector('.carousel-dots');
  const carouselId = `carousel-${Date.now()}-${Math.random()}`;
  
  carousels.set(carouselId, {
    currentSlide: 0,
    element: carouselElement,
    slides: slides
  });
  
  // Clear and create dots
  dotsContainer.innerHTML = '';
  slides.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.className = 'dot';
    dot.onclick = () => goToSlide(carouselId, i);
    dotsContainer.appendChild(dot);
  });
  
  carouselElement.dataset.carouselId = carouselId;
  updateDots(carouselId);
}

function moveCarousel(direction, button) {
  const carousel = button.closest('.carousel');
  const carouselId = carousel.dataset.carouselId;
  if (!carouselId || !carousels.has(carouselId)) return;
  
  const state = carousels.get(carouselId);
  state.currentSlide = (state.currentSlide + direction + state.slides.length) % state.slides.length;
  updateCarousel(carouselId);
}

function goToSlide(carouselId, slideIndex) {
  if (!carousels.has(carouselId)) return;
  const state = carousels.get(carouselId);
  state.currentSlide = slideIndex;
  updateCarousel(carouselId);
}

function updateCarousel(carouselId) {
  const state = carousels.get(carouselId);
  if (!state) return;
  
  const container = state.element.querySelector('.carousel-container');
  container.style.transform = `translateX(-${state.currentSlide * 100}%)`;
  updateDots(carouselId);
}

function updateDots(carouselId) {
  const state = carousels.get(carouselId);
  if (!state) return;
  
  const dots = state.element.querySelectorAll('.dot');
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === state.currentSlide);
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
    const carousel = content.querySelector('.carousel');
    if (carousel && !carousel.dataset.carouselId) {
      setTimeout(() => initCarousel(carousel), 0);
    }
  }
}

// Initialize all carousels in expanded projects on page load
document.addEventListener('DOMContentLoaded', function() {
  const activeProjects = document.querySelectorAll('.project-content.active');
  activeProjects.forEach(content => {
    const carousel = content.querySelector('.carousel');
    if (carousel && !carousel.dataset.carouselId) {
      initCarousel(carousel);
    }
  });
});

// Fix for sticky nav
document.addEventListener('DOMContentLoaded', function() {
  const nav = document.querySelector('.projects-nav-wrapper');
  const navTop = nav.offsetTop;
  
  // Mobile-only sticky behavior
  function handleMobileNav() {
    // Only apply sticky logic on mobile screens
    if (window.innerWidth <= 768) {
      if (window.scrollY >= navTop) {
        nav.classList.add('sticky-active');
      } else {
        nav.classList.remove('sticky-active');
      }
    } else {
      // On desktop, always remove sticky class
      nav.classList.remove('sticky-active');
    }
  }
  
  window.addEventListener('scroll', handleMobileNav);
  window.addEventListener('resize', handleMobileNav);
  
  // Initial check
  handleMobileNav();
});
</script>