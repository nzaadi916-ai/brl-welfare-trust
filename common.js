// Common JS utility file for BRL Welfare Trust Website
// Implements: 3D Tilt Card Effects, Responsive Hamburger Drawers, Scroll Reveal, Hero Slider, Support Calculator, and Lightbox Gallery.

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initScrollReveals();
  init3DTilt();
  initHeroSlider();
  initSupportWidget();
  initLightboxGallery();
});

// 1. Mobile Menu Navigation Drawer
function initMobileNav() {
  const burger = document.querySelector('.menu-toggle');
  if (!burger) return;
  
  // Create overlay and drawer if they don't exist
  let overlay = document.querySelector('.mobile-nav-overlay');
  let drawer = document.querySelector('.mobile-nav-drawer');
  
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'mobile-nav-overlay';
    document.body.appendChild(overlay);
  }
  
  if (!drawer) {
    drawer = document.createElement('div');
    drawer.className = 'mobile-nav-drawer';
    
    // Copy nav links into drawer
    const navLinks = document.querySelector('.nav-links');
    const linksHTML = navLinks ? navLinks.innerHTML : '';
    
    drawer.innerHTML = `
      <div class="mobile-drawer-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:30px;">
        <span style="font-family: var(--font-headings); font-weight: 800; color: var(--color-primary); font-size:18px; letter-spacing: 0.05em;">MENU</span>
        <button class="mobile-drawer-close" style="background:none; border:none; cursor:pointer; font-size:32px; color:var(--color-text-primary); padding:8px 12px; line-height:1; display:flex; align-items:center; justify-content:center;" aria-label="Close menu">&times;</button>
      </div>
      <ul class="mobile-drawer-links">
        ${linksHTML}
      </ul>
    `;
    document.body.appendChild(drawer);
  }
  
  const closeBtn = drawer.querySelector('.mobile-drawer-close');
  
  function toggleDrawer() {
    drawer.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = drawer.classList.contains('active') ? 'hidden' : '';
  }
  
  burger.addEventListener('click', toggleDrawer);
  closeBtn.addEventListener('click', toggleDrawer);
  overlay.addEventListener('click', toggleDrawer);
}

// 2. Scroll Reveal Animations (using IntersectionObserver)
function initScrollReveals() {
  const scrollElements = document.querySelectorAll('.scroll-reveal');
  if (scrollElements.length === 0) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
        observer.unobserve(entry.target); // Reveal once
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });
  
  scrollElements.forEach(el => observer.observe(el));
}

// 3. 3D Tilt Card Effects
function init3DTilt() {
  // Disable 3D tilt effects on touch screen devices to prevent jerky scrolling
  if (window.matchMedia("(pointer: coarse)").matches) return;
  
  const cards = document.querySelectorAll('.tilt-card');
  if (cards.length === 0) return;
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within card
      const y = e.clientY - rect.top;  // y position within card
      
      const width = rect.width;
      const height = rect.height;
      
      // Calculate tilt angles (-10 to +10 degrees)
      const tiltX = ((y / height) - 0.5) * -16;
      const tiltY = ((x / width) - 0.5) * 16;
      
      card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

// 4. Hero Slider Rotation
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  if (slides.length === 0) return;
  
  let currentSlide = 0;
  const slideInterval = 6000; // 6 seconds per slide
  
  const prevBtn = document.querySelector('.hero-arrow-prev');
  const nextBtn = document.querySelector('.hero-arrow-next');
  const indicatorsContainer = document.querySelector('.hero-indicators');
  
  // Set up indicators if container exists
  if (indicatorsContainer) {
    indicatorsContainer.innerHTML = '';
    slides.forEach((_, idx) => {
      const btn = document.createElement('button');
      btn.setAttribute('aria-label', `Go to slide ${idx + 1}`);
      btn.className = `hero-indicator-dot ${idx === 0 ? 'active' : ''}`;
      btn.style.cssText = `
        height: 6px; 
        border-radius: 99px; 
        transition: all 0.3s; 
        cursor: pointer;
        border: none;
        outline: none;
      `;
      updateIndicatorStyle(btn, idx === 0);
      btn.addEventListener('click', () => goToSlide(idx));
      indicatorsContainer.appendChild(btn);
    });
  }
  
  function updateIndicatorStyle(dot, isActive) {
    if (isActive) {
      dot.style.width = '32px';
      dot.style.backgroundColor = 'var(--color-primary-light)';
    } else {
      dot.style.width = '6px';
      dot.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
    }
  }
  
  function updateIndicators() {
    if (!indicatorsContainer) return;
    const dots = indicatorsContainer.querySelectorAll('button');
    dots.forEach((dot, idx) => {
      updateIndicatorStyle(dot, idx === currentSlide);
    });
  }
  
  function goToSlide(n) {
    slides[currentSlide].classList.remove('active');
    currentSlide = (n + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    updateIndicators();
  }
  
  function nextSlide() {
    goToSlide(currentSlide + 1);
  }
  
  function prevSlide() {
    goToSlide(currentSlide - 1);
  }
  
  let timer = setInterval(nextSlide, slideInterval);
  
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      clearInterval(timer);
      prevSlide();
      timer = setInterval(nextSlide, slideInterval);
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      clearInterval(timer);
      nextSlide();
      timer = setInterval(nextSlide, slideInterval);
    });
  }
}

