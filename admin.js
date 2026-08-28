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

const auth = getAuth(app);

const db = getFirestore(app);


let editingId = null;


/* LOGIN */

document
  .getElementById("loginBtn")
  .addEventListener("click", async () => {

    const email =
      document.getElementById("email").value.trim();

    const password =
      document.getElementById("password").value;

    const message =
      document.getElementById("loginMessage");

    if (!email || !password) {

      message.innerText =
        "Please enter email and password.";

      return;
    }

    try {

      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      message.innerText = "";

    } catch (error) {

      console.error(error);

      message.innerText =
        "Login failed. Check your email and password.";

    }

  });


/* AUTH STATE */

onAuthStateChanged(auth, user => {

  if (user) {

    document.getElementById("loginBox")
      .style.display = "none";

    document.getElementById("dashboard")
      .style.display = "block";

    loadProducts();

  } else {

    document.getElementById("loginBox")
      .style.display = "block";

    document.getElementById("dashboard")
      .style.display = "none";

  }

});


/* LOGOUT */

document
  .getElementById("logoutBtn")
  .addEventListener("click", async () => {

    await signOut(auth);

  });


/* ADD / UPDATE */

document
  .getElementById("saveProductBtn")
  .addEventListener("click", async () => {

    const name =
      document.getElementById("productName")
        .value.trim();

    const price =
      Number(
        document.getElementById("productPrice")
          .value
      );

    const oldPriceValue =
      document.getElementById("productOldPrice")
        .value;

    const oldPrice =
      oldPriceValue
      ? Number(oldPriceValue)
      : null;

    const image =
      document.getElementById("productImage")
        .value.trim();

    const description =
      document.getElementById("productDescription")
        .value.trim();

    const message =
      document.getElementById("productMessage");


    if (!name || !price) {

      message.innerText =
        "Product name and price are required.";

      return;
    }


    try {

      if (editingId) {

        await updateDoc(
          doc(db, "products", editingId),
          {
            name,
            price,
            oldPrice,
            image,
            description
          }
        );

        message.innerText =
          "Product updated successfully.";

      } else {

        await addDoc(
          collection(db, "products"),
          {
            name,
            price,
            oldPrice,
            image,
            description,
            createdAt: serverTimestamp()
          }
        );

        message.innerText =
          "Product added successfully.";
      }

      resetForm();

      loadProducts();

    } catch (error) {

      console.error(error);

      message.innerText =
        "Something went wrong.";

    }

  });


/* LOAD PRODUCTS */

async function loadProducts() {

  const list =
    document.getElementById("productList");

  list.innerHTML = "Loading...";

  try {

    const q = query(
      collection(db, "products"),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);

    list.innerHTML = "";

    snapshot.forEach(productDoc => {

      const product =
        productDoc.data();

      const id =
        productDoc.id;

      const div =
        document.createElement("div");

      div.className = "product";

      div.innerHTML = `

        <img
          src="${product.image || "profile.jpeg"}"
          onerror="this.src='profile.jpeg'"
        >

        <h3>
          ${product.name || "Unnamed"}
        </h3>

        <p>
          ${product.description || ""}
        </p>

        <strong>
          ৳${Number(product.price || 0).toLocaleString()}
        </strong>

        ${
          product.oldPrice
          ?
          `<del>
            ৳${Number(product.oldPrice).toLocaleString()}
          </del>`
          :
          ""
        }

        <div class="actions">

          <button
            class="edit"
            onclick="editProduct('${id}')"
          >
            Edit
          </button>

          <button
            class="delete"
            onclick="deleteProduct('${id}')"
          >
            Delete
          </button>

        </div>
      `;

      list.appendChild(div);

    });

  } catch (error) {

    console.error(error);

    list.innerHTML =
      "Unable to load products.";

  }
}


/* DELETE */

window.deleteProduct = async function(id) {

  if (!confirm(
    "Are you sure you want to delete this product?"
  )) return;

  try {

    await deleteDoc(
      doc(db, "products", id)
    );

    loadProducts();

  } catch (error) {

    console.error(error);

    alert("Delete failed.");

  }

};


/* EDIT */

window.editProduct = async function(id) {

  try {

    const snapshot =
      await getDocs(
        collection(db, "products")
      );

    let selected = null;

    snapshot.forEach(d => {

      if (d.id === id) {

        selected = {
          id: d.id,
          ...d.data()
        };

      }

    });

    if (!selected) return;

    editingId = id;

    document.getElementById("productName")
      .value = selected.name || "";

    document.getElementById("productPrice")
      .value = selected.price || "";

    document.getElementById("productOldPrice")
      .value = selected.oldPrice || "";

    document.getElementById("productImage")
      .value = selected.image || "";

    document.getElementById("productDescription")
      .value = selected.description || "";

    document.getElementById("formTitle")
      .innerText = "Edit Product";

    document.getElementById("saveProductBtn")
      .innerText = "Update Product";

    document.getElementById("cancelEditBtn")
      .style.display = "block";

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  } catch (error) {

    console.error(error);

  }

};


/* RESET */

document
  .getElementById("cancelEditBtn")
  .addEventListener("click", resetForm);


function resetForm() {

  editingId = null;

  document.getElementById("productName")
    .value = "";

  document.getElementById("productPrice")
    .value = "";

  document.getElementById("productOldPrice")
    .value = "";

  document.getElementById("productImage")
    .value = "";

  document.getElementById("productDescription")
    .value = "";

  document.getElementById("formTitle")
    .innerText = "Add Product";

  document.getElementById("saveProductBtn")
    .innerText = "Add Product";

  document.getElementById("cancelEditBtn")
    .style.display = "none";

}
