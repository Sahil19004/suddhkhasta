document.addEventListener('DOMContentLoaded', function() {
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  const preloader = document.querySelector('.preloader');
  if (preloader) {
    window.addEventListener('load', function() {
      setTimeout(function() {
        preloader.classList.add('fade-out');
        setTimeout(function() {
          preloader.style.display = 'none';
        }, 600);
      }, 1000);
    });
  }
  
  // ===== NAVBAR SCROLL EFFECT =====
// ===== NAVBAR =====
document.addEventListener('DOMContentLoaded', function() {
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
    
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    // Create overlay element
    const mobileOverlay = document.createElement('div');
    mobileOverlay.className = 'mobile-overlay';
    document.body.appendChild(mobileOverlay);
    
    if (hamburger && navLinks) {
      // Toggle menu function
      function toggleMenu() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        mobileOverlay.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', 
          hamburger.classList.contains('active') ? 'true' : 'false');
        
        // Toggle body scroll
        if (navLinks.classList.contains('active')) {
          document.body.style.overflow = 'hidden';
        } else {
          document.body.style.overflow = '';
        }
      }
      
      // Hamburger click
      hamburger.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleMenu();
      });
      
      // Overlay click to close menu
      mobileOverlay.addEventListener('click', function() {
        if (navLinks.classList.contains('active')) {
          toggleMenu();
        }
      });
      
      // Close menu when clicking on a link
      const navItems = navLinks.querySelectorAll('a');
      navItems.forEach(item => {
        item.addEventListener('click', function() {
          if (navLinks.classList.contains('active')) {
            toggleMenu();
          }
        });
      });
      
      // Close menu when pressing Escape key
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
          toggleMenu();
        }
      });
      
      // Handle window resize - close menu and ensure proper layout
      let resizeTimer;
      window.addEventListener('resize', function() {
        // Clear the timer if it's already running
        clearTimeout(resizeTimer);
        
        // Set a new timer
        resizeTimer = setTimeout(function() {
          // If resizing to desktop size, close the menu
          if (window.innerWidth > 992 && navLinks.classList.contains('active')) {
            toggleMenu();
          }
          
          // Add animation class for desktop menu appearance
          if (window.innerWidth > 992) {
            navLinks.classList.add('desktop-transition');
            setTimeout(() => {
              navLinks.classList.remove('desktop-transition');
            }, 500);
          }
        }, 250); // Wait 250ms after resize finishes
      });
    }
  }
  

  // ===== PRELOADER =====
  const preloader = document.querySelector('.preloader');
  if (preloader) {
    window.addEventListener('load', function() {
      setTimeout(function() {
        preloader.classList.add('fade-out');
        setTimeout(function() {
          preloader.style.display = 'none';
        }, 600);
      }, 1000);
    });
  }
});
  // ===== HERO SLIDER =====
  const heroSlider = document.querySelector('.hero-slides');
  if (heroSlider && !prefersReducedMotion) {
    const slides = Array.from(document.querySelectorAll('.hero-slide'));
    const prevBtn = document.querySelector('.hero-prev');
    const nextBtn = document.querySelector('.hero-next');
    const pagination = document.querySelector('.hero-pagination');
    
    let currentSlide = 0;
    let slideInterval;
    const slideDuration = 6000; // 6 seconds
    
    // Create pagination dots
    slides.forEach((slide, index) => {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(index));
      pagination.appendChild(dot);
    });
    
    const dots = Array.from(document.querySelectorAll('.hero-pagination .dot'));
    
    // Initialize first slide
    slides[0].classList.add('active');
    
    // Next slide function
    function nextSlide() {
      goToSlide((currentSlide + 1) % slides.length);
    }
    
    // Previous slide function
    function prevSlide() {
      goToSlide((currentSlide - 1 + slides.length) % slides.length);
    }
    
    // Go to specific slide
    function goToSlide(index) {
      slides[currentSlide].classList.remove('active');
      dots[currentSlide].classList.remove('active');
      
      currentSlide = index;
      
      slides[currentSlide].classList.add('active');
      dots[currentSlide].classList.add('active');
      
      // Reset timer
      resetInterval();
    }
    
    // Reset autoplay interval
    function resetInterval() {
      clearInterval(slideInterval);
      slideInterval = setInterval(nextSlide, slideDuration);
    }
    
    // Event listeners
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    
    // Start autoplay
    if (!prefersReducedMotion) {
      slideInterval = setInterval(nextSlide, slideDuration);
      
      // Pause on hover
      heroSlider.addEventListener('mouseenter', () => clearInterval(slideInterval));
      heroSlider.addEventListener('mouseleave', resetInterval);
    }
  }
  
  // ===== PRODUCT CAROUSEL =====
  const productCarousel = document.querySelector('.product-carousel');
  if (productCarousel) {
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const products = Array.from(document.querySelectorAll('.product-card'));
    
    let currentIndex = 0;
    const cardWidth = products[0].offsetWidth + parseInt(getComputedStyle(products[0]).marginRight);
    
    // Next product
    function nextProduct() {
      currentIndex = (currentIndex + 1) % (products.length - 2);
      updateCarousel();
    }
    
    // Previous product
    function prevProduct() {
      currentIndex = (currentIndex - 1 + (products.length - 2)) % (products.length - 2);
      updateCarousel();
    }
    
    // Update carousel position
    function updateCarousel() {
      const offset = -currentIndex * cardWidth;
      productCarousel.style.transform = `translateX(${offset}px)`;
    }
    
    // Event listeners
    if (nextBtn) nextBtn.addEventListener('click', nextProduct);
    if (prevBtn) prevBtn.addEventListener('click', prevProduct);
    
    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    
    productCarousel.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    productCarousel.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
      if (touchEndX < touchStartX - 50) {
        nextProduct();
      } else if (touchEndX > touchStartX + 50) {
        prevProduct();
      }
    }
  }
  
  // ===== TESTIMONIAL SLIDER =====
  // ===== VIDEO TESTIMONIAL SLIDER =====
  function initVideoTestimonialSlider() {
    const videoSlider = document.querySelector('.video-slider');
    const videoTestimonials = document.querySelectorAll('.video-testimonial');
    const prevButton = document.querySelector('.video-prev');
    const nextButton = document.querySelector('.video-next');
    const paginationDots = document.querySelectorAll('.pagination-dot');
    const playButtons = document.querySelectorAll('.play-button');
    const videoModal = document.querySelector('.video-modal');
    const modalClose = document.querySelector('.modal-close');
    const videoIframe = document.querySelector('.video-container iframe');
    
    // Check if elements exist before initializing
    if (!videoSlider || !videoTestimonials.length) return;
    
    let currentSlide = 0;
    const totalSlides = videoTestimonials.length;
    
    // Replace with your actual YouTube video IDs
    const videoIds = [
      'dQw4w9WgXcQ', 
      'dQw4w9WgXcQ',
      'dQw4w9WgXcQ',
      'dQw4w9WgXcQ'
    ];
    
    // Initialize slider
    function updateSlider() {
      if (!videoSlider) return;
      
      videoSlider.style.transform = `translateX(-${currentSlide * 100}%)`;
      
      // Update active classes
      videoTestimonials.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentSlide);
      });
      
      // Update pagination
      if (paginationDots.length) {
        paginationDots.forEach((dot, index) => {
          dot.classList.toggle('active', index === currentSlide);
        });
      }
    }
    
    // Next slide
    function nextSlide() {
      currentSlide = (currentSlide + 1) % totalSlides;
      updateSlider();
    }
    
    // Previous slide
    function prevSlide() {
      currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
      updateSlider();
    }
    
    // Go to specific slide
    function goToSlide(index) {
      if (index >= 0 && index < totalSlides) {
        currentSlide = index;
        updateSlider();
      }
    }
    
    // Open video modal
    function openVideoModal(videoIndex) {
      if (!videoModal || !videoIframe) return;
      
      videoIframe.src = `https://www.youtube.com/embed/${videoIds[videoIndex]}?autoplay=1`;
      videoModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
    
    // Close video modal
    function closeVideoModal() {
      if (!videoModal || !videoIframe) return;
      
      videoModal.classList.remove('active');
      videoIframe.src = '';
      document.body.style.overflow = '';
    }
    
    // Event listeners for navigation
    if (prevButton) {
      prevButton.addEventListener('click', prevSlide);
    }
    
    if (nextButton) {
      nextButton.addEventListener('click', nextSlide);
    }
    
    // Pagination dots
    if (paginationDots.length) {
      paginationDots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
      });
    }
    
    // Play buttons
    if (playButtons.length) {
      playButtons.forEach((button, index) => {
        button.addEventListener('click', () => openVideoModal(index));
      });
    }
    
    // Modal close
    if (modalClose) {
      modalClose.addEventListener('click', closeVideoModal);
    }
    
    // Close modal when clicking outside
    if (videoModal) {
      videoModal.addEventListener('click', (e) => {
        if (e.target === videoModal) {
          closeVideoModal();
        }
      });
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && videoModal && videoModal.classList.contains('active')) {
        closeVideoModal();
      }
    });
    
    // Initialize the slider
    updateSlider();
    
    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    if (videoSlider) {
      videoSlider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });
      
      videoSlider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
      }, { passive: true });
    }
    
    function handleSwipe() {
      if (touchEndX < touchStartX - 50) {
        nextSlide();
      } else if (touchEndX > touchStartX + 50) {
        prevSlide();
      }
    }
    
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        updateSlider();
      }, 250);
    });
  }

  // Initialize the video testimonial slider when DOM is loaded
  document.addEventListener('DOMContentLoaded', function() {
    initVideoTestimonialSlider();
  });
  // ===== SCROLL REVEAL ANIMATIONS =====
  if (!prefersReducedMotion && typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    
    // Animate sections on scroll
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      gsap.from(section, {
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: 'power2.out'
      });
    });
    
    // Animate collection cards
    const collectionCards = document.querySelectorAll('.collection-card');
    collectionCards.forEach((card, index) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 50,
        duration: 0.6,
        delay: index * 0.1,
        ease: 'power2.out'
      });
    });
    
    // Animate product cards
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach((card, index) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 50,
        duration: 0.6,
        delay: index * 0.1,
        ease: 'power2.out'
      });
    });
  }
  
  // ===== COOKIE CANVAS ANIMATION =====
  const cookieCanvas = document.getElementById('cookie-canvas');
  if (cookieCanvas && !prefersReducedMotion) {
    const ctx = cookieCanvas.getContext('2d');
    let particles = [];
    const particleCount = window.innerWidth < 768 ? 20 : 40;
    
    // Set canvas size
    function resizeCanvas() {
      cookieCanvas.width = window.innerWidth;
      cookieCanvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', function() {
      resizeCanvas();
    });
    
    resizeCanvas();
    
    // Particle class
    class Particle {
      constructor() {
        this.reset();
        this.y = Math.random() * cookieCanvas.height;
      }
      
      reset() {
        this.x = Math.random() * cookieCanvas.width;
        this.y = -20;
        this.size = Math.random() * 15 + 5;
        this.speed = Math.random() * 2 + 1;
        this.opacity = Math.random() * 0.6 + 0.2;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = Math.random() * 0.02 - 0.01;
        this.wobble = Math.random() * 5;
        this.wobbleSpeed = Math.random() * 0.02;
        this.wobbleOffset = Math.random() * Math.PI * 2;
        this.color = `hsl(${Math.random() * 30 + 20}, 70%, 60%)`;
      }
      
      update() {
        this.y += this.speed;
        this.rotation += this.rotationSpeed;
        this.wobbleOffset += this.wobbleSpeed;
        
        if (this.y > cookieCanvas.height + this.size) {
          this.reset();
        }
      }
      
      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        // Draw cookie shape
        ctx.beginPath();
        ctx.ellipse(
          0, 
          0, 
          this.size + Math.sin(this.wobbleOffset) * this.wobble, 
          this.size, 
          0, 
          0, 
          Math.PI * 2
        );
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fill();
        
        // Draw chocolate chips
        for (let i = 0; i < 5; i++) {
          const angle = (i / 5) * Math.PI * 2;
          const chipX = Math.cos(angle + this.rotation) * (this.size * 0.7);
          const chipY = Math.sin(angle + this.rotation) * (this.size * 0.5);
          
          ctx.beginPath();
          ctx.arc(chipX, chipY, this.size * 0.15, 0, Math.PI * 2);
          ctx.fillStyle = 'hsl(20, 70%, 30%)';
          ctx.fill();
        }
        
        ctx.restore();
      }
    }
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
      setTimeout(() => {
        particles.push(new Particle());
      }, i * 500);
    }
    
    // Animation loop
    function animate() {
      ctx.clearRect(0, 0, cookieCanvas.width, cookieCanvas.height);
      
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      
      requestAnimationFrame(animate);
    }
    
    animate();
  }
  
  // ===== ADD TO CART ANIMATION =====
  const addToCartButtons = document.querySelectorAll('.add-to-cart');
  const cartIcon = document.querySelector('.cart-icon');
  const cartCount = document.querySelector('.cart-count');
  
  if (addToCartButtons.length && cartIcon && cartCount) {
    addToCartButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Update cart count
        let count = parseInt(cartCount.textContent);
        cartCount.textContent = count + 1;
        
        // Create flying cookie element
        const flyingCookie = document.createElement('div');
        flyingCookie.className = 'flying-cookie';
        
        // Get button position
        const rect = this.getBoundingClientRect();
        const startX = rect.left + rect.width / 2;
        const startY = rect.top + rect.height / 2;
        
        // Get cart position
        const cartRect = cartIcon.getBoundingClientRect();
        const endX = cartRect.left + cartRect.width / 2;
        const endY = cartRect.top + cartRect.height / 2;
        
        // Set initial position
        flyingCookie.style.left = `${startX}px`;
        flyingCookie.style.top = `${startY}px`;
        
        // Add to DOM
        document.body.appendChild(flyingCookie);
        
        // Animate to cart
        if (typeof gsap !== 'undefined') {
          gsap.to(flyingCookie, {
            x: endX - startX,
            y: endY - startY,
            scale: 0.5,
            duration: 0.8,
            ease: 'power2.in',
            onComplete: () => {
              flyingCookie.remove();
              
              // Bounce cart icon
              gsap.to(cartIcon, {
                scale: 1.2,
                duration: 0.2,
                yoyo: true,
                repeat: 1,
                ease: 'power2.out'
              });
            }
          });
        }
        
        // Change button text temporarily
        const originalText = this.innerHTML;
        this.innerHTML = '<i class="fa-solid fa-check"></i> Added';
        this.disabled = true;
        
        setTimeout(() => {
          this.innerHTML = originalText;
          this.disabled = false;
        }, 2000);
      });
    });
  }
  
  // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });
});


