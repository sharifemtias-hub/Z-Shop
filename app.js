import { initializeApp } from
"https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy,
  addDoc,
  serverTimestamp,
  doc,
  getDoc
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

const db =
  getFirestore(app);


/* ================= PAYMENT ================= */

const PAYMENT_INFO = {

  bKash: {

    number:
      "01875487705",

    type:
      "bKash"

  },


  Nagad: {

    number:
      "01875487705",

    type:
      "Nagad"

  }

};


/* ================= VARIABLES ================= */

let products = [];

let cart = [];


/* ==================================================
   LOAD PRODUCTS
================================================== */

async function loadProducts() {

  const grid =
    document.getElementById(
      "productsGrid"
    );

  const loading =
    document.getElementById(
      "loading"
    );

  const empty =
    document.getElementById(
      "noProducts"
    );


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


    products = [];


    snapshot.forEach(
      productDoc => {

        products.push({

          id:
            productDoc.id,

          ...productDoc.data()

        });

      }
    );


    loading.style.display =
      "none";


    if (
      products.length === 0
    ) {

      empty.style.display =
        "block";

      return;

    }


    renderProducts();

  }

  catch (error) {

    console.error(error);

    loading.innerText =
      "Unable to load products. Please check Firebase.";

  }

}


/* ==================================================
   RENDER PRODUCTS
================================================== */

function renderProducts() {

  const grid =
    document.getElementById(
      "productsGrid"
    );


  grid.innerHTML =
    "";


  products.forEach(
    product => {

      const card =
        document.createElement(
          "div"
        );


      card.className =
        "product-card";


      const stock =
        Number(
          product.stock || 0
        );


      const outOfStock =
        stock <= 0;


      card.innerHTML = `

        <img
          class="product-image"
          src="${escapeAttribute(
            product.image ||
            "profile.jpeg"
          )}"
          alt="${escapeAttribute(
            product.name ||
            "Product"
          )}"
          onerror="this.src='profile.jpeg'"
        >


        <div class="product-info">

          <div class="product-name">

            ${escapeHTML(
              product.name ||
              "Unnamed Product"
            )}

          </div>


          <div class="product-description">

            ${escapeHTML(
              product.description ||
              ""
            )}

          </div>


          <div class="price">

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


          <button
            class="add-btn"
            ${
              outOfStock
              ? "disabled"
              : ""
            }
            onclick="addToCart('${product.id}')"
          >

            ${
              outOfStock
              ?
              "Out of Stock"
              :
              "Add to Cart"
            }

          </button>

        </div>

      `;


      grid.appendChild(card);

    }
  );

}


/* ==================================================
   ADD TO CART
================================================== */

window.addToCart =
function(id) {

  const product =
    products.find(
      p => p.id === id
    );


  if (!product)
    return;


  const stock =
    Number(
      product.stock || 0
    );


  if (stock <= 0) {

    alert(
      "This product is out of stock."
    );

    return;

  }


  const existing =
    cart.find(
      item => item.id === id
    );


  if (existing) {

    if (
      existing.qty >= stock
    ) {

      alert(
        `Only ${stock} item(s) available.`
      );

      return;

    }


    existing.qty++;

  }

  else {

    cart.push({

      ...product,

      qty: 1

    });

  }


  updateCart();

};


/* ==================================================
   UPDATE CART
================================================== */

function updateCart() {

  const count =
    cart.reduce(
      (
        sum,
        item
      ) =>
        sum + item.qty,
      0
    );


  document.getElementById(
    "cartCount"
  ).innerText =
    count;


  renderCart();

}


/* ==================================================
   RENDER CART
================================================== */

