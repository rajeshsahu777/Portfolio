/* ==========================================================================
   Typewriter Subtitles Engine
   ========================================================================== */
function initTypewriter() {
  const el = document.getElementById('typewriter-text');
  if (!el) return;

  const roles = [
    'AI/ML DEVELOPER',
    'EMBEDDED SYSTEMS ENGINEER',
    'SOFTWARE DEVELOPER',
    'PROBLEM SOLVER'
  ];

  let currentRoleIdx = 0;
  let currentCharIdx = 0;
  let isDeleting = false;
  let delay = 100;

  function type() {
    const fullText = roles[currentRoleIdx];
    
    if (isDeleting) {
      el.textContent = fullText.substring(0, currentCharIdx - 1);
      currentCharIdx--;
      delay = 50;
    } else {
      el.textContent = fullText.substring(0, currentCharIdx + 1);
      currentCharIdx++;
      delay = 120;
    }

    if (!isDeleting && currentCharIdx === fullText.length) {
      delay = 2000; // Hold full text
      isDeleting = true;
    } else if (isDeleting && currentCharIdx === 0) {
      isDeleting = false;
      currentRoleIdx = (currentRoleIdx + 1) % roles.length;
      delay = 500; // Delay before next text
    }

    setTimeout(type, delay);
  }

  type();
}

/* ==========================================================================
   Dynamic Dual-Engine Canvas (Default Neural Network vs 3D Perspective Grid)
   ========================================================================== */
