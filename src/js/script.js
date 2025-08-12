/* Team Avinya Website - Optimized JavaScript */
const CONFIG = {
    scriptURL: 'https://script.google.com/macros/s/AKfycbye0m-3szwSl82lU3UCdHGGu-aHw6MtSpCu9IUPKOAdlBPXMVW2AUJ3h-R2ZvfymbPyww/exec',
    cursorTrailEnabled: true,
    maxTrailLength: 12,
    trailInterval: 8,
    trailFadeTime: 400,
    aosDuration: 800,
    aosEasing: 'ease-in-out',
    aosOnce: true,
    aosOffset: 100,
    aosDelay: 100
};

/* Navbar Scroll Effects */
function initializeNavbarScrollEffect() {
    const header = document.querySelector('header');
    if (!header) return;
    
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                header.classList.toggle('scrolled', window.scrollY > 50);
                ticking = false;
            });
            ticking = true;
        }
    });
}

/* Headline Animation */
function animateHeadline() {
    const headlines = document.querySelectorAll('.headline-line');
    if (headlines.length === 0) return;
    
    headlines.forEach((line, index) => {
        setTimeout(() => {
            line.classList.add('animate-in');
            line.querySelectorAll('.highlight-word').forEach((highlight, highlightIndex) => {
                setTimeout(() => highlight.classList.add('animate-in'), 300 + (highlightIndex * 200));
            });
        }, index * 800);
    });
}



/* Initialization */
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
    initializeNavbarScrollEffect();
    
    // Start headline animation after a brief delay
    setTimeout(animateHeadline, 500);
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
        
        // Normalize website URL if provided
        if (data.website && data.website.trim() !== '') {
            data.website = normalizeWebsite(data.website);
        }
        
        // Validate form data
        const validation = validateFormData(data);
        if (!validation.isValid) {
            showErrorMessage(validation.errors.join('\n'));
            return;
        }
        
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
    
    videos.forEach((video) => {
        // Check if video is in Special Moments section
        const isSpecialMoments = video.closest('#special-moments') !== null;
        
        // Set initial volume and mute settings
        video.addEventListener('loadedmetadata', function() {
            if (isSpecialMoments) {
                // Special Moments videos: 50% volume, not muted
                if (this.volume === 0) {
                    this.volume = 0.5;
                }
                this.muted = false;
            } else {
                // All other videos: muted by default
                this.muted = true;
                this.volume = 0;
            }
        });
        
        // Handle play event - show all controls
        video.addEventListener('play', function() {
            this.classList.add('playing');
            this.closest('.media-card').classList.add('playing');
        });
        
        // Handle pause event - hide controls, show play button
        video.addEventListener('pause', function() {
            this.classList.remove('playing');
            this.closest('.media-card').classList.remove('playing');
        });
        
        // Handle ended event - hide controls, show play button
        video.addEventListener('ended', function() {
            this.classList.remove('playing');
            this.closest('.media-card').classList.remove('playing');
        });
        
        // Add click handler for custom play button
        const mediaCard = video.closest('.media-card');
        mediaCard.addEventListener('click', function(e) {
            // Only trigger if clicking on the card itself (not on video controls)
            if (e.target === this || e.target.classList.contains('media-card')) {
                if (video.paused) {
                    video.play();
                } else {
                    video.pause();
                }
            }
        });
        
        // Prevent unmuting for non-Special Moments videos
        if (!isSpecialMoments) {
            video.addEventListener('volumechange', function() {
                if (!this.muted) {
                    this.muted = true;
                }
            });
            
            // Prevent unmuting via controls
            video.addEventListener('loadedmetadata', function() {
                this.muted = true;
            });
        }
        
        // Handle video errors silently
        video.addEventListener('error', function(e) {
            console.error('Video error for', this.src, ':', e);
        });
    });
    
    // Initialize fullscreen support
    initializeFullscreenSupport();
}



// Fullscreen functionality
function initializeFullscreenSupport() {
    const videos = document.querySelectorAll('video');
    
    videos.forEach(video => {
        // Add double-click event for fullscreen
        video.addEventListener('dblclick', function() {
            toggleFullscreen(this);
        });
        
        // Add keyboard support for fullscreen
        video.addEventListener('keydown', function(e) {
            if (e.key === 'f' || e.key === 'F') {
                e.preventDefault();
                toggleFullscreen(this);
            }
        });
        

    });
}

