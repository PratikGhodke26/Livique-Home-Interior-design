(function () {
	'use strict';

	var tinyslider = function () {
		var el = document.querySelectorAll('.testimonial-slider');

		if (el.length > 0) {
			var slider = tns({
				container: '.testimonial-slider',
				items: 1,
				axis: "horizontal",
				controlsContainer: "#testimonial-nav",
				swipeAngle: false,
				speed: 700,
				nav: true,
				controls: true,
				autoplay: true,
				autoplayHoverPause: true,
				autoplayTimeout: 3500,
				autoplayButtonOutput: false
			});
		}
	};
	tinyslider();




	var sitePlusMinus = function () {

		var value,
			quantity = document.getElementsByClassName('quantity-container');

		function createBindings(quantityContainer) {
			var quantityAmount = quantityContainer.getElementsByClassName('quantity-amount')[0];
			var increase = quantityContainer.getElementsByClassName('increase')[0];
			var decrease = quantityContainer.getElementsByClassName('decrease')[0];
			increase.addEventListener('click', function (e) { increaseValue(e, quantityAmount); });
			decrease.addEventListener('click', function (e) { decreaseValue(e, quantityAmount); });
		}

		function init() {
			for (var i = 0; i < quantity.length; i++) {
				createBindings(quantity[i]);
			}
		};

		function increaseValue(event, quantityAmount) {
			value = parseInt(quantityAmount.value, 10);

			console.log(quantityAmount, quantityAmount.value);

			value = isNaN(value) ? 0 : value;
			value++;
			quantityAmount.value = value;
		}

		function decreaseValue(event, quantityAmount) {
			value = parseInt(quantityAmount.value, 10);

			value = isNaN(value) ? 0 : value;
			if (value > 0) value--;
			quantityAmount.value = value;
		}
		init();
	};
	sitePlusMinus();
})()


document.addEventListener("DOMContentLoaded", () => {
	renderCart();
});

function renderCart() {
	const cart = JSON.parse(localStorage.getItem('cart')) || [];
	const tbody = document.getElementById('cart-items');
	tbody.innerHTML = '';

	let subtotal = 0;

	if (!cart || !Array.isArray(cart) || cart.length === 0) {
		tbody.innerHTML = `<tr><td colspan="6" class="text-center">Your cart is empty</td></tr>`;
		updateTotalsDisplay(0);
		return;
	}

	cart.forEach((item, index) => {
		if (!item || typeof item.price !== 'number' || typeof item.qty !== 'number') return;

		const total = item.price * item.qty;
		subtotal += total;

		const row = document.createElement('tr');
		row.innerHTML = `
				<td class="product-thumbnail">
					<img src="${item.img}" alt="${item.name}" class="img-fluid" style="width: 100px;">
				</td>
				<td class="product-name">
					<h2 class="h5 text-black">${item.name}</h2>
				</td>
				<td class="product-price">$${item.price.toFixed(2)}</td>
				<td>
					<div class="input-group mb-3 d-flex align-items-center quantity-container" style="max-width: 120px;">
						<div class="input-group-prepend">
							<button class="btn btn-outline-black decrease" data-index="${index}" type="button">&minus;</button>
						</div>
						<input type="text" class="form-control text-center quantity-amount" value="${item.qty}" readonly>
						<div class="input-group-append">
							<button class="btn btn-outline-black increase" data-index="${index}" type="button">&plus;</button>
						</div>
					</div>
				</td>
				<td class="product-total">$${total.toFixed(2)}</td>
				<td><a href="#" class="btn btn-black btn-sm remove-item" data-index="${index}">X</a></td>
			`;
		tbody.appendChild(row);
	});

	updateTotalsDisplay(subtotal);
	attachCartEvents();
}

function updateTotalsDisplay(subtotal) {
	document.querySelectorAll('.text-black').forEach(el => {
		if (el.textContent.includes('$')) {
			el.textContent = `$${subtotal.toFixed(2)}`;
		}
	});

	const subtotalEl = document.getElementById("cart-subtotal");
	const totalEl = document.getElementById("cart-total");
	if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
	if (totalEl) totalEl.textContent = `$${subtotal.toFixed(2)}`;
}

function attachCartEvents() {
	document.querySelectorAll('.increase').forEach(btn => {
		btn.addEventListener('click', function () {
			const index = this.dataset.index;
			let cart = JSON.parse(localStorage.getItem('cart')) || [];
			if (cart[index]) {
				cart[index].qty += 1;
				localStorage.setItem('cart', JSON.stringify(cart));
				renderCart();
			}
		});
	});

	document.querySelectorAll('.decrease').forEach(btn => {
		btn.addEventListener('click', function () {
			const index = this.dataset.index;
			let cart = JSON.parse(localStorage.getItem('cart')) || [];
			if (cart[index] && cart[index].qty > 1) {
				cart[index].qty -= 1;
				localStorage.setItem('cart', JSON.stringify(cart));
				renderCart();
			}
		});
	});

	document.querySelectorAll('.remove-item').forEach(btn => {
		btn.addEventListener('click', function (e) {
			e.preventDefault();
			const index = this.dataset.index;
			let cart = JSON.parse(localStorage.getItem('cart')) || [];
			cart.splice(index, 1);
			localStorage.setItem('cart', JSON.stringify(cart));
			renderCart();
		});
	});
}

