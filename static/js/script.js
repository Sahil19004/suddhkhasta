// ===== PRELOADER =====
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

  // ===== NAVBAR & HAMBURGER =====
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });

    // Hamburger menu
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    let mobileOverlay = document.querySelector('.mobile-overlay');
    if (!mobileOverlay) {
      mobileOverlay = document.createElement('div');
      mobileOverlay.className = 'mobile-overlay';
      document.body.appendChild(mobileOverlay);
    }
    if (hamburger && navLinks) {
      function toggleMenu() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        mobileOverlay.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', hamburger.classList.contains('active') ? 'true' : 'false');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
      }
      hamburger.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleMenu();
      });
      mobileOverlay.addEventListener('click', function() {
        if (navLinks.classList.contains('active')) {
          toggleMenu();
        }
      });
      navLinks.querySelectorAll('a').forEach(item => {
        item.addEventListener('click', function() {
          if (navLinks.classList.contains('active')) {
            toggleMenu();
          }
        });
      });
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
          toggleMenu();
        }
      });
      let resizeTimer;
      window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
          if (window.innerWidth > 992 && navLinks.classList.contains('active')) {
            toggleMenu();
          }
          if (window.innerWidth > 992) {
            navLinks.classList.add('desktop-transition');
            setTimeout(() => {
              navLinks.classList.remove('desktop-transition');
            }, 500);
          }
        }, 250);
      });
    }
  }

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
    if (pagination) {
      slides.forEach((slide, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        pagination.appendChild(dot);
      });
    }
    
    const dots = Array.from(document.querySelectorAll('.hero-pagination .dot'));
    
    // Initialize first slide
    if (slides.length > 0) {
      slides[0].classList.add('active');
    }
    
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
      if (dots.length > 0) {
        dots[currentSlide].classList.remove('active');
      }
      
      currentSlide = index;
      
      slides[currentSlide].classList.add('active');
      if (dots.length > 0) {
        dots[currentSlide].classList.add('active');
      }
      
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
    
    if (products.length > 0) {
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
  }
  
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

  // Initialize the video testimonial slider
  initVideoTestimonialSlider();

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
});


// /////////////////////   product .js //////////////////////////////////////////////////////////////////////////


document.addEventListener('DOMContentLoaded', function() {
  // Thumbnail image switcher
// Product gallery thumbnail click
const thumbnails = document.querySelectorAll('.thumbnail');
const mainImage = document.querySelector('.main-image img');

thumbnails.forEach(thumbnail => {
  thumbnail.addEventListener('click', function () {
    // Update main image source from data-image
    const newImage = this.getAttribute('data-image');
    mainImage.setAttribute('src', newImage);

    // Update active class
    thumbnails.forEach(thumb => thumb.classList.remove('active'));
    this.classList.add('active');
  });
});

  // Tab system
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      // Remove active class from all buttons and panes
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));
      
      // Add active class to clicked button
      this.classList.add('active');
      
      // Show corresponding pane
      const tabId = this.dataset.tab;
      document.getElementById(tabId).classList.add('active');
    });
  });

  // Star rating input
  const ratingStars = document.querySelectorAll('.rating-input i');
  
  ratingStars.forEach(star => {
    star.addEventListener('click', function() {
      const rating = parseInt(this.dataset.rating);
      
      // Update star display
      ratingStars.forEach((s, index) => {
        if (index < rating) {
          s.classList.add('active');
          s.classList.remove('fa-regular');
          s.classList.add('fa-solid');
        } else {
          s.classList.remove('active');
          s.classList.remove('fa-solid');
          s.classList.add('fa-regular');
        }
      });
    });
  });

      // Change button text temporarily
     

  // Quick add functionality for related products
  

  // GSAP animations
  if (typeof gsap !== 'undefined') {
    // Product image animation
    gsap.from('.main-image img', {
      opacity: 0,
      scale: 0.9,
      duration: 1,
      ease: 'power2.out'
    });
    
    // Product info animation
    gsap.from('.product-info > *', {
      opacity: 0,
      y: 20,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out',
      delay: 0.3
    });
    
    // Tab content animation
    document.querySelectorAll('.tab-pane').forEach(pane => {
      pane.addEventListener('click', function() {
        if (this.classList.contains('active')) {
          gsap.from(this, {
            opacity: 0,
            y: 10,
            duration: 0.4,
            ease: 'power2.out'
          });
        }
      });
    });
  }
});




///////////////////////////////////////////////////    shipping.js /////////////////////////////////////////////////


