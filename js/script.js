/**
 * Rajesh Sahu Portfolio - Interactive Javascript
 * Hand-coded, performance-optimized, and accessible.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Check user preference for reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  initNavigation();
  initTypewriter();
  initContactForm();
  
  if (!prefersReducedMotion) {
    initParticles();
    initScrollReveal();
  } else {
    // If reduced motion is preferred, immediately show all elements without animation
    document.querySelectorAll('.scroll-reveal').forEach(el => el.classList.add('active'));
  }
});

/* ==========================================================================
   Navigation & Menu Handlers
   ========================================================================== */
function initNavigation() {
  const header = document.querySelector('.header');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  // Sticky navbar logic
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    updateActiveNavLink();
  });

  // Mobile navigation hamburger toggle
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.contains('open');
      navMenu.classList.toggle('open');
      navToggle.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', !isOpen);
    });

    // Close menu when clicking links
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Scrollspy: update active states based on viewport sections
  function updateActiveNavLink() {
    let currentSectionId = '';
    const scrollPosition = window.scrollY + window.innerHeight / 3;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  }
  
  // Trigger once on page load to set initial state
  updateActiveNavLink();
}

/* ==========================================================================
   Typewriter Effect
   ========================================================================== */
function initTypewriter() {
  const words = [
    'AI/ML Intern & Developer',
    'Embedded Systems Specialist',
    'Hardware Integration Engineer',
    'Full-Stack Software Builder'
  ];
  const textEl = document.getElementById('typewriter-text');
  if (!textEl) return;

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 80;

  function type() {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
      // Deleting character
      textEl.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 40; // delete faster
    } else {
      // Adding character
      textEl.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 80;
    }

    // Checking word completeness
    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      typeSpeed = 1500; // Pause at end of word
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typeSpeed = 500; // Pause before starting new word
    }

    setTimeout(type, typeSpeed);
  }

  // Kickstart typewriter
  setTimeout(type, 1000);
}



/* ==========================================================================
   HTML5 Particle Network Canvas (Neural Graph Simulation Engine)
   ========================================================================== */
