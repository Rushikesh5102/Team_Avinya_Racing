/**
 * Team Avinya Website - Main JavaScript File
 * Comprehensive functionality including animations, forms, cursor trail, and more
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
    // Form Configuration
    scriptURL: 'https://script.google.com/macros/s/AKfycbye0m-3szwSl82lU3UCdHGGu-aHw6MtSpCu9IUPKOAdlBPXMVW2AUJ3h-R2ZvfymbPyww/exec',
    
    // Cursor Trail Configuration
    cursorTrailEnabled: true,
    maxTrailLength: 12,
    trailInterval: 8,
    trailFadeTime: 400,
    
    // Animation Configuration
    aosDuration: 800,
    aosEasing: 'ease-in-out',
    aosOnce: true,
    aosOffset: 100,
    aosDelay: 100
};

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    initializeAOS();
    initializeFormHandlers();
    initializeCursorTrail();
    initializeGalleryModals();
    initializeGalleryVideoControls();
    initializeScrollEffects();
    initializeLoadingAnimation();
    initializeBackToTop();
    initializeCreatorSection();
});

// ============================================================================
// AOS ANIMATIONS
// ============================================================================

function initializeAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: CONFIG.aosDuration,
            easing: CONFIG.aosEasing,
            once: CONFIG.aosOnce,
            offset: CONFIG.aosOffset,
            delay: CONFIG.aosDelay
        });
    }
}

// ============================================================================
// FORM HANDLING
// ============================================================================

function initializeFormHandlers() {
    // Sponsorship form
    const sponsorshipForm = document.getElementById('sponsorship-form');
    if (sponsorshipForm) {
        sponsorshipForm.addEventListener('submit', handleSponsorshipForm);
    }

    // Contact form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }

    // File input handlers

}





/**
 * Handle sponsorship form submission
 * @param {Event} event - Form submit event
 */