document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle
  // const hamburger = document.querySelector('.hamburger');
  // const navLinks = document.querySelector('.nav-links');
  
  // if (hamburger && navLinks) {
  //   hamburger.addEventListener('click', function() {
  //     this.classList.toggle('active');
  //     navLinks.classList.toggle('active');
      
  //     // Toggle body scroll
  //     if (navLinks.classList.contains('active')) {
  //       document.body.style.overflow = 'hidden';
  //     } else {
  //       document.body.style.overflow = '';
  //     }
  //   });
  // }

  // Animate policy cards on scroll
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.utils.toArray('.animated-card').forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: "top 80%",
          toggleActions: "play none none none"
        },
        opacity: 0,
        y: 50,
        duration: 0.8,
        delay: i * 0.1,
        ease: "power2.out"
      });
    });

    // Animate hero elements
    gsap.from('.policy-hero h1', {
      opacity: 0,
      y: 30,
      duration: 0.8,
      delay: 0.2,
      ease: "power2.out"
    });

    gsap.from('.policy-hero p', {
      opacity: 0,
      y: 30,
      duration: 0.8,
      delay: 0.4,
      ease: "power2.out"
    });

    gsap.from('.delivery-truck, .return-box', {
      opacity: 0,
      scale: 0.5,
      duration: 1,
      delay: 0.6,
      ease: "elastic.out(1, 0.5)"
    });
  }

  // Support button interaction

});


// /////////////////////////////login page ///////////////////////////////////

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



/////////////////////////////////////////// About page /////////////////////////

// Simple JavaScript for additional interactivity
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add intersection observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.value-card, .team-member').forEach(el => {
        observer.observe(el);
    });

    // Cookie counter animation for fun
    
});


// ///////////////////////////////////////////// TOS PAGE ////////////////////////////////////////

// Terms of Service Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Navigation active state
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.terms-article');
    
    // Highlight active section in sidebar
    function highlightActiveSection() {
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= (sectionTop - 200)) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 100,
                    behavior: 'smooth'
                });
                
                // Update URL hash without scrolling
                history.pushState(null, null, targetId);
            }
        });
    });
    
    // Animate sections on scroll
    function animateSections() {
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (sectionTop < windowHeight * 0.85) {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
                section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            }
        });
    }
    
    // Initialize animations
    setTimeout(animateSections, 300);
    
    // Event listeners
    window.addEventListener('scroll', function() {
        highlightActiveSection();
        animateSections();
    });
    
    // Print button functionality
    // const printButton = document.createElement('button');
    // printButton.innerHTML = '<i class="fas fa-print"></i> Print Terms';
    // printButton.classList.add('print-button');
    // printButton.style.position = 'fixed';
    // printButton.style.bottom = '20px';
    // printButton.style.right = '20px';
    // printButton.style.backgroundColor = '#8B5A2B';
    // printButton.style.color = 'white';
    // printButton.style.border = 'none';
    // printButton.style.padding = '12px 20px';
    // printButton.style.borderRadius = '50px';
    // printButton.style.cursor = 'pointer';
    // printButton.style.boxShadow = '0 4px 10px rgba(0,0,0,0.2)';
    // printButton.style.zIndex = '1000';
    // printButton.style.fontFamily = 'inherit';
    // printButton.style.fontSize = '14px';
    // printButton.style.display = 'flex';
    // printButton.style.alignItems = 'center';
    // printButton.style.gap = '8px';
    // printButton.style.transition = 'all 0.3s ease';
    
    // printButton.addEventListener('mouseenter', function() {
    //     this.style.transform = 'translateY(-3px)';
    //     this.style.boxShadow = '0 6px 15px rgba(0,0,0,0.2)';
    // });
    
    // printButton.addEventListener('mouseleave', function() {
    //     this.style.transform = 'translateY(0)';
    //     this.style.boxShadow = '0 4px 10px rgba(0,0,0,0.2)';
    // });
    
    // printButton.addEventListener('click', function() {
    //     window.print();
    // });
    
    // document.body.appendChild(printButton);
    
    // Back to top button
    const backToTopButton = document.createElement('button');
    backToTopButton.innerHTML = '<i class="fas fa-chevron-up"></i>';
    backToTopButton.classList.add('back-to-top');
    backToTopButton.style.position = 'fixed';
    backToTopButton.style.bottom = '70px';
    backToTopButton.style.right = '20px';
    backToTopButton.style.backgroundColor = '#8B5A2B';
    backToTopButton.style.color = 'white';
    backToTopButton.style.border = 'none';
    backToTopButton.style.width = '50px';
    backToTopButton.style.height = '50px';
    backToTopButton.style.borderRadius = '50%';
    backToTopButton.style.cursor = 'pointer';
    backToTopButton.style.boxShadow = '0 4px 10px rgba(0,0,0,0.2)';
    backToTopButton.style.zIndex = '1000';
    backToTopButton.style.fontSize = '18px';
    backToTopButton.style.display = 'none';
    backToTopButton.style.justifyContent = 'center';
    backToTopButton.style.alignItems = 'center';
    backToTopButton.style.transition = 'all 0.3s ease';
    
    backToTopButton.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px)';
        this.style.boxShadow = '0 6px 15px rgba(0,0,0,0.2)';
    });
    
    backToTopButton.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 4px 10px rgba(0,0,0,0.2)';
    });
    
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    document.body.appendChild(backToTopButton);
    
    // Show/hide back to top button
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            backToTopButton.style.display = 'flex';
        } else {
            backToTopButton.style.display = 'none';
        }
    });
    
    // Initialize page
    highlightActiveSection();
});


