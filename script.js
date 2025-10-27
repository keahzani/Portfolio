// ===== LOADING SCREEN =====
window.addEventListener('load', () => {
  const loadingScreen = document.getElementById('loading-screen');
  setTimeout(() => {
    loadingScreen.classList.add('hidden');
    setTimeout(() => {
      loadingScreen.style.display = 'none';
    }, 500);
  }, 1500);
});

// ===== MOBILE NAVIGATION =====
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navItems = document.querySelectorAll('.nav-link');

if (hamburger) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.classList.toggle('nav-open');
  });

  // Close menu when clicking on nav items
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.classList.remove('nav-open');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.classList.remove('nav-open');
    }
  });
}

// ===== NAVBAR SCROLL EFFECT =====
const header = document.querySelector('.header');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
  if (window.scrollY > 100) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll('section[id]');

function highlightNav() {
  const scrollY = window.pageYOffset;

  sections.forEach(section => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - 100;
    const sectionId = section.getAttribute('id');
    const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      navItems.forEach(item => item.classList.remove('active'));
      if (navLink) navLink.classList.add('active');
    }
  });
}

window.addEventListener('scroll', highlightNav);

// ===== SMOOTH SCROLLING =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const headerHeight = header.offsetHeight;
      const targetPosition = targetElement.offsetTop - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ===== TYPING EFFECT =====
const typingText = document.querySelector('.typing-text');
if (typingText) {
  const roles = [
    'Technology Enthusiast',
    'Business Computing Graduate',
    'AI Developer',
    'Cybersecurity Specialist',
    'Web Developer',
    'Problem Solver'
  ];
  
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 150;

  // Set initial text
  typingText.textContent = roles[0];

  function type() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
      typingText.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 75;
    } else {
      typingText.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 150;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      typingSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 500;
    }

    setTimeout(type, typingSpeed);
  }

  setTimeout(type, 1000);
}

// ===== SCROLL REVEAL ANIMATION =====
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      
      // Trigger skill bar animations
      if (entry.target.classList.contains('skills-container')) {
        animateSkillBars();
      }
    }
  });
}, observerOptions);

// Observe all elements with scroll-reveal class
document.querySelectorAll('.scroll-reveal').forEach(el => {
  observer.observe(el);
});

// Observe sections for animations
document.querySelectorAll('.about-section, .experience-section, .projects-section, .skills-section, .contact-section').forEach(section => {
  observer.observe(section);
});

// ===== SKILL BARS ANIMATION =====
function animateSkillBars() {
  const skillBars = document.querySelectorAll('.skill-progress');
  
  skillBars.forEach(bar => {
    const progress = bar.getAttribute('data-progress');
    setTimeout(() => {
      bar.style.width = progress + '%';
    }, 200);
  });
}

// ===== FORM VALIDATION & SUBMISSION =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  const formInputs = contactForm.querySelectorAll('input, textarea');
  const submitBtn = contactForm.querySelector('.btn-submit');
  const formMessage = document.getElementById('formMessage');

  // Real-time validation
  formInputs.forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => clearError(input));
  });

  function validateField(field) {
    const value = field.value.trim();
    const errorMessage = field.parentElement.querySelector('.error-message');
    let error = '';

    if (!value && field.hasAttribute('required')) {
      error = 'This field is required';
    } else if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        error = 'Please enter a valid email address';
      }
    }

    if (error) {
      field.classList.add('error');
      errorMessage.textContent = error;
    } else {
      field.classList.remove('error');
      errorMessage.textContent = '';
    }

    return !error;
  }

  function clearError(field) {
    if (field.value.trim()) {
      field.classList.remove('error');
      const errorMessage = field.parentElement.querySelector('.error-message');
      errorMessage.textContent = '';
    }
  }

  // Form submission
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate all fields
    let isValid = true;
    formInputs.forEach(input => {
      if (!validateField(input)) {
        isValid = false;
      }
    });

    if (!isValid) {
      showFormMessage('Please correct the errors above.', 'error');
      return;
    }

    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    // Simulate form submission (replace with actual submission logic)
    try {
      await simulateFormSubmission();

      // Success
      showFormMessage('✅ Thank you! Your message has been sent successfully. I\'ll get back to you soon!', 'success');
      contactForm.reset();
      
    } catch (error) {
      showFormMessage('❌ Sorry, there was an error sending your message. Please try again or email me directly.', 'error');
    } finally {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  });

  function showFormMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    formMessage.style.display = 'block';

    setTimeout(() => {
      formMessage.style.display = 'none';
    }, 6000);
  }

  function simulateFormSubmission() {
    return new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });
  }
}