async function handleSponsorshipForm(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    try {
        // Show loading state
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;
        
        // Collect form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Handle checkboxes for support types
        const supportTypeCheckboxes = form.querySelectorAll('input[name="supportType"]:checked');
        if (supportTypeCheckboxes.length > 0) {
            const selectedOptions = Array.from(supportTypeCheckboxes).map(cb => cb.value);
            data.supportType = selectedOptions.join(', ');
        }
        
        // Send to Google Apps Script
        const response = await fetch(CONFIG.scriptURL, {
            method: 'POST',
            body: new URLSearchParams({
                formType: 'sponsorship',
                ...data
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showSuccessMessage('Sponsorship form submitted successfully!');
            form.reset();
        } else {
            showErrorMessage(result.error || 'Submission failed. Please try again.');
        }
        
    } catch (error) {
        console.error('Sponsorship form error:', error);
        showErrorMessage('An error occurred. Please try again.');
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

/**
 * Handle contact form submission
 * @param {Event} event - Form submit event
 */
async function handleContactForm(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    try {
        // Show loading state
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Collect form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Send to Google Apps Script
        const response = await fetch(CONFIG.scriptURL, {
            method: 'POST',
            body: new URLSearchParams({
                formType: 'contact',
                ...data
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showSuccessMessage('Contact form submitted successfully!');
            form.reset();
        } else {
            showErrorMessage(result.error || 'Submission failed. Please try again.');
        }
        
    } catch (error) {
        console.error('Contact form error:', error);
        showErrorMessage('An error occurred. Please try again.');
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// ============================================================================
// NOTIFICATIONS
// ============================================================================

/**
 * Show success message
 * @param {string} message - Success message
 */
function showSuccessMessage(message) {
    // Show popup instead of notification
    const popup = document.getElementById('popup');
    if (popup) {
        popup.style.display = 'flex';
    } else {
        // Fallback to notification if popup doesn't exist
        const notification = document.createElement('div');
        notification.className = 'alert alert-success';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: #28a745;
            color: white;
            border-radius: 5px;
            z-index: 1000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

/**
 * Show error message
 * @param {string} message - Error message
 */
function showErrorMessage(message) {
    const notification = document.createElement('div');
    notification.className = 'alert alert-danger';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: #dc3545;
        color: white;
        border-radius: 5px;
        z-index: 1000;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// ============================================================================
// CURSOR TRAIL
// ============================================================================

function initializeCursorTrail() {
    if (!CONFIG.cursorTrailEnabled) return;
    
    // Create canvas for smooth trail
    const canvas = document.createElement('canvas');
    canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        pointer-events: none;
        z-index: 9999;
        background: transparent;
    `;
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    let mouseX = 0;
    let mouseY = 0;
    let lastX = 0;
    let lastY = 0;
    let trailPoints = [];
    const maxTrailLength = 20; // Reduced for closer following
    const baseTrailWidth = 6; // Increased for bolder trail
    
    // Resize canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Track mouse movement with higher frequency
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Calculate movement speed
        const dx = mouseX - lastX;
        const dy = mouseY - lastY;
        const speed = Math.sqrt(dx * dx + dy * dy);
        
        // Add new trail point more frequently
        trailPoints.push({
            x: mouseX,
            y: mouseY,
            speed: speed,
            timestamp: Date.now()
        });
        
        // Limit trail length for closer following
        if (trailPoints.length > maxTrailLength) {
            trailPoints.shift();
        }
        
        lastX = mouseX;
        lastY = mouseY;
    });
    
    // Animation loop for neon glowy trail
    function animateTrail() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (trailPoints.length > 1) {
            // Draw neon glowy trail
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            
            for (let i = 1; i < trailPoints.length; i++) {
                const current = trailPoints[i];
                const previous = trailPoints[i - 1];
                
                // Calculate opacity and width based on position in trail
                const opacity = (i / trailPoints.length) * 1.2; // Increased opacity
                const width = baseTrailWidth * (i / trailPoints.length) * 1.5; // Bolder trail
                
                // Create neon glow effect with multiple layers
                
                // Outer glow (larger, more transparent)
                ctx.shadowColor = '#ff3c38';
                ctx.shadowBlur = 15;
                ctx.lineWidth = width + 4;
                ctx.strokeStyle = `rgba(255, 60, 56, ${opacity * 0.3})`;
                ctx.beginPath();
                ctx.moveTo(previous.x, previous.y);
                ctx.lineTo(current.x, current.y);
                ctx.stroke();
                
                // Middle glow
                ctx.shadowBlur = 8;
                ctx.lineWidth = width + 2;
                ctx.strokeStyle = `rgba(255, 100, 80, ${opacity * 0.6})`;
                ctx.beginPath();
                ctx.moveTo(previous.x, previous.y);
                ctx.lineTo(current.x, current.y);
                ctx.stroke();
                
                // Inner core (brightest)
                ctx.shadowBlur = 4;
                ctx.lineWidth = width;
                ctx.strokeStyle = `rgba(255, 200, 100, ${opacity})`;
                ctx.beginPath();
                ctx.moveTo(previous.x, previous.y);
                ctx.lineTo(current.x, current.y);
                ctx.stroke();
                
                // Add neon pulse effect
                const pulseIntensity = Math.sin(Date.now() * 0.01 + i * 0.5) * 0.3 + 0.7;
                ctx.shadowBlur = 6;
                ctx.lineWidth = width + 1;
                ctx.strokeStyle = `rgba(255, 60, 56, ${opacity * pulseIntensity * 0.4})`;
                ctx.beginPath();
                ctx.moveTo(previous.x, previous.y);
                ctx.lineTo(current.x, current.y);
                ctx.stroke();
            }
        }
        
        // Remove old trail points faster for closer following
        const now = Date.now();
        trailPoints = trailPoints.filter(point => now - point.timestamp < 200);
        
        requestAnimationFrame(animateTrail);
    }
    
    // Start animation
    animateTrail();
}

// ============================================================================
// GALLERY MODALS
// ============================================================================

function initializeGalleryModals() {
    const galleryImages = document.querySelectorAll('.gallery img');
    galleryImages.forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => createModal(img));
    });
}

// Prevent unmuting of videos in gallery (except Special Moments section)
function initializeGalleryVideoControls() {
    const videos = document.querySelectorAll('video');
    
    videos.forEach(video => {
        // Check if video is in Special Moments section
        const isInSpecialMoments = video.closest('.section')?.querySelector('h2')?.textContent.includes('Special Moments');
        
        if (!isInSpecialMoments) {
            // For non-Special Moments videos, prevent unmuting
            video.addEventListener('volumechange', function() {
                if (this.volume > 0) {
                    this.volume = 0;
                    this.muted = true;
                }
            });
            
            // Ensure video stays muted on play
            video.addEventListener('play', function() {
                this.muted = true;
                this.volume = 0;
            });
            
            // Prevent unmuting through right-click context menu
            video.addEventListener('contextmenu', function(e) {
                e.preventDefault();
                return false;
            });
        }
    });
}

function createModal(img) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        cursor: pointer;
    `;

    const modalImg = document.createElement('img');
    modalImg.src = img.src;
    modalImg.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        object-fit: contain;
        border-radius: 8px;
    `;

    modal.appendChild(modalImg);
    document.body.appendChild(modal);

    modal.addEventListener('click', () => {
        modal.remove();
    });
}

// ============================================================================
// SCROLL EFFECTS
// ============================================================================

function initializeScrollEffects() {
// Header scroll effect with throttling
let scrollTimeout;
const header = document.querySelector('header');
    if (header) {
window.addEventListener('scroll', () => {
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  }, 100);
});
    }
}

// ============================================================================
// LOADING ANIMATION
// ============================================================================

function initializeLoadingAnimation() {
    const loading = document.createElement('div');
    loading.className = 'loading';
    loading.setAttribute('role', 'status');
    loading.setAttribute('aria-label', 'Loading');
    loading.innerHTML = '<div class="loader"></div>';
    document.body.appendChild(loading);

    window.addEventListener('load', () => {
        loading.classList.add('hidden');
        setTimeout(() => {
            loading.style.display = 'none';
        }, 500);
    });
}

// ============================================================================
// BACK TO TOP
// ============================================================================

function initializeBackToTop() {
const backToTop = document.createElement('button');
backToTop.className = 'back-to-top';
backToTop.setAttribute('aria-label', 'Scroll to top');
backToTop.innerHTML = '↑';
document.body.appendChild(backToTop);

window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 300);
});

backToTop.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Validate email format
 * @param {string} email - Email address
 * @returns {boolean} - Is valid email
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate form data
 * @param {Object} data - Form data
 * @returns {Object} - Validation result
 */
function validateFormData(data) {
    const errors = [];

    // Required fields validation
    if (!data.fullName || data.fullName.trim() === '') {
        errors.push('Full name is required');
    }
    
    if (!data.email || !data.email.trim()) {
        errors.push('Email is required');
    } else if (!isValidEmail(data.email)) {
      errors.push('Please enter a valid email address');
    }

    if (data.formType === 'sponsorship') {
        if (!data.company || data.company.trim() === '') {
            errors.push('Company name is required');
        }
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

// ============================================================================
// POPUP FUNCTIONS
// ============================================================================

/**
 * Function to close the sponsorship popup
 */
function closePopup() {
    const popup = document.getElementById('popup');
    if (popup) {
        popup.style.display = 'none';
    }
}

// ============================================================================
// CREATOR SECTION FUNCTIONALITY
// ============================================================================

function initializeCreatorSection() {
    // Smooth scroll to creator section
    const creatorLinks = document.querySelectorAll('a[href*="#creator"]');
    creatorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            
            // Handle cross-page navigation
            if (href.includes('about.html#creator')) {
                // Navigate to about page first, then scroll to creator section
                window.location.href = 'about.html#creator';
                
                // Add a delay to ensure the page loads, then scroll to proper position
                setTimeout(() => {
                    const creatorSection = document.getElementById('creator');
                    if (creatorSection) {
                        // Calculate the position to show the creator section properly
                        const headerHeight = document.querySelector('header')?.offsetHeight || 80;
                        const sectionTop = creatorSection.offsetTop;
                        const windowHeight = window.innerHeight;
                        // Position to show the creator section with name visible
                        const scrollPosition = sectionTop - headerHeight - (windowHeight * 0.4);
                        
                        window.scrollTo({
                            top: scrollPosition,
                            behavior: 'smooth'
                        });
                    }
                }, 200);
                return;
            }
            
            // Handle same-page navigation
            const targetId = href.split('#')[1];
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Add highlight effect to creator section
                setTimeout(() => {
                    targetElement.classList.add('creator-highlight');
                    setTimeout(() => {
                        targetElement.classList.remove('creator-highlight');
                    }, 2000);
                }, 500);
            }
        });
    });

    // Creator support icon hover effects
    const creatorSupportLinks = document.querySelectorAll('.creator-support-link');
    creatorSupportLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // Social icon links hover effects
    const socialIconLinks = document.querySelectorAll('.social-icon-link');
    socialIconLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.1) rotate(5deg)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1) rotate(0deg)';
        });
    });

    // Add typing effect to creator title
    const creatorTitle = document.querySelector('.creator-title');
    if (creatorTitle) {
        const originalText = creatorTitle.textContent;
        creatorTitle.textContent = '';
        creatorTitle.style.opacity = '1';
        
        let i = 0;
        const typeWriter = () => {
            if (i < originalText.length) {
                creatorTitle.textContent += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        // Start typing effect when section comes into view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(typeWriter, 500);
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(creatorTitle);
    }

    // Add particle effect to creator section
    const creatorSection = document.querySelector('.creator-section');
    if (creatorSection) {
        createParticleEffect(creatorSection);
    }
}

function createParticleEffect(container) {
    const particleCount = 20;
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'creator-particle';
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: var(--primary-color);
            border-radius: 50%;
            opacity: 0.3;
            pointer-events: none;
            animation: particleFloat 6s ease-in-out infinite;
            animation-delay: ${i * 0.3}s;
        `;
        
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        container.appendChild(particle);
        particles.push(particle);
    }
}

// Add CSS for particle animation
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes particleFloat {
        0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.3;
        }
        25% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.6;
        }
        50% {
            transform: translateY(-40px) translateX(-5px);
            opacity: 0.8;
        }
        75% {
            transform: translateY(-20px) translateX(-10px);
            opacity: 0.6;
        }
    }
    
    .creator-highlight {
        animation: creatorSectionHighlight 2s ease-in-out;
    }
    
    @keyframes creatorSectionHighlight {
        0% {
            box-shadow: 0 0 0 0 rgba(255, 60, 56, 0.7);
        }
        70% {
            box-shadow: 0 0 0 20px rgba(255, 60, 56, 0);
        }
        100% {
            box-shadow: 0 0 0 0 rgba(255, 60, 56, 0);
        }
    }
`;
document.head.appendChild(particleStyle);

// ============================================================================
// GLOBAL EXPORTS
// ============================================================================

// Export functions for global use
window.FormHandler = {
    handleSponsorshipForm,
    handleContactForm,
    fileToBase64,
    showSuccessMessage,
    showErrorMessage,
    validateFormData,
    isValidEmail
};

window.closePopup = closePopup;
window.createModal = createModal; 
