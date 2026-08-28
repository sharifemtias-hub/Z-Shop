import { initializeApp } from
"https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from
"https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
  query,
  orderBy
} from
"https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


/* ================= FIREBASE ================= */

const firebaseConfig = {

  apiKey:
    "AIzaSyDNS1kJkHfDqFz5Nr8YJe-CnMyyCmWSPEw",

  authDomain:
    "z-shop-e1a3e.firebaseapp.com",

  projectId:
    "z-shop-e1a3e",

  storageBucket:
    "z-shop-e1a3e.firebasestorage.app",

  messagingSenderId:
    "501847773563",

  appId:
    "1:501847773563:web:0be960fed00363b85e2dde",

  measurementId:
    "G-XK9K643HDD"
};


const app =
  initializeApp(firebaseConfig);

const auth =
  getAuth(app);

const db =
  getFirestore(app);


/* ================= VARIABLES ================= */

let editingId = null;

let imageIsValid = false;


/* ================= ELEMENTS ================= */

const email =
  document.getElementById("email");

const password =
  document.getElementById("password");

const loginBtn =
  document.getElementById("loginBtn");

const loginMessage =
  document.getElementById("loginMessage");

const loginBox =
  document.getElementById("loginBox");

const dashboard =
  document.getElementById("dashboard");

const logoutBtn =
  document.getElementById("logoutBtn");

const productName =
  document.getElementById("productName");

const productPrice =
  document.getElementById("productPrice");

const productOldPrice =
  document.getElementById("productOldPrice");

const productImage =
  document.getElementById("productImage");

const productStock =
  document.getElementById("productStock");

const productFeatured =
  document.getElementById("productFeatured");

const productDescription =
  document.getElementById("productDescription");

const imagePreview =
  document.getElementById("imagePreview");

const previewText =
  document.getElementById("previewText");

const imageStatus =
  document.getElementById("imageStatus");

const stockPreview =
  document.getElementById("stockPreview");

const saveProductBtn =
  document.getElementById("saveProductBtn");

const cancelEditBtn =
  document.getElementById("cancelEditBtn");

const productMessage =
  document.getElementById("productMessage");

const productList =
  document.getElementById("productList");


/* ================= LOGIN ================= */

loginBtn.addEventListener(
  "click",
  async () => {

    const userEmail =
      email.value.trim();

    const userPassword =
      password.value;

    loginMessage.className =
      "message";

    if (
      !userEmail ||
      !userPassword
    ) {

      loginMessage.innerText =
        "Please enter email and password.";

      return;
    }


    loginBtn.disabled = true;

    loginBtn.innerText =
      "Logging in...";


    try {

      await signInWithEmailAndPassword(
        auth,
        userEmail,
        userPassword
      );

      loginMessage.innerText =
        "";

    }

    catch (error) {

      console.error(error);

      loginMessage.className =
        "message error";

      loginMessage.innerText =
        "Login failed. Check your email and password.";

    }

    finally {

      loginBtn.disabled = false;

      loginBtn.innerText =
        "Login";

    }

  }
);


/* ================= AUTH ================= */

onAuthStateChanged(
  auth,
  user => {

    if (user) {

      loginBox.style.display =
        "none";

      dashboard.style.display =
        "block";

      loadProducts();

    }

    else {

      loginBox.style.display =
        "block";

      dashboard.style.display =
        "none";

    }

  }
);


/* ================= LOGOUT ================= */

logoutBtn.addEventListener(
  "click",
  async () => {

    await signOut(auth);

  }
);


/* ================= IMAGE PREVIEW ================= */

productImage.addEventListener(
  "input",
  previewProductImage
);


function previewProductImage() {

  let filename =
    productImage.value.trim();


  imageIsValid = false;

  saveProductBtn.disabled =
    true;


  if (!filename) {

    imagePreview.style.display =
      "none";

    previewText.style.display =
      "block";

    previewText.innerText =
      "Image preview will appear here";

    imageStatus.innerText =
      "";

    return;
  }


  /*
    IMPORTANT:

    Images must be stored in:

    products/

    Example:

    products/watch.jpg
  */

  const imagePath =
    `products/${filename}`;


  imagePreview.src =
    imagePath;


  imagePreview.onload =
    () => {

      imagePreview.style.display =
        "block";

      previewText.style.display =
        "none";

      imageStatus.className =
        "image-status success";

      imageStatus.innerText =
        "✓ Image found";

      imageIsValid =
        true;

      validateForm();

    };


  imagePreview.onerror =
    () => {

      imagePreview.style.display =
        "none";

      previewText.style.display =
        "block";

      previewText.innerText =
        "Image not found";

      imageStatus.className =
        "image-status error";

      imageStatus.innerText =
        "✕ Check filename and extension";

      imageIsValid =
        false;

      saveProductBtn.disabled =
        true;

    };

}