function applyCoupon() {
	const allowedCoupons = ["livique821", "liv221", "livique123"];
	const input = document.getElementById("coupon-code").value.trim();
	const message = document.getElementById("coupon-message");

	if (allowedCoupons.includes(input)) {
		message.textContent = "Coupon applied successfully!";
		message.style.color = "green";
		// You can apply discount here by modifying subtotal or total
	} else {
		message.textContent = "Invalid coupon code.";
		message.style.color = "red";
	}
}

document.addEventListener("DOMContentLoaded", () => {
	// Clean and validate cart items
	function cleanCart(cart) {
		return cart.filter(item =>
			item &&
			item.name &&
			typeof item.name === "string" &&
			!isNaN(parseFloat(item.price)) &&
			!isNaN(parseInt(item.qty))
		);
	}

	// Render checkout order summary
	function renderCheckoutSummary() {
		const rawCart = JSON.parse(localStorage.getItem("cart")) || [];
		const cart = cleanCart(rawCart);
		const tbody = document.getElementById("checkout-order-summary");
		if (!tbody) return;

		tbody.innerHTML = "";
		let subtotal = 0;

		cart.forEach(item => {
			const price = parseFloat(item.price);
			const qty = parseInt(item.qty);
			const total = price * qty;
			subtotal += total;

			const row = document.createElement("tr");
			row.innerHTML = `
					<td>${item.name} <strong class="mx-2">x</strong> ${qty}</td>
					<td>$${total.toFixed(2)}</td>
				`;
			tbody.appendChild(row);
		});

		// Apply discount if valid coupon exists
		const discountRate = parseFloat(localStorage.getItem("couponDiscount")) || 0;
		const discountAmount = subtotal * discountRate;
		const totalAfterDiscount = subtotal - discountAmount;

		// Subtotal row
		const subtotalRow = document.createElement("tr");
		subtotalRow.innerHTML = `
				<td class="text-black font-weight-bold"><strong>Cart Subtotal</strong></td>
				<td class="text-black">$${subtotal.toFixed(2)}</td>
			`;
		tbody.appendChild(subtotalRow);

		// Discount row if applicable
		if (discountRate > 0) {
			const discountRow = document.createElement("tr");
			discountRow.innerHTML = `
					<td class="text-black font-weight-bold"><strong>Coupon Discount (5%)</strong></td>
					<td class="text-black text-danger">- $${discountAmount.toFixed(2)}</td>
				`;
			tbody.appendChild(discountRow);
		}

		// Total after discount
		const totalRow = document.createElement("tr");
		totalRow.innerHTML = `
				<td class="text-black font-weight-bold"><strong>Order Total</strong></td>
				<td class="text-black font-weight-bold"><strong>$${totalAfterDiscount.toFixed(2)}</strong></td>
			`;
		tbody.appendChild(totalRow);
	}

	// Apply coupon
	window.applyCoupon = function () {
		const allowedCoupons = ["livique821", "liv221", "livique123"];
		const input = document.getElementById("coupon-code").value.trim().toLowerCase();
		const message = document.getElementById("coupon-message");

		if (allowedCoupons.includes(input)) {
			localStorage.setItem("couponDiscount", "0.05"); // 5%
			message.textContent = "Coupon applied successfully! 5% discount applied.";
			message.style.color = "green";
		} else {
			localStorage.removeItem("couponDiscount");
			message.textContent = "Invalid coupon code.";
			message.style.color = "red";
		}
		renderCheckoutSummary(); // Refresh total
	};

	// Generate and download TXT tax invoice
	function generateInvoice() {
		const cart = JSON.parse(localStorage.getItem("cart")) || [];
		if (cart.length === 0) {
			alert("Your cart is empty. Cannot generate invoice.");
			return;
		}

		const discountRate = parseFloat(localStorage.getItem("couponDiscount")) || 0;

		let invoiceText = "====== LIVIQUE TAX INVOICE ======\n";
		invoiceText += `Date: ${new Date().toLocaleString()}\n\n`;
		invoiceText += "Item\t\tQty\tPrice\tTotal\n";
		invoiceText += "----------------------------------------\n";

		let subtotal = 0;
		cart.forEach(item => {
			const qty = parseInt(item.qty);
			const price = parseFloat(item.price);
			const total = qty * price;
			subtotal += total;
			invoiceText += `${item.name}\t${qty}\t$${price.toFixed(2)}\t$${total.toFixed(2)}\n`;
		});

		const discountAmount = subtotal * discountRate;
		const totalAfterDiscount = subtotal - discountAmount;

		invoiceText += "----------------------------------------\n";
		invoiceText += `Subtotal:\t\t\t$${subtotal.toFixed(2)}\n`;

		if (discountRate > 0) {
			invoiceText += `Discount (5%):\t\t\t-$${discountAmount.toFixed(2)}\n`;
		}

		invoiceText += `Total Payable:\t\t\t$${totalAfterDiscount.toFixed(2)}\n`;
		invoiceText += "========================================\n";
		invoiceText += "Thank you for shopping with LIVIQUE!\n";

		const blob = new Blob([invoiceText], { type: "text/plain" });
		const link = document.createElement("a");
		link.href = URL.createObjectURL(blob);
		link.download = `LIVIQUE_Invoice_${Date.now()}.txt`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

	// Auto-toggle payment details
	document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
		radio.addEventListener('change', () => {
			document.querySelectorAll('.collapse').forEach(div => div.classList.remove('show'));
			const method = radio.value;
			const collapseId = document.getElementById('collapse' + method);
			if (collapseId) collapseId.classList.add('show');
		});
	});

	// Place order handler
	window.placeOrder = function () {
		const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked');
		if (!selectedMethod) {
			alert("Please select a payment method.");
			return;
		}

		const cart = JSON.parse(localStorage.getItem("cart")) || [];
		if (cart.length === 0) {
			alert("Your cart is empty!");
			return;
		}

		// Save order (optional)
		localStorage.setItem("lastOrder", JSON.stringify({
			items: cart,
			method: selectedMethod.value,
			date: new Date().toISOString()
		}));

		// ✅ Generate invoice
		generateInvoice();

		// ✅ Clear cart and redirect
		setTimeout(() => {
			localStorage.removeItem("cart");
			localStorage.removeItem("couponDiscount");
			window.location.href = "thankyou.html";
		}, 1000);
	};

	renderCheckoutSummary();
});

