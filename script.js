// Load cart from localStorage or initialize an empty cart
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Animated Text - Fade-in on Scroll
document.addEventListener("DOMContentLoaded", () => {
    const fadeElements = document.querySelectorAll(".fade-in");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    fadeElements.forEach(el => observer.observe(el));

    updateCartSummary(); // Update cart on page load
    loadCheckoutPage();  // Load checkout page if applicable
});

// Get required DOM elements
const addToCartButtons = document.querySelectorAll('.add-to-cart');
const cartPopup = document.querySelector('.cart-popup');
const cartButton = document.querySelector('.cart-button');
const closeBtn = document.querySelector('.close-btn');
const cartSummaryContainer = document.querySelector('.cart-popup ul');
const checkoutBtn = document.getElementById('checkout-btn');

// Product list for reference
const products = [
    { name: 'Solid Perfume Stick', price: 149 },
    { name: 'Bamboo Sticks', price: 499 },
    { name: 'Antique Package', price: 749 }, // Added this missing product
];

// Ensure cart popup is hidden on page load
window.addEventListener('load', () => {
    if (cartPopup) {
        cartPopup.classList.remove('active'); // Hide popup initially
    }
    updateCartSummary();
    loadCheckoutPage();
});

// Add to Cart button click listeners
addToCartButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const index = parseInt(button.getAttribute('data-index'));
        addToCart(index);
    });
});

// Toggle cart popup visibility on Cart button click
if (cartButton) {
    cartButton.addEventListener('click', () => {
        cartPopup.classList.toggle('active');
        updateCartSummary();
    });
}

// Close cart popup on close button click
if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        cartPopup.classList.remove('active');
    });
}

// Show toast notification for added items
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = message;

    Object.assign(toast.style, {
        position: 'fixed',
        bottom: '50px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: '#333',
        color: '#fff',
        padding: '12px 18px',
        borderRadius: '8px',
        fontSize: '16px',
        opacity: '0',
        transition: 'opacity 0.5s, transform 0.5s',
        zIndex: '1000'
    });

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '1';
    }, 100);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}


// Add to Cart function
function addToCart(index) {
    const selectedProduct = products[index];
    const existingProduct = cart.find(item => item.name === selectedProduct.name);

    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({ ...selectedProduct, quantity: 1 });
    }

    saveCart();
    updateCartSummary();
    showToast(`${selectedProduct.name} added to cart!`);
}

// Update Cart Summary
function updateCartSummary() {
    if (!cartSummaryContainer) return;

    cartSummaryContainer.innerHTML = '';

    if (cart.length === 0) {
        cartSummaryContainer.innerHTML = '<li>Your cart is empty.</li>';
        return;
    }

    let total = 0;
    cart.forEach((item, idx) => {
        total += item.price * item.quantity;

        const listItem = document.createElement('li');
        listItem.className = 'cart-item';
        listItem.innerHTML = `
            ${item.name} - ₹${item.price} x ${item.quantity}
            <button onclick="removeFromCart(${idx})" class="remove-btn">❌</button>
        `;
        cartSummaryContainer.appendChild(listItem);
    });

    const totalItem = document.createElement('li');
    totalItem.className = 'cart-total';
    totalItem.innerHTML = `<strong>Total: ₹${total.toFixed(2)}</strong>`;
    cartSummaryContainer.appendChild(totalItem);

    const checkoutButton = document.createElement('button');
    checkoutButton.innerText = "Proceed to Checkout";
    checkoutButton.className = "checkout-btn";
    checkoutButton.onclick = () => confirmCheckout();
    cartSummaryContainer.appendChild(checkoutButton);
}

