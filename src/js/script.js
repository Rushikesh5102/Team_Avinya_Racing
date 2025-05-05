// Configuration
const CONFIG = {
  formEndpoint: 'https://script.google.com/macros/s/AKfycbzk6BvsFU55NlPvmT86bhpSBF0GISrkP5gBdQyBm9kfKkl3N1_7bU_TOPmtmUuuwD8/exec',
  cursorTrailEnabled: true, // Enable cursor trail
  maxTrailLength: 20,
  trailInterval: 5 // Create a new trail point every 5ms
};

// Initialize AOS with better performance settings
AOS.init({
  duration: 800,
  easing: 'ease-in-out',
  once: true,
  offset: 100,
  delay: 100
});

// Function to close the sponsorship popup
function closePopup() {
  const popup = document.getElementById('popup');
  if (popup) {
    popup.style.display = 'none';
  }
}

// Header scroll effect with throttling
let scrollTimeout;
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  }, 100);
});

// Back to top button with improved accessibility
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

// Loading animation with improved performance
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

// Form handling with improved validation and error handling
const sponsorForm = document.getElementById('sponsorForm');
if (sponsorForm) {
  sponsorForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Form validation
    const requiredFields = sponsorForm.querySelectorAll('[required]');
    let isValid = true;
    const errors = [];

    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        isValid = false;
        field.classList.add('error');
        errors.push(`${field.name} is required`);
      } else {
        field.classList.remove('error');
      }
    });

    // Phone number validation
    const phoneInput = sponsorForm.mobile.value.trim();
    const phoneRegex = /^\+91\d{10}$/;
    if (phoneInput && !phoneRegex.test(phoneInput)) {
      isValid = false;
      sponsorForm.mobile.classList.add('error');
      errors.push('Please enter a valid phone number in the format +91XXXXXXXXXX');
    }

    // Donation amount validation
    const amountInput = sponsorForm.amount.value.trim();
    if (amountInput && (!/^\d+$/.test(amountInput) || parseInt(amountInput) <= 0)) {
      isValid = false;
      sponsorForm.amount.classList.add('error');
      errors.push('Please enter a valid donation amount (numbers only, greater than 0)');
    }

    if (!isValid) {
      alert(errors.join('\n'));
      return;
    }

    // Prepare URL-encoded data
    const formData = new URLSearchParams(new FormData(sponsorForm)).toString();

    try {
      await fetch(CONFIG.formEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData
      });

      // Show success message
      const popup = document.getElementById('popup');
      if (popup) {
        popup.style.display = 'flex';
        popup.setAttribute('aria-hidden', 'false');
      }

      // Reset form
      sponsorForm.reset();
    } catch (error) {
      console.error('Form submission error:', error);
      alert('There was an error submitting the form. Please try again later.');
    }
  });
}

// Image gallery with improved accessibility
const galleryImages = document.querySelectorAll('.gallery img');
galleryImages.forEach(img => {
  img.setAttribute('role', 'button');
  img.setAttribute('tabindex', '0');
  
  img.addEventListener('click', () => createModal(img));
  img.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      createModal(img);
    }
  });
});

function createModal(img) {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-label', 'Image preview');
  
  modal.innerHTML = `
    <div class="modal-content">
      <button class="close" aria-label="Close modal">&times;</button>
      <img src="${img.src}" alt="${img.alt}">
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Close modal
  const closeBtn = modal.querySelector('.close');
  closeBtn.addEventListener('click', () => modal.remove());
  
  // Close on outside click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
  
  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modal.remove();
    }
  });
}

// Timeline interaction with improved accessibility
const timelineItems = document.querySelectorAll('.timeline li');
timelineItems.forEach(item => {
  item.setAttribute('role', 'button');
  item.setAttribute('tabindex', '0');
  
  item.addEventListener('click', () => item.classList.toggle('active'));
  item.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      item.classList.toggle('active');
    }
  });
});

// Department cards with improved accessibility
const departmentCards = document.querySelectorAll('.departments .card');
departmentCards.forEach(card => {
  card.setAttribute('role', 'button');
  card.setAttribute('tabindex', '0');
  
  card.addEventListener('click', () => {
    const description = card.querySelector('p');
    if (description) {
      const isHidden = description.style.display === 'none';
      description.style.display = isHidden ? 'block' : 'none';
      card.setAttribute('aria-expanded', isHidden);
    }
  });
  
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      card.click();
    }
  });
});

// Smooth scroll for navigation links
document.querySelectorAll('nav a').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');
    if (targetId.startsWith('#')) {
      e.preventDefault();
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    }
  });
});

// Add hover effect to option cards - only for sponsor page
const sponsorOptionCards = document.querySelectorAll('#sponsor .option-card');
sponsorOptionCards.forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.transform = 'scale(1.05) rotateX(2deg)';
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'scale(1) rotateX(0)';
  });
});

// Add CSS for modal
const modalStyle = document.createElement('style');
modalStyle.textContent = `
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal-content {
    position: relative;
    max-width: 90%;
    max-height: 90%;
  }
  
  .modal-content img {
    max-width: 100%;
    max-height: 80vh;
    object-fit: contain;
  }
  
  .close {
    position: absolute;
    top: -40px;
    right: 0;
    color: white;
    font-size: 30px;
    cursor: pointer;
  }
`;
document.head.appendChild(modalStyle);

// Cursor Trail Effect
if (CONFIG.cursorTrailEnabled) {
  const trails = [];
  let lastTrailTime = 0;

  document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastTrailTime >= CONFIG.trailInterval) {
      const trail = document.createElement('div');
      trail.className = 'cursor-trail';
      trail.style.left = e.clientX + 'px';
      trail.style.top = e.clientY + 'px';
      document.body.appendChild(trail);
      
      trails.push(trail);
      if (trails.length > CONFIG.maxTrailLength) {
        const oldTrail = trails.shift();
        oldTrail.remove();
      }
      
      // Fade out and remove trail
      setTimeout(() => {
        trail.style.opacity = '0';
        trail.style.transform = 'translate(-50%, -50%) scale(0.5)';
        setTimeout(() => {
          trail.remove();
          const index = trails.indexOf(trail);
          if (index > -1) {
            trails.splice(index, 1);
          }
        }, 300);
      }, 100);
      
      lastTrailTime = now;
    }
  });
} 