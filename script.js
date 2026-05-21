// Inicializace košíku z localStorage, nebo prázdné pole, pokud ještě nic staženo nebylo
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentCategory = 'vse';
let currentMaxPrice = 100000;

// --- INICIALIZACE PŘI NAČTENÍ STRÁNKY ---
document.addEventListener('DOMContentLoaded', () => {
    // Aktualizace počtu položek v košíku hned po načtení
    updateCartUI();
    
    // Přidání event listenerů na tlačítka "Do košíku"
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault(); // Zamezí případnému chování odkazu
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
    const searchQuery = searchInput ? searchInput.value.toLowerCase().trim() : "";
    const products = document.querySelectorAll('.product');

    products.forEach(product => {
        // Kontrola, zda produkt není "page" (detail produktu), ten nefiltrujeme
        if (product.classList.contains('page')) return;

        // Načtení dat přímo z elementu .product
        const name = (product.getAttribute('data-name') || "").toLowerCase();
        const price = parseFloat(product.getAttribute('data-price') || 0);
        const category = product.getAttribute('data-category') || "";

        // Podmínky pro zobrazení
        const matchesSearch = name.includes(searchQuery);
        const matchesPrice = price <= currentMaxPrice;
        const matchesCategory = (currentCategory === 'vse' || category === currentCategory);

        // Pokud produkt splňuje všechny 3 podmínky, ukážeme ho, jinak skryjeme
        if (matchesSearch && matchesPrice && matchesCategory) {
            product.style.display = "block";
        } else {
            product.style.display = "none";
        }
    });
}

// Volá se po kliknutí na tlačítka kategorií v menu
function filterProduct(category) {
    currentCategory = category;
    filterEverything();
}

// Volá se při pohybu s posuvníkem ceny (range input)
function updatePrice(val) {
    currentMaxPrice = parseFloat(val);
    const priceValueLabel = document.getElementById('priceValue');
    if (priceValueLabel) {
        priceValueLabel.innerText = val;
    }
    filterEverything();
}

// --- FUNKCE PRO KOŠÍK ---
function addToCart(event) {
    // Najde nejbližší rodičovský element s třídou .product, kde jsou uložena data o produktu
    const productElement = event.target.closest('.product');
    if (!productElement) return;

    const id = productElement.getAttribute('data-id');
    const name = productElement.getAttribute('data-name');
    const price = parseInt(productElement.getAttribute('data-price'), 10);

    // Ověření, zda už produkt v košíku náhodou není
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }

    // Uložení aktualizovaného košíku do paměti prohlížeče
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();

    // Malá vizuální odezva na tlačítku po kliknutí
    const btn = event.target;
    const originalText = btn.innerText;
    btn.innerText = "✓ Přidáno";
    btn.disabled = true; // Dočasně vypne tlačítko, aby uživatel neklikal zběsile
    
    setTimeout(() => {
        btn.innerText = originalText;
        btn.disabled = false;
    }, 1000);
}

// Aktualizuje číslo (počet kusů) u ikonky košíku v hlavičce
function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const countElement = document.querySelector('.cart-count');
    if (countElement) {
        countElement.innerText = totalItems;
    }
}

// --- FUNKCE PRO MOBILNÍ MENU ---
function toggleMenu() {
    const menu = document.getElementById("menu");
    const burger = document.getElementById("burger");
    if (!menu) return;

    menu.classList.toggle("active");
    if (burger) {
        burger.textContent = menu.classList.contains("active") ? "✖" : "☰";
    }
}