/////////////////////////////// TrackOrder page //////////////////////////////////////////////


// Track Order Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const trackForm = document.getElementById('track-order-form');
    const orderStatus = document.getElementById('order-status');
    const orderNotFound = document.getElementById('order-not-found');
    const progressFill = document.getElementById('progress-fill');
    const orderItems = document.getElementById('order-items');
    const tryAgainBtn = document.getElementById('try-again-btn');
    
    // Sample order data (in a real app, this would come from an API)
    const sampleOrder = {
        id: 'SUDDK-12345',
        date: 'June 15, 2023',
        status: 'shipped', // ordered, baking, packaged, shipped, delivered
        progress: 60, // percentage
        customer: {
            name: 'Priya Sharma',
            address: '42 Cookie Lane, Bandra West, Mumbai, 400050',
            phone: '+91 98765 43210'
        },
        items: [
            {
                name: 'Salted Caramel Cookies',
                quantity: 2,
                price: 249,
                image: 'https://images.unsplash.com/photo-1590080874088-e8e7b5ef5e0c?q=80&w=300&auto=format&fit=crop'
            },
            {
                name: 'Dark Chocolate Crunch',
                quantity: 1,
                price: 279,
                image: 'https://images.unsplash.com/photo-1559620192-032c4bc4674e?q=80&w=300&auto=format&fit=crop'
            },
            {
                name: 'Assorted Cookie Box',
                quantity: 1,
                price: 450,
                image: 'https://images.unsplash.com/photo-1618923850107-d1a234d7a73a?q=80&w=300&auto=format&fit=crop'
            }
        ],
        subtotal: 1227,
        shipping: 99,
        tax: 198.45,
        total: 1524.45
    };
    
    // Initialize page
    function initPage() {
        // Add animation to elements
        gsap.to('.progress-step', {
            opacity: 1,
            y: 0,
            stagger: 0.2,
            duration: 0.8,
            delay: 0.5
        });
    }
    
    // Handle form submission
    trackForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const orderId = document.getElementById('order-id').value;
        const emailPhone = document.getElementById('email-phone').value;
        
        // Simple validation
        if (!orderId || !emailPhone) {
            showError('Please fill in all fields');
            return;
        }
        
        // Show loading state
        const submitBtn = trackForm.querySelector('button');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Tracking...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Check if order exists (in a real app, this would be an API call)
            if (orderId.toUpperCase() === 'SUDDK-12345' && 
                (emailPhone.includes('@') || emailPhone.includes('98765'))) {
                displayOrderDetails(sampleOrder);
            } else {
                showOrderNotFound();
            }
        }, 1500);
    });
    
    // Display order details
    function displayOrderDetails(order) {
        // Update order information
        document.getElementById('order-number').textContent = order.id;
        document.getElementById('order-date').textContent = order.date;
        document.getElementById('delivery-name').textContent = order.customer.name;
        document.getElementById('delivery-address').textContent = order.customer.address;
        document.getElementById('delivery-phone').textContent = order.customer.phone;
        
        // Update progress
        progressFill.style.width = `${order.progress}%`;
        
        // Update order items
        orderItems.innerHTML = '';
        order.items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'order-item';
            itemElement.innerHTML = `
                <div class="item-info">
                    <div class="item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="item-details">
                        <h4>${item.name}</h4>
                        <p>Qty: ${item.quantity}</p>
                    </div>
                </div>
                <div class="item-price">₹${(item.price * item.quantity).toFixed(2)}</div>
            `;
            orderItems.appendChild(itemElement);
        });
        
        // Update totals
        document.getElementById('subtotal').textContent = `₹${order.subtotal.toFixed(2)}`;
        document.getElementById('shipping').textContent = `₹${order.shipping.toFixed(2)}`;
        document.getElementById('tax').textContent = `₹${order.tax.toFixed(2)}`;
        document.getElementById('total').textContent = `₹${order.total.toFixed(2)}`;
        
        // Update progress steps based on status
        updateProgressSteps(order.status);
        
        // Show order status section
        trackForm.style.opacity = '0';
        gsap.to(trackForm, {
            opacity: 0,
            y: -20,
            duration: 0.5,
            onComplete: () => {
                trackForm.style.display = 'none';
                orderStatus.style.display = 'block';
                gsap.to(orderStatus, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8
                });
            }
        });
    }
    
    // Update progress steps based on order status
    function updateProgressSteps(status) {
        const steps = document.querySelectorAll('.progress-step');
        const statusIndex = {
            'ordered': 0,
            'baking': 1,
            'packaged': 2,
            'shipped': 3,
            'delivered': 4
        };
        
        steps.forEach((step, index) => {
            if (index <= statusIndex[status]) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }
    
    // Show order not found message
    function showOrderNotFound() {
        trackForm.style.opacity = '0';
        gsap.to(trackForm, {
            opacity: 0,
            y: -20,
            duration: 0.5,
            onComplete: () => {
                trackForm.style.display = 'none';
                orderNotFound.style.display = 'block';
                gsap.to(orderNotFound, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8
                });
            }
        });
    }
    
    // Try again button
    tryAgainBtn.addEventListener('click', function() {
        orderNotFound.style.opacity = '0';
        gsap.to(orderNotFound, {
            opacity: 0,
            y: 20,
            duration: 0.5,
            onComplete: () => {
                orderNotFound.style.display = 'none';
                trackForm.style.display = 'block';
                gsap.to(trackForm, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8
                });
            }
        });
    });
    
    // Show error message
    function showError(message) {
        // Remove any existing error messages
        const existingError = document.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Create error message
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.style.color = 'var(--accent)';
        errorElement.style.marginTop = '10px';
        errorElement.style.padding = '10px';
        errorElement.style.backgroundColor = 'rgba(124, 29, 29, 0.1)';
        errorElement.style.borderRadius = '5px';
        errorElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        
        trackForm.appendChild(errorElement);
        
        // Remove error after 5 seconds
        setTimeout(() => {
            errorElement.remove();
        }, 5000);
    }
    
    // Support button actions
    document.querySelectorAll('.support-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const btnText = this.textContent.trim();
            
            if (btnText === 'Start Chat') {
                alert('Chat service would open here. In a real application, this would connect to a live chat system.');
            } else if (btnText.includes('@')) {
                window.location.href = `mailto:${btnText}`;
            } else if (btnText.includes('+')) {
                window.location.href = `tel:${btnText}`;
            }
        });
    });
    
    // Initialize the page
    initPage();
});

