/* ==========================================
   Z SHOP - ADMIN PANEL
   ========================================== */

let products =
  JSON.parse(localStorage.getItem("zshop_products")) || [];

const form = document.getElementById("productForm");

function saveProducts() {

  localStorage.setItem(
    "zshop_products",
    JSON.stringify(products)
  );
}

function clearForm() {

  document.getElementById("productName").value = "";
  document.getElementById("productPrice").value = "";
  document.getElementById("productImage").value = "";
  document.getElementById("productDescription").value = "";

  document.getElementById("productCategory").value =
    "electronics";
}

form.addEventListener("submit", function(event) {

  event.preventDefault();

  const name =
    document.getElementById("productName").value.trim();

  const price =
    Number(document.getElementById("productPrice").value);

  const category =
    document.getElementById("productCategory").value;

  const image =
    document.getElementById("productImage").value.trim()
    || "cover.jpeg";

  const description =
    document.getElementById("productDescription").value.trim()
    || "Premium product from Z Shop.";

  if (!name) {
    alert("Please enter product name.");
    return;
  }

  const product = {

    id: Date.now(),

    name: name,

    price: price,

    category: category,

    image: image,

    description: description

  };

  products.push(product);

  saveProducts();

  renderAdminProducts();

  clearForm();

  alert("Product added successfully!");

});

function deleteProduct(id) {

  const product =
    products.find(item => item.id === id);

  if (!product) return;

  const confirmDelete =
    confirm(`Delete "${product.name}"?`);

  if (!confirmDelete) return;

  products =
    products.filter(item => item.id !== id);

  saveProducts();

  renderAdminProducts();
}

function renderAdminProducts() {

  const container =
    document.getElementById("adminProducts");

  if (!products.length) {

    container.innerHTML = `
      <div style="
        text-align:center;
        padding:50px;
        color:#777;
      ">
        <div style="font-size:45px">📦</div>
        <p>No products added yet.</p>
      </div>
    `;

    return;
  }

  container.innerHTML =
    products.map(product => {

      return `
        <div class="admin-product">

          <img
            src="${escapeHTML(product.image || "cover.jpeg")}"
            alt="${escapeHTML(product.name)}"
            onerror="this.src='cover.jpeg'"
          >

          <div class="admin-product-info">

            <h3>
              ${escapeHTML(product.name)}
            </h3>

            <p>
              ${Number(product.price) > 0
                ? "৳ " + Number(product.price).toLocaleString("en-BD")
                : "Contact"}
            </p>

            <small style="color:#666">
              ${escapeHTML(product.category)}
            </small>

          </div>

          <button
            class="delete-btn"
            onclick="deleteProduct(${product.id})"
          >
            Delete
          </button>

        </div>
      `;

    }).join("");
}

function escapeHTML(value) {

  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

renderAdminProducts();
