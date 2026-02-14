const products = [
    { id: 1, name: "Pure Organic Honey", price: 350.00, image: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=800&q=90" },
    { id: 2, name: "Artisan Sourdough Bread", price: 120.00, image: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=800&q=90" },
    { id: 3, name: "Handmade Soy Candle", price: 450.00, image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=90" },
    { id: 4, name: "Premium Coffee Beans", price: 550.00, image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=90" },
    { id: 5, name: "Handcrafted Ceramic Mug", price: 299.00, image: "https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&w=800&q=90" },
    { id: 6, name: "Homemade Strawberry Jam", price: 180.00, image: "https://images.unsplash.com/photo-1590845947670-c009801ffa74?auto=format&fit=crop&w=800&q=90" },
    { id: 7, name: "Organic Turmeric Powder", price: 220.00, image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=90" },
    { id: 8, name: "Handwoven Jute Bag", price: 499.00, image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=90" },
    { id: 9, name: "Terracotta Plant Pot", price: 399.00, image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=90" },
    { id: 10, name: "Assorted Tea Box", price: 650.00, image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=800&q=90" },
];

// State
let state = {
    location: localStorage.getItem('localkart_location') || null,
    cart: JSON.parse(localStorage.getItem('localkart_cart')) || [],
};

// DOM Elements
const appContent = document.getElementById('app-content');
const productGrid = document.getElementById('product-grid');
const cartBtn = document.getElementById('cart-btn');
const cartCount = document.getElementById('cart-count');
const cartModal = document.getElementById('cart-modal');
const closeCartBtn = document.getElementById('close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalDisplay = document.getElementById('cart-total');

// Initialization
function init() {
    renderProducts();
    updateCartUI();
}

// Logic
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = state.cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        state.cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    updateCartUI();

    // Simple feedback animation
    const btn = document.querySelector(`button[data-id="${productId}"]`);
    const originalText = btn.textContent;
    btn.textContent = "Added!";
    setTimeout(() => btn.textContent = originalText, 1000);
}

function removeFromCart(productId) {
    state.cart = state.cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
}

function saveCart() {
    localStorage.setItem('localkart_cart', JSON.stringify(state.cart));
}

function updateCartUI() {
    // Update Badge
    const count = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = count;

    // Render Cart Items
    cartItemsContainer.innerHTML = '';
    let total = 0;

    if (state.cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-msg">Your cart is empty.</p>';
    } else {
        state.cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <div>
                    <h4>${item.name}</h4>
                    <p>₹${item.price.toFixed(2)} x ${item.quantity}</p>
                </div>
                <button onclick="removeFromCart(${item.id})" style="background:none; color:red; padding:5px;">🗑️</button>
            `;
            cartItemsContainer.appendChild(div);
        });
    }

    cartTotalDisplay.textContent = total.toFixed(2);
}

function renderProducts() {
    productGrid.innerHTML = products.map(p => `
        <div class="product-card">
            <img src="${p.image}" alt="${p.name}" class="product-image">
            <div class="product-info">
                <h4>${p.name}</h4>
                <p>₹${p.price.toFixed(2)}</p>
            </div>
            <button class="add-btn" data-id="${p.id}" onclick="addToCart(${p.id})">Add to Cart</button>
        </div>
    `).join('');
}

// Event Listeners
cartBtn.addEventListener('click', () => cartModal.classList.remove('hidden'));
closeCartBtn.addEventListener('click', () => cartModal.classList.add('hidden'));

// Close cart on outside click
cartModal.addEventListener('click', (e) => {
    if (e.target === cartModal) cartModal.classList.add('hidden');
});

// Run
init();
