/* ==========================================
   Z SHOP - CUSTOMER WEBSITE
   ========================================== */

const DEFAULT_PRODUCTS = [
  {
    id: 1,
    name: "Premium Product",
    category: "other",
    price: 0,
    image: "cover.jpeg",
    description: "Add your products from the Admin Panel."
  }
];

let products = JSON.parse(localStorage.getItem("zshop_products")) || [];
let cart = JSON.parse(localStorage.getItem("zshop_cart")) || [];

function money(number) {
  return Number(number || 0).toLocaleString("en-BD");
}

function saveCart() {
  localStorage.setItem("zshop_cart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  document.getElementById("cartCount").textContent = count;
}

function getProducts() {
  return products;
}

function renderProducts(list = products) {

  const grid = document.getElementById("productGrid");
  const empty = document.getElementById("emptyProducts");

  if (!list.length) {
    grid.innerHTML = "";
    empty.style.display = "block";
    return;
  }

  empty.style.display = "none";

  grid.innerHTML = list.map(product => {

    return `
      <article class="product-card">

        <div class="product-image">
          <img
            src="${escapeHTML(product.image || "cover.jpeg")}"
            alt="${escapeHTML(product.name)}"
            onerror="this.src='cover.jpeg'"
          >
        </div>

        <div class="product-info">

          <span class="product-category">
            ${escapeHTML(product.category || "other")}
          </span>

          <h3>${escapeHTML(product.name)}</h3>

          <p class="product-description">
            ${escapeHTML(product.description || "Premium product from Z Shop.")}
          </p>

          <div class="product-bottom">

            <div class="price">
              ${Number(product.price) > 0 ? "৳ " + money(product.price) : "Contact"}
            </div>

            <button
              class="add-btn"
              onclick="addToCart(${product.id})"
            >
              + Cart
            </button>

          </div>

          <button
            class="details-btn"
            onclick="openProduct(${product.id})"
          >
            View Details
          </button>

        </div>
      </article>
    `;

  }).join("");
}

function filterProducts(category, button) {

  document.querySelectorAll(".category").forEach(btn => {
    btn.classList.remove("active");
  });

  button.classList.add("active");

  if (category === "all") {
    renderProducts(products);
  } else {
    renderProducts(
      products.filter(product => product.category === category)
    );
  }
}

function addToCart(id) {

  const product = products.find(p => p.id === id);

  if (!product) return;

  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({
      ...product,
      quantity: 1
    });
  }

  saveCart();
  renderCart();

  alert(`${product.name} added to cart.`);
}

function removeFromCart(id) {

  cart = cart.filter(item => item.id !== id);

  saveCart();
  renderCart();
}

function changeQuantity(id, change) {

  const item = cart.find(product => product.id === id);

  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    removeFromCart(id);
    return;
  }

  saveCart();
  renderCart();
}

function openCart() {

  document.getElementById("cartModal").classList.add("show");

  renderCart();
}

function closeCart() {

  document.getElementById("cartModal").classList.remove("show");
}

function renderCart() {

  const container = document.getElementById("cartItems");
  const totalElement = document.getElementById("cartTotal");

  if (!cart.length) {

    container.innerHTML = `
      <div style="text-align:center;padding:35px 10px;color:#777">
        <div style="font-size:45px">🛒</div>
        <p>Your cart is empty.</p>
      </div>
    `;

    totalElement.textContent = "0";
    return;
  }

  let total = 0;

  container.innerHTML = cart.map(item => {

    total += Number(item.price || 0) * item.quantity;

    return `
      <div class="cart-item">

        <img
          src="${escapeHTML(item.image || "cover.jpeg")}"
          onerror="this.src='cover.jpeg'"
        >

        <div class="cart-item-info">
          <h4>${escapeHTML(item.name)}</h4>
          <p>৳ ${money(item.price)} × ${item.quantity}</p>

          <div style="margin-top:7px">
            <button
              onclick="changeQuantity(${item.id}, -1)"
              style="background:#222;color:white;border:0;padding:3px 8px;border-radius:5px"
            >−</button>

            <span style="padding:0 8px">${item.quantity}</span>

            <button
              onclick="changeQuantity(${item.id}, 1)"
              style="background:#222;color:white;border:0;padding:3px 8px;border-radius:5px"
            >+</button>
          </div>
        </div>

        <button
          class="remove-item"
          onclick="removeFromCart(${item.id})"
        >
          ✕
        </button>

      </div>
    `;

  }).join("");

  totalElement.textContent = money(total);
}

function checkoutWhatsApp() {

  if (!cart.length) {
    alert("Your cart is empty.");
    return;
  }

  let message = "🛍️ *Z SHOP ORDER*%0A%0A";

  cart.forEach((item, index) => {

    message +=
      `${index + 1}. ${item.name}%0A` +
      `Quantity: ${item.quantity}%0A` +
      `Price: ৳${money(item.price)}%0A%0A`;

  });

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price || 0) * item.quantity,
    0
  );

  message += `*Total: ৳${money(total)}*%0A%0A`;
  message += "Please confirm my order.";

  window.open(
    `https://wa.me/8801875487705?text=${message}`,
    "_blank"
  );
}

function openProduct(id) {

  const product = products.find(p => p.id === id);

  if (!product) return;

  document.getElementById("modalImage").src =
    product.image || "cover.jpeg";

  document.getElementById("modalCategory").textContent =
    product.category || "Other";

  document.getElementById("modalName").textContent =
    product.name;

  document.getElementById("modalDescription").textContent =
    product.description || "Premium product from Z Shop.";

  document.getElementById("modalPrice").textContent =
    Number(product.price) > 0
      ? money(product.price)
      : "Contact";

  document.getElementById("modalAddBtn").onclick = () => {
    addToCart(product.id);
    closeProduct();
  };

  document.getElementById("productModal").classList.add("show");
}

function closeProduct() {

  document.getElementById("productModal").classList.remove("show");
}

function escapeHTML(value) {

  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

window.addEventListener("click", event => {

  if (event.target.id === "cartModal") {
    closeCart();
  }

  if (event.target.id === "productModal") {
    closeProduct();
  }

});

document.getElementById("year").textContent =
  new Date().getFullYear();

renderProducts(products);
updateCartCount();
