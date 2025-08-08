/**
 * Mobile Navigation JavaScript
 * Handles mobile menu functionality for Team Avinya website
 * Updated for checkbox-based navigation system
 */

document.addEventListener('DOMContentLoaded', function() {
    initializeMobileNavigation();
});

function initializeMobileNavigation() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    console.log('Mobile Navigation Initializing...');
    console.log('Mobile Menu Button:', mobileMenuBtn);
    console.log('Nav Menu:', navMenu);
    console.log('Nav Links:', navLinks.length);
    
    if (!mobileMenuBtn || !navMenu) {
        console.log('Mobile navigation elements not found');
        return;
    }
    
    console.log('Mobile navigation initialized successfully');
    
    // Create mobile menu overlay
    const overlay = document.createElement('div');
    overlay.className = 'mobile-menu-overlay';
    document.body.appendChild(overlay);
    
    // Create mobile social links container
    const mobileSocialLinks = document.createElement('div');
    mobileSocialLinks.className = 'mobile-social-links';
    
    // Clone social links for mobile menu
    const socialLinks = document.querySelector('.social-links');
    if (socialLinks) {
        const socialIcons = socialLinks.querySelectorAll('.social-icon');
        socialIcons.forEach(icon => {
            const clonedIcon = icon.cloneNode(true);
            mobileSocialLinks.appendChild(clonedIcon);
        });
    }
    
    // Add mobile social links to nav menu
    navMenu.appendChild(mobileSocialLinks);
    
    // Toggle mobile menu
    mobileMenuBtn.addEventListener('click', function() {
        console.log('Mobile menu button clicked');
        mobileMenuBtn.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
        console.log('Menu active:', navMenu.classList.contains('active'));
    });
    
    // Close menu when clicking overlay
    overlay.addEventListener('click', function() {
        mobileMenuBtn.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
    });
    
    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenuBtn.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            mobileMenuBtn.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
    
    // Handle escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            mobileMenuBtn.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            mobileMenuBtn.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
}

// Touch device optimizations
function initializeTouchOptimizations() {
    // Add touch feedback for interactive elements
    const touchElements = document.querySelectorAll('.btn, .option-card, .team-card, .media-card, .event-card, .supporter-card');
    
    touchElements.forEach(element => {
        element.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        });
        
        element.addEventListener('touchend', function() {
            this.style.transform = '';
        });
    });
}

// Initialize touch optimizations
document.addEventListener('DOMContentLoaded', function() {
    initializeTouchOptimizations();
});
