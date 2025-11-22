//INITIALIZE VARIABLES
let subtotal = 0;
let discount = 0;
let tax = 0;
let total = 0;

//ADD TO CART FUNCTION
function addToCart(name, price, img) {
    // Retrieve existing cart from localStorage, or create an empty array if none exists
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Check if item already exists in cart
    const existingItem = cart.find((item) => item.name === name);

    if (existingItem) {
        // Increase quantity
        existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
        // Add new item
        cart.push({name, price, img, quantity: 1});
    }
    // Save the updated cart back to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
    // Notify the user that the item has been added
    alert(`${name} added to cart!`);
}

// Remove an item from the cart
function removeItem(index) {
    // Get the cart from localStorage
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Remove the item at the given index
    cart.splice(index, 1);

    // Save the updated cart back to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
    // Reload the cart display
    loadCart();
}

//LOAD CART FUNCTION
function loadCart() {
    // Get references to the html elements for displaying cart items and totals
    const cartContainer = document.getElementById("cart-items");
    const subtotalEl = document.getElementById("subtotal");
    const discountEl = document.getElementById("discount");
    const taxEl = document.getElementById("tax");
    const totalEl = document.getElementById("total");

    // If the cart container doesn't exist, exit the function
    if (!cartContainer) return;

    // Retrieve the cart from localStorage
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    // Clear the cart container before loading items
    cartContainer.innerHTML = "";

    // If the cart is empty, display a message and reset totals
    if (cart.length === 0) {
        cartContainer.innerHTML = "<p>Your cart is empty.</p>";
        subtotalEl.textContent = discountEl.textContent = taxEl.textContent = totalEl.textContent = "0.00";
        return;
    }

    // Initialize subtotal
    let subtotal = 0;
    // Loop through each item in the cart
    cart.forEach((item, index) => {
        const quantity = item.quantity || 1; // Default to 1 if quantity is missing
        const itemSubtotal = item.price * quantity; // Calculate subtotal
        subtotal += itemSubtotal; // Add to total subtotal

        // Create a div element for this cart item
        const div = document.createElement("div");
        div.classList.add("cart-item");
        // Populate the div with item details and add remove button
        div.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            <div class="cart-item-details">
                <h2>${item.name}</h2>
                <p>Price: $${item.price.toFixed(2)}</p>
                <p>Quantity: ${quantity}</p>
                <p>Subtotal: $${itemSubtotal.toFixed(2)}</p>
            </div>
            <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
        `;
        // Add item to the cart container
        cartContainer.appendChild(div);
    });

    // Calculate discount: 10% if subtotal > 1000, otherwise 0
    const discount = subtotal > 1000 ? subtotal * 0.1 : 0;
    // Calculate tax: 15% of (subtotal - discount)
    const tax = (subtotal - discount) * 0.15;
    // Calculate total: subtotal - discount + tax
    const total = subtotal - discount + tax;

    // Update the totals in the HTML
    subtotalEl.textContent = subtotal.toFixed(2);
    discountEl.textContent = discount.toFixed(2);
    taxEl.textContent = tax.toFixed(2);
    totalEl.textContent = total.toFixed(2);
}
// EVENT LISTENER: run loadcart items when the DOM is fully loaded
window.addEventListener("DOMContentLoaded", loadCart);

// Load cart items into checkout page
function loadCheckout() {
    // Get references to the HTML elements for displaying checkout items and totals
    const cartContainer = document.getElementById("checkout-cart");
    const subtotalEl = document.getElementById("checkout-subtotal");
    const discountEl = document.getElementById("checkout-discount");
    const taxEl = document.getElementById("checkout-tax");
    const totalEl = document.getElementById("checkout-total");

    // If the checkout container doesn't exist, exit the function
    if (!cartContainer) return;

    // Retrieve the cart from localStorage
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    // Clear any existing content in the checkout container
    cartContainer.innerHTML = "";

    // If the cart is empty, display a message and reset totals
    if (cart.length === 0) {
        cartContainer.innerHTML = "<p>Your cart is empty.</p>";
        subtotalEl.textContent = discountEl.textContent = taxEl.textContent = totalEl.textContent = "0.00";
        return;
    }

    // Initialize subtotal
    let subtotal = 0;

    // Loop through each item in the cart
    cart.forEach((item) => {
        subtotal += item.price * (item.quantity || 1);

        const div = document.createElement("div");
        div.classList.add("checkout-item");
        // Populate the div with item details
        div.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            <div class="checkout-item-details">
                <h3>${item.name}</h3>
                <p>Price: $${item.price.toFixed(2)}</p>
                <p>Quantity: ${item.quantity || 1}</p>
                <p>Subtotal: $${(item.price * (item.quantity || 1)).toFixed(2)}</p>
            </div>
        `;
        cartContainer.appendChild(div);
    });

    const discount = subtotal > 1000 ? subtotal * 0.1 : 0;
    const tax = (subtotal - discount) * 0.15;
    const total = subtotal - discount + tax;

    // Update the totals in the checkout HTML
    subtotalEl.textContent = subtotal.toFixed(2);
    discountEl.textContent = discount.toFixed(2);
    taxEl.textContent = tax.toFixed(2);
    totalEl.textContent = total.toFixed(2);
    // Auto-fill the amount input with the total
    document.getElementById("amount").value = total.toFixed(2);
}

