// ali yousri
var users = [
    { username: "user1", email: "user1@coffee.com", password: "user123" },
    { username: "user2", email: "user2@coffee.com", password: "user123" },
    { username: "user3", email: "user3@coffee.com", password: "user123" }
];

// cart object is divided for 2 colleagues, omar khaled and ali yousri 
var cart = {
    // omar khaled
    items: {},

    add: function(product) {
        if (!this.items[product.id]) {
            this.items[product.id] = {
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 0
            };
        }

        this.items[product.id].quantity += 1;
        this.save();
        renderCart();
    },

    remove: function(productId) {
        delete this.items[productId];
        this.save();
        renderCart();
    },

    changeQuantity: function(productId, amount) {
        if (!this.items[productId]) return;

        this.items[productId].quantity += amount;

        if (this.items[productId].quantity <= 0) {
            this.remove(productId);
            return;
        }

        this.save();
        renderCart();
    },
    // ali youssri
    total: function() {
        return Object.values(this.items).reduce(function(sum, item) {
            return sum + item.price * item.quantity;
        }, 0);
    },

    count: function() {
        return Object.values(this.items).reduce(function(sum, item) {
            return sum + item.quantity;
        }, 0);
    },

    save: function() {
        localStorage.setItem("coffeeCart", JSON.stringify(this.items));
    },

    load: function() {
        var savedCart = localStorage.getItem("coffeeCart");
        this.items = savedCart ? JSON.parse(savedCart) : {};
    }
};
// ali yousri last part
var products = [];

function displayGreeting() {
    var header = document.querySelector(".top");
    if (!header || document.querySelector(".greeting")) return;

    var now = new Date();
    var hour = now.getHours();
    var msg = (hour < 12) ? "Good Morning!" : (hour < 18) ? "Good Afternoon!" : "Good Evening!";

    var greeting = document.createElement("div");
    greeting.className = "greeting";
    greeting.textContent = msg + " Welcome to Coffee & Friends";
    header.parentNode.insertBefore(greeting, header.nextSibling);
}

// omar el-ghamri

function setupMenuPage() {
    var menuPage = document.querySelector(".menu-page");
    var menuNav = document.querySelector(".menu-nav");

    if (!menuPage || !menuNav) return;

    products = buildProductsFromCards();
    insertMenuTools(menuNav);
    setupMenuSearch();
    renderCart();
}

function buildProductsFromCards() {
    var cards = document.querySelectorAll(".product-card");

    return Array.from(cards).map(function(card, index) {
        var name = card.querySelector("h3").textContent.trim();
        var priceText = card.querySelector(".price").textContent;
        var price = Number(priceText.replace(/[^0-9.]/g, ""));
        var id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "item-" + index;
        var button = card.querySelector("button");

        card.dataset.productId = id;
        card.dataset.productName = name.toLowerCase();
        card.dataset.productPrice = price;

        if (button) {
            button.classList.add("order-btn");
            button.dataset.productId = id;
        }

        return {
            id: id,
            name: name,
            price: price,
            searchText: card.textContent.toLowerCase(),
            card: card
        };
    });
}

// omar ehab 
function insertMenuTools(menuNav) {
    if (document.querySelector(".menu-tools")) return;

    var tools = document.createElement("section");
    tools.className = "menu-tools";
    tools.innerHTML = `
        <input id="menu-search" type="search" placeholder="Search coffee, juice, or dessert">
        <aside class="cart-panel">
            <div class="cart-title-row">
                <h2>Your Cart</h2>
                <span id="cart-count">0 items</span>
            </div>
            <div id="cart-items"></div>
            <div class="cart-total-row">
                <span>Total</span>
                <strong id="cart-total">EGP 0</strong>
            </div>
        </aside>
    `;

    menuNav.parentNode.insertBefore(tools, menuNav.nextSibling);
}

