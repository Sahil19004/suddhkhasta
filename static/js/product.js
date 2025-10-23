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

// #PRODUCT PAGE JS

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

  // Quantity selector
  const minusBtn = document.querySelector('.quantity-btn.minus');
  const plusBtn = document.querySelector('.quantity-btn.plus');
  const quantityInput = document.querySelector('.quantity-input');
  
  minusBtn.addEventListener('click', function() {
    let value = parseInt(quantityInput.value);
    if (value > 1) {
      quantityInput.value = value - 1;
    }
  });
  
  plusBtn.addEventListener('click', function() {
    let value = parseInt(quantityInput.value);
    quantityInput.value = value + 1;
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

  // Add to cart animation
  const addToCartBtn = document.querySelector('.add-to-cart-btn');
  const cartCount = document.querySelector('.cart-count');
  
  if (addToCartBtn && cartCount) {
    addToCartBtn.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Update cart count
      let count = parseInt(cartCount.textContent);
      const quantity = parseInt(quantityInput.value);
      cartCount.textContent = count + quantity;
      
      // Animation
      if (typeof gsap !== 'undefined') {
        // Create flying cookies for each quantity
        for (let i = 0; i < quantity; i++) {
          setTimeout(() => {
            const flyingCookie = document.createElement('div');
            flyingCookie.className = 'flying-cookie';
            
            // Position at button
            const rect = addToCartBtn.getBoundingClientRect();
            const startX = rect.left + rect.width / 2;
            const startY = rect.top + rect.height / 2;
            
            // Position at cart icon
            const cartRect = document.querySelector('.cart-icon').getBoundingClientRect();
            const endX = cartRect.left + cartRect.width / 2;
            const endY = cartRect.top + cartRect.height / 2;
            
            flyingCookie.style.left = `${startX}px`;
            flyingCookie.style.top = `${startY}px`;
            document.body.appendChild(flyingCookie);
            
            gsap.to(flyingCookie, {
              x: endX - startX,
              y: endY - startY,
              scale: 0.5,
              duration: 0.8,
              ease: 'power2.in',
              onComplete: () => {
                flyingCookie.remove();
                
                // Bounce cart icon on last item
                if (i === quantity - 1) {
                  gsap.to('.cart-icon', {
                    scale: 1.2,
                    duration: 0.2,
                    yoyo: true,
                    repeat: 1,
                    ease: 'power2.out'
                  });
                }
              }
            });
          }, i * 100);
        }
      }
      
      // Change button text temporarily
      const originalText = this.innerHTML;
      this.innerHTML = '<i class="fa-solid fa-check"></i> Added to Cart';
      this.disabled = true;
      
      setTimeout(() => {
        this.innerHTML = originalText;
        this.disabled = false;
      }, 2000);
    });
  }

  // Quick add functionality for related products
  const quickAddBtns = document.querySelectorAll('.quick-add');
  
  quickAddBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      if (cartCount) {
        let count = parseInt(cartCount.textContent);
        cartCount.textContent = count + 1;
        
        // Animation
        if (typeof gsap !== 'undefined') {
          const flyingCookie = document.createElement('div');
          flyingCookie.className = 'flying-cookie';
          
          const rect = this.getBoundingClientRect();
          const startX = rect.left + rect.width / 2;
          const startY = rect.top + rect.height / 2;
          
          const cartRect = document.querySelector('.cart-icon').getBoundingClientRect();
          const endX = cartRect.left + cartRect.width / 2;
          const endY = cartRect.top + cartRect.height / 2;
          
          flyingCookie.style.left = `${startX}px`;
          flyingCookie.style.top = `${startY}px`;
          document.body.appendChild(flyingCookie);
          
          gsap.to(flyingCookie, {
            x: endX - startX,
            y: endY - startY,
            scale: 0.5,
            duration: 0.8,
            ease: 'power2.in',
            onComplete: () => {
              flyingCookie.remove();
              gsap.to('.cart-icon', {
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
      }
    });
  });

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

// Add to cart flying cookie style
const style = document.createElement('style');
style.textContent = `
  .flying-cookie {
    position: fixed;
    width: 20px;
    height: 20px;
    background-color: var(--secondary);
    border-radius: 50%;
    pointer-events: none;
    z-index: 1000;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  }
`;
document.head.appendChild(style);




