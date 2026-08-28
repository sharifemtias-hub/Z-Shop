import { initializeApp } from
"https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy
} from
"https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyDNS1kJkHfDqFz5Nr8YJe-CnMyyCmWSPEw",
  authDomain: "z-shop-e1a3e.firebaseapp.com",
  projectId: "z-shop-e1a3e",
  storageBucket: "z-shop-e1a3e.firebasestorage.app",
  messagingSenderId: "501847773563",
  appId: "1:501847773563:web:0be960fed00363b85e2dde",
  measurementId: "G-XK9K643HDD"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let products = [];
let cart = [];

async function loadProducts() {

  const grid = document.getElementById("productsGrid");
  const loading = document.getElementById("loading");
  const empty = document.getElementById("noProducts");

  try {

    const q = query(
      collection(db, "products"),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);

    products = [];

    snapshot.forEach(doc => {
      products.push({
        id: doc.id,
        ...doc.data()
      });
    });

    loading.style.display = "none";

    if (products.length === 0) {
      empty.style.display = "block";
      return;
    }

    renderProducts();

  } catch (error) {

    console.error(error);

    loading.innerText =
      "Unable to load products. Please check Firebase.";

  }
}

function renderProducts() {

  const grid = document.getElementById("productsGrid");

  grid.innerHTML = "";

  products.forEach(product => {

    const card = document.createElement("div");

    card.className = "product-card";

    card.innerHTML = `

      <img
        class="product-image"
        src="${product.image || "profile.jpeg"}"
        alt="${product.name || "Product"}"
        onerror="this.src='profile.jpeg'"
      >

      <div class="product-info">

        <div class="product-name">
          ${product.name || "Unnamed Product"}
        </div>

        <div class="product-description">
          ${product.description || ""}
        </div>

        <div class="price">

          ৳${Number(product.price || 0).toLocaleString()}

          ${
            product.oldPrice
            ?
            `<span class="old-price">
              ৳${Number(product.oldPrice).toLocaleString()}
            </span>`
            :
            ""
          }

        </div>

        <button
          class="add-btn"
          onclick="addToCart('${product.id}')"
        >
          Add to Cart
        </button>

      </div>
    `;

    grid.appendChild(card);
  });
}

window.addToCart = function(id) {

  const product = products.find(p => p.id === id);

  if (!product) return;

  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({
      ...product,
      qty: 1
    });
  }

  updateCart();

  alert("Product added to cart!");
};

function updateCart() {

  const count = cart.reduce(
    (sum, item) => sum + item.qty,
    0
  );

  document.getElementById("cartCount").innerText = count;

  renderCart();
}

function renderCart() {

  const container = document.getElementById("cartItems");

  const totalElement =
    document.getElementById("cartTotal");

  container.innerHTML = "";

  let total = 0;

  cart.forEach(item => {

    total += Number(item.price || 0) * item.qty;

    const div = document.createElement("div");

    div.className = "cart-item";

    div.innerHTML = `

      <div>
        <strong>${item.name}</strong>
        <br>
        ৳${Number(item.price || 0).toLocaleString()}
      </div>

      <div class="qty">

        <button onclick="changeQty('${item.id}', -1)">
          -
        </button>

        ${item.qty}

        <button onclick="changeQty('${item.id}', 1)">
          +
        </button>

      </div>
    `;

    container.appendChild(div);
  });

  totalElement.innerText =
    total.toLocaleString();
}

window.changeQty = function(id, change) {

  const item = cart.find(p => p.id === id);

  if (!item) return;

  item.qty += change;

  if (item.qty <= 0) {
    cart = cart.filter(p => p.id !== id);
  }

  updateCart();
};

window.openCart = function() {

  document.getElementById("cartModal").style.display = "flex";

  renderCart();
};

window.closeCart = function() {

  document.getElementById("cartModal").style.display = "none";
};

window.checkoutWhatsApp = function() {

  if (cart.length === 0) {

    alert("Your cart is empty.");

    return;
  }

  let message = "🛍️ *Z SHOP ORDER*%0A%0A";

  let total = 0;

  cart.forEach(item => {

    const subtotal =
      Number(item.price || 0) * item.qty;

    total += subtotal;

    message +=
      `• ${item.name} × ${item.qty} = ৳${subtotal}%0A`;
  });

  message +=
    `%0A💰 *Total: ৳${total}*`;

  const url =
    `https://wa.me/8801875487705?text=${message}`;

  window.open(url, "_blank");
};

loadProducts();