function renderCart() {

  const container =
    document.getElementById(
      "cartItems"
    );


  const totalElement =
    document.getElementById(
      "cartTotal"
    );


  container.innerHTML =
    "";


  let total = 0;


  if (
    cart.length === 0
  ) {

    container.innerHTML = `

      <div class="empty-cart">

        Your cart is empty.

      </div>

    `;


    totalElement.innerText =
      "0";


    return;

  }


  cart.forEach(
    item => {

      const price =
        Number(
          item.price || 0
        );


      const subtotal =
        price *
        item.qty;


      total += subtotal;


      const div =
        document.createElement(
          "div"
        );


      div.className =
        "cart-item";


      div.innerHTML = `

        <div>

          <strong>

            ${escapeHTML(
              item.name
            )}

          </strong>


          <br>

          ৳${price.toLocaleString()}


          <div class="item-subtotal">

            Subtotal:
            ৳${subtotal.toLocaleString()}

          </div>

        </div>


        <div class="qty">

          <button
            onclick="changeQty(
              '${item.id}',
              -1
            )"
          >
            −
          </button>


          <strong>
            ${item.qty}
          </strong>


          <button
            onclick="changeQty(
              '${item.id}',
              1
            )"
          >
            +
          </button>

        </div>

      `;


      container.appendChild(
        div
      );

    }
  );


  totalElement.innerText =
    total.toLocaleString();

}


/* ==================================================
   CHANGE QUANTITY
================================================== */

window.changeQty =
function(
  id,
  change
) {

  const item =
    cart.find(
      p => p.id === id
    );


  if (!item)
    return;


  const stock =
    Number(
      item.stock || 0
    );


  if (
    change > 0 &&
    item.qty >= stock
  ) {

    alert(
      `Only ${stock} item(s) available.`
    );

    return;

  }


  item.qty += change;


  if (
    item.qty <= 0
  ) {

    cart =
      cart.filter(
        p => p.id !== id
      );

  }


  updateCart();

};


/* ==================================================
   OPEN CART
================================================== */

window.openCart =
function() {

  document.getElementById(
    "cartModal"
  ).style.display =
    "flex";


  renderCart();

};


/* ==================================================
   CLOSE CART
================================================== */

window.closeCart =
function() {

  document.getElementById(
    "cartModal"
  ).style.display =
    "none";

};


/* ==================================================
   OPEN CHECKOUT
================================================== */

window.openCheckout =
function() {

  if (
    cart.length === 0
  ) {

    alert(
      "Your cart is empty."
    );

    return;

  }


  document.getElementById(
    "cartModal"
  ).style.display =
    "none";


  renderCheckout();


  document.getElementById(
    "checkoutModal"
  ).style.display =
    "flex";

};


/* ==================================================
   CLOSE CHECKOUT
================================================== */

window.closeCheckout =
function() {

  document.getElementById(
    "checkoutModal"
  ).style.display =
    "none";

};


/* ==================================================
   GET RECEIVE METHOD
================================================== */

function getReceiveMethod() {

  const selected =
    document.querySelector(
      'input[name="receiveMethod"]:checked'
    );


  return selected
    ? selected.value
    : "Delivery";

}


/* ==================================================
   RENDER CHECKOUT
================================================== */

function renderCheckout() {

  const container =
    document.getElementById(
      "checkoutItems"
    );


  const totalElement =
    document.getElementById(
      "checkoutTotal"
    );


  const breakdown =
    document.getElementById(
      "paymentBreakdown"
    );


  container.innerHTML =
    "";


  let total = 0;


  cart.forEach(
    item => {

      const price =
        Number(
          item.price || 0
        );


      const subtotal =
        price *
        item.qty;


      total += subtotal;


      const row =
        document.createElement(
          "div"
        );


      row.className =
        "summary-row";


      row.innerHTML = `

        <span>

          ${escapeHTML(
            item.name
          )}

          × ${item.qty}

        </span>


        <strong>

          ৳${subtotal.toLocaleString()}

        </strong>

      `;


      container.appendChild(
        row
      );

    }
  );


  totalElement.innerText =
    total.toLocaleString();


  updatePaymentBreakdown();

}


/* ==================================================
   AUTO PAYMENT CALCULATION
================================================== */