// ===== BACK TO TOP BUTTON =====
const backToTopBtn = document.getElementById('backToTop');

if (backToTopBtn) {
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// ===== SCROLL INDICATOR =====
const scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
  scrollIndicator.addEventListener('click', () => {
    const aboutSection = document.querySelector('#about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  });

  // Hide scroll indicator after scrolling
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 100) {
      scrollIndicator.style.opacity = '0';
      scrollIndicator.style.pointerEvents = 'none';
    } else {
      scrollIndicator.style.opacity = '1';
      scrollIndicator.style.pointerEvents = 'auto';
    }
  });
}

// ===== ANIMATED COUNTERS =====
function animateCounter(element) {
  const target = parseInt(element.textContent);
  const duration = 2000;
  const increment = target / (duration / 16);
  let current = 0;

  const updateCounter = () => {
    if (current < target) {
      current += increment;
      element.textContent = Math.ceil(current) + (element.textContent.includes('+') ? '+' : '');
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = element.textContent;
    }
  };

  updateCounter();
}

// Observe stat numbers for counter animation
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const statNumbers = entry.target.querySelectorAll('.stat-number');
      statNumbers.forEach(stat => {
        if (!stat.classList.contains('animated')) {
          stat.classList.add('animated');
          animateCounter(stat);
        }
      });
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
  statObserver.observe(heroStats);
}

// ===== PROJECT CARDS HOVER EFFECT =====
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach(card => {
  card.addEventListener('mouseenter', function() {
    this.style.zIndex = '10';
  });
  
  card.addEventListener('mouseleave', function() {
    this.style.zIndex = '1';
  });
});

// ===== TIMELINE ANIMATION =====
const timelineObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateX(0)';
      }, index * 200);
      timelineObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.timeline-item').forEach(item => {
  timelineObserver.observe(item);
});

// ===== PARALLAX EFFECT FOR HERO =====
const heroSection = document.querySelector('.hero-section');
if (heroSection) {
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxSpeed = 0.5;
    
    if (scrolled < window.innerHeight) {
      heroSection.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
    }
  });
}

// ===== INTEREST CARDS STAGGER ANIMATION =====
const interestObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, index * 100);
      interestObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.interest-card').forEach(card => {
  interestObserver.observe(card);
});

// ===== COPY EMAIL ON CLICK =====
const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
emailLinks.forEach(link => {
  link.addEventListener('click', async (e) => {
    const email = link.textContent;
    try {
      await navigator.clipboard.writeText(email);
      
      // Show tooltip
      const tooltip = document.createElement('span');
      tooltip.className = 'copy-tooltip';
      tooltip.textContent = 'Email copied!';
      tooltip.style.cssText = `
        position: absolute;
        background: #10b981;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        font-size: 0.875rem;
        font-weight: 600;
        transform: translateY(-100%);
        margin-top: -10px;
        white-space: nowrap;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        animation: fadeIn 0.3s ease;
      `;
      
      link.parentElement.style.position = 'relative';
      link.parentElement.appendChild(tooltip);
      
      setTimeout(() => {
        tooltip.remove();
      }, 2000);
    } catch (err) {
      console.log('Failed to copy email');
    }
  });
});

// ===== PHONE NUMBER CLICK TO COPY =====
const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
phoneLinks.forEach(link => {
  link.addEventListener('click', async (e) => {
    const phone = link.textContent;
    try {
      await navigator.clipboard.writeText(phone);
      
      // Show tooltip
      const tooltip = document.createElement('span');
      tooltip.className = 'copy-tooltip';
      tooltip.textContent = 'Phone copied!';
      tooltip.style.cssText = `
        position: absolute;
        background: #10b981;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        font-size: 0.875rem;
        font-weight: 600;
        transform: translateY(-100%);
        margin-top: -10px;
        white-space: nowrap;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        animation: fadeIn 0.3s ease;
      `;
      
      link.parentElement.style.position = 'relative';
      link.parentElement.appendChild(tooltip);
      
      setTimeout(() => {
        tooltip.remove();
      }, 2000);
    } catch (err) {
      console.log('Failed to copy phone');
    }
  });
});

// ===== LAZY LOADING IMAGES =====
const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      if (img.dataset.src) {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      }
      imageObserver.unobserve(img);
    }
  });
});

document.querySelectorAll('img[data-src]').forEach(img => {
  imageObserver.observe(img);
});

// ===== PREVENT FORM RESUBMISSION =====
if (window.history.replaceState) {
  window.history.replaceState(null, null, window.location.href);
}