const order = {
	id: Date.now(), // Unique ID
	items: JSON.parse(localStorage.getItem("cartItems")) || [],
	total: parseFloat(localStorage.getItem("cartTotal")) || 0,
	date: new Date().toLocaleDateString(),
	time: new Date().toLocaleTimeString(),
	status: "Delivered", // Or "Pending" / "Shipped" etc.
};

// Save it in a list of orders
let orders = JSON.parse(localStorage.getItem("orders")) || [];
orders.push(order);
localStorage.setItem("orders", JSON.stringify(orders));

// Optionally clear cart after checkout
localStorage.removeItem("cartItems");
localStorage.removeItem("cartTotal");

// CONTACT FORM SUBMISSION HANDLER
document.querySelector("form").addEventListener("submit", function (e) {
	e.preventDefault(); // prevent actual form submission
	// Optionally, you can validate form fields here

	// Show success message
	document.getElementById("contact-success-message").style.display = "block";

	// Reset form
	this.reset();
});

// NEWSLETTER FORM SUBMISSION HANDLER
document.querySelector(".subscription-form form").addEventListener("submit", function (e) {
	e.preventDefault(); // prevent actual form submission

	// Show newsletter success message
	document.getElementById("newsletter-success-message").style.display = "block";

	// Reset newsletter form
	this.reset();
});

function checkPassword() {
    const correctPassword = "pratik";  // Example hardcoded password
    const enteredPassword = document.getElementById("password").value;

    if (enteredPassword === correctPassword) {
        alert("Access granted!");
        window.location.href = "dashboard.html"; // or your secure page
    } else {
        alert("Incorrect password.");
    }
}

// auth.js

let users = [
  {
    name: "pratik",
    email: "ghodkepratik271@gmail.com",
    password: "pratik"
  }
];

// Load users from localStorage
if (localStorage.getItem("users")) {
  users = JSON.parse(localStorage.getItem("users"));
}

// Save user to localStorage
function saveUser(user) {
  users.push(user);
  localStorage.setItem("users", JSON.stringify(users));
}

// Handle login
function login(email, password) {
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    localStorage.setItem("loggedInUser", JSON.stringify(user));
    return true;
  }
  return false;
}

// Handle logout
function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "login.html"; // or index.html
}

// Check login state
function getLoggedInUser() {
  return JSON.parse(localStorage.getItem("loggedInUser"));
}

const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];

    const matchedUser = users.find(user => user.email === email && user.password === password);

    if (matchedUser) {
        localStorage.setItem('loggedInUser', JSON.stringify(matchedUser));
        alert("Login successful!");
        window.location.href = "index.html";
    } else {
        alert("Invalid email or password.");
    }
});