function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particlesArray = [];
  
  // Throttle performance variables based on screen resolution
  const isMobile = window.innerWidth < 768;
  
  // Dynamic Simulation Parameters State
  const modelConfig = {
    speed: 1.0,
    density: isMobile ? 35 : 85,
    distance: isMobile ? 80 : 120,
    mouseMode: 'repel'
  };

  let mouse = {
    x: null,
    y: null,
    radius: 150
  };

  // Wire console panel handlers
  const consoleEl = document.getElementById('model-console');
  const toggleEl = document.getElementById('console-toggle');
  
  if (toggleEl && consoleEl) {
    toggleEl.addEventListener('click', () => {
      const isExpanded = consoleEl.classList.contains('expanded');
      consoleEl.classList.toggle('expanded');
      toggleEl.setAttribute('aria-expanded', !isExpanded);
    });
  }

  // Speed slider binding
  const speedSlider = document.getElementById('slider-speed');
  const valSpeed = document.getElementById('val-speed');
  if (speedSlider && valSpeed) {
    speedSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value) / 10;
      modelConfig.speed = val;
      valSpeed.textContent = val.toFixed(1) + 'x';
    });
  }

  // Density slider binding
  const densitySlider = document.getElementById('slider-density');
  const valDensity = document.getElementById('val-density');
  if (densitySlider && valDensity) {
    densitySlider.value = modelConfig.density;
    valDensity.textContent = modelConfig.density;
    densitySlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value);
      modelConfig.density = val;
      valDensity.textContent = val;
      adjustParticlesCount();
    });
  }

  // Distance connection slider binding
  const distanceSlider = document.getElementById('slider-distance');
  const valDistance = document.getElementById('val-distance');
  if (distanceSlider && valDistance) {
    distanceSlider.value = modelConfig.distance;
    valDistance.textContent = modelConfig.distance + 'px';
    distanceSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value);
      modelConfig.distance = val;
      valDistance.textContent = val + 'px';
    });
  }

  // Mouse vector interaction selectors
  const mouseRadios = document.querySelectorAll('input[name="mouse-mode"]');
  mouseRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      modelConfig.mouseMode = e.target.value;
    });
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Set sizing
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  
  // Debounced window resize to prevent layout recalculation thrashing
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      resizeCanvas();
      init();
    }, 100);
  });

  // Particle blueprint
  class Particle {
    constructor(x, y, directionX, directionY, size, color) {
      this.x = x;
      this.y = y;
      this.directionX = directionX;
      this.directionY = directionY;
      this.size = size;
      this.color = color;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
      ctx.fillStyle = this.color;
      ctx.fill();
    }

    update() {
      // Wall collisions
      if (this.x > canvas.width || this.x < 0) {
        this.directionX = -this.directionX;
      }
      if (this.y > canvas.height || this.y < 0) {
        this.directionY = -this.directionY;
      }

      // Physics coordinate update with speed settings
      this.x += this.directionX * modelConfig.speed;
      this.y += this.directionY * modelConfig.speed;

      // Mouse interactive push/pull vector trigonometry
      if (mouse.x !== null && modelConfig.mouseMode !== 'none') {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius; // stronger closer to center
          const pullSpeed = 2.5 * force * modelConfig.speed;
          
          const angle = Math.atan2(dy, dx);
          if (modelConfig.mouseMode === 'repel') {
            this.x -= Math.cos(angle) * pullSpeed;
            this.y -= Math.sin(angle) * pullSpeed;
          } else if (modelConfig.mouseMode === 'attract') {
            this.x += Math.cos(angle) * pullSpeed;
            this.y += Math.sin(angle) * pullSpeed;
          }
        }
      }
      this.draw();
    }
  }

  // Populate particles
  function init() {
    particlesArray = [];
    for (let i = 0; i < modelConfig.density; i++) {
      let size = (Math.random() * 2) + 1;
      let x = (Math.random() * (canvas.width - size * 2) + size * 2);
      let y = (Math.random() * (canvas.height - size * 2) + size * 2);
      let directionX = (Math.random() * 0.4) - 0.2;
      let directionY = (Math.random() * 0.4) - 0.2;
      
      let color = i % 2 === 0 ? 'rgba(168, 85, 247, 0.45)' : 'rgba(244, 63, 94, 0.45)';
      particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
  }

  // Adjust particle array dynamically
  function adjustParticlesCount() {
    const currentCount = particlesArray.length;
    const targetCount = modelConfig.density;
    
    if (currentCount < targetCount) {
      const diff = targetCount - currentCount;
      for (let i = 0; i < diff; i++) {
        let size = (Math.random() * 2) + 1;
        let x = (Math.random() * (canvas.width - size * 2) + size * 2);
        let y = (Math.random() * (canvas.height - size * 2) + size * 2);
        let directionX = (Math.random() * 0.4) - 0.2;
        let directionY = (Math.random() * 0.4) - 0.2;
        let color = i % 2 === 0 ? 'rgba(168, 85, 247, 0.45)' : 'rgba(244, 63, 94, 0.45)';
        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
      }
    } else if (currentCount > targetCount) {
      particlesArray = particlesArray.slice(0, targetCount);
    }
  }

  // Link drawing & counting
  let activeLinksCount = 0;
  function connect() {
    activeLinksCount = 0;
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
      for (let b = a; b < particlesArray.length; b++) {
        let dx = particlesArray[a].x - particlesArray[b].x;
        let dy = particlesArray[a].y - particlesArray[b].y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < modelConfig.distance) {
          activeLinksCount++;
          opacityValue = 1 - (distance / modelConfig.distance);
          ctx.strokeStyle = `rgba(39, 39, 42, ${opacityValue * 0.25})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
          ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
          ctx.stroke();
        }
      }
    }
  }

  // Telemetry loop diagnostic indicators
  let lastTime = performance.now();
  let frameCount = 0;
  let fps = 60;
  
  const diagFps = document.getElementById('diag-fps');
  const diagNodes = document.getElementById('diag-nodes');
  const diagLinks = document.getElementById('diag-links');

  // Animation cycle loop
  function animate() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    
    // FPS Calculation diagnostics
    const now = performance.now();
    frameCount++;
    if (now > lastTime + 1000) {
      fps = Math.round((frameCount * 1000) / (now - lastTime));
      frameCount = 0;
      lastTime = now;
      
      // Render to console DOM elements to avoid layout churn
      if (diagFps) diagFps.textContent = fps;
      if (diagNodes) diagNodes.textContent = particlesArray.length;
      if (diagLinks) diagLinks.textContent = activeLinksCount;
    }

    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
    }
    connect();
    requestAnimationFrame(animate);
  }

  init();
  animate();
}

/* ==========================================================================
   Scroll-Reveal Intersection Observer
   ========================================================================== */
function initScrollReveal() {
  const options = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, options);

  document.querySelectorAll('.scroll-reveal').forEach(el => {
    observer.observe(el);
  });
}

/* ==========================================================================
   Contact Form Validation & Async Web3Forms Submission
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('form-submit-btn');
  const successAlert = document.getElementById('form-success-alert');
  const errorAlert = document.getElementById('form-error-alert');
  const errorDesc = document.getElementById('error-alert-desc');

  if (!form) return;

  // Validation rules helper
  function validateField(inputEl, errorElId, validationFn) {
    const isValid = validationFn(inputEl.value);
    if (!isValid) {
      inputEl.classList.add('invalid');
      document.getElementById(errorElId).style.display = 'block';
      return false;
    } else {
      inputEl.classList.remove('invalid');
      document.getElementById(errorElId).style.display = 'none';
      return true;
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Reset warnings
    successAlert.style.display = 'none';
    errorAlert.style.display = 'none';

    // Get input elements
    const nameInput = document.getElementById('form-name');
    const emailInput = document.getElementById('form-email');
    const subjectInput = document.getElementById('form-subject');
    const messageInput = document.getElementById('form-message');

    // Email validation regex check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const isNameValid = validateField(nameInput, 'name-error', val => val.trim().length > 0);
    const isEmailValid = validateField(emailInput, 'email-error', val => emailRegex.test(val.trim()));
    const isSubjectValid = validateField(subjectInput, 'subject-error', val => val.trim().length > 0);
    const isMessageValid = validateField(messageInput, 'message-error', val => val.trim().length > 0);

    const isFormValid = isNameValid && isEmailValid && isSubjectValid && isMessageValid;

    if (!isFormValid) {
      // Focus on first invalid field
      const firstInvalid = form.querySelector('.invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // Disable button & show sending state
    submitBtn.disabled = true;
    const btnSpan = submitBtn.querySelector('span');
    const originalText = btnSpan.textContent;
    btnSpan.textContent = 'Sending Message...';

    // Prepare JSON request
    const formData = new FormData(form);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: json
      });

      const result = await response.json();

      if (response.status === 200) {
        successAlert.style.display = 'flex';
        form.reset();
      } else {
        errorAlert.style.display = 'flex';
        errorDesc.textContent = result.message || 'An error occurred during submission.';
      }
    } catch (error) {
      errorAlert.style.display = 'flex';
      errorDesc.textContent = 'Network error. Please verify your connection and try again.';
    } finally {
      submitBtn.disabled = false;
      btnSpan.textContent = originalText;
    }
  });

  // Client-side quick feedback listener (removes warnings when user types)
  form.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('input', () => {
      if (input.value.trim().length > 0) {
        input.classList.remove('invalid');
        const errorEl = input.nextElementSibling;
        if (errorEl && errorEl.classList.contains('error-msg')) {
          errorEl.style.display = 'none';
        }
      }
    });
  });
}
