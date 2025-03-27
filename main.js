// DOM Elements
const loader = document.querySelector('.loader');
const themeToggle = document.querySelector('.theme-toggle');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const backToTop = document.querySelector('.back-to-top');
const currentYear = document.getElementById('year');
const skillProgressBars = document.querySelectorAll('.skill-progress');
const contactForm = document.getElementById('contactForm');
const heroPhoto = document.querySelector('.floating-photo');

// Variables
let threeJSInitialized = false;
let photoAnimationId;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Set current year
    currentYear.textContent = new Date().getFullYear();

    // Remove loader after assets are loaded
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('fade-out');
        }, 500);
    });

    // Initialize animations
    initTypingAnimation();
    initScrollAnimations();
    initPhotoAnimation();
    initTheme();
    initThreeJS();
    setupEventListeners();
});
// Add to main.js
function initGridInteraction() {
    document.body.addEventListener('mousemove', (e) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      document.body.style.backgroundPosition = `${x * 20}px ${y * 20}px`;
    });
  }
  
  // Call this in your initialization
  initGridInteraction();

  // In main.js - detects and applies your theme colors
function updateGridColors() {
    const primary = getComputedStyle(document.documentElement)
      .getPropertyValue('--primary-color').trim() || '#6a11cb';
    
    const secondary = getComputedStyle(document.documentElement)
      .getPropertyValue('--secondary-color').trim() || '#2575fc';
  
    document.documentElement.style.setProperty(
      '--grid-color-light', 
      hexToRgba(primary, 0.08)
    );
    
    document.documentElement.style.setProperty(
      '--grid-color-dark', 
      hexToRgba(secondary, 0.1)
    );
  }
  
  // Helper function
  function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16),
          g = parseInt(hex.slice(3, 5), 16),
          b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  
  // Call on load and theme change
  updateGridColors();
  window.addEventListener('theme-change', updateGridColors); // Trigger this event when theme toggles

/* JavaScript for Mouse Tracking */
document.addEventListener('mousemove', (e) => {
    document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
    document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
  });
// Event Listeners
function setupEventListeners() {
    themeToggle.addEventListener('click', toggleTheme);
    hamburger.addEventListener('click', toggleMobileMenu);
    window.addEventListener('scroll', handleScroll);
    contactForm.addEventListener('submit', handleFormSubmit);
    
    // Photo hover effect
    if (heroPhoto) {
        heroPhoto.addEventListener('mousemove', handlePhotoMove);
        heroPhoto.addEventListener('mouseleave', handlePhotoLeave);
    }
}

// Photo Animation
function initPhotoAnimation() {
    if (!heroPhoto) return;
    
    let angle = 0;
    const floatPhoto = () => {
        angle += 0.01;
        const floatY = Math.sin(angle) * 15;
        heroPhoto.style.transform = `translateY(${floatY}px)`;
        photoAnimationId = requestAnimationFrame(floatPhoto);
    };
    photoAnimationId = requestAnimationFrame(floatPhoto);
}

function handlePhotoMove(e) {
    if (!heroPhoto) return;
    
    const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
    const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
    heroPhoto.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
}

function handlePhotoLeave() {
    if (!heroPhoto) return;
    heroPhoto.style.transform = 'rotateY(0deg) rotateX(0deg)';
}

// Typing Animation
function initTypingAnimation() {
    const subtitle = document.querySelector('.hero-subtitle');
    if (!subtitle) return;

    const texts = [
        "Frontend Developer",
        "Freelance Web Designer",
        "UI/UX Enthusiast",
        "Problem Solver"
    ];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            subtitle.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            subtitle.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = charIndex % 3 === 0 ? 150 : 100; // Variable speed
        }

        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            typingSpeed = 1500;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typingSpeed = 500;
        }

        setTimeout(type, typingSpeed);
    }

    setTimeout(type, 1000);
}

// Scroll Animations
function initScrollAnimations() {
    const animateOnScroll = () => {
        animateSkills();
        animateStats();
        animateProjectCards();
    };

    // Run once on load
    animateOnScroll();
    
    // Run on scroll
    window.addEventListener('scroll', animateOnScroll);
}

function animateSkills() {
    skillProgressBars.forEach(bar => {
        if (isInViewport(bar) && !bar.style.width) {
            const level = bar.getAttribute('data-level');
            bar.style.width = `${level}%`;
        }
    });
}

function animateStats() {
    const stats = document.querySelectorAll('.stat .number');
    stats.forEach(stat => {
        if (isInViewport(stat) && !stat.hasAttribute('data-animated')) {
            const target = parseInt(stat.getAttribute('data-count'));
            animateCounter(stat, target);
            stat.setAttribute('data-animated', 'true');
        }
    });
}

function animateCounter(element, target) {
    const duration = 2000;
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            clearInterval(timer);
            current = target;
        }
        element.textContent = Math.floor(current);
    }, 16);
}

function animateProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        if (isInViewport(card)) {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }
    });
}

