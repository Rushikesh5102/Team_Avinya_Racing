/* Sidebar Navigation System */
class SidebarManager {
  constructor() {
    this.isInitialized = false;
    this.sidebar = null;
    this.overlay = null;
    this.menuBtn = null;
    this.closeBtn = null;
    this.isOpen = false;
    this.resizeTimer = null;
  }

  init() {
    if (this.isInitialized) return;
    
    // Wait for DOM to be completely ready including all scripts
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        // Additional delay to ensure all elements are rendered
        setTimeout(() => {
          this.setupSidebar();
          this.handleHashNavigation();
        }, 100);
      });
    } else {
      // Document is already loaded, add small delay for rendering
      setTimeout(() => {
        this.setupSidebar();
        this.handleHashNavigation();
      }, 100);
    }
    
    this.isInitialized = true;
  }

  setupSidebar() {
    try {
      this.createSidebarElements();
      this.setupEventListeners();
      this.populateSidebarContent();
    } catch (error) {
      console.error('Sidebar setup failed:', error);
    }
  }

  createSidebarElements() {
    // Create sidebar overlay
    this.overlay = document.createElement('div');
    this.overlay.className = 'sidebar-overlay';
    this.overlay.setAttribute('aria-hidden', 'true');
    document.body.appendChild(this.overlay);

    // Create sidebar container
    this.sidebar = document.createElement('div');
    this.sidebar.className = 'sidebar';
    this.sidebar.setAttribute('role', 'navigation');
    this.sidebar.setAttribute('aria-label', 'Mobile navigation sidebar');
    this.sidebar.setAttribute('aria-hidden', 'true');
    
    // Create sidebar structure
    this.sidebar.innerHTML = `
      <div class="sidebar-header">
        <h2 class="sidebar-title">Menu</h2>
        <button class="sidebar-close" aria-label="Close sidebar" tabindex="0">
          ×
        </button>
      </div>
      
      <div class="sidebar-nav">
        <ul role="list">
          <!-- Navigation items will be populated here -->
        </ul>
      </div>
      
      <div class="sidebar-social">
        <h3>Connect With Us</h3>
        <div class="sidebar-social-links">
          <!-- Social links will be populated here -->
        </div>
      </div>
      
      <div class="sidebar-footer">
        <!-- Footer content will be populated here -->
      </div>
    `;

    document.body.appendChild(this.sidebar);

    // Get references to created elements
    this.closeBtn = this.sidebar.querySelector('.sidebar-close');
    this.menuBtn = document.querySelector('.mobile-menu-btn');
  }

  populateSidebarContent() {
    this.populateNavigation();
    this.populateSocialLinks();
    this.populateFooterContent();
  }

  populateNavigation() {
    const desktopNav = document.querySelector('.nav-menu ul');
    const sidebarNav = this.sidebar.querySelector('.sidebar-nav ul');
    
    if (desktopNav && sidebarNav) {
      // Clone navigation items
      const navItems = desktopNav.cloneNode(true);
      sidebarNav.innerHTML = navItems.innerHTML;
      
      // Add dropdown functionality for Gallery and About
      this.addGalleryDropdown(sidebarNav);
      this.addAboutDropdown(sidebarNav);
      
      // Add click handlers to close sidebar when navigating
      const sidebarNavLinks = sidebarNav.querySelectorAll('a');
      sidebarNavLinks.forEach(link => {
        link.addEventListener('click', () => {
          this.closeSidebar();
        });
      });
    }
  }

  addGalleryDropdown(sidebarNav) {
    // Find the Gallery link
    const galleryLink = sidebarNav.querySelector('a[href="gallery.html"]');
    
    if (galleryLink) {
      // Create dropdown container
      const dropdownContainer = document.createElement('div');
      dropdownContainer.className = 'sidebar-dropdown';
      
      // Create dropdown toggle button
      const dropdownToggle = document.createElement('button');
      dropdownToggle.className = 'sidebar-dropdown-toggle';
      dropdownToggle.innerHTML = `
        <span class="gallery-text">Gallery</span>
        <span class="dropdown-arrow">▼</span>
      `;
      dropdownToggle.setAttribute('aria-expanded', 'false');
      dropdownToggle.setAttribute('aria-controls', 'gallery-dropdown');
      
      // Create dropdown content
      const dropdownContent = document.createElement('div');
      dropdownContent.className = 'sidebar-dropdown-content';
      dropdownContent.id = 'gallery-dropdown';
      
      // Add quick navigation links
      const quickLinks = [
        { href: '#special-moments', icon: '🌟', text: 'Special Moments' },
        { href: '#manufacturing', icon: '🔧', text: 'Manufacturing' },
        { href: '#testing', icon: '🧪', text: 'Testing' },
        { href: '#inspection', icon: '🔍', text: 'Inspection' },
        { href: '#inauguration', icon: '🚗', text: 'Inauguration' },
        { href: '#competition', icon: '🏁', text: 'Competition' },
        { href: '#photos', icon: '📸', text: 'Photos' }
      ];
      
      quickLinks.forEach(link => {
        const linkElement = document.createElement('a');
        linkElement.href = link.href;
        linkElement.className = 'sidebar-dropdown-link';
        linkElement.innerHTML = `
          <span class="dropdown-link-icon">${link.icon}</span>
          <span class="dropdown-link-text">${link.text}</span>
        `;
        
        // Add click handler to close sidebar and scroll to section
        linkElement.addEventListener('click', (e) => {
          e.preventDefault();
          this.closeSidebar();
          
          // Check if we're on the correct page
          const currentPage = window.location.pathname.split('/').pop() || 'index.html';
          const targetPage = 'gallery.html';
          const targetSection = link.href.includes('#') ? link.href.split('#')[1] : null;
          
          if (currentPage !== targetPage) {
            // Navigate to the target page with section hash
            const targetUrl = targetPage + (targetSection ? '#' + targetSection : '');
            console.log('Navigating to:', targetUrl);
            window.location.href = targetUrl;
          } else {
            // We're on the correct page, scroll to section
            setTimeout(() => {
              const targetElement = document.querySelector(link.href);
              if (targetElement) {
                targetElement.scrollIntoView({ 
                  behavior: 'smooth', 
                  block: 'start' 
                });
              } else {
                console.warn(`Target section ${link.href} not found on current page`);
              }
            }, 300);
          }
        });
        
        dropdownContent.appendChild(linkElement);
      });
      
      // Add specific tap functionality
      dropdownToggle.addEventListener('click', (e) => {
        const rect = dropdownToggle.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const toggleWidth = rect.width;
        
        // If clicked on the left side (gallery text area), navigate to gallery
        if (clickX < toggleWidth * 0.8) {
          this.closeSidebar();
          // Navigate to gallery page or scroll to top if already on gallery
          if (window.location.pathname.includes('gallery.html')) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            window.location.href = 'gallery.html';
          }
        } else {
          // If clicked on the right side (arrow area), toggle dropdown
          const isExpanded = dropdownToggle.getAttribute('aria-expanded') === 'true';
          dropdownToggle.setAttribute('aria-expanded', !isExpanded);
          dropdownContent.style.display = isExpanded ? 'none' : 'block';
          dropdownToggle.querySelector('.dropdown-arrow').textContent = isExpanded ? '▼' : '▲';
        }
      });
      
      // Replace the original gallery link with dropdown
      dropdownContainer.appendChild(dropdownToggle);
      dropdownContainer.appendChild(dropdownContent);
      galleryLink.parentNode.replaceChild(dropdownContainer, galleryLink);
    }
  }

  addAboutDropdown(sidebarNav) {
    // Find the About link
    const aboutLink = sidebarNav.querySelector('a[href="about.html"]');
    
    if (aboutLink) {
      // Create dropdown container
      const dropdownContainer = document.createElement('div');
      dropdownContainer.className = 'sidebar-dropdown';
      
      // Create dropdown toggle button
      const dropdownToggle = document.createElement('button');
      dropdownToggle.className = 'sidebar-dropdown-toggle';
      dropdownToggle.innerHTML = `
        <span class="about-text">About</span>
        <span class="dropdown-arrow">▼</span>
      `;
      dropdownToggle.setAttribute('aria-expanded', 'false');
      dropdownToggle.setAttribute('aria-controls', 'about-dropdown');
      
      // Create dropdown content
      const dropdownContent = document.createElement('div');
      dropdownContent.className = 'sidebar-dropdown-content';
      dropdownContent.id = 'about-dropdown';
      
      // Add quick navigation links
      const quickLinks = [
        { href: '#who-we-are', icon: '👥', text: 'Who We Are' },
        { href: '#our-journey', icon: '🛤️', text: 'Our Journey' },
        { href: '#achievements', icon: '🏆', text: 'Achievements' },
        { href: '#departments', icon: '🔧', text: 'Departments' },
        { href: '#members-panel', icon: '👨‍💼', text: 'Members Panel' }
      ];
      
      quickLinks.forEach(link => {
        const linkElement = document.createElement('a');
        linkElement.href = link.href;
        linkElement.className = 'sidebar-dropdown-link';
        linkElement.innerHTML = `
          <span class="dropdown-link-icon">${link.icon}</span>
          <span class="dropdown-link-text">${link.text}</span>
        `;
        
        // Add click handler to close sidebar and scroll to section
        linkElement.addEventListener('click', (e) => {
          e.preventDefault();
          this.closeSidebar();
          
          // Check if we're on the correct page
          const currentPage = window.location.pathname.split('/').pop() || 'index.html';
          const targetPage = 'about.html';
          const targetSection = link.href.includes('#') ? link.href.split('#')[1] : null;
          
          if (currentPage !== targetPage) {
            // Navigate to the target page with section hash
            const targetUrl = targetPage + (targetSection ? '#' + targetSection : '');
            console.log('Navigating to:', targetUrl);
            window.location.href = targetUrl;
          } else {
            // We're on the correct page, scroll to section
            setTimeout(() => {
              const targetElement = document.querySelector(link.href);
              if (targetElement) {
                targetElement.scrollIntoView({ 
                  behavior: 'smooth', 
                  block: 'start' 
                });
              } else {
                console.warn(`Target section ${link.href} not found on current page`);
              }
            }, 300);
          }
        });
        
        dropdownContent.appendChild(linkElement);
      });
      
      // Add specific tap functionality
      dropdownToggle.addEventListener('click', (e) => {
        const rect = dropdownToggle.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const toggleWidth = rect.width;
        
        // If clicked on the left side (about text area), navigate to about
        if (clickX < toggleWidth * 0.8) {
          this.closeSidebar();
          // Navigate to about page or scroll to top if already on about
          if (window.location.pathname.includes('about.html')) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            window.location.href = 'about.html';
          }
        } else {
          // If clicked on the right side (arrow area), toggle dropdown
          const isExpanded = dropdownToggle.getAttribute('aria-expanded') === 'true';
          dropdownToggle.setAttribute('aria-expanded', !isExpanded);
          dropdownContent.style.display = isExpanded ? 'none' : 'block';
          dropdownToggle.querySelector('.dropdown-arrow').textContent = isExpanded ? '▼' : '▲';
        }
      });
      
      // Replace the original about link with dropdown
      dropdownContainer.appendChild(dropdownToggle);
      dropdownContainer.appendChild(dropdownContent);
      aboutLink.parentNode.replaceChild(dropdownContainer, aboutLink);
    }
  }

  populateSocialLinks() {
    const desktopSocial = document.querySelector('.social-links');
    const sidebarSocial = this.sidebar.querySelector('.sidebar-social-links');
    
    if (desktopSocial && sidebarSocial) {
      // Clone social links
      const socialLinks = Array.from(desktopSocial.children);
      
      // Create container for regular social icons (non-support)
      const socialIconsRow = document.createElement('div');
      socialIconsRow.className = 'social-icons-row';
      
      let creatorSupportIcon = null;
      
      socialLinks.forEach(link => {
        const clonedLink = link.cloneNode(true);
        
        // Handle tooltip based on link type
        const tooltip = clonedLink.querySelector('.tooltip');
        if (tooltip) {
          // For creator support icon, convert tooltip to always-visible text
          if (clonedLink.classList.contains('support')) {
            // Create a always-visible text element
            const supportText = document.createElement('span');
            supportText.className = 'sidebar-support-text';
            supportText.innerHTML = tooltip.innerHTML; // Preserve the HTML content including <br>
            tooltip.remove(); // Remove the original tooltip
            clonedLink.appendChild(supportText);
            creatorSupportIcon = clonedLink; // Store for later
          } else {
            // For other icons, remove tooltip and add to row
            tooltip.remove();
            socialIconsRow.appendChild(clonedLink);
          }
        } else {
          // No tooltip, add to regular row
          socialIconsRow.appendChild(clonedLink);
        }
      });
      
      // Add the row of regular social icons first
      sidebarSocial.appendChild(socialIconsRow);
      
      // Add creator support icon at the bottom (full width)
      if (creatorSupportIcon) {
        sidebarSocial.appendChild(creatorSupportIcon);
      }
    }
  }

  populateFooterContent() {
    const footer = document.querySelector('footer');
    const sidebarFooter = this.sidebar.querySelector('.sidebar-footer');
    
    if (footer && sidebarFooter) {
      // Clone footer content
      const footerContent = Array.from(footer.children);
      
      footerContent.forEach(element => {
        const clonedElement = element.cloneNode(true);
        sidebarFooter.appendChild(clonedElement);
      });
    }
  }

  setupEventListeners() {
    // Menu button click
    if (this.menuBtn) {
      this.menuBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.toggleSidebar();
      });
    } else {
      console.error('Menu button not found for event listener');
    }

    // Close button click
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.closeSidebar();
      });
    } else {
      console.error('Close button not found for event listener');
    }

    // Overlay click
    this.overlay.addEventListener('click', () => {
      this.closeSidebar();
    });

    // Keyboard events
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.closeSidebar();
      }
    });

    // Prevent sidebar click from closing
    this.sidebar.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    // Handle window resize
    window.addEventListener('resize', () => {
      clearTimeout(this.resizeTimer);
      this.resizeTimer = setTimeout(() => {
        this.handleResize();
      }, 250);
    });

    // Handle orientation change
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        this.handleResize();
      }, 500);
    });
  }

  toggleSidebar() {
    if (this.isOpen) {
      this.closeSidebar();
    } else {
      this.openSidebar();
    }
  }

  openSidebar() {
    if (this.isOpen) return;

    this.isOpen = true;
    
    // Update ARIA attributes
    this.sidebar.setAttribute('aria-hidden', 'false');
    this.overlay.setAttribute('aria-hidden', 'false');
    if (this.menuBtn) {
      this.menuBtn.setAttribute('aria-expanded', 'true');
      this.menuBtn.classList.add('active');
    }

    // Add active classes
    this.sidebar.classList.add('active');
    this.overlay.classList.add('active');
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Focus management
    this.closeBtn.focus();
    
    // Trap focus within sidebar
    this.trapFocus();
  }

  closeSidebar() {
    if (!this.isOpen) return;

    this.isOpen = false;
    
    // Update ARIA attributes
    this.sidebar.setAttribute('aria-hidden', 'true');
    this.overlay.setAttribute('aria-hidden', 'true');
    if (this.menuBtn) {
      this.menuBtn.setAttribute('aria-expanded', 'false');
      this.menuBtn.classList.remove('active');
    }

    // Remove active classes
    this.sidebar.classList.remove('active');
    this.overlay.classList.remove('active');
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    // Return focus to menu button
    if (this.menuBtn) {
      this.menuBtn.focus();
    }
    
    // Remove focus trap
    this.removeFocusTrap();
  }

  trapFocus() {
    const focusableElements = this.sidebar.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    this.focusTrapHandler = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', this.focusTrapHandler);
  }

  removeFocusTrap() {
    if (this.focusTrapHandler) {
      document.removeEventListener('keydown', this.focusTrapHandler);
      this.focusTrapHandler = null;
    }
  }

  handleResize() {
    // Close sidebar on resize to desktop
    if (window.innerWidth > 900 && this.isOpen) {
      this.closeSidebar();
    }
    
    // Update sidebar content if structure changed
    this.updateSidebarContent();
  }

  updateSidebarContent() {
    // Re-populate content in case the main content has changed
    const navContainer = this.sidebar.querySelector('.sidebar-nav ul');
    const socialContainer = this.sidebar.querySelector('.sidebar-social-links');
    const footerContainer = this.sidebar.querySelector('.sidebar-footer');
    
    if (navContainer) navContainer.innerHTML = '';
    if (socialContainer) socialContainer.innerHTML = '';
    if (footerContainer) {
      // Keep the h3 title, clear the rest
      const existingContent = footerContainer.querySelectorAll(':not(h3)');
      existingContent.forEach(el => el.remove());
    }
    
    this.populateSidebarContent();
  }

  handleHashNavigation() {
    // Check if there's a hash in the URL
    if (window.location.hash) {
      const hash = window.location.hash;
      
      // Wait a bit for the page to fully load
      setTimeout(() => {
        const targetElement = document.querySelector(hash);
        if (targetElement) {
          // Scroll to the element with smooth behavior
          targetElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
          
          // Add a subtle highlight effect
          targetElement.style.transition = 'background-color 0.3s ease';
          targetElement.style.backgroundColor = 'rgba(255, 60, 56, 0.1)';
          setTimeout(() => {
            targetElement.style.backgroundColor = '';
          }, 2000);
        } else {
          // If element not found, try scrolling to top
          console.warn(`Target element ${hash} not found on this page`);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 500);
    }
  }

  // Public methods for external control
  static getInstance() {
    if (!window.sidebarManager) {
      window.sidebarManager = new SidebarManager();
      window.sidebarManager.init(); // Initialize here instead
    }
    return window.sidebarManager;
  }

  // Debug method to check sidebar status
  debug() {
    console.log('Sidebar Debug Info:');
    console.log('- Is initialized:', this.isInitialized);
    console.log('- Is open:', this.isOpen);
    console.log('- Current page:', window.location.pathname);
    console.log('- Current hash:', window.location.hash);
    console.log('- Sidebar element:', this.sidebar);
    console.log('- Menu button:', this.menuBtn);
  }

  destroy() {
    if (this.sidebar) {
      this.sidebar.remove();
    }
    if (this.overlay) {
      this.overlay.remove();
    }
    
    this.removeFocusTrap();
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    // Clean up references
    this.sidebar = null;
    this.overlay = null;
    this.menuBtn = null;
    this.closeBtn = null;
    this.isOpen = false;
    this.isInitialized = false;
    
    window.sidebarManager = null;
  }
}

// Auto-initialize when script loads
document.addEventListener('DOMContentLoaded', () => {
  SidebarManager.getInstance();
});

// Export for external use
window.SidebarManager = SidebarManager;
