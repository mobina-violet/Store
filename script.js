let PRODUCTS = [];
let BASKET = [];
//select to the DOM
const basketBtn = document.querySelector(".basket");
const counterBasket = document.querySelector(".counter");
const showAllproducts = document.querySelector(".logo");
const container = document.querySelector("#container");
const category = document.querySelectorAll(".navbar a");
const input = document.querySelector("input");
const homeSection = document.querySelector(".home");
const discountSection = document.querySelector(".discount");
const infoSection = document.querySelector(".info");
const inputName = document.querySelector("#input-name");
const inputEmail = document.querySelector('input[type="email"]');
const inputNumber = document.querySelector('input[type="number"]');
const inputBtn = document.querySelector(".form-btn");
const editBtn = document.querySelector(".edit-btn");
const footerSection = document.querySelector(".footer");
// ajax
const getProducts = () => {
  fetch("https://fakestoreapi.com/products")
    .then((response) => response.json())
    .then((data) => {
      PRODUCTS = data;
      render(PRODUCTS);
    });
};
// search the category click in header
category.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    homeSection.style.display = "none";
    infoSection.style.display = "none";

    discountSection.style.display = "none";
    const category = link.dataset.category;
    const filtered = PRODUCTS.filter((p) => p.category === category);

    render(filtered);
  });
});

//input search
const handleInput = (event) => {
  const inputBox = event.target.value.toLowerCase();
  homeSection.style.display = "none";
  infoSection.style.display = "none";
  footerSection.style.display = "none";
  discountSection.style.display = "none";
  const searchResult = PRODUCTS.filter(
    (product) => product.title.toLowerCase().search(inputBox) >= 0
  );

  render(searchResult);
};

//form
const handleForm = () => {
  const name = inputName.value.trim();
  const email = inputEmail.value.trim();
  const number = inputNumber.value.trim();

  const nameH4 = inputName.nextElementSibling;
  const emailH4 = inputEmail.nextElementSibling;
  const numberH4 = inputNumber.nextElementSibling;

  nameH4.textContent = "";
  emailH4.textContent = "";
  numberH4.textContent = "";

  //regex
  const invalidName = /^[\d.#]/; //اینجا من یه الگو اشتباه تعریف کردم
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const numberPattern = /^\d+$/;

  if (!name || !email || !number) {
    alert("please add your information ..");
    return;
  }
  //اینجا حالا اگر اون اشنباه و کرد ...
  if (invalidName.test(name)) {
    alert("Name cannot start with a number, '.' or '#'");
    return;
  }
  if (!emailPattern.test(email)) {
    alert("Please enter a valid email!");
    return;
  }

  if (!numberPattern.test(number)) {
    alert("Number should contain only digits!");
    return;
  }

  nameH4.textContent = `Name: ${name}`;
  emailH4.textContent = `Email: ${email}`;
  numberH4.textContent = `Phone: ${number}`;

  inputName.value = "";
  inputEmail.value = "";
  inputNumber.value = "";
};

//editing form
const handleEdit = () => {
  const nameH4 = inputName.nextElementSibling;
  const emailH4 = inputEmail.nextElementSibling;
  const numberH4 = inputNumber.nextElementSibling;

  if (!nameH4.textContent || !emailH4.textContent || !numberH4.textContent) {
    alert("No data to edit yet!");
    return;
  }

  const nameValue = nameH4.textContent.replace("Name: ", "").trim();
  const emailValue = emailH4.textContent.replace("Email: ", "").trim();
  const numberValue = numberH4.textContent.replace("Phone: ", "").trim();

  inputName.value = nameValue;
  inputEmail.value = emailValue;
  inputNumber.value = numberValue;

  nameH4.textContent = "";
  emailH4.textContent = "";
  numberH4.textContent = "";
};

// add to basket
const handletoBasket = (productId) => {
  const selectedProduct = PRODUCTS.find((item) => item.id === productId);
  if (!selectedProduct)
     return;

  const inBasket = BASKET.find((item) => item.id === productId);

  if (inBasket) {
    // حذف از سبد
    BASKET = BASKET.filter((item) => item.id !== productId);
  } else {
    // اضافه به سبد
    BASKET.push(selectedProduct);
  }

  counterBasket.textContent = BASKET.length;

  // اگر در حالت سبد هستیم، همون view رو رندر کن
  if (container.classList.contains("view-basket")) {
    renderBasket(BASKET);
  } else {
    render(PRODUCTS);
  }
};
//in basket
const showBasket = () => {
  homeSection.style.display = "none";
  discountSection.style.display = "none";
  infoSection.style.display = "none";
  footerSection.style.display = "none";

  renderBasket(BASKET);
};

//in browser
const showAllProducts = () => {
  footerSection.style.display = "none";
  render(PRODUCTS);
};

// all the products
const render = (list) => {
  const template = list
    .map(
      (product) => `
     
      <div class="card">
        <div>
          <img src="${product.image}" />
          <h3>${product.title}</h3>
          <h5><span>Category:</span> ${product.category}</h5>
          <h4><span>Price: </span>  $ ${product.price} </h4>
          
        </div>
        ${
          BASKET.find((item) => item.id === product.id)
            ? `<button onclick="handletoBasket(${product.id})" class="remove">REMOVE FROM BASKET</button>`
            : `<button onclick="handletoBasket(${product.id})">ADD TO BASKET</button>`
        }
        
      </div>`
    )
    .join("");
  //make a class
  container.classList.remove("view-basket");

  container.innerHTML = template;
};
// item in basket
const renderBasket = (list) => {
  const template = list
    .map(
      (product) => `
      <div class="card">
        <div>
          <img src="${product.image}" />
          <h3>${product.title}</h3>
          <h5><span>Category:</span> ${product.category}</h5>
          <h4><span>Price: </span>  $ ${product.price} </h4>
          

        </div>
        <button onclick="handletoBasket(${product.id})" class="remove">REMOVE</button>
      </div>`
    )
    .join("");

  container.classList.add("view-basket");
  container.innerHTML = template;
  if (list.length === 0) {
    container.innerHTML = "<h2>Your basket is empty 🛒</h2>";
  }
};

//events
window.addEventListener("load", getProducts);
basketBtn.addEventListener("click", showBasket);
showAllproducts.addEventListener("click", showAllProducts);
input.addEventListener("keyup", handleInput);
inputBtn.addEventListener("click", (e) => {
  e.preventDefault();
  handleForm();
});

editBtn.addEventListener("click", (e) => {
  e.preventDefault();
  handleEdit();
});
