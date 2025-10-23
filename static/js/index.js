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