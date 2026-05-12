// --- GLOBÁLNÍ PROMĚNNÉ ---
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentCategory = 'vse';
let currentMaxPrice = 100000;

// --- INICIALIZACE PŘI NAČTENÍ STRÁNKY ---
document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
    
    // Přidání event listenerů na tlačítka "Do košíku"
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            addToCart(e);
        });
    });

    // Pokud existuje searchbar, spustíme filtr při psaní
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', filterEverything);
    }
});

// --- FUNKCE PRO FILTROVÁNÍ (SEARCH + KATEGORIE + CENA) ---
function filterEverything() {
    const searchInput = document.getElementById('searchInput');
    const searchQuery = searchInput ? searchInput.value.toLowerCase() : "";
    const products = document.querySelectorAll('.product');

    products.forEach(product => {
        // Kontrola, zda produkt není "page" (detail produktu), ten nefiltrujeme
        if (product.classList.contains('page')) return;

        const name = (product.getAttribute('data-name') || "").toLowerCase();
        const price = parseFloat(product.getAttribute('data-price') || 0);
        const category = product.getAttribute('data-category') || "";

        const matchesSearch = name.includes(searchQuery);
        const matchesPrice = price <= currentMaxPrice;
        const matchesCategory = (currentCategory === 'vse' || category === currentCategory);

        if (matchesSearch && matchesPrice && matchesCategory) {
            product.style.display = "block";
        } else {
            product.style.display = "none";
        }
    });
}

function filterProduct(category) {
    currentCategory = category;
    filterEverything();
}

function updatePrice(val) {
    currentMaxPrice = parseFloat(val);
    const priceValueLabel = document.getElementById('priceValue');
    if (priceValueLabel) priceValueLabel.innerText = val;
    filterEverything();
}

// --- FUNKCE PRO KOŠÍK ---
function addToCart(event) {
    const productElement = event.target.closest('[data-id]');
    if (!productElement) return;

    const id = productElement.getAttribute('data-id');
    const name = productElement.getAttribute('data-name');
    const price = parseInt(productElement.getAttribute('data-price'));

    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();

    // Malá vizuální odezva na tlačítku
    const btn = event.target;
    const originalText = btn.innerText;
    btn.innerText = "✓ Přidáno";
    setTimeout(() => btn.innerText = originalText, 1000);
}

function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const countElement = document.querySelector('.cart-count');
    if (countElement) {
        countElement.innerText = totalItems;
    }
}

// --- FUNKCE PRO MENU ---
function toggleMenu() {
    const menu = document.getElementById("menu");
    const burger = document.getElementById("burger");
    if (!menu) return;

    menu.classList.toggle("active");
    if (burger) {
        burger.textContent = menu.classList.contains("active") ? "✖" : "☰";
    }
}