// ===== FAQ ACCORDION FUNCTIONALITY =====
const faqItems = document.querySelectorAll('.faq-item');
if (faqItems.length) {
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    
    question.addEventListener('click', () => {
      const isExpanded = question.getAttribute('aria-expanded') === 'true';
      
      // Toggle this item
      question.setAttribute('aria-expanded', !isExpanded);
      item.classList.toggle('active');
      
      // Close other items if needed
      if (!isExpanded) {
        faqItems.forEach(otherItem => {
          if (otherItem !== item && otherItem.classList.contains('active')) {
            otherItem.classList.remove('active');
            otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
          }
        });
      }
    });
  });
  
  // Keyboard navigation for accessibility
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const focusedElement = document.activeElement;
      if (focusedElement.classList.contains('faq-question')) {
        e.preventDefault();
        focusedElement.click();
      }
    }
  });
}

// ===== FAQ ANIMATIONS WITH GSAP (if available) =====
if (typeof gsap !== 'undefined' && !prefersReducedMotion) {
  // Animate FAQ items on scroll
  gsap.utils.toArray('.faq-item').forEach((item, index) => {
    gsap.from(item, {
      scrollTrigger: {
        trigger: item,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 30,
      duration: 0.6,
      delay: index * 0.1,
      ease: 'power2.out'
    });
  });
}

























document.addEventListener('DOMContentLoaded', function() {
  // Initialize animations
  initAuthAnimations();
  
  // Setup form validation and submission
  setupLoginForm();
  setupRegisterForm();
  
  // Setup password toggle
  setupPasswordToggle();
  
  // Setup password strength indicator
  setupPasswordStrength();
  
  // Setup social login buttons
  setupSocialLogin();
});

function initAuthAnimations() {
  if (typeof gsap !== 'undefined') {
    // Animate floating cookies
    gsap.utils.toArray('.cookie').forEach((cookie, i) => {
      gsap.to(cookie, {
        y: 20,
        rotation: 10,
        duration: 3 + Math.random() * 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: i * 0.5
      });
    });
  }
}

function setupLoginForm() {
  const loginForm = document.getElementById('loginForm');
  if (!loginForm) return;
  
  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Simple validation
    if (!email || !password) {
      showToast('Please fill in all fields', 'error');
      return;
    }
    
    // Check if user exists in localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      // Login successful
      localStorage.setItem('currentUser', JSON.stringify(user));
      showToast('Login successful! Redirecting...');
      
      // Redirect after delay
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1500);
    } else {
      // Login failed
      showToast('Invalid email or password', 'error');
    }
  });
}