/* ================= STOCK PREVIEW ================= */

productStock.addEventListener(
  "input",
  updateStockPreview
);


function updateStockPreview() {

  const stock =
    Number(productStock.value || 0);


  if (stock > 0) {

    stockPreview.innerText =
      `🟢 In Stock (${stock})`;

    stockPreview.style.color =
      "#16752b";

  }

  else {

    stockPreview.innerText =
      "🔴 Out of Stock";

    stockPreview.style.color =
      "#a00000";

  }

}


/* ================= FORM VALIDATION ================= */

[
  productName,
  productPrice,
  productStock
].forEach(
  element => {

    element.addEventListener(
      "input",
      validateForm
    );

  }
);


function validateForm() {

  const name =
    productName.value.trim();

  const price =
    Number(productPrice.value);

  const stock =
    Number(productStock.value);


  if (
    name &&
    price >= 0 &&
    stock >= 0 &&
    imageIsValid
  ) {

    saveProductBtn.disabled =
      false;

  }

  else {

    saveProductBtn.disabled =
      true;

  }

}


/* ================= ADD / UPDATE ================= */

saveProductBtn.addEventListener(
  "click",
  async () => {

    const name =
      productName.value.trim();

    const price =
      Number(productPrice.value);

    const oldPriceValue =
      productOldPrice.value.trim();

    const oldPrice =
      oldPriceValue
      ? Number(oldPriceValue)
      : null;

    const filename =
      productImage.value.trim();

    const stock =
      Number(productStock.value || 0);

    const featured =
      productFeatured.value === "true";

    const description =
      productDescription.value.trim();


    if (
      !name ||
      price < 0 ||
      stock < 0 ||
      !imageIsValid
    ) {

      productMessage.className =
        "message error";

      productMessage.innerText =
        "Please complete the required fields.";

      return;
    }


    const image =
      `products/${filename}`;


    saveProductBtn.disabled =
      true;

    saveProductBtn.innerText =
      editingId
      ? "Updating..."
      : "Adding...";


    try {

      if (editingId) {

        await updateDoc(
          doc(
            db,
            "products",
            editingId
          ),
          {

            name,

            price,

            oldPrice,

            image,

            stock,

            featured,

            description

          }
        );


        productMessage.className =
          "message success";

        productMessage.innerText =
          "✓ Product updated successfully.";

      }

      else {

        await addDoc(
          collection(
            db,
            "products"
          ),
          {

            name,

            price,

            oldPrice,

            image,

            stock,

            featured,

            description,

            createdAt:
              serverTimestamp()

          }
        );


        productMessage.className =
          "message success";

        productMessage.innerText =
          "✓ Product added successfully.";

      }


      resetForm();

      await loadProducts();

    }

    catch (error) {

      console.error(error);

      productMessage.className =
        "message error";

      productMessage.innerText =
        "Something went wrong. Check Firebase.";

    }

    finally {

      saveProductBtn.innerText =
        editingId
        ? "Update Product"
        : "Add Product";

      validateForm();

    }

  }
);


/* ================= LOAD PRODUCTS ================= */