function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particlesArray = [];
  
  const isMobile = window.innerWidth < 768;
  
  // Simulation Configuration Parameters
  const modelConfig = {
    theme: 'gaming', // Defaults to gaming synthwave theme as requested
    speed: 1.0,
    density: isMobile ? 25 : 60,
    distance: isMobile ? 90 : 130,
    mouseMode: 'repel'
  };

  let mouse = {
    x: null,
    y: null,
    radius: 150
  };

  // Vanishing point state (Gaming Synthwave grid)
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;
  let horizon = height * 0.52;
  
  let targetVanishingPointX = width / 2;
  let vanishingPointX = width / 2;
  let vanishingPointY = horizon;
  let gridOffset = 0;

  // Sync index.html skin toggles UI
  const themeRadios = document.querySelectorAll('input[name="theme-skin"]');
  themeRadios.forEach(radio => {
    // Set checked state matching configuration
    if (radio.value === modelConfig.theme) {
      radio.checked = true;
      if (modelConfig.theme === 'gaming') {
        document.body.classList.add('theme-gaming');
      } else {
        document.body.classList.remove('theme-gaming');
      }
    }

    radio.addEventListener('change', (e) => {
      modelConfig.theme = e.target.value;
      if (modelConfig.theme === 'gaming') {
        document.body.classList.add('theme-gaming');
        modelConfig.density = isMobile ? 25 : 60;
        modelConfig.distance = isMobile ? 90 : 130;
      } else {
        document.body.classList.remove('theme-gaming');
        modelConfig.density = isMobile ? 35 : 85;
        modelConfig.distance = isMobile ? 80 : 120;
      }
      
      // Update HUD Sliders UI values
      const densitySlider = document.getElementById('slider-density');
      const valDensity = document.getElementById('val-density');
      if (densitySlider && valDensity) {
        densitySlider.value = modelConfig.density;
        valDensity.textContent = modelConfig.density;
      }
      
      const distanceSlider = document.getElementById('slider-distance');
      const valDistance = document.getElementById('val-distance');
      if (distanceSlider && valDistance) {
        distanceSlider.value = modelConfig.distance;
        valDistance.textContent = modelConfig.distance + 'px';
      }

      init();
    });
  });

  // Slider bindings
  const speedSlider = document.getElementById('slider-speed');
  const valSpeed = document.getElementById('val-speed');
  if (speedSlider && valSpeed) {
    speedSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value) / 10;
      modelConfig.speed = val;
      valSpeed.textContent = val.toFixed(1) + 'x';
    });
  }

  const densitySlider = document.getElementById('slider-density');
  const valDensity = document.getElementById('val-density');
  if (densitySlider && valDensity) {
    densitySlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value);
      modelConfig.density = val;
      valDensity.textContent = val;
      adjustParticlesCount();
    });
  }

  const distanceSlider = document.getElementById('slider-distance');
  const valDistance = document.getElementById('val-distance');
  if (distanceSlider && valDistance) {
    distanceSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value);
      modelConfig.distance = val;
      valDistance.textContent = val + 'px';
    });
  }

  const mouseRadios = document.querySelectorAll('input[name="mouse-mode"]');
  mouseRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      modelConfig.mouseMode = e.target.value;
    });
  });

  // Cursor FX settings & Interactive Trail elements
  const cursorFxCheckbox = document.getElementById('checkbox-cursor-fx');
  const trailPointer = document.getElementById('trail-pointer');
  let cursorFxEnabled = false;

  if (cursorFxCheckbox && trailPointer) {
    cursorFxCheckbox.addEventListener('change', (e) => {
      cursorFxEnabled = e.target.checked;
      if (cursorFxEnabled) {
        trailPointer.classList.add('active');
      } else {
        trailPointer.classList.remove('active');
        trailPointer.style.left = '-100px';
        trailPointer.style.top = '-100px';
      }
    });
  }

  // Smooth pointer rendering variables
  let trailX = 0, trailY = 0;
  let mouseX = -100, mouseY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Set model canvas interact coordinates
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    
    // Gaming background perspective shift parallax
    targetVanishingPointX = (width / 2) + (e.clientX - width / 2) * 0.12;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
    targetVanishingPointX = width / 2;
  });

  // Sizing adjust routines
  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    horizon = height * 0.52;
    vanishingPointY = horizon;
  }
  resizeCanvas();

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      resizeCanvas();
      init();
    }, 100);
  });

  // BLUEPRINT 1: Default Neural bouncing node
  class DefaultNode {
    constructor() {
      this.size = (Math.random() * 2) + 1;
      this.x = (Math.random() * (width - this.size * 2) + this.size * 2);
      this.y = (Math.random() * (height - this.size * 2) + this.size * 2);
      this.directionX = (Math.random() * 0.4) - 0.2;
      this.directionY = (Math.random() * 0.4) - 0.2;
      this.color = Math.random() > 0.5 ? 'rgba(6, 182, 212, 0.45)' : 'rgba(16, 185, 129, 0.45)'; // Cyan or Emerald
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
      ctx.fillStyle = this.color;
      ctx.fill();
    }

    update() {
      if (this.x > width || this.x < 0) {
        this.directionX = -this.directionX;
      }
      if (this.y > height || this.y < 0) {
        this.directionY = -this.directionY;
      }

      this.x += this.directionX * modelConfig.speed;
      this.y += this.directionY * modelConfig.speed;

      if (mouse.x !== null && modelConfig.mouseMode !== 'none') {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
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

  // BLUEPRINT 2: Gaming Cyber Star
  class CyberStar {
    constructor() {
      this.reset();
      this.y = Math.random() * horizon;
    }

    reset() {
      this.x = Math.random() * width;
      this.y = horizon;
      this.size = Math.random() * 2.2 + 0.6;
      this.speedY = -(Math.random() * 0.2 + 0.1); // float upwards
      this.speedX = (Math.random() * 0.4 - 0.2);
      this.color = Math.random() > 0.5 ? 'rgba(168, 85, 247, 0.55)' : 'rgba(244, 63, 94, 0.55)'; // Neon Purple or Neon Rose
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
      ctx.fillStyle = this.color;
      ctx.fill();
    }

    update() {
      this.x += this.speedX * modelConfig.speed;
      this.y += this.speedY * modelConfig.speed;

      if (this.y < 0 || this.x < 0 || this.x > width) {
        this.reset();
      }

      // Mouse interactive push/pull vector mechanics
      if (mouse.x !== null && modelConfig.mouseMode !== 'none' && this.y < horizon) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          const pullSpeed = 2.0 * force * modelConfig.speed;
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

  // Populate active particle array
  function init() {
    particlesArray = [];
    for (let i = 0; i < modelConfig.density; i++) {
      if (modelConfig.theme === 'gaming') {
        particlesArray.push(new CyberStar());
      } else {
        particlesArray.push(new DefaultNode());
      }
    }
  }

  // Adjust particle count dynamically
  function adjustParticlesCount() {
    const currentCount = particlesArray.length;
    const targetCount = modelConfig.density;
    
    if (currentCount < targetCount) {
      const diff = targetCount - currentCount;
      for (let i = 0; i < diff; i++) {
        if (modelConfig.theme === 'gaming') {
          particlesArray.push(new CyberStar());
        } else {
          particlesArray.push(new DefaultNode());
        }
      }
    } else if (currentCount > targetCount) {
      particlesArray = particlesArray.slice(0, targetCount);
    }
  }

  // Draw linkages
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
          
          if (modelConfig.theme === 'gaming') {
            ctx.strokeStyle = `rgba(168, 85, 247, ${opacityValue * 0.22})`; // Purple
            ctx.lineWidth = 0.8;
          } else {
            ctx.strokeStyle = `rgba(6, 182, 212, ${opacityValue * 0.22})`; // Cyan
            ctx.lineWidth = 1;
          }
          
          ctx.beginPath();
          ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
          ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
          ctx.stroke();
        }
      }
    }
  }

  // Perspective 3D Grid Drawing (Gaming Mode Only)
  function drawPerspectiveGrid() {
    gridOffset += 1.5 * modelConfig.speed;
    if (gridOffset >= 50) {
      gridOffset = 0;
    }

    const numHorizontalGrids = 16;
    for (let i = 0; i <= numHorizontalGrids; i++) {
      let progress = (i + gridOffset / 50) / numHorizontalGrids;
      let y = horizon + (height - horizon) * Math.pow(progress, 3);
      let opacity = Math.pow(progress, 1.8) * 0.28;
      
      ctx.strokeStyle = `rgba(168, 85, 247, ${opacity})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    const numVerticalGrids = 30;
    for (let i = 0; i <= numVerticalGrids; i++) {
      let xOnBottom = (width / numVerticalGrids) * i;
      let distanceFromCenter = Math.abs(xOnBottom - width / 2) / (width / 2);
      let opacity = (1 - distanceFromCenter * 0.55) * 0.16;

      ctx.strokeStyle = `rgba(244, 63, 94, ${opacity})`; // Rose
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(vanishingPointX, vanishingPointY);
      ctx.lineTo(xOnBottom, height);
      ctx.stroke();
    }

    let horizonGlow = ctx.createLinearGradient(0, horizon - 4, 0, horizon + 2);
    horizonGlow.addColorStop(0, 'rgba(244, 63, 94, 0)');
    horizonGlow.addColorStop(0.5, 'rgba(244, 63, 94, 0.7)');
    horizonGlow.addColorStop(1, 'rgba(244, 63, 94, 0)');
    ctx.fillStyle = horizonGlow;
    ctx.fillRect(0, horizon - 4, width, 6);
  }

  // Diagnostics parameters
  let lastTime = performance.now();
  let frameCount = 0;
  let fps = 60;
  
  const diagFps = document.getElementById('diag-fps');
  const diagNodes = document.getElementById('diag-nodes');
  const diagLinks = document.getElementById('diag-links');

  // Animation cycle loop
  function animate() {
    if (modelConfig.theme === 'gaming') {
      let bgGrad = ctx.createRadialGradient(width / 2, horizon, 10, width / 2, horizon, width * 0.9);
      bgGrad.addColorStop(0, '#100624');
      bgGrad.addColorStop(0.4, '#040308');
      bgGrad.addColorStop(1, '#020204');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      vanishingPointX += (targetVanishingPointX - vanishingPointX) * 0.06;
      drawPerspectiveGrid();
    } else {
      ctx.fillStyle = '#09090b';
      ctx.fillRect(0, 0, width, height);
    }

    // Render active particles
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
    }
    connect();

    // Custom Neon Cursor Trail lerping calculation
    if (cursorFxEnabled && trailPointer) {
      // Lerping formula to make the trail lag look incredibly organic and fluid
      trailX += (mouseX - trailX) * 0.15;
      trailY += (mouseY - trailY) * 0.15;
      trailPointer.style.left = trailX + 'px';
      trailPointer.style.top = trailY + 'px';
    }

    // FPS diagnostics updates
    const now = performance.now();
    frameCount++;
    if (now > lastTime + 1000) {
      fps = Math.round((frameCount * 1000) / (now - lastTime));
      frameCount = 0;
      lastTime = now;
      
      if (diagFps) diagFps.textContent = fps;
      if (diagNodes) diagNodes.textContent = particlesArray.length;
      if (diagLinks) diagLinks.textContent = activeLinksCount;
    }

    requestAnimationFrame(animate);
  }

  // Open settings panel console toggle handlers
  const consoleEl = document.getElementById('model-console');
  const toggleEl = document.getElementById('console-toggle');
  
  if (toggleEl && consoleEl) {
    toggleEl.addEventListener('click', () => {
      const isExpanded = consoleEl.classList.contains('expanded');
      consoleEl.classList.toggle('expanded');
      toggleEl.setAttribute('aria-expanded', !isExpanded);
    });
  }

  init();
  animate();
}

/* ==========================================================================
   Responsive Navigation Menu
   ========================================================================== */
function initNavigation() {
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('nav-menu');
  const header = document.querySelector('.header');

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.contains('open');
      menu.classList.toggle('open');
      toggle.classList.toggle('open');
      toggle.setAttribute('aria-expanded', !isOpen);
    });

    // Close menu when a link is clicked
    menu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Header scroll effects
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* ==========================================================================
   Scroll Spy & Active Section Indicator
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function spy() {
    let currentSectionId = '';
    const scrollPos = window.scrollY + 120; // offset

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
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

  window.addEventListener('scroll', spy);
  spy();
}

/* ==========================================================================
   Scroll-Reveal Intersection Observer (Stat progress animations & reveals)
   ========================================================================== */
function initScrollReveal() {
  const revealOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        
        // If entry is experience quest item, mark node dot as active
        if (entry.target.classList.contains('timeline-item')) {
          entry.target.classList.add('active-node');
        }
        
        observer.unobserve(entry.target);
      }
    });
  }, revealOptions);

  document.querySelectorAll('.scroll-reveal').forEach(el => {
    revealObserver.observe(el);
  });

  // Stat progress/XP bars animation fill-trigger
  const statOptions = {
    threshold: 0.15
  };

  const statObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fillEl = entry.target;
        // Fetch target-width custom variable value set in HTML inline styles
        const targetWidth = fillEl.style.getPropertyValue('--target-width') || '0%';
        fillEl.style.width = targetWidth;
        observer.unobserve(fillEl);
      }
    });
  }, statOptions);

  document.querySelectorAll('.stat-bar-fill').forEach(el => {
    statObserver.observe(el);
  });
}

/* ==========================================================================
   Web3Forms Comms Form Handlers & Alerts Notifications
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

    // Run inputs check
    const isNameValid = validateField(
      document.getElementById('form-name'),
      'name-error',
      value => value.trim().length > 0
    );

    const isEmailValid = validateField(
      document.getElementById('form-email'),
      'email-error',
      value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
    );

    const isSubjectValid = validateField(
      document.getElementById('form-subject'),
      'subject-error',
      value => value.trim().length > 0
    );

    const isMessageValid = validateField(
      document.getElementById('form-message'),
      'message-error',
      value => value.trim().length > 0
    );

    if (!isNameValid || !isEmailValid || !isSubjectValid || !isMessageValid) {
      return; // Stop submission
    }

    // Prepare transmission loading state UI
    submitBtn.disabled = true;
    submitBtn.querySelector('span').textContent = '[ TRANSMITTING... ]';
    successAlert.style.display = 'none';
    errorAlert.style.display = 'none';

    try {
      const formData = new FormData(form);
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok && data.success) {
        successAlert.style.display = 'flex';
        form.reset();
      } else {
        errorDesc.textContent = data.message || 'System transmission routing error. Try again.';
        errorAlert.style.display = 'flex';
      }
    } catch (err) {
      errorDesc.textContent = 'Transmission connection failure. Ensure your edge networking logs are online.';
      errorAlert.style.display = 'flex';
    } finally {
      submitBtn.disabled = false;
      submitBtn.querySelector('span').textContent = '[ TRANSMIT_MESSAGE ]';
    }
  });

  // Clear live validation states on focus input
  const formInputs = form.querySelectorAll('.form-input');
  formInputs.forEach(input => {
    input.addEventListener('input', () => {
      input.classList.remove('invalid');
      const errorMsg = input.parentNode.querySelector('.error-msg');
      if (errorMsg) {
        errorMsg.style.display = 'none';
      }
    });
  });
}

function bootstrap() {
  initTypewriter();
  initParticles();
  initNavigation();
  initScrollSpy();
  initScrollReveal();
  initContactForm();
}

if (document.readyState !== 'loading') {
  bootstrap();
} else {
  document.addEventListener('DOMContentLoaded', bootstrap);
}