// ===== KEYBOARD NAVIGATION IMPROVEMENTS =====
document.addEventListener('keydown', (e) => {
  // Close mobile menu with Escape key
  if (e.key === 'Escape' && navLinks.classList.contains('active')) {
    hamburger.classList.remove('active');
    navLinks.classList.remove('active');
    document.body.classList.remove('nav-open');
  }
  
  // Scroll to top with Home key
  if (e.key === 'Home' && e.ctrlKey) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  // Scroll to bottom with End key
  if (e.key === 'End' && e.ctrlKey) {
    e.preventDefault();
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }
});

// ===== HANDLE EXTERNAL LINKS =====
document.querySelectorAll('a[target="_blank"]').forEach(link => {
  link.setAttribute('rel', 'noopener noreferrer');
});

// ===== PAGE VISIBILITY API =====
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    document.title = '👋 Come back! - Ronald Zani';
  } else {
    document.title = 'Ronald Zani | Technology Enthusiast & Developer';
  }
});

// ===== EASTER EGG - KONAMI CODE =====
let konamiCode = [];
const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
  konamiCode.push(e.key);
  konamiCode.splice(-konamiPattern.length - 1, konamiCode.length - konamiPattern.length);
  
  if (konamiCode.join('').includes(konamiPattern.join(''))) {
    activateEasterEgg();
    konamiCode = [];
  }
});

function activateEasterEgg() {
  // Create confetti effect
  const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#10b981'];
  
  for (let i = 0; i < 100; i++) {
    setTimeout(() => {
      const confetti = document.createElement('div');
      confetti.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        top: -10px;
        left: ${Math.random() * 100}vw;
        border-radius: 50%;
        z-index: 10000;
        pointer-events: none;
        animation: fall ${2 + Math.random() * 2}s linear;
      `;
      
      document.body.appendChild(confetti);
      
      setTimeout(() => confetti.remove(), 4000);
    }, i * 30);
  }
  
  // Add CSS animation if not exists
  if (!document.getElementById('confetti-animation')) {
    const style = document.createElement('style');
    style.id = 'confetti-animation';
    style.textContent = `
      @keyframes fall {
        to {
          transform: translateY(100vh) rotate(360deg);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Show message
  const message = document.createElement('div');
  message.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 2rem 3rem;
    border-radius: 1rem;
    font-size: 1.5rem;
    font-weight: 700;
    text-align: center;
    z-index: 10001;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
    animation: fadeIn 0.5s ease;
  `;
  message.innerHTML = `
    🎉 You found the secret! 🎉<br>
    <span style="font-size: 1rem; font-weight: 400; opacity: 0.9;">Thanks for exploring!</span>
  `;
  
  document.body.appendChild(message);
  
  setTimeout(() => {
    message.style.animation = 'fadeOut 0.5s ease';
    setTimeout(() => message.remove(), 500);
  }, 3000);
}

// ===== PERFORMANCE OPTIMIZATION =====
// Debounce scroll events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Apply debounce to scroll-heavy functions
const debouncedHighlightNav = debounce(highlightNav, 100);
window.removeEventListener('scroll', highlightNav);
window.addEventListener('scroll', debouncedHighlightNav);

// ===== PRELOAD CRITICAL RESOURCES =====
function preloadImage(url) {
  const img = new Image();
  img.src = url;
}

// Preload important images
const criticalImages = [
  'profile.jpg',
  'trading-signal.jpg',
  'flashcard-ai.jpg',
  'evoting-system.jpg'
];

criticalImages.forEach(preloadImage);

// ===== LOG INITIALIZATION =====
console.log('%c🚀 Ronald Zani Portfolio', 'color: #667eea; font-size: 20px; font-weight: bold;');
console.log('%cBuilt with ❤️ using HTML, CSS, and JavaScript', 'color: #764ba2; font-size: 12px;');
console.log('%cInterested in the code? Check out my GitHub: https://github.com/keahzani', 'color: #10b981; font-size: 12px;');

// ===== SERVICE WORKER REGISTRATION (Optional - for PWA) =====
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Uncomment when you have a service worker file
    // navigator.serviceWorker.register('/sw.js')
    //   .then(registration => console.log('SW registered:', registration))
    //   .catch(error => console.log('SW registration failed:', error));
  });
}

// ===== INITIALIZE ALL FEATURES ON DOM LOAD =====
document.addEventListener('DOMContentLoaded', () => {
  // Don't add scroll-reveal classes - show content immediately
  console.log('✅ Portfolio initialized successfully');
});