async function loadProducts() {

  productList.innerHTML =
    "Loading products...";


  try {

    const q =
      query(
        collection(
          db,
          "products"
        ),
        orderBy(
          "createdAt",
          "desc"
        )
      );


    const snapshot =
      await getDocs(q);


    productList.innerHTML =
      "";


    if (
      snapshot.empty
    ) {

      productList.innerHTML =
        "<p>No products added yet.</p>";

      return;

    }


    snapshot.forEach(
      productDoc => {

        const product =
          productDoc.data();

        const id =
          productDoc.id;


        const stock =
          Number(
            product.stock || 0
          );


        const div =
          document.createElement(
            "div"
          );


        div.className =
          "product";


        div.innerHTML = `

          <img
            src="${product.image || "profile.jpeg"}"
            alt="${product.name || "Product"}"
            onerror="this.src='profile.jpeg'"
          >


          ${
            product.featured
            ?
            `
            <span class="badge featured">
              ⭐ Featured
            </span>
            `
            :
            ""
          }


          <h3>
            ${escapeHTML(
              product.name || "Unnamed"
            )}
          </h3>


          <div class="product-description">
            ${escapeHTML(
              product.description || ""
            )}
          </div>


          <div class="product-price">

            ৳${Number(
              product.price || 0
            ).toLocaleString()}

            ${
              product.oldPrice
              ?
              `
              <span class="old-price">
                ৳${Number(
                  product.oldPrice
                ).toLocaleString()}
              </span>
              `
              :
              ""
            }

          </div>


          ${
            stock > 0
            ?
            `
            <span class="badge in-stock">
              🟢 In Stock: ${stock}
            </span>
            `
            :
            `
            <span class="badge out-stock">
              🔴 Out of Stock
            </span>
            `
          }


          <div class="actions">

            <button
              class="edit"
              data-id="${id}"
            >
              Edit
            </button>

            <button
              class="delete"
              data-id="${id}"
            >
              Delete
            </button>

          </div>

        `;


        div
          .querySelector(".edit")
          .addEventListener(
            "click",
            () => editProduct(
              id,
              product
            )
          );


        div
          .querySelector(".delete")
          .addEventListener(
            "click",
            () => deleteProduct(
              id,
              product.name
            )
          );


        productList.appendChild(
          div
        );

      }
    );

  }

  catch (error) {

    console.error(error);

    productList.innerHTML =
      `
      <p class="error">
        Unable to load products.
      </p>
      `;

  }

}


/* ================= EDIT ================= */

function editProduct(
  id,
  product
) {

  editingId =
    id;


  productName.value =
    product.name || "";


  productPrice.value =
    product.price ?? "";


  productOldPrice.value =
    product.oldPrice ?? "";


  productStock.value =
    product.stock ?? 0;


  productFeatured.value =
    product.featured
    ? "true"
    : "false";


  productDescription.value =
    product.description || "";


  /*
    Firestore stores:

    products/watch.jpg

    Admin input should show:

    watch.jpg
  */

  let filename =
    product.image || "";

  filename =
    filename
      .replace(
        /^products\//,
        ""
      );


  productImage.value =
    filename;


  document.getElementById(
    "formTitle"
  ).innerText =
    "Edit Product";


  saveProductBtn.innerText =
    "Update Product";


  cancelEditBtn.style.display =
    "block";


  productMessage.innerText =
    "";


  updateStockPreview();


  /*
    Trigger image preview
  */

  previewProductImage();


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


/* ================= DELETE ================= */

async function deleteProduct(
  id,
  name
) {

  const confirmed =
    confirm(
      `Delete "${name}"?`
    );


  if (!confirmed) return;


  try {

    await deleteDoc(
      doc(
        db,
        "products",
        id
      )
    );


    await loadProducts();

  }

  catch (error) {

    console.error(error);

    alert(
      "Delete failed."
    );

  }

}


/* ================= RESET ================= */

cancelEditBtn.addEventListener(
  "click",
  resetForm
);


function resetForm() {

  editingId =
    null;

  imageIsValid =
    false;


  productName.value =
    "";

  productPrice.value =
    "";

  productOldPrice.value =
    "";

  productImage.value =
    "";

  productStock.value =
    "0";

  productFeatured.value =
    "false";

  productDescription.value =
    "";


  document.getElementById(
    "formTitle"
  ).innerText =
    "Add Product";


  saveProductBtn.innerText =
    "Add Product";


  cancelEditBtn.style.display =
    "none";


  imagePreview.style.display =
    "none";


  previewText.style.display =
    "block";


  previewText.innerText =
    "Image preview will appear here";


  imageStatus.innerText =
    "";


  productMessage.innerText =
    "";


  updateStockPreview();


  saveProductBtn.disabled =
    true;

}


/* ================= SECURITY HELPER ================= */

function escapeHTML(value) {

  return String(value)
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );

}