// //////////////////////////////// Order page ///////////////////////////////

// Orders Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const ordersList = document.getElementById('orders-list');
    const ordersEmpty = document.getElementById('orders-empty');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // Sample orders data (in a real app, this would come from an API)
    const sampleOrders = [
        {
            id: 'SUDDK-78901',
            date: 'June 18, 2023',
            status: 'delivered',
            items: [
                {
                    name: 'Salted Caramel Cookies',
                    quantity: 2,
                    price: 249,
                    image: 'https://images.unsplash.com/photo-1590080874088-e8e7b5ef5e0c?q=80&w=300&auto=format&fit=crop'
                },
                {
                    name: 'Hazelnut Crunch',
                    quantity: 1,
                    price: 229,
                    image: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?q=80&w=300&auto=format&fit=crop'
                }
            ],
            total: 727
        },
        {
            id: 'SUDDK-45678',
            date: 'June 12, 2023',
            status: 'processing',
            items: [
                {
                    name: 'Dark Chocolate Crunch',
                    quantity: 3,
                    price: 279,
                    image: 'https://images.unsplash.com/photo-1559620192-032c4bc4674e?q=80&w=300&auto=format&fit=crop'
                },
                {
                    name: 'Assorted Cookie Box',
                    quantity: 1,
                    price: 450,
                    image: 'https://images.unsplash.com/photo-1618923850107-d1a234d7a73a?q=80&w=300&auto=format&fit=crop'
                }
            ],
            total: 1287
        },
        {
            id: 'SUDDK-12345',
            date: 'June 5, 2023',
            status: 'shipped',
            items: [
                {
                    name: 'Matcha White Chocolate',
                    quantity: 2,
                    price: 299,
                    image: 'https://images.unsplash.com/photo-1618923850107-d1a234d7a73a?q=80&w=300&auto=format&fit=crop'
                },
                {
                    name: 'Classic Chocolate Chip',
                    quantity: 1,
                    price: 199,
                    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=300&auto=format&fit=crop'
                }
            ],
            total: 797
        },
        {
            id: 'SUDDK-23456',
            date: 'May 28, 2023',
            status: 'cancelled',
            items: [
                {
                    name: 'Seasonal Special Box',
                    quantity: 1,
                    price: 599,
                    image: 'https://images.unsplash.com/photo-1626074353765-5177690d722d?q=80&w=300&auto=format&fit=crop'
                }
            ],
            total: 599
        }
    ];
    
    // Initialize page
    function initPage() {
        displayOrders(sampleOrders);
        setupFilterButtons();
        
        // Animate orders
        gsap.to('.order-card', {
            opacity: 1,
            y: 0,
            stagger: 0.15,
            duration: 0.8,
            delay: 0.5
        });
    }
    
    // Display orders
    function displayOrders(orders) {
        ordersList.innerHTML = '';
        
        if (orders.length === 0) {
            ordersEmpty.style.display = 'block';
            gsap.to(ordersEmpty, {
                opacity: 1,
                y: 0,
                duration: 0.8
            });
            return;
        }
        
        ordersEmpty.style.display = 'none';
        
        orders.forEach(order => {
            const orderElement = createOrderElement(order);
            ordersList.appendChild(orderElement);
        });
    }
    
    // Create order element
    function createOrderElement(order) {
        const orderElement = document.createElement('div');
        orderElement.className = 'order-card';
        
        // Format status class
        const statusClass = `status-${order.status}`;
        
        orderElement.innerHTML = `
            <div class="order-header">
                <div class="order-info">
                    <span class="order-id">Order #${order.id}</span>
                    <span class="order-date">Placed on ${order.date}</span>
                </div>
                <span class="order-status ${statusClass}">${formatStatus(order.status)}</span>
            </div>
            <div class="order-details">
                <div class="order-items">
                    ${order.items.map(item => `
                        <div class="order-item">
                            <div class="item-info">
                                <div class="item-image">
                                    <img src="${item.image}" alt="${item.name}">
                                </div>
                                <div class="item-details">
                                    <h4>${item.name}</h4>
                                    <p>Qty: ${item.quantity}</p>
                                </div>
                            </div>
                            <div class="item-price">₹${(item.price * item.quantity).toFixed(2)}</div>
                        </div>
                    `).join('')}
                </div>
                <div class="order-summary">
                    <div class="order-total">Total: ₹${order.total.toFixed(2)}</div>
                    <div class="order-actions">
                        <button class="order-btn btn-secondary" onclick="viewOrderDetails('${order.id}')">
                            <i class="fas fa-eye"></i> View Details
                        </button>
                        <button class="order-btn btn-primary" onclick="reorder('${order.id}')">
                            <i class="fas fa-shopping-cart"></i> Reorder
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        return orderElement;
    }
    
    // Format status text
    function formatStatus(status) {
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
    
    // Setup filter buttons
    function setupFilterButtons() {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Update active state
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Filter orders
                const filter = this.getAttribute('data-filter');
                filterOrders(filter);
            });
        });
    }
    
    // Filter orders
    function filterOrders(filter) {
        if (filter === 'all') {
            displayOrders(sampleOrders);
            return;
        }
        
        const filteredOrders = sampleOrders.filter(order => order.status === filter);
        displayOrders(filteredOrders);
    }
    
    // View order details
    window.viewOrderDetails = function(orderId) {
        // In a real app, this would navigate to an order details page
        alert(`Viewing details for order ${orderId}. In a real application, this would show detailed order information.`);
    };
    
    // Reorder
    window.reorder = function(orderId) {
        // In a real app, this would add all items from the order to the cart
        alert(`Adding items from order ${orderId} to your cart. In a real application, this would add all items to the shopping cart.`);
    };
    
    // Initialize the page
    initPage();
});

///////////////////// contact page ///////////////////////////