function updatePaymentBreakdown() {

  let total = 0;


  cart.forEach(
    item => {

      total +=
        Number(
          item.price || 0
        ) *
        item.qty;

    }
  );


  const method =
    getReceiveMethod();


  const breakdown =
    document.getElementById(
      "paymentBreakdown"
    );


  if (
    method === "Self Pickup"
  ) {

    const advance =
      Math.round(
        total * 0.70
      );


    const due =
      total -
      advance;


    breakdown.innerHTML = `

      <strong>
        🏪 Self Pickup Payment
      </strong>

      <br><br>

      Total:
      <strong>
        ৳${total.toLocaleString()}
      </strong>

      <br>

      Pay Now (70%):
      <strong>
        ৳${advance.toLocaleString()}
      </strong>

      <br>

      Due on Pickup (30%):
      <strong>
        ৳${due.toLocaleString()}
      </strong>

    `;

  }

  else {

    breakdown.innerHTML = `

      <strong>
        🚚 Delivery Payment
      </strong>

      <br><br>

      Total:
      <strong>
        ৳${total.toLocaleString()}
      </strong>

      <br>

      Pay Now (100%):
      <strong>
        ৳${total.toLocaleString()}
      </strong>

      <br>

      Due:
      <strong>
        ৳0
      </strong>

    `;

  }

}


/* ==================================================
   RECEIVE METHOD CHANGE
================================================== */

document
  .querySelectorAll(
    'input[name="receiveMethod"]'
  )
  .forEach(
    radio => {

      radio.addEventListener(
        "change",
        () => {

          const addressSection =
            document.getElementById(
              "addressSection"
            );


          const deliveryOption =
            document.getElementById(
              "deliveryOption"
            );


          const pickupOption =
            document.getElementById(
              "pickupOption"
            );


          if (
            radio.value ===
            "Self Pickup"
            &&
            radio.checked
          ) {

            addressSection.style.display =
              "none";


            document
              .getElementById(
                "customerAddress"
              )
              .value =
              "";


            deliveryOption.classList
              .remove("active");


            pickupOption.classList
              .add("active");

          }


          if (
            radio.value ===
            "Delivery"
            &&
            radio.checked
          ) {

            addressSection.style.display =
              "block";


            deliveryOption.classList
              .add("active");


            pickupOption.classList
              .remove("active");

          }


          updatePaymentBreakdown();

        }
      );

    }
  );


/* ==================================================
   PAYMENT METHOD INFO
================================================== */

document
  .getElementById(
    "paymentMethod"
  )
  .addEventListener(
    "change",
    showPaymentInfo
  );


function showPaymentInfo() {

  const method =
    document.getElementById(
      "paymentMethod"
    ).value;


  const box =
    document.getElementById(
      "paymentInfo"
    );


  if (!method) {

    box.style.display =
      "none";

    box.innerHTML =
      "";

    return;

  }


  if (
    method === "Bank Transfer"
  ) {

    box.innerHTML = `

      🏦 Bank Transfer is
      <strong>currently unavailable</strong>.

      <br><br>

      Please use bKash or Nagad.

    `;

    box.style.display =
      "block";

    return;

  }


  const info =
    PAYMENT_INFO[method];


  if (!info)
    return;


  box.innerHTML = `

    <strong>
      ${method}
    </strong>

    <br>

    Send the required payment
    to:

    <br>

    📱

    <strong>
      ${info.number}
    </strong>

    <br><br>

    After payment:

    <br>

    1. Copy your Transaction ID.

    <br>

    2. Enter it below.

    <br>

    3. Submit your order.

  `;


  box.style.display =
    "block";

}


/* ==================================================
   PLACE ORDER
================================================== */