// 5. Support Calculator widget
function initSupportWidget() {
  const slider = document.getElementById('children-slider');
  if (!slider) return;
  
  const countDisplay = document.getElementById('children-count');
  const costDisplay = document.getElementById('children-cost');
  
  const COST_PER_CHILD_YEAR = 4200; // Rs 4,200/year support cost
  
  function updateWidget() {
    const val = parseInt(slider.value, 10);
    countDisplay.textContent = val;
    
    const formattedCost = (val * COST_PER_CHILD_YEAR).toLocaleString('en-IN');
    costDisplay.textContent = `Rs ${formattedCost} / year`;
  }
  
  slider.addEventListener('input', updateWidget);
  updateWidget(); // Run once
}

// 6. Click-to-Open 3D Lightbox Gallery
function initLightboxGallery() {
  const cards = document.querySelectorAll('.gallery-card, .lightbox-trigger');
  if (cards.length === 0) return;
  
  // Ensure we have the Lightbox HTML injected at the end of body
  let lightbox = document.querySelector('.lightbox');
  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
      <div class="lightbox-content-box">
        <button class="lightbox-close" aria-label="Close Gallery">&times;</button>
        <button class="lightbox-arrow lightbox-arrow-left" aria-label="Previous image">&#10094;</button>
        <div class="lightbox-img-container">
          <img class="lightbox-img" src="" alt="Gallery Image">
        </div>
        <button class="lightbox-arrow lightbox-arrow-right" aria-label="Next image">&#10095;</button>
        <p class="lightbox-caption"></p>
      </div>
    `;
    document.body.appendChild(lightbox);
  }
  
  const lbImg = lightbox.querySelector('.lightbox-img');
  const lbCaption = lightbox.querySelector('.lightbox-caption');
  const lbClose = lightbox.querySelector('.lightbox-close');
  const lbLeft = lightbox.querySelector('.lightbox-arrow-left');
  const lbRight = lightbox.querySelector('.lightbox-arrow-right');
  
  let currentGalleryList = [];
  let currentActiveIndex = 0;
  
  // Fetch from global config if available
  const imgConfig = typeof getImagesConfig === 'function' ? getImagesConfig() : null;
  
  // Function to gather images for a specific category
  function getImagesForCategory(category) {
    if (typeof IMAGES_DATA === 'undefined') return [];
    
    return IMAGES_DATA.filter(filename => {
      // Filter out blocked/blurry/military ones
      if (imgConfig && imgConfig.blocked.includes(filename)) return false;
      
      if (category === 'all' || !category) return true;
      
      if (imgConfig && imgConfig.categories[filename] === category) return true;
      
      // Basic text containment fallback for categorizing
      return filename.toLowerCase().includes(category.toLowerCase());
    });
  }
  
  // Initialize dynamic filtering if we are on the our-work.html page
  const filterTabsContainer = document.querySelector('.filter-tabs');
  const galleryGrid = document.querySelector('.gallery-grid-dynamic');
  
  if (galleryGrid) {
    // We are on our-work.html
    const defaultTab = document.querySelector('.filter-tab.active');
    let currentTabCat = defaultTab ? defaultTab.dataset.filter : 'all';
    
    function renderGalleryGrid(cat) {
      galleryGrid.innerHTML = '';
      const list = getImagesForCategory(cat);
      
      if (list.length === 0) {
        galleryGrid.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding: 48px; color: var(--color-text-secondary);">No images found in this category yet. Use the Image Manager to assign them!</div>`;
        return;
      }
      
      list.forEach((imgName, index) => {
        const cleanName = imgName.replace(/WhatsApp Image /g, '').replace(/ at /g, ' ').replace(/\.jpeg/g, '');
        const card = document.createElement('div');
        card.className = 'gallery-card scroll-reveal tilt-card';
        card.dataset.index = index;
        card.innerHTML = `
          <div class="gallery-img-wrapper">
            <img class="gallery-card-img" src="${imgName}" alt="${cleanName}" loading="lazy">
          </div>
          <div class="gallery-card-info">
            <h3 class="gallery-card-title">${cleanName.substring(0, 24)}...</h3>
            <p class="gallery-card-desc">Local project image captured during field activities in rural Sindh.</p>
          </div>
        `;
        
        card.addEventListener('click', () => {
          currentGalleryList = list;
          currentActiveIndex = index;
          openLightbox();
        });
        
        galleryGrid.appendChild(card);
      });
      
      // Re-init tilt and reveal animations for new elements
      init3DTilt();
      initScrollReveals();
    }
    
    // Bind click events to tabs
    const tabs = document.querySelectorAll('.filter-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentTabCat = tab.dataset.filter;
        renderGalleryGrid(currentTabCat);
      });
    });
    
    // Initial render
    renderGalleryGrid(currentTabCat);
  } else {
    // If not a dynamic grid, bind manual trigger triggers (e.g. from homepage cards)
    cards.forEach(card => {
      card.addEventListener('click', (e) => {
        const cat = card.dataset.category || 'all';
        const list = getImagesForCategory(cat);
        if (list.length > 0) {
          currentGalleryList = list;
          currentActiveIndex = 0;
          openLightbox();
        }
      });
    });
  }
  
  function openLightbox() {
    if (currentGalleryList.length === 0) return;
    updateLightboxImage();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  function updateLightboxImage() {
    const imgName = currentGalleryList[currentActiveIndex];
    lbImg.src = imgName;
    
    // Create clean description
    const label = imgName.replace(/WhatsApp Image /g, '').replace(/ at /g, ' ').replace(/\.jpeg/g, '');
    lbImg.alt = label;
    lbCaption.textContent = `${label} (${currentActiveIndex + 1} of ${currentGalleryList.length})`;
  }
  
  function prevImage(e) {
    if (e) e.stopPropagation();
    currentActiveIndex = (currentActiveIndex - 1 + currentGalleryList.length) % currentGalleryList.length;
    updateLightboxImage();
  }
  
  function nextImage(e) {
    if (e) e.stopPropagation();
    currentActiveIndex = (currentActiveIndex + 1) % currentGalleryList.length;
    updateLightboxImage();
  }
  
  lbClose.addEventListener('click', closeLightbox);
  lbLeft.addEventListener('click', prevImage);
  lbRight.addEventListener('click', nextImage);
  lightbox.addEventListener('click', closeLightbox);
  
  // Prevent click on content box from closing lightbox
  lightbox.querySelector('.lightbox-content-box').addEventListener('click', (e) => {
    e.stopPropagation();
  });
  
  // Keyboard listeners
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'ArrowRight') nextImage();
  });
}