function setupMenuSearch() {
    var searchInput = document.getElementById("menu-search");
    if (!searchInput) return;

    searchInput.addEventListener("input", function() {
        var searchValue = searchInput.value.trim().toLowerCase();

        products.forEach(function(product) {
            var isMatch = product.searchText.includes(searchValue);
            product.card.style.display = isMatch ? "" : "none";
        });
    });
}
// omar hakim 
function renderCart() {
    var cartItems = document.getElementById("cart-items");
    var cartTotal = document.getElementById("cart-total");
    var cartCount = document.getElementById("cart-count");

    if (!cartItems || !cartTotal || !cartCount) return;

    var items = Object.values(cart.items);
    cartItems.innerHTML = "";

    if (items.length === 0) {
        cartItems.innerHTML = `<p class="empty-cart">No products added yet.</p>`;
    } else {
        items.forEach(function(item) {
            var row = document.createElement("div");
            row.className = "cart-item";
            row.innerHTML = `
                <div>
                    <strong>${item.name}</strong>
                    <span>EGP ${item.price} x ${item.quantity}</span>
                </div>
                <div class="cart-actions">
                    <button type="button" data-cart-action="decrease" data-product-id="${item.id}">-</button>
                    <button type="button" data-cart-action="increase" data-product-id="${item.id}">+</button>
                    <button type="button" data-cart-action="remove" data-product-id="${item.id}">Remove</button>
                </div>
            `;
            cartItems.appendChild(row);
        });
    }

    cartCount.textContent = cart.count() + " item" + (cart.count() === 1 ? "" : "s");
    cartTotal.textContent = "EGP " + cart.total();
}

// ali soliman 
function setupFormValidation() {
    var loginForm = document.querySelector("#username1") ? document.querySelector("#username1").closest("form") : null;
    var signupForm = document.querySelector("#fullname") ? document.querySelector("#fullname").closest("form") : null;

    if (loginForm) {
        loginForm.addEventListener("submit", handleLogin);
    }

    if (signupForm) {
        signupForm.addEventListener("submit", handleSignup);
    }
}


function handleLogin(e) {
    e.preventDefault();

    var email = document.getElementById("username1").value.trim().toLowerCase();
    var password = document.getElementById("pass1").value;
    var foundUser = users.find(function(user) {
        return user.email === email && user.password === password;
    });

    showFormMessage(
        e.target,
        foundUser ? "Login successful. Welcome " + foundUser.username + "!" : "Invalid login. Try user1@coffee.com, user2@coffee.com, or user3@coffee.com with password user123.",
        Boolean(foundUser)
    );
}
// omar karam 
function handleSignup(e) {
    e.preventDefault();

    var username = document.getElementById("fullname").value.trim().toLowerCase();
    var email = document.getElementById("email").value.trim().toLowerCase();
    var password = document.getElementById("password").value;
    var allowedUser = users.find(function(user) {
        return user.username === username;
    });
    var emailTaken = users.some(function(user) {
        return user.email === email;
    });

    if (!allowedUser) {
        showFormMessage(e.target, "Signup is only available for user1, user2, or user3.", false);
        return;
    }

    if (emailTaken) {
        showFormMessage(e.target, "This email already belongs to one of the demo users.", false);
        return;
    }

    if (password.length < 6) {
        showFormMessage(e.target, "Password must be at least 6 characters.", false);
        return;
    }

    users.push({ username: username, email: email, password: password });
    showFormMessage(e.target, "Signup successful for " + username + ". You can now log in with this email.", true);
}

// omar al-raies
function showFormMessage(form, message, isSuccess) {
    var messageBox = form.querySelector(".form-message");

    if (!messageBox) {
        messageBox = document.createElement("p");
        messageBox.className = "form-message";
        form.appendChild(messageBox);
    }

    messageBox.textContent = message;
    messageBox.classList.toggle("success", isSuccess);
    messageBox.classList.toggle("error", !isSuccess);
}
window.addEventListener("load", function() {
    cart.load();
    displayGreeting();
    setupMenuPage();
    setupFormValidation();
});
document.addEventListener("click", function(e) {
    var orderButton = e.target.closest(".order-btn");
    var cartButton = e.target.closest("[data-cart-action]");

    if (orderButton) {
        var product = products.find(function(item) {
            return item.id === orderButton.dataset.productId;
        });

        if (product) {
            cart.add(product);
        }
    }

    if (cartButton) {
        var action = cartButton.dataset.cartAction;
        var productId = cartButton.dataset.productId;

        if (action === "increase") cart.changeQuantity(productId, 1);
        if (action === "decrease") cart.changeQuantity(productId, -1);
        if (action === "remove") cart.remove(productId);
    }
});