// Clear all cart items
function clearCart() {
    localStorage.removeItem("cart");
    loadCheckout();
}

// CONFIRM CHECKOUT FUNCTION
function confirmCheckout() {
    // Get input values from the checkout form and remove extra spaces
    const name = document.getElementById("name").value.trim();
    const address = document.getElementById("address").value.trim();
    const city = document.getElementById("city").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("number").value.trim();
    const cname = document.getElementById("cname").value.trim();
    const ccnum = document.getElementById("ccnum").value.trim();
    const expmonth = document.getElementById("expmonth").value.trim();
    const expyear = document.getElementById("expyear").value.trim();
    const cvv = document.getElementById("cvv").value.trim();

    // BASIC VALIDATION: Check if all fields are filled
    if (!name || !address || !city || !phone || !email || !cname || !ccnum || !expmonth || !expyear || !cvv) {
        alert("Please fill in all fields."); // Show alert if any field is empty
        return;
    }

    // Email must contain "@"
    if (!email.includes("@")) {
        alert("Email must contain '@'.");
        return;
    }

    //PHONE NUMBER MUST BE 10 DIGITS
    const numdigits = phone.replace(/\D/g, "");
        if (numdigits.length !== 10) {
            alert("Please enter a valid phone number.");
            return;
        }
    // Credit card number validation ( 16 digits)
    // Remove all non-digit characters
    const ccdigits = ccnum.replace(/\D/g, "");

    // Check if there are exactly 16 digits
    if (ccdigits.length !== 16) {
        alert("Please enter a valid 16-digit credit card number.");
        return;
    }

    // Exp month validation (1-12)
    const month = expmonth.replace(/\D/g, "");

    // Check if it’s between 1 and 12
    if (month < 1 || month > 12) {
        alert("Please enter a valid Exp Month (1-12).");
        return;
    }

    //VALIDATE CVV INPUT
    const cvvdigits = cvv.replace(/\D/g, "");
    // Check if it has 3 or 4 digits
    if (cvvdigits.length !== 3) {
        alert("Please enter a valid 3-digit CVV.");
        return;
    }

    // If all validations pass, confirm the purchase
    alert("Thank you for your purchase!");

    // Clear the cart after successful checkout
    clearCart();

    // Reset the checkout form fields
    document.getElementById("checkout-form").reset();
}

// Cancel checkout
function cancelCheckout() {
    window.location.href = "cart.html";
}

// Close checkout (redirect back to home)
function closeCheckout() {
    window.location.href = "index.html";
}

// EVENT LISTENER: Load checkout items when the DOM is fully loaded
window.addEventListener("DOMContentLoaded", loadCheckout);

//POPUP SECTIONS
const popup = document.getElementById("popup");
const loginSection = document.getElementById("loginSection"); // Login form section
const registerSection = document.getElementById("registerSection"); // Register form section
const forgotSection = document.getElementById("forgotSection"); // Forgot password section

// CLOSE POPUP BUTTON
const closePopup = document.getElementById("closePopup");
if (closePopup) {
    closePopup.addEventListener("click", () => {
        popup.style.display = "none"; // Hide the popup
    });
}

//INTERNAL NAVIGATION
// Show Register section and hide others
document.getElementById("showRegister")?.addEventListener("click", (e) => {
    e.preventDefault();
    loginSection.style.display = "none";
    forgotSection.style.display = "none";
    registerSection.style.display = "block"; // Show register form
});

// Show Login section from Register section
document.getElementById("showLogin")?.addEventListener("click", (e) => {
    e.preventDefault();
    registerSection.style.display = "none";
    forgotSection.style.display = "none";
    loginSection.style.display = "block"; // Show login form
});

