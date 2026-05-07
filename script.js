function toggleMenu() {
  const menu = document.getElementById("menu");
  const burger = document.getElementById("burger");

  menu.classList.toggle("active");

  // change icon
  if (menu.classList.contains("active")) {
    burger.textContent = "✖";
  } else {
    burger.textContent = "☰";
  }
}
// Inicializace košíku z localStorage nebo prázdné pole
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Funkce pro aktualizaci textu v hlavičce "Cart (X)"
function updateCartUI() {
    const cartCount = document.querySelector('.cart');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.innerHTML = `<i class="fas fa-shopping-cart"></i> Košík (${totalItems})`;
}

// Funkce pro přidání do košíku
function addToCart(event) {
    const productElement = event.target.closest('.product');
    const id = productElement.getAttribute('data-id');
    const name = productElement.getAttribute('data-name');
    const price = parseInt(productElement.getAttribute('data-price'));

    // Kontrola, zda už produkt v košíku je
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: id,
            name: name,
            price: price,
            quantity: 1
        });
    }

    // Uložení do localStorage a update vzhledu
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
    
    alert(`${name} byl přidán do košíku!`);
}

// Přidání event listenerů na všechna tlačítka
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', addToCart);
});

// Voláme při načtení stránky, aby zůstal počet v košíku správný
updateCartUI();
function updateCartUI() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    
    // Najde to číslo v červeném tlačítku a přepíše ho
    const countElement = document.querySelector('.cart-count');
    if (countElement) {
        countElement.innerText = totalItems;
    }
}