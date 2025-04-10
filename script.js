let cart = JSON.parse(localStorage.getItem('cart')) || [];
let allProducts = [];

document.addEventListener('DOMContentLoaded', async () => {
    await loadProducts();
    updateCartCount();
});

async function loadProducts() {
    try {
        const response = await fetch('products.json');
        const data = await response.json();
        allProducts = data.products;
        displayProducts(allProducts);
        setupFilters();
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

function displayProducts(products) {
    const container = document.getElementById('product-container');
    container.innerHTML = '';
    
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.image}" class="product-img" alt="${product.name}" loading="lazy">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-material">Material: ${product.material}</p>
                <p class="product-price">₹${product.price.toLocaleString()}</p>
                <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        `;
        container.appendChild(card);
    });

    // Add lightbox functionality
    document.querySelectorAll('.product-img').forEach(img => {
        img.addEventListener('click', () => {
            document.getElementById('lightbox').style.display = 'flex';
            document.getElementById('lightbox-img').src = img.src;
        });
    });
}

function setupFilters() {
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    
    const filterProducts = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const category = categoryFilter.value;
        
        const filtered = allProducts.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm) || 
                                product.description.toLowerCase().includes(searchTerm);
            const matchesCategory = category ? product.category === category : true;
            return matchesSearch && matchesCategory;
        });
        
        displayProducts(filtered);
    };

    searchInput.addEventListener('input', filterProducts);
    categoryFilter.addEventListener('change', filterProducts);
}

function addToCart(productId) {
    const product = getProductById(productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCartCount();
    localStorage.setItem('cart', JSON.stringify(cart));
    showNotification(`${product.name} added to cart!`);
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = count;
}

function getProductById(id) {
    return allProducts.find(p => p.id === id);
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// Close lightbox
document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('lightbox').style.display = 'none';
});

// Close lightbox when clicking outside
window.onclick = function(event) {
    const lightbox = document.getElementById('lightbox');
    if (event.target === lightbox) {
        lightbox.style.display = 'none';
    }
};
// Update the renderCartItems function
function renderCartItems() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-info">
                <h3>${item.name}</h3>
                <p>Material: ${item.material}</p>
                <p>₹${item.price.toLocaleString()} x ${item.quantity}</p>
            </div>
            <div class="cart-item-controls">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">−</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                <button class="remove-btn" onclick="removeItem(${item.id})">×</button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });
    updateTotal();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity < 1) removeItem(productId);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartItems();
        updateCartCount();
    }
}

function removeItem(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCartItems();
    updateCartCount();
}

function updateTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('total-amount').textContent = total.toLocaleString();
}

// Modified checkout function
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    const total = document.getElementById('total-amount').textContent;
    window.location.href = `pay.html?total=${total}`;
}

// Initialize cart if on cart page
if (window.location.pathname.includes('cart.html')) {
    document.addEventListener('DOMContentLoaded', () => {
        updateCartCount();
        renderCartItems();
    });
}
// Update renderCartItems function
function renderCartItems() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-info">
                <h3>${item.name}</h3>
                <p>Material: ${item.material}</p>
                <p>₹${item.price.toLocaleString()} x ${item.quantity}</p>
            </div>
            <div class="cart-item-controls">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">−</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                <button class="remove-btn" onclick="removeItem(${item.id})">×</button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });

    updateTotal();
}

// Enhanced renderCartItems function
function renderCartItems() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = cart.length ? '' : '<p class="empty-cart">Your cart is empty. Start shopping!</p>';
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-info">
                <h3>${item.name}</h3>
                <p>Material: ${item.material}</p>
                <p>₹${item.price.toLocaleString()} x ${item.quantity}</p>
                <p class="item-total">Item Total: ₹${(item.price * item.quantity).toLocaleString()}</p>
            </div>
            <div class="cart-item-controls">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">−</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                <button class="remove-btn" onclick="removeItem(${item.id})">Remove</button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });

    updateTotal();
}

// Enhanced checkout function
function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    const total = document.getElementById('total-amount').textContent;
    window.location.href = `pay.html?total=${total}`;
}