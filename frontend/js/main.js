// ========================================
// CHAI MYSORE - Main JavaScript (v2)
// ========================================

// API Base URL
const API_URL = window.location.origin + '/api';

// State
let categories = [];
let menuItems = [];
let settings = { showPrices: true };

// ========================================
// Navigation
// ========================================

// Mobile menu toggle
const menuToggle = document.getElementById('menuToggle');
const navbarMenu = document.getElementById('navbarMenu');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navbarMenu.classList.toggle('active');
    });
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            navbarMenu.classList.remove('active');
        }
    });
});

// Navbar scroll effect (transparent to solid)
const navbar = document.getElementById('navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// ========================================
// API Functions
// ========================================

async function fetchCategories() {
    try {
        const response = await fetch(`${API_URL}/menu/categories`);
        if (!response.ok) throw new Error('Failed to fetch categories');
        categories = await response.json();
        return categories;
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}

async function fetchMenuItems() {
    try {
        const response = await fetch(`${API_URL}/menu/items`);
        if (!response.ok) throw new Error('Failed to fetch menu items');
        menuItems = await response.json();
        return menuItems;
    } catch (error) {
        console.error('Error fetching menu items:', error);
        return [];
    }
}

async function fetchSettings() {
    try {
        const response = await fetch(`${API_URL}/menu/settings`);
        if (!response.ok) throw new Error('Failed to fetch settings');
        settings = await response.json();
        return settings;
    } catch (error) {
        console.error('Error fetching settings:', error);
        return { showPrices: true };
    }
}

async function fetchGalleryImages() {
    try {
        const response = await fetch(`${API_URL}/gallery`);
        if (!response.ok) throw new Error('Failed to fetch gallery');
        return await response.json();
    } catch (error) {
        console.error('Error fetching gallery:', error);
        return [];
    }
}

// ========================================
// Menu Rendering (v2 - Vertical Categories)
// ========================================

function renderMenuByCategory() {
    const container = document.getElementById('menuCategories');
    const loadingEl = document.getElementById('menuLoading');

    if (!container) return;

    // Hide loading
    if (loadingEl) loadingEl.style.display = 'none';

    // Clear container
    container.innerHTML = '';

    if (categories.length === 0 || menuItems.length === 0) {
        container.innerHTML = '<div class="menu-empty"><p>Menu coming soon...</p></div>';
        return;
    }

    // Render each category with its items
    categories.forEach(category => {
        const categoryItems = menuItems.filter(item =>
            item.category._id === category._id || item.category === category._id
        );

        if (categoryItems.length === 0) return;

        const categoryEl = document.createElement('div');
        categoryEl.className = 'menu-category slide-up';

        // Category header
        const categoryHeader = document.createElement('div');
        categoryHeader.innerHTML = `
            <h3 class="category-name">${category.name}</h3>
            <div class="category-divider"></div>
        `;
        categoryEl.appendChild(categoryHeader);

        // Menu items list
        const itemsList = document.createElement('div');
        itemsList.className = 'menu-items-list';

        categoryItems.forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.className = `menu-item ${item.isSpecial ? 'special' : ''}`;

            itemEl.innerHTML = `
                <div class="menu-item-info">
                    <div class="menu-item-name">${item.name}</div>
                    ${item.description ? `<div class="menu-item-description">${item.description}</div>` : ''}
                </div>
                ${settings.showPrices && item.price ? `<div class="menu-item-price">₹${item.price}</div>` : ''}
            `;

            itemsList.appendChild(itemEl);
        });

        categoryEl.appendChild(itemsList);
        container.appendChild(categoryEl);
    });

    // Trigger animation initialization
    window.dispatchEvent(new Event('menuRendered'));
}

// ========================================
// Today's Special Rendering (v2 - With Images)
// ========================================

function renderSpecialItems() {
    const specialSection = document.getElementById('todays-special');
    const specialContainer = document.getElementById('specialItems');

    if (!specialSection || !specialContainer) return;

    const specialItems = menuItems.filter(item => item.isSpecial);

    if (specialItems.length === 0) {
        specialSection.classList.remove('active');
        return;
    }

    specialSection.classList.add('active');
    specialContainer.innerHTML = '';

    // Limit to max 3 items for editorial style
    const displayItems = specialItems.slice(0, 3);

    displayItems.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'special-item slide-up';

        itemEl.innerHTML = `
            ${item.image ? `<img src="${item.image}" alt="${item.name}" class="special-item-image">` : ''}
            <div class="special-item-content">
                <h3 class="special-item-name">${item.name}</h3>
                ${item.description ? `<p class="special-item-description">${item.description}</p>` : ''}
                ${settings.showPrices && item.price ? `<p class="special-item-price">₹${item.price}</p>` : ''}
            </div>
        `;

        specialContainer.appendChild(itemEl);
    });

    // Trigger animation initialization
    window.dispatchEvent(new Event('menuRendered'));
}

// ========================================
// Gallery Rendering (v2 - Large Images)
// ========================================

let galleryImages = [];

function renderGallery(images) {
    const container = document.getElementById('galleryGrid');
    const loadingEl = document.getElementById('galleryLoading');

    if (!container) return;

    // Store images globally for lightbox navigation
    galleryImages = images;

    // Hide loading
    if (loadingEl) loadingEl.style.display = 'none';

    // Clear container
    container.innerHTML = '';

    if (images.length === 0) {
        container.innerHTML = '<div class="gallery-empty"><p>Gallery coming soon...</p></div>';
        return;
    }

    images.forEach((image) => {
        const itemEl = document.createElement('div');
        itemEl.className = 'gallery-item slide-up';

        itemEl.innerHTML = `
            <img src="${image.path}" alt="CHAI MYSORE" class="gallery-image" loading="lazy">
        `;

        // Add click event for lightbox
        itemEl.addEventListener('click', () => openLightbox(image.path));

        container.appendChild(itemEl);
    });

    // Trigger animation initialization
    window.dispatchEvent(new Event('menuRendered'));
}

// ========================================
// Lightbox
// ========================================

let currentImageIndex = 0;

function openLightbox(imageSrc) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');

    if (lightbox && lightboxImage) {
        // Find the index of the clicked image
        currentImageIndex = galleryImages.findIndex(img => img.path === imageSrc);

        lightboxImage.src = imageSrc;
        lightbox.classList.add('active');
        updateNavigationButtons();
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.classList.remove('active');
    }
}

function showNextImage() {
    if (galleryImages.length === 0) return;

    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    const lightboxImage = document.getElementById('lightboxImage');
    if (lightboxImage) {
        lightboxImage.src = galleryImages[currentImageIndex].path;
        updateNavigationButtons();
    }
}

function showPrevImage() {
    if (galleryImages.length === 0) return;

    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    const lightboxImage = document.getElementById('lightboxImage');
    if (lightboxImage) {
        lightboxImage.src = galleryImages[currentImageIndex].path;
        updateNavigationButtons();
    }
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('lightboxPrev');
    const nextBtn = document.getElementById('lightboxNext');

    if (prevBtn && nextBtn) {
        // Show/hide buttons based on number of images
        if (galleryImages.length <= 1) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
        } else {
            prevBtn.style.display = 'flex';
            nextBtn.style.display = 'flex';
        }
    }
}

// Lightbox event listeners
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
const lightbox = document.getElementById('lightbox');

if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
}

if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        showPrevImage();
    });
}

if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        showNextImage();
    });
}

if (lightbox) {
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
}

// Close lightbox on Escape key, navigate with arrow keys
document.addEventListener('keydown', (e) => {
    const lightbox = document.getElementById('lightbox');
    if (lightbox && lightbox.classList.contains('active')) {
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            showPrevImage();
        } else if (e.key === 'ArrowRight') {
            showNextImage();
        }
    }
});

// ========================================
// Initialization
// ========================================

async function initializeApp() {
    try {
        // Fetch all data
        await Promise.all([
            fetchSettings(),
            fetchCategories(),
            fetchMenuItems()
        ]);

        // Render Today's Special (homepage)
        renderSpecialItems();

        // Render menu by category (vertical layout)
        renderMenuByCategory();

        // Fetch and render gallery
        const galleryImages = await fetchGalleryImages();
        renderGallery(galleryImages);

    } catch (error) {
        console.error('Error initializing app:', error);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