const placeOrderBtn = document.getElementById('place-order-btn');

placeOrderBtn.addEventListener('click', () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const user = JSON.parse(localStorage.getItem('loggedInUser'));

    if (!user) {
        alert("Please log in to place an order.");
        return;
    }

    const order = {
        email: user.email,
        items: cart,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        status: "Delivered"
    };

    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));

    // clear cart
    localStorage.removeItem('cart');
    alert("Order placed successfully!");
    window.location.href = "order-history.html";
});

window.addEventListener('DOMContentLoaded', () => {
    const ordersContainer = document.getElementById('order-history');
    const user = JSON.parse(localStorage.getItem('loggedInUser'));

    if (!user) {
        ordersContainer.innerHTML = "<p>Please log in to view your order history.</p>";
        return;
    }

    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const userOrders = orders.filter(order => order.email === user.email);

    if (userOrders.length === 0) {
        ordersContainer.innerHTML = "<p>No orders found.</p>";
        return;
    }

    userOrders.forEach(order => {
        const orderEl = document.createElement('div');
        orderEl.className = "order-item";
        orderEl.innerHTML = `
            <p><strong>Date:</strong> ${order.date} ${order.time}</p>
            <p><strong>Status:</strong> ${order.status}</p>
            <ul>
                ${order.items.map(item => `<li>${item.name} - $${item.price}</li>`).join('')}
            </ul>
            <hr>
        `;
        ordersContainer.appendChild(orderEl);
    });
 });
 function saveOrder(cartItems) {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!user) return alert("User not logged in.");

  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  const newOrder = {
    userEmail: user.email,
    items: cartItems,
    date: new Date().toLocaleString()
  };
  orders.push(newOrder);
  localStorage.setItem("orders", JSON.stringify(orders));
}


// ----------------- USER SESSION -----------------
function getLoggedInUser() {
  return JSON.parse(localStorage.getItem("loggedInUser"));
}

// ----------------- CART FUNCTIONS -----------------
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function renderCartItems() {
  const cartItems = getCart();
  const container = document.getElementById("cart-items");
  if (!container) return;

  container.innerHTML = "";
  let total = 0;

  cartItems.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const row = `
      <tr>
        <td><img src="${item.image}" width="50" /></td>
        <td>${item.name}</td>
        <td>₹${item.price}</td>
        <td>
          <input type="number" value="${item.quantity}" min="1"
            onchange="updateQuantity(${index}, this.value)">
        </td>
        <td>₹${itemTotal}</td>
        <td><button onclick="removeFromCart(${index})">Remove</button></td>
      </tr>`;
    container.innerHTML += row;
  });

  document.querySelectorAll(".text-black").forEach(el => {
    if (el.textContent.includes("₹")) el.textContent = `₹${total}`;
  });
}

function updateQuantity(index, qty) {
  const cart = getCart();
  cart[index].quantity = parseInt(qty);
  saveCart(cart);
  renderCartItems();
}

function removeFromCart(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  renderCartItems();
}

function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  saveCart(cart);
}

// ----------------- CHECKOUT & ORDER FUNCTIONS -----------------
function saveOrder() {
  const user = getLoggedInUser();
  if (!user) return alert("Please login to place order.");

  const cart = getCart();
  if (cart.length === 0) return alert("Cart is empty.");

  const now = new Date();
  const order = {
    user: user.email,
    items: cart,
    total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    status: "Confirmed",
    date: now.toLocaleDateString(),
    time: now.toLocaleTimeString()
  };

  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  orders.push(order);
  localStorage.setItem("orders", JSON.stringify(orders));

  localStorage.removeItem("cart");
  window.location.href = "orders.html";
}

// ----------------- ORDER HISTORY -----------------
function renderOrderHistory() {
  const user = getLoggedInUser();
  const container = document.getElementById("order-container");
  if (!container) return;

  if (!user) {
    container.innerHTML = "<p>Please login to view your orders.</p>";
    return;
  }

  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  const userOrders = orders.filter(o => o.user === user.email);

  if (userOrders.length === 0) {
    container.innerHTML = "<p>No orders found.</p>";
    return;
  }

  container.innerHTML = userOrders.map(order => {
    const itemsHtml = order.items.map(i =>
      `<li>${i.name} - ₹${i.price} x ${i.quantity} = ₹${i.price * i.quantity}</li>`
    ).join("");

    return `
      <div class="border p-3 mb-3">
        <p><strong>Date:</strong> ${order.date} ${order.time}</p>
        <ul>${itemsHtml}</ul>
        <p><strong>Total:</strong> ₹${order.total}</p>
        <p><strong>Status:</strong> ${order.status}</p>
      </div>`;
  }).join("");
}
