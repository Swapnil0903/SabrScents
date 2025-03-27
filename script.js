// Load cart from localStorage or initialize an empty cart
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Animated Text - Fade-in on Scroll
document.addEventListener("DOMContentLoaded", () => {
    const fadeElements = document.querySelectorAll(".fade-in");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target); // Stop observing once visible
            }
        });
    }, { threshold: 0.2 }); // Trigger when 20% of the element is visible

    fadeElements.forEach(el => observer.observe(el));
});

// Get required DOM elements
const addToCartButtons = document.querySelectorAll('.add-to-cart');
const cartPopup = document.querySelector('.cart-popup');
const cartButton = document.querySelector('.cart-button');
const closeBtn = document.querySelector('.close-btn');
const cartSummaryContainer = cartPopup.querySelector('ul');

// Product list for reference
const products = [
    { name: 'Tin Package', price: 299 },
    { name: 'Bamboo Sticks', price: 499 },
    { name: 'Antique Package', price: 749 }
];

// Ensure cart popup is hidden on page load
window.addEventListener('load', () => {
    cartPopup.classList.remove('active'); // Hide popup initially
    updateCartSummary();
});

// Add to Cart button click listeners
addToCartButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const index = parseInt(button.getAttribute('data-index'));
        addToCart(index);
    });
});

// Toggle cart popup visibility on Cart button click
cartButton.addEventListener('click', () => {
    if (cartPopup.classList.contains('active')) {
        cartPopup.classList.remove('active');  // Hide popup
    } else {
        cartPopup.classList.add('active');  // Show popup
        updateCartSummary();
    }
});

// Close cart popup on close button click
closeBtn.addEventListener('click', () => {
    cartPopup.classList.remove('active');
});

// Show toast notification for added items
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = message;

    Object.assign(toast.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: '#f4b400',
        color: '#333',
        padding: '10px 20px',
        borderRadius: '5px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
        zIndex: '1000',
        opacity: '0',
        transform: 'translateY(20px)',
        transition: 'opacity 0.5s, transform 0.5s'
    });

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    }, 100);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        setTimeout(() => toast.remove(), 500);
    }, 2000);
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

// Scroll to Products Section
function scrollToProducts() {
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

// ✅ Shop Now Button - Scroll to Products Section
document.querySelector(".hero-buttons button:nth-child(1)").addEventListener("click", function() {
    document.getElementById("products").scrollIntoView({ behavior: "smooth" });
});


// ✅ Explore Collections Button - Display Message
document.querySelector(".hero-buttons button:nth-child(2)").addEventListener("click", function() {
    alert("Explore our exclusive collections!");
});
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    });
});
window.addEventListener("scroll", function () {
    const navbar = document.querySelector(".navbar");
    if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
});

