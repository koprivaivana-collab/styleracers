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