function setupRegisterForm() {
  const registerForm = document.getElementById('registerForm');
  if (!registerForm) return;
  
  registerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    // Validation
    if (!name || !email || !password || !confirmPassword) {
      showToast('Please fill in all fields', 'error');
      return;
    }
    
    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }
    
    if (!agreeTerms) {
      showToast('Please agree to the terms and conditions', 'error');
      return;
    }
    
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userExists = users.some(u => u.email === email);
    
    if (userExists) {
      showToast('Email already registered', 'error');
      return;
    }
    
    // Create new user
    const newUser = {
      id: Date.now(),
      name,
      email,
      password, // Note: In a real app, you would hash the password
      createdAt: new Date().toISOString()
    };
    
    // Save user
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    // Show success message
    showToast('Registration successful! Welcome to SUDDKHASTA');
    
    // Redirect after delay
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1500);
  });
}

function setupPasswordToggle() {
  document.querySelectorAll('.toggle-password').forEach(button => {
    button.addEventListener('click', function() {
      const input = this.parentElement.querySelector('input');
      const icon = this.querySelector('i');
      
      if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
      } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
      }
    });
  });
}

function setupPasswordStrength() {
  const passwordInput = document.getElementById('registerPassword');
  if (!passwordInput) return;
  
  passwordInput.addEventListener('input', function() {
    const password = this.value;
    const strengthBars = document.querySelectorAll('.strength-bar');
    const strengthText = document.querySelector('.strength-text');
    
    // Reset
    strengthBars.forEach(bar => {
      bar.style.backgroundColor = (--light-alt);
    });
    
    if (!password) {
      strengthText.textContent = 'Password strength';
      return;
    }
    
    // Very simple strength check (for demo)
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    // Update UI
    for (let i = 0; i < strength && i < 3; i++) {
      if (i === 0) {
        strengthBars[i].style.backgroundColor = '#ff4d4d'; // Red
      } else if (i === 1) {
        strengthBars[i].style.backgroundColor = '#ffcc00'; // Yellow
      } else {
        strengthBars[i].style.backgroundColor = '#00cc66'; // Green
      }
    }
    
    // Update text
    if (strength <= 2) {
      strengthText.textContent = 'Weak';
      strengthText.style.color = '#ff4d4d';
    } else if (strength <= 4) {
      strengthText.textContent = 'Moderate';
      strengthText.style.color = '#ffcc00';
    } else {
      strengthText.textContent = 'Strong';
      strengthText.style.color = '#00cc66';
    }
  });
}

function setupSocialLogin() {
  document.querySelectorAll('.social-btn').forEach(button => {
    button.addEventListener('click', function() {
      const provider = this.classList.contains('google') ? 'Google' : 'Facebook';
      showToast(`${provider} login would be implemented in a real app`);
    });
  });
}

function showToast(message, type = '') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  
  toast.textContent = message;
  toast.className = 'toast';
  if (type) toast.classList.add(type);
  
  // Show toast
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  
  // Hide after delay
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Check if user is logged in (for other pages)
function checkAuthState() {
  const currentUser = localStorage.getItem('currentUser');
  const authLinks = document.querySelectorAll('.auth-link');
  
  if (authLinks.length) {
    if (currentUser) {
      // User is logged in
      authLinks.forEach(link => {
        link.innerHTML = '<i class="fa-solid fa-user"></i> Account';
        link.href = 'account.html';
      });
    } else {
      // User is not logged in
      authLinks.forEach(link => {
        link.innerHTML = '<i class="fa-regular fa-user"></i> Login';
        link.href = 'login.html';
      });
    }
  }
}

// Logout function (can be called from other pages)
function logout() {
  localStorage.removeItem('currentUser');
  showToast('Logged out successfully');
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1000);
}

// Initialize auth state check
checkAuthState();