window.placeOrder =
async function() {

  const name =
    document.getElementById(
      "customerName"
    ).value.trim();


  const phone =
    document.getElementById(
      "customerPhone"
    ).value.trim();


  const address =
    document.getElementById(
      "customerAddress"
    ).value.trim();


  const paymentMethod =
    document.getElementById(
      "paymentMethod"
    ).value;


  const transactionId =
    document.getElementById(
      "transactionId"
    ).value.trim();


  const receiveMethod =
    getReceiveMethod();


  const errorBox =
    document.getElementById(
      "checkoutError"
    );


  const button =
    document.getElementById(
      "placeOrderBtn"
    );


  errorBox.innerText =
    "";


  /* ================= VALIDATION ================= */

  if (!name) {

    errorBox.innerText =
      "Please enter your name.";

    return;

  }


  if (!phone) {

    errorBox.innerText =
      "Please enter your phone number.";

    return;

  }


  if (
    !/^01[3-9]\d{8}$/.test(
      phone
    )
  ) {

    errorBox.innerText =
      "Please enter a valid Bangladesh phone number.";

    return;

  }


  if (
    receiveMethod ===
    "Delivery" &&
    !address
  ) {

    errorBox.innerText =
      "Please enter your delivery address.";

    return;

  }


  if (!paymentMethod) {

    errorBox.innerText =
      "Please select a payment method.";

    return;

  }


  if (
    paymentMethod ===
    "Bank Transfer"
  ) {

    errorBox.innerText =
      "Bank Transfer is currently unavailable.";

    return;

  }


  if (!transactionId) {

    errorBox.innerText =
      "Please enter your Transaction ID.";

    return;

  }


  if (
    cart.length === 0
  ) {

    errorBox.innerText =
      "Your cart is empty.";

    return;

  }


  /* ================= DISABLE ================= */

  button.disabled =
    true;

  button.innerText =
    "Checking stock...";


  try {

    /*
      Re-check every product from Firebase.
    */

    const verifiedItems = [];


    for (
      const cartItem of cart
    ) {

      const productRef =
        doc(
          db,
          "products",
          cartItem.id
        );


      const productSnap =
        await getDoc(
          productRef
        );


      if (
        !productSnap.exists()
      ) {

        throw new Error(
          `${cartItem.name} is no longer available.`
        );

      }


      const latest =
        productSnap.data();


      const stock =
        Number(
          latest.stock || 0
        );


      if (
        stock <
        cartItem.qty
      ) {

        throw new Error(
          `Only ${stock} of "${cartItem.name}" is available.`
        );

      }


      verifiedItems.push({

        productId:
          cartItem.id,

        productName:
          latest.name,

        price:
          Number(
            latest.price || 0
          ),

        quantity:
          cartItem.qty,

        subtotal:
          Number(
            latest.price || 0
          ) *
          cartItem.qty

      });

    }


    /* ================= TOTAL ================= */

    const total =
      verifiedItems.reduce(
        (
          sum,
          item
        ) =>
          sum + item.subtotal,
        0
      );


    let paidNow =
      total;


    let dueOnPickup =
      0;


    let paymentPlan =
      "Full Payment";


    if (
      receiveMethod ===
      "Self Pickup"
    ) {

      paidNow =
        Math.round(
          total * 0.70
        );


      dueOnPickup =
        total -
        paidNow;


      paymentPlan =
        "70% Advance + 30% On Pickup";

    }


    /* ================= ORDER ID ================= */

    const random =
      Math.random()
        .toString(36)
        .substring(
          2,
          8
        )
        .toUpperCase();


    const orderId =
      `ZSHOP-${Date.now()}-${random}`;


    /* ================= SAVE ORDER ================= */

    button.innerText =
      "Submitting Order...";


    await addDoc(
      collection(
        db,
        "orders"
      ),
      {

        orderId,

        customer: {

          name,

          phone,

          address:
            receiveMethod ===
            "Delivery"
            ? address
            : ""

        },


        receiveMethod,


        paymentPlan,


        items:
          verifiedItems,


        total,


        paidNow,


        dueOnPickup,


        payment: {

          method:
            paymentMethod,

          transactionId,

          status:
            "Pending"

        },


        orderStatus:
          "Pending",


        createdAt:
          serverTimestamp()

      }
    );


    /* ================= SUCCESS ================= */

    cart = [];


    updateCart();


    document.getElementById(
      "checkoutModal"
    ).style.display =
      "none";


    document.getElementById(
      "successOrderId"
    ).innerText =
      orderId;


    document.getElementById(
      "successPaymentInfo"
    ).innerHTML = `

      <strong>
        ${
          receiveMethod ===
          "Delivery"
          ?
          "🚚 D