// Remove item from cart
function removeFromCart(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity--;
    } else {
        cart.splice(index, 1);
    }

    saveCart();
    updateCartSummary();
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Ensure the total amount updates correctly on checkout page
function loadCheckoutPage() {
    const checkoutSummary = document.getElementById('cart-items');
    const checkoutTotal = document.getElementById('total-price');

    if (!checkoutSummary || !checkoutTotal) return;

    let storedCart = localStorage.getItem('cart');
    cart = storedCart ? JSON.parse(storedCart) : [];

    checkoutSummary.innerHTML = '';

    if (cart.length === 0) {
        checkoutSummary.innerHTML = '<li>Your cart is empty.</li>';
        checkoutTotal.innerText = '₹0.00';
        return;
    }

    let total = 0;
    cart.forEach(item => {
        total += item.price * item.quantity;

        const listItem = document.createElement('li');
        listItem.innerText = `${item.name} - ₹${item.price} x ${item.quantity}`;
        checkoutSummary.appendChild(listItem);
    });

    checkoutTotal.innerText = `₹${total.toFixed(2)}`;
}

// Confirm Checkout
function confirmCheckout() {
    if (cart.length === 0) {
        alert("⚠️ Your cart is empty. Add items before checking out.");
        return;
    }

    const checkoutMsg = document.createElement('div');
    checkoutMsg.className = 'checkout-popup';
    checkoutMsg.innerHTML = `
        <p>✅ Proceeding to checkout...</p>
    `;

    Object.assign(checkoutMsg.style, {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#4CAF50',
        color: '#fff',
        padding: '15px 20px',
        borderRadius: '10px',
        fontSize: '18px',
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
        opacity: '0',
        transition: 'opacity 0.5s ease-in-out'
    });

    document.body.appendChild(checkoutMsg);

    setTimeout(() => {
        checkoutMsg.style.opacity = '1';
    }, 100);

    setTimeout(() => {
        checkoutMsg.style.opacity = '0';
        setTimeout(() => checkoutMsg.remove(), 500);
        window.location.href = "checkout.html";
    }, 2000);
}


// Place Order Function
function placeOrder() {
    if (cart.length === 0) {
        alert("⚠️ Your cart is empty! Please add items before placing an order.");
        return;
    }

    const orderMsg = document.createElement('div');
    orderMsg.className = 'order-popup';
    orderMsg.innerHTML = `
        <p>🎉 Placing your order...</p>
    `;

    Object.assign(orderMsg.style, {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#3498db',
        color: '#fff',
        padding: '15px 20px',
        borderRadius: '10px',
        fontSize: '18px',
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
        opacity: '0',
        transition: 'opacity 0.5s ease-in-out'
    });

    document.body.appendChild(orderMsg);

    setTimeout(() => {
        orderMsg.style.opacity = '1';
    }, 100);

    // Reduce delay if needed (Currently 2s)
    setTimeout(() => {
        orderMsg.style.opacity = '0';
        setTimeout(() => orderMsg.remove(), 500);
        localStorage.removeItem('cart'); // Clear cart
        cart = [];
        window.location.href = "order-confirmation.html";
    }, 1500);  // Reduced delay
}

// Ensure "Place Order" works in checkout page
document.addEventListener('DOMContentLoaded', () => {
    const orderBtn = document.getElementById('checkout-form');
    if (orderBtn) {
        orderBtn.addEventListener('submit', function(event) {
            event.preventDefault();
            placeOrder();
        });
    }
});

// Scroll to Products Section
function scrollToProducts() {
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

// Display User Initials in Avatar
document.querySelectorAll(".user-avatar").forEach((avatar) => {
    let name = avatar.getAttribute("data-name").trim();
    let initials = name.split(" ").map(word => word[0]).join("").toUpperCase();
    avatar.innerText = initials;
});
fetch('https://api64.ipify.org?format=json')
    .then(response => response.json())
    .then(data => {
        let ip = data.ip;

        // Fetch location details
        fetch(`https://ipapi.co/${ip}/json/`)
            .then(response => response.json())
            .then(locationData => {
                let logData = {
                    ip: ip,
                    location: `${locationData.city}, ${locationData.region}, ${locationData.country_name}`,
                    time: new Date().toLocaleString()
                };

                // Retrieve existing logs from Local Storage
                let logs = JSON.parse(localStorage.getItem("visitorLogs")) || [];

                // Add new log entry
                logs.push(logData);

                // Store updated logs back in Local Storage
                localStorage.setItem("visitorLogs", JSON.stringify(logs));

                console.log("Visitor logged:", logData);
            })
            .catch(error => console.error("Error fetching location:", error));
    })
    .catch(error => console.error("Error fetching IP:", error));