// Show Forgot Password section from Login section
document.getElementById("showForgot")?.addEventListener("click", (e) => {
    e.preventDefault();
    loginSection.style.display = "none";
    registerSection.style.display = "none";
    forgotSection.style.display = "block"; // Show forgot password form
});

// Go back to Login from Forgot Password section
document.getElementById("backToLogin")?.addEventListener("click", (e) => {
    e.preventDefault();
    forgotSection.style.display = "none";
    loginSection.style.display = "block";
});

//OPEN POPUP
document.getElementById("dropdownLogin")?.addEventListener("click", (e) => {
    e.preventDefault();
    popup.style.display = "flex"; // Show popup
    loginSection.style.display = "block"; // Show login form
    registerSection.style.display = "none";
    forgotSection.style.display = "none";
});

document.getElementById("dropdownRegister")?.addEventListener("click", (e) => {
    e.preventDefault();
    popup.style.display = "flex";
    loginSection.style.display = "none";
    registerSection.style.display = "block"; // Show registration form
    forgotSection.style.display = "none";
});

//USER REGISTRATION
const registerForm = document.getElementById("registerForm");
if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const inputs = registerForm.querySelectorAll("input");
        const username = inputs[0].value.trim();
        const dob = inputs[1].value;
        const email = inputs[2].value.trim();
        const password = inputs[3].value.trim();

        // Check if all fields are filled
        if (!username || !dob || !email || !password) {
            alert("Please fill in all fields!");
            return;
        }

        let users = JSON.parse(localStorage.getItem("users")) || [];

        // Check for duplicate username or email
        if (users.some((u) => u.username === username)) {
            alert("Username already exists. Choose another.");
            return;
        }
        if (users.some((u) => u.email === email)) {
            alert("Email already registered. Try logging in.");
            return;
        }

        // Save new user to localStorage
        users.push({username, dob, email, password});
        localStorage.setItem("users", JSON.stringify(users));

        alert("Registration successful! You can now log in.");

        // Switch to login section after registration
        document.getElementById("registerSection").style.display = "none";
        document.getElementById("loginSection").style.display = "block";
    });
}

//USER LOGIN
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();

        let users = JSON.parse(localStorage.getItem("users")) || [];

        // Check credentials
        const user = users.find((u) => u.username === username && u.password === password);

        if (user) {
            alert(`Welcome back, ${user.username}!`);
            localStorage.setItem("loggedInUser", JSON.stringify(user)); // Store logged in user

            const popup = document.getElementById("popup");
            if (popup) popup.style.display = "none";

            updateLoginStatus(); // Update to show login status
        } else {
            alert("Invalid username or password. Please try again.");
        }
    });
}

//LOGOUT FUNCTION
function logoutUser() {
    localStorage.removeItem("loggedInUser"); // Remove user from localStorage
    alert("You have been logged out.");
    updateLoginStatus();
}

//LOGIN STATUS DISPLAY
function updateLoginStatus() {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    const loginBtn = document.getElementById("dropdownLogin");
    const registerBtn = document.getElementById("dropdownRegister");
    const userStatus = document.getElementById("userStatus");
    const logoutBtn = document.getElementById("logoutBtn");

    if (user) {
        // Hide login/register buttons if user is logged in
        if (loginBtn) loginBtn.style.display = "none";
        if (registerBtn) registerBtn.style.display = "none";

        // Show username and logout button
        if (userStatus) userStatus.textContent = `Hello, ${user.username}`;
        if (logoutBtn) logoutBtn.style.display = "inline-block";
    } else {
        // Show login/register buttons if no user is logged in
        if (loginBtn) loginBtn.style.display = "inline-block";
        if (registerBtn) registerBtn.style.display = "inline-block";

        // Hide username and logout button
        if (userStatus) userStatus.textContent = "";
        if (logoutBtn) logoutBtn.style.display = "none";
    }
}
// Update login status on page load
window.addEventListener("DOMContentLoaded", updateLoginStatus);

//FORGOT PASSWORD
document.getElementById("forgotForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("forgotEmail").value.trim();
    if (!email) {
        alert("Please enter your email.");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find((u) => u.email === email);

    if (user) {
        alert(`A reset link has been sent to ${email}.`);
    } else {
        alert("Email not found. Please register first.");
    }

    document.getElementById("forgotSection").style.display = "none";
    document.getElementById("loginSection").style.display = "block";
});