// Toggle fullscreen function
function toggleFullscreen(element) {
    if (!document.fullscreenElement && 
        !document.webkitFullscreenElement && 
        !document.mozFullScreenElement) {
        // Enter fullscreen
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    } else {
        // Exit fullscreen
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
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
    (function forceFixBackToTop(){
        const ID = 'back-to-top-btn';
        const btn = document.getElementById(ID);
        if(!btn){ console.warn('[rushi] No #' + ID + ' found'); return; }
        console.group('[rushi] forceFixBackToTop');

        // 1) Move to body (try)
        try {
            document.body.appendChild(btn);
            console.log('Moved button to document.body');
        } catch (e) {
            console.warn('Could not append to body:', e);
        }

        // 2) small helper to detect problematic styles
        function isProblem(el){
            if(!el || el.nodeType !== 1) return false;
            const cs = getComputedStyle(el);
            return (cs.transform && cs.transform !== 'none') ||
                   (cs.filter && cs.filter !== 'none') ||
                   (cs.perspective && cs.perspective !== 'none') ||
                   (cs.willChange && cs.willChange !== 'auto') ||
                   (/hidden|clip/.test(cs.overflow));
        }

        // 3) gather problematic ancestors (from body up)
        let problems = [];
        let cursor = btn.parentElement;
        while(cursor){
            if(isProblem(cursor)) problems.push(cursor);
            cursor = cursor.parentElement;
        }
        if(problems.length) {
            console.warn('[rushi] Found problematic ancestors:', problems);
        } else {
            console.log('[rushi] No problematic ancestors found');
        }

        // 4) create top-level portal if not exists
        let portal = document.getElementById('rushi-backtop-portal');
        if(!portal){
            portal = document.createElement('div');
            portal.id = 'rushi-backtop-portal';
            // minimal inline safe styles
            Object.assign(portal.style, {
                position: 'fixed',
                bottom: '30px',
                right: '30px',
                zIndex: '2147483647',
                pointerEvents: 'none',
                display: 'block'
            });
            document.documentElement.appendChild(portal);
            console.log('Portal created and appended to document.documentElement');
        } else {
            // ensure it's top-level
            try { document.documentElement.appendChild(portal); } catch(e){}
        }

        // 5) move button into portal and enable pointer events on button
        portal.appendChild(btn);
        btn.style.pointerEvents = 'auto';
        btn.style.position = 'fixed';
        btn.style.bottom = '30px';
        btn.style.right = '30px';
        btn.style.zIndex = '2147483647';
        btn.classList.remove('stuck'); // cleanup if you used that
        console.log('Button moved into portal and style applied');

        // 6) add override CSS (id-based, appended once)
        if(!document.getElementById('rushi-backtop-override-css')){
            const style = document.createElement('style');
            style.id = 'rushi-backtop-override-css';
            style.innerHTML = `
                #rushi-backtop-portal { position: fixed !important; bottom: 30px !important; right: 30px !important; z-index: 2147483647 !important; pointer-events: none !important; }
                #rushi-backtop-portal > * { pointer-events: auto !important; }
                #${ID} { position: fixed !important; bottom: 30px !important; right: 30px !important; z-index: 2147483647 !important; pointer-events: auto !important; }
                @media (max-width: 768px){ #rushi-backtop-portal, #${ID} { bottom: 20px !important; right: 20px !important; } }
                @media (max-width: 480px){ #rushi-backtop-portal, #${ID} { bottom: 15px !important; right: 15px !important; } }
                .rushi-backtop-temp-override { transform: none !important; filter: none !important; perspective: none !important; will-change: auto !important; overflow: visible !important; }
            `;
            document.head.appendChild(style);
            console.log('Injected override CSS');
        }

        // 7) If problematic ancestors found, add temporary class to them (logged) so we can revert
        const altered = [];
        problems.forEach(el=>{
            if(!el.classList.contains('rushi-backtop-temp-override')){
                el.classList.add('rushi-backtop-temp-override');
                altered.push(el);
                el.setAttribute('data-rushi-backtop-original', 'applied'); // marker only
            }
        });
        if(altered.length) console.warn('[rushi] Temporarily overrode', altered.length, 'ancestors. This may change layout. Revert below.');

        // 8) find actual scroll container
        function findScrollContainer(){
            // prefer scrollingElement
            try {
                const se = document.scrollingElement || document.documentElement;
                if(se.scrollHeight > se.clientHeight) return window;
            } catch(e){}
            // check common selectors
            const candidates = ['main','#main','.main','.site-main','.content','.scroll-container'];
            for(const sel of candidates){
                const el = document.querySelector(sel);
                if(el){
                    const cs = getComputedStyle(el);
                    if((cs.overflowY === 'auto' || cs.overflowY === 'scroll') && el.scrollHeight > el.clientHeight) return el;
                }
            }
            // fallback: search for any scrollable element
            const all = document.querySelectorAll('*');
            for(const el of all){
                const cs = getComputedStyle(el);
                if((cs.overflowY === 'auto' || cs.overflowY === 'scroll') && el.scrollHeight > el.clientHeight){
                    return el;
                }
            }
            return window;
        }

        const scrollContainer = findScrollContainer();
        console.log('[rushi] Scroll container ->', (scrollContainer === window) ? 'window' : scrollContainer);

        // 9) attach show/hide and click handlers for the detected container
        function handleScroll(){
            const y = (scrollContainer === window) ? window.scrollY : scrollContainer.scrollTop;
            if(y > 10) btn.classList.add('visible');
            else btn.classList.remove('visible');
        }
        if(scrollContainer === window) window.addEventListener('scroll', handleScroll, {passive:true});
        else scrollContainer.addEventListener('scroll', handleScroll, {passive:true});
        handleScroll();

        btn.addEventListener('click', function(e){
            e.preventDefault();
            if(scrollContainer === window) window.scrollTo({top:0, behavior:'smooth'});
            else scrollContainer.scrollTo({top:0, behavior:'smooth'});
        });

        // 10) provide revert helper on window so you can undo overrides in console:
        window.__rushiBackToTopRevert = function(){
            try{
                // remove temp class
                document.querySelectorAll('.rushi-backtop-temp-override').forEach(el=>{
                    el.classList.remove('rushi-backtop-temp-override');
                    el.removeAttribute('data-rushi-backtop-original');
                });
                // remove injected style
                const s = document.getElementById('rushi-backtop-override-css');
                if(s) s.remove();
                // move button back to body end (optional)
                const portalEl = document.getElementById('rushi-backtop-portal');
                if(portalEl && portalEl.contains(btn)){
                    document.body.appendChild(btn);
                    portalEl.remove();
                }
                console.log('[rushi] Reverted temporary overrides.');
            }catch(er){ console.error(er); }
        };

        console.log('[rushi] Done. To revert temporary overrides run: window.__rushiBackToTopRevert()');
        console.groupEnd();
    })();
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

function isValidWebsite(website) {
    if (!website || website.trim() === '') {
        return true; // Empty is valid (optional field)
    }
    
    // Remove leading/trailing whitespace
    const cleanWebsite = website.trim();
    
    // Very flexible validation that accepts:
    // - Any protocol: http://, https://, ftp://, etc.
    // - Any domain format: example.com, www.example.com, sub.example.com
    // - IP addresses: 192.168.1.1
    // - Localhost: localhost, 127.0.0.1
    // - Port numbers: example.com:8080
    // - Paths: example.com/path
    // - Query parameters: example.com?param=value
    // - Fragments: example.com#section
    // - Special characters in domain names
    // - International domains (IDN)
    // - Any valid URL format
    
    // Basic URL pattern that accepts almost anything that looks like a URL
    const urlPattern = /^[a-zA-Z0-9+.-]+:\/\/[^\s]+$/;
    
    // Domain pattern for URLs without protocol
    const domainPattern = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;
    
    // IP address pattern
    const ipPattern = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    
    // Localhost pattern
    const localhostPattern = /^localhost(:\d+)?$/;
    
    // Check if it's a valid URL with protocol
    if (urlPattern.test(cleanWebsite)) {
        return true;
    }
    
    // Check if it's a valid domain
    if (domainPattern.test(cleanWebsite)) {
        return true;
    }
    
    // Check if it's an IP address
    if (ipPattern.test(cleanWebsite)) {
        return true;
    }
    
    // Check if it's localhost
    if (localhostPattern.test(cleanWebsite)) {
        return true;
    }
    
    // Additional checks for various URL formats
    const additionalPatterns = [
        // URLs with paths, queries, fragments
        /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}(\/[^\s]*)?(\?[^\s]*)?(#[^\s]*)?$/,
        // IP addresses with paths
        /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(:\d+)?(\/[^\s]*)?(\?[^\s]*)?(#[^\s]*)?$/,
        // Very permissive pattern for any string that might be a URL
        /^[^\s]+$/
    ];
    
    for (const pattern of additionalPatterns) {
        if (pattern.test(cleanWebsite)) {
            return true;
        }
    }
    
    // If all else fails, accept any non-empty string that doesn't contain only whitespace
    return cleanWebsite.length > 0 && !/^\s+$/.test(cleanWebsite);
}

function normalizeWebsite(website) {
    if (!website || website.trim() === '') {
        return '';
    }
    
    let normalized = website.trim();
    
    // If it already has a protocol, return as is
    if (normalized.match(/^[a-zA-Z0-9+.-]+:\/\//)) {
        return normalized;
    }
    
    // If it's an IP address, add https://
    if (normalized.match(/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/)) {
        return 'https://' + normalized;
    }
    
    // If it's localhost, add https://
    if (normalized.match(/^localhost(:\d+)?$/)) {
        return 'https://' + normalized;
    }
    
    // For domain names, add https:// if no protocol is present
    if (!normalized.match(/^https?:\/\//)) {
        normalized = 'https://' + normalized;
    }
    
    return normalized;
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
        
        // Website validation (optional field) - now accepts all types of URLs
        if (data.website && data.website.trim() !== '') {
            if (!isValidWebsite(data.website)) {
                errors.push('Please enter a valid website URL. We accept any type of URL including domains, IP addresses, localhost, and URLs with paths or parameters.');
            }
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

// ============================================================================
// GOOGLE ANALYTICS ENHANCED TRACKING
// ============================================================================

// Enhanced tracking for user interactions
document.addEventListener('DOMContentLoaded', function() {
  
  // Track form submissions
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', function() {
      const formType = this.querySelector('input[name="formType"]')?.value || 'contact';
      if (typeof gtag !== 'undefined') {
        gtag('event', 'form_submit', {
          'event_category': 'engagement',
          'event_label': formType + '_form',
          'value': 1
        });
      }
    });
  });
  
  // Track button clicks
  const buttons = document.querySelectorAll('.btn, .hero-sponsor-btn, .hero-watch-btn');
  buttons.forEach(button => {
    button.addEventListener('click', function() {
      const buttonText = this.textContent.trim();
      if (typeof gtag !== 'undefined') {
        gtag('event', 'button_click', {
          'event_category': 'engagement',
          'event_label': buttonText,
          'value': 1
        });
      }
    });
  });
  
  // Track external link clicks
  const externalLinks = document.querySelectorAll('a[target="_blank"]');
  externalLinks.forEach(link => {
    link.addEventListener('click', function() {
      if (typeof gtag !== 'undefined') {
        gtag('event', 'external_link_click', {
          'event_category': 'engagement',
          'event_label': this.href,
          'value': 1
        });
      }
    });
  });
  
  // Track file downloads
  const downloads = document.querySelectorAll('a[download], a[href*=".pdf"]');
  downloads.forEach(download => {
    download.addEventListener('click', function() {
      const fileName = this.href.split('/').pop();
      if (typeof gtag !== 'undefined') {
        gtag('event', 'file_download', {
          'event_category': 'engagement',
          'event_label': fileName,
          'value': 1
        });
      }
    });
  });
  
  // Track scroll depth
  let maxScroll = 0;
  window.addEventListener('scroll', function() {
    const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
    if (scrollPercent > maxScroll && scrollPercent % 25 === 0) {
      maxScroll = scrollPercent;
      if (typeof gtag !== 'undefined') {
        gtag('event', 'scroll_depth', {
          'event_category': 'engagement',
          'event_label': scrollPercent + '%',
          'value': scrollPercent
        });
      }
    }
  });
  
  // Track section views for single page navigation
  const navLinks = document.querySelectorAll('nav a[href^="#"]');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      const section = this.getAttribute('href').substring(1);
      if (typeof gtag !== 'undefined') {
        gtag('event', 'section_view', {
          'event_category': 'navigation',
          'event_label': section,
          'value': 1
        });
      }
    });
  });
  
  // Track time on page
  let startTime = Date.now();
  window.addEventListener('beforeunload', function() {
    const timeOnPage = Math.round((Date.now() - startTime) / 1000);
    if (typeof gtag !== 'undefined' && timeOnPage > 10) {
      gtag('event', 'time_on_page', {
        'event_category': 'engagement',
        'event_label': 'seconds',
        'value': timeOnPage
      });
    }
  });
}); 