// Three.js Initialization
function initThreeJS() {
    if (threeJSInitialized || !document.getElementById('hero-3d-container')) return;
    
    try {
        const container = document.getElementById('hero-3d-container');
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true,
            powerPreference: "high-performance"
        });
        
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);
        
        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(1, 1, 1);
        scene.add(directionalLight);
        
        // Photo as 3D plane
        const texture = new THREE.TextureLoader().load('images/your-photo.jpg', (texture) => {
            texture.encoding = THREE.sRGBEncoding;
            const geometry = new THREE.PlaneGeometry(3, 3);
            const material = new THREE.MeshStandardMaterial({ 
                map: texture,
                roughness: 0.3,
                metalness: 0.1,
                transparent: true,
                opacity: 0.95
            });
            const photo = new THREE.Mesh(geometry, material);
            scene.add(photo);
            
            camera.position.z = 5;
            
            // Animation loop
            const animate = () => {
                requestAnimationFrame(animate);
                photo.rotation.y += 0.005;
                photo.position.y = Math.sin(Date.now() * 0.001) * 0.2;
                renderer.render(scene, camera);
            };
            animate();
            
            // Handle resize
            window.addEventListener('resize', () => {
                camera.aspect = container.clientWidth / container.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(container.clientWidth, container.clientHeight);
            });
        });
        
        threeJSInitialized = true;
    } catch (error) {
        console.error("Three.js initialization failed:", error);
        // Fallback to CSS animation
        if (photoAnimationId) {
            cancelAnimationFrame(photoAnimationId);
        }
        initPhotoAnimation();
    }
}

// Theme Management
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    if (icon) {
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        icon.style.transform = theme === 'dark' ? 'rotate(360deg)' : 'rotate(0deg)';
    }
}

// Mobile Menu
function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    
    // Toggle body scroll
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
}

// Scroll Handling
function handleScroll() {
    // Navbar background
    document.querySelector('.navbar').classList.toggle('scrolled', window.scrollY > 50);
    
    // Back to top button
    backToTop.classList.toggle('active', window.scrollY > 300);
    
    // Parallax effect for photo
    if (heroPhoto && !threeJSInitialized) {
        const scrollValue = window.scrollY;
        heroPhoto.style.transform = `translateY(${scrollValue * 0.2}px)`;
    }
}

// Form Handling
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    
    // Disable button
    submitButton.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
    submitButton.disabled = true;
    
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Success state
        submitButton.innerHTML = '<span>Message Sent!</span><i class="fas fa-check"></i>';
        contactForm.reset();
        
        // Reset button after delay
        setTimeout(() => {
            submitButton.innerHTML = originalButtonText;
            submitButton.disabled = false;
        }, 2000);
    } catch (error) {
        // Error state
        submitButton.innerHTML = '<span>Error! Try Again</span><i class="fas fa-exclamation"></i>';
        setTimeout(() => {
            submitButton.innerHTML = originalButtonText;
            submitButton.disabled = false;
        }, 2000);
    }
}

// Helper Functions
function isInViewport(element) {
    if (!element) return false;
    
    const rect = element.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.75 &&
        rect.bottom >= 0
    );
}
/* JavaScript */
window.addEventListener('scroll', () => {
  document.querySelectorAll('.parallax-layer').forEach(layer => {
    const speed = parseFloat(layer.style.getPropertyValue('--parallax-speed'));
    layer.style.transform = `translateY(${window.scrollY * speed}px)`;
  });
});

// Cleanup on window close
window.addEventListener('beforeunload', () => {
    if (photoAnimationId) {
        cancelAnimationFrame(photoAnimationId);
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const messageTextarea = document.getElementById('message');
    const charCounter = document.querySelector('.char-counter span');

    // Character counter for message
    messageTextarea.addEventListener('input', function() {
        charCounter.textContent = this.value.length;
    });

    // Form validation
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        let isValid = true;

        // Validate each field
        document.querySelectorAll('.floating-label input, .floating-label textarea').forEach(field => {
            const formGroup = field.closest('.form-group');
            
            if (!field.checkValidity()) {
                formGroup.classList.add('invalid');
                isValid = false;
            } else {
                formGroup.classList.remove('invalid');
            }
        });

        if (isValid) {
            submitForm();
        }
    });

    // Real-time validation on blur
    document.querySelectorAll('.floating-label input, .floating-label textarea').forEach(field => {
        field.addEventListener('blur', function() {
            const formGroup = this.closest('.form-group');
            if (!this.checkValidity()) {
                formGroup.classList.add('invalid');
            } else {
                formGroup.classList.remove('invalid');
            }
        });
    });

    // Form submission
    function submitForm() {
        const formStatus = document.querySelector('.form-status');
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;

        // Show loading state
        submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
        submitBtn.disabled = true;

        // Simulate form submission (replace with actual AJAX call)
        setTimeout(() => {
            formStatus.textContent = 'Message sent successfully!';
            formStatus.classList.add('success');
            formStatus.style.display = 'block';
            form.reset();
            
            // Reset button
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
            
            // Hide status after 5s
            setTimeout(() => {
                formStatus.style.display = 'none';
            }, 5000);
        }, 1500);
    }
});