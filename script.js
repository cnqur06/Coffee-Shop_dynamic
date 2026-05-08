// 1. Configuration & Data
var folderPrefix = window.location.pathname.includes("htdocs") ? "../media/" : "./media/";

// var coffeeShop = {
//     menu: [
//         { id: 101, title: "Special Espresso", price: 50, img: "Espresso.jpeg" },
//         { id: 102, title: "Iced Mocha", price: 75, img: "Iced_Mocha.jpg" },
//         { id: 103, title: "Fresh Kunafa", price: 90, img: "kunafa.jpg" }
//     ]
// };

// 2. Greeting Logic (PDF Sec 2-3)
function displayGreeting() {
    var header = document.querySelector(".top");
    if (!header) return;

    var now = new Date();
    var hour = now.getHours();
    var msg = (hour < 12) ? "Good Morning!" : (hour < 18) ? "Good Afternoon!" : "Good Evening!";

    var greeting = document.createElement("div");
    greeting.innerHTML = `<h3 style="text-align:center; color:#d6c7b4; margin: 10px 0;">${msg} Welcome to Coffee & Friends</h3>`;
    header.parentNode.insertBefore(greeting, header.nextSibling);
}

// 3. Dynamic Menu Loader (PDF Sec 4-5)
function loadMenu() {
    var menuSection = document.getElementById("menu-container");
    if (!menuSection) return;

    // Use a loop to add the special items
    coffeeShop.menu.forEach(function(item) {
        var card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
            <img src="${folderPrefix}${item.img}" alt="${item.title}">
            <h3>${item.title}</h3>
            <p class="price">EGP ${item.price}</p>
            <button class="order-btn" id="item-${item.id}">Add to Order</button>
        `;
        menuSection.appendChild(card);
    });
}

// 4. Global Event Handling
document.addEventListener("click", function(e) {
    // Matches both dynamically added buttons and your hardcoded HTML buttons
    if (e.target.classList.contains("order-btn") || e.target.tagName === "BUTTON") {
        if (e.target.innerText === "Add to Order") {
            alert("Added to your tray!");
        }
    }
});

// Initialization
window.addEventListener("load", function() {
    displayGreeting();
    loadMenu();
});