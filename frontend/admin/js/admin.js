// ========================================
// CHAI MYSORE - Admin Panel JavaScript
// ========================================

const API_URL = window.location.origin + '/api';
let authToken = localStorage.getItem('adminToken');
let categories = [];
let menuItems = [];
let galleryImages = [];
let editingItemId = null;

// ========================================
// Authentication
// ========================================

function checkAuth() {
    if (authToken) {
        verifyToken();
    } else {
        showLogin();
    }
}

async function verifyToken() {
    try {
        const response = await fetch(`${API_URL}/auth/verify`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            showDashboard();
        } else {
            showLogin();
        }
    } catch (error) {
        showLogin();
    }
}

function showLogin() {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('adminDashboard').classList.remove('active');
    authToken = null;
    localStorage.removeItem('adminToken');
}

function showDashboard() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminDashboard').classList.add('active');
    initializeDashboard();
}

// Login form handler
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorEl = document.getElementById('loginError');

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            const data = await response.json();
            authToken = data.token;
            localStorage.setItem('adminToken', authToken);
            showDashboard();
        } else {
            errorEl.textContent = 'Invalid username or password';
            errorEl.classList.add('show');
        }
    } catch (error) {
        errorEl.textContent = 'Login failed. Please try again.';
        errorEl.classList.add('show');
    }
});

// Logout handler
document.getElementById('logoutBtn').addEventListener('click', () => {
    if (confirm('Are you sure you want to logout?')) {
        showLogin();
    }
});

// ========================================
// Tab Management
// ========================================

document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tabName = btn.dataset.tab;

        // Update active tab button
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Update active tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabName + 'Tab').classList.add('active');
    });
});

// ========================================
// API Helpers
// ========================================

async function apiRequest(url, options = {}) {
    const headers = {
        'Authorization': `Bearer ${authToken}`,
        ...options.headers
    };

    const response = await fetch(url, { ...options, headers });

    if (response.status === 401) {
        showLogin();
        throw new Error('Unauthorized');
    }

    if (!response.ok) {
        throw new Error('Request failed');
    }

    return response.json();
}

// ========================================
// Settings Management
// ========================================

async function loadSettings() {
    try {
        const settings = await fetch(`${API_URL}/menu/settings`).then(r => r.json());
        document.getElementById('showPricesToggle').checked = settings.showPrices;
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

document.getElementById('showPricesToggle').addEventListener('change', async (e) => {
    try {
        await apiRequest(`${API_URL}/menu/settings`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ showPrices: e.target.checked })
        });
        alert('Settings updated successfully!');
    } catch (error) {
        alert('Failed to update settings');
        e.target.checked = !e.target.checked;
    }
});

// ========================================
// Category Management
// ========================================

async function loadCategories() {
    try {
        categories = await fetch(`${API_URL}/menu/categories`).then(r => r.json());
        renderCategories();
        updateCategorySelect();
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

function renderCategories() {
    const tbody = document.getElementById('categoriesTable');
    tbody.innerHTML = '';

    categories.forEach(category => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
      <td>${category.name}</td>
      <td>${category.displayOrder}</td>
      <td>
        <div class="action-buttons">
          <button class="btn btn-danger btn-small" onclick="deleteCategory('${category._id}')">Delete</button>
        </div>
      </td>
    `;
        tbody.appendChild(tr);
    });
}

function updateCategorySelect() {
    const select = document.getElementById('itemCategory');
    select.innerHTML = '<option value="">Select Category</option>';

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category._id;
        option.textContent = category.name;
        select.appendChild(option);
    });
}

document.getElementById('categoryForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('categoryName').value;
    const displayOrder = parseInt(document.getElementById('categoryOrder').value);

    try {
        await apiRequest(`${API_URL}/menu/categories`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, displayOrder })
        });

        e.target.reset();
        loadCategories();
        alert('Category added successfully!');
    } catch (error) {
        alert('Failed to add category');
    }
});

async function deleteCategory(id) {
    if (!confirm('Delete this category? All menu items in this category will also be deleted.')) {
        return;
    }

    try {
        await apiRequest(`${API_URL}/menu/categories/${id}`, { method: 'DELETE' });
        loadCategories();
        loadMenuItems();
        alert('Category deleted successfully!');
    } catch (error) {
        alert('Failed to delete category');
    }
}

// ========================================
// Menu Item Management
// ========================================

async function loadMenuItems() {
    try {
        menuItems = await fetch(`${API_URL}/menu/items`).then(r => r.json());
        renderMenuItems();
    } catch (error) {
        console.error('Error loading menu items:', error);
    }
}

function renderMenuItems() {
    const tbody = document.getElementById('menuItemsTable');
    tbody.innerHTML = '';

    menuItems.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
      <td>${item.name}</td>
      <td>${item.category.name}</td>
      <td>₹${item.price || 0}</td>
      <td>${item.isSpecial ? 'Yes' : 'No'}</td>
      <td>
        <div class="action-buttons">
          <button class="btn btn-primary btn-small" onclick="editMenuItem('${item._id}')">Edit</button>
          <button class="btn btn-danger btn-small" onclick="deleteMenuItem('${item._id}')">Delete</button>
        </div>
      </td>
    `;
        tbody.appendChild(tr);
    });
}

document.getElementById('menuItemForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
        name: document.getElementById('itemName').value,
        category: document.getElementById('itemCategory').value,
        price: parseFloat(document.getElementById('itemPrice').value) || 0,
        description: document.getElementById('itemDescription').value,
        isSpecial: document.getElementById('itemSpecial').checked,
        image: document.getElementById('itemImage').value || ''
    };

    try {
        if (editingItemId) {
            await apiRequest(`${API_URL}/menu/items/${editingItemId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            alert('Menu item updated successfully!');
        } else {
            await apiRequest(`${API_URL}/menu/items`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            alert('Menu item added successfully!');
        }

        cancelEdit();
        e.target.reset();
        loadMenuItems();
    } catch (error) {
        alert('Failed to save menu item');
    }
});

function editMenuItem(id) {
    const item = menuItems.find(i => i._id === id);
    if (!item) return;

    editingItemId = id;
    document.getElementById('itemName').value = item.name;
    document.getElementById('itemCategory').value = item.category._id;
    document.getElementById('itemPrice').value = item.price;
    document.getElementById('itemDescription').value = item.description || '';
    document.getElementById('itemSpecial').checked = item.isSpecial;
    document.getElementById('itemImage').value = item.image || '';

    document.getElementById('menuItemBtnText').textContent = 'Update Menu Item';
    document.getElementById('cancelEditBtn').style.display = 'inline-block';

    // Scroll to form
    document.getElementById('menuItemForm').scrollIntoView({ behavior: 'smooth' });
}

function cancelEdit() {
    editingItemId = null;
    document.getElementById('editItemId').value = '';
    document.getElementById('menuItemBtnText').textContent = 'Add Menu Item';
    document.getElementById('cancelEditBtn').style.display = 'none';
    document.getElementById('menuItemForm').reset();
}

document.getElementById('cancelEditBtn').addEventListener('click', cancelEdit);

async function deleteMenuItem(id) {
    if (!confirm('Delete this menu item?')) return;

    try {
        await apiRequest(`${API_URL}/menu/items/${id}`, { method: 'DELETE' });
        loadMenuItems();
        alert('Menu item deleted successfully!');
    } catch (error) {
        alert('Failed to delete menu item');
    }
}

// ========================================
// Gallery Management
// ========================================

async function loadGallery() {
    try {
        galleryImages = await fetch(`${API_URL}/gallery`).then(r => r.json());
        renderGalleryAdmin();
    } catch (error) {
        console.error('Error loading gallery:', error);
    }
}

function renderGalleryAdmin() {
    const grid = document.getElementById('galleryAdminGrid');
    const emptyEl = document.getElementById('galleryAdminEmpty');

    if (galleryImages.length === 0) {
        grid.style.display = 'none';
        emptyEl.style.display = 'block';
        return;
    }

    grid.style.display = 'grid';
    emptyEl.style.display = 'none';
    grid.innerHTML = '';

    galleryImages.forEach(image => {
        const div = document.createElement('div');
        div.className = 'gallery-admin-item';
        div.innerHTML = `
      <img src="${image.path}" alt="${image.caption || 'Gallery image'}">
      <button class="btn btn-danger btn-delete" onclick="deleteGalleryImage('${image._id}')">×</button>
    `;
        grid.appendChild(div);
    });
}

// Upload area click handler
document.getElementById('uploadArea').addEventListener('click', () => {
    document.getElementById('galleryImageInput').click();
});

// File input change handler
document.getElementById('galleryImageInput').addEventListener('change', async (e) => {
    const files = e.target.files;
    if (files.length === 0) return;

    for (let file of files) {
        await uploadImage(file);
    }

    e.target.value = '';
    loadGallery();
});

async function uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);

    try {
        await fetch(`${API_URL}/gallery`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
            body: formData
        });
    } catch (error) {
        console.error('Error uploading image:', error);
        alert('Failed to upload ' + file.name);
    }
}

async function deleteGalleryImage(id) {
    if (!confirm('Delete this image?')) return;

    try {
        await apiRequest(`${API_URL}/gallery/${id}`, { method: 'DELETE' });
        loadGallery();
        alert('Image deleted successfully!');
    } catch (error) {
        alert('Failed to delete image');
    }
}

// ========================================
// Dashboard Initialization
// ========================================

async function initializeDashboard() {
    await loadSettings();
    await loadCategories();
    await loadMenuItems();
    await loadGallery();
}

// ========================================
// Initialize App
// ========================================

checkAuth();
