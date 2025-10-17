// data
let PRODUCTS = [];
const BASKET = [];

const basketCounter = document.querySelector(".counter");
const basketBtn = document.querySelector(".basket");
const allButton = document.querySelector("h1");
const root = document.getElementById("root");

const getProducts = () => {
  // متد برای گرفتن از دیتا از سرور
  // پرامیس برمیگردونه
  fetch("https://fakestoreapi.com/products")
    .then((response) => {
      // json
      // یک نوع داده است که بین کلاینت و سرور رد و بدل
      // اینجا باید پارسش کنیم
      return response.json();
    })
    .then((data) => {
      // یک آرایه از آبجکت ها
      PRODUCTS = data;
      render(data);
    });
};

const handleAddToBasket = (productId) => {
  const selectedProduct = PRODUCTS.find((item) => item.id === productId);
  if (!selectedProduct) return;

  const isInBasket = BASKET.some((item) => item.id === productId);

  if (isInBasket) {
    // حذف از سبد
    BASKET = BASKET.filter((item) => item.id !== productId);
  } else {
    // اضافه به سبد
    BASKET.push(selectedProduct);
  }

  basketCounter.textContent = BASKET.length;

  // اگر در حالت سبد هستیم، همون سبد رو دوباره رندر کن
  if (container.classList.contains("basket-view")) {
    renderBasket(BASKET);
  } else {
    render(PRODUCTS);
  }
};

const showBasket = () => {
  renderBasket(BASKET);
};

const showAllProducts = () => {
  render(PRODUCTS);
};

const render = (list) => {
  const template = list.map((product) => {
    return `
            <div class='card'>
                <div>
                    <img src="${product.image}" />
                    <h3>${product.title}</h3>
                    <p>price: ${product.price}</p>
                </div>
               ${
                 BASKET.find((item) => item.id === product.id)
                   ? ` <button onclick="handleAddToBasket(${product.id})" class="remove">REMOVE FROM BASKET</button>`
                   : ` <button onclick="handleAddToBasket(${product.id})">ADD TO Basket</button>`
               }
            </div>
        `;
  });
  root.classList.remove("basket-view");
  root.innerHTML = template.join("");
};

const renderBasket = (list) => {
  const template = list.map((product) => {
    return `
              <div class='basket-card'>
                      <img src="${product.image}" />
                      <h3>${product.title}</h3>
                      <p>price: ${product.price}</p>
                  <button onclick='handleAddToBasket(${product.id})'>ADD TO Basket</button>
              </div>
          `;
  });
  root.classList.add("basket-view");
  root.innerHTML = template.join("");
};

window.addEventListener("load", getProducts);
basketBtn.addEventListener("click", showBasket);
allButton.addEventListener("click", showAllProducts);
