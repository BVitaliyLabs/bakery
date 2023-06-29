document.addEventListener("DOMContentLoaded", function () {
    var carouselInner = document.querySelector(".carousel-inner");
    var prevButton = document.querySelector(".prev-button");
    var nextButton = document.querySelector(".next-button");
  
    var slideWidth = 1300;
    var currentSlide = 0;
  
  
    var selectedProducts = [];
    var selectedProductIds = [];
  
    function addToSelectedProducts(productId) {
      if (!selectedProductIds.includes(productId)) {
        selectedProductIds.push(productId);
        localStorage.setItem("selectedProductIds", JSON.stringify(selectedProductIds));
      }
    }
  
    function loadSelectedProducts() {
      var selectedProducts = localStorage.getItem("selectedProductIds");
      if (selectedProducts) {
        selectedProductIds = JSON.parse(selectedProducts);
      }
    }
  
    function showSlide() {
      carouselInner.style.transform = `translateX(${-slideWidth * currentSlide}px)`;
  
      prevButton.disabled = currentSlide === 0;
      nextButton.disabled = currentSlide === carouselInner.children.length - 2;
    }
  
    function generateCards(products) {
      var cardsPerSlide = 4; 
      var totalCards = products.length; 
      var totalSlides = Math.ceil(totalCards / cardsPerSlide);
  
      for (var i = 0; i < totalSlides; i++) {
        var slide = document.createElement("div");
        slide.classList.add("slide");
        slide.style.width = "1300px";
        slide.style.marginLeft = "12px";
  
        for (var j = i * cardsPerSlide; j < (i + 1) * cardsPerSlide; j++) {
          if (j >= totalCards) {
            break;
          }
  
          var product = products[j];
  
          var productCard = document.createElement("div");
          productCard.classList.add("product-card");
  
          var img = document.createElement("img");
          img.src = product.imagePath || "/assets/img/default.jpg";
          img.alt = "";
  
          var firstRow = document.createElement("div");
          firstRow.classList.add("first-row");
  
          var productName = document.createElement("p");
          productName.classList.add("product-name");
          productName.textContent = product.name;
  
          var buttonAddProduct = document.createElement("button");
          buttonAddProduct.classList.add("button-add-product");
          buttonAddProduct.dataset.productId = product.id;
          buttonAddProduct.addEventListener("click", function () {
            var productId = this.dataset.productId;
            loadSelectedProducts();
            addToSelectedProducts(productId);
            updateBasket();
            console.log(selectedProductIds);
          });
  
          var spanIcon = document.createElement("span");
          spanIcon.classList.add("icon");
  
          buttonAddProduct.appendChild(spanIcon);
  
          firstRow.appendChild(productName);
          firstRow.appendChild(buttonAddProduct);
  
          var secondRow = document.createElement("div");
          secondRow.classList.add("second-row");
  
          var price = document.createElement("p");
          price.classList.add("price");
          price.innerHTML = product.price + "<span> грн.</span>";
  
          var detail = document.createElement("a");
          detail.href = "javascript:void(0);";
          detail.classList.add("detail");
          detail.textContent = "Про товар";
  
          secondRow.appendChild(price);
          secondRow.appendChild(detail);
  
          var cardOverlay = document.createElement("div");
          cardOverlay.classList.add("card-overlay");
  
          var productNameOverlay = document.createElement("p");
          productNameOverlay.classList.add("product-name");
          productNameOverlay.textContent = product.name;
  
          var closeIcon = document.createElement("div");
          closeIcon.classList.add("close-icon");
  
          var productDescription = document.createElement("p");
          productDescription.classList.add("product-description");
          productDescription.textContent = product.description;
  
          cardOverlay.appendChild(productNameOverlay);
          cardOverlay.appendChild(closeIcon);
          cardOverlay.appendChild(productDescription);
  
          productCard.appendChild(img);
          productCard.appendChild(firstRow);
          productCard.appendChild(secondRow);
          productCard.appendChild(cardOverlay);
          slide.appendChild(productCard);
        }
  
        carouselInner.appendChild(slide);
        console.log(totalSlides);
      }
  
      var detailButtons = document.querySelectorAll(".detail");
      var overlays = document.querySelectorAll(".card-overlay");
      var closeIcons = document.querySelectorAll(".close-icon");
  
      detailButtons.forEach(function (button, index) {
        button.addEventListener("click", function (event) {
          event.preventDefault();
          overlays[index].classList.add("active");
        });
      });
  
      closeIcons.forEach(function (icon, index) {
        icon.addEventListener("click", function () {
          overlays[index].classList.remove("active");
        });
      });
    }
  
    console.log(selectedProductIds);
  
    fetch("http://localhost:3000/products")
      .then((response) => response.json())
      .then((data) => {
        generateCards(data);
      })
      .catch((error) => {
        console.error("Сталася помилка під час отримання даних продуктів:", error);
      });
  
    prevButton.disabled = true;
  
    nextButton.addEventListener("click", function () {
      currentSlide++;
      if (currentSlide >= carouselInner.children.length) {
        currentSlide = carouselInner.children.length - 1;
      }
      showSlide();
    });
  
    prevButton.addEventListener("click", function () {
      currentSlide--;
      if (currentSlide < 0) {
        currentSlide = 0;
      }
      showSlide();
    });
  
  
    async function getProductById(id) {
      try {
        const response = await fetch(`http://localhost:3000/products/${id}`);
        const product = await response.json();
        if (product) {
          selectedProducts.push(product);
        }
      } catch (error) {
        console.error(error);
      }
    }
  
    function createBasketItem(product, productId) {
      var basketItem = document.createElement("div");
      basketItem.classList.add("basket-item");
      basketItem.setAttribute('data-id', productId);
  
      var itemName = document.createElement("div");
      itemName.classList.add("item-name");
      var itemNameParagraph = document.createElement("p");
      itemNameParagraph.textContent = product.name;
      itemName.appendChild(itemNameParagraph);
  
      var inputCount = document.createElement("input");
      inputCount.type = "number";
      inputCount.name = "";
      inputCount.min = "1";
      inputCount.value = "1";
      inputCount.classList.add("input-count");
  
      var removeItem = document.createElement("a");
      removeItem.href = "javascript:void(0);";
      removeItem.classList.add("remove-item");
      removeItem.textContent = "Видалити";
      removeItem.addEventListener("click", function (event) {
        event.preventDefault(); 
  
        var index = selectedProductIds.indexOf(productId);
        if (index !== -1) {
          selectedProductIds.splice(index, 1);
          selectedProducts.splice(index, 1);
          localStorage.setItem("selectedProductIds", JSON.stringify(selectedProductIds));
          updateBasket();
        }
      });
  
      basketItem.appendChild(itemName);
      basketItem.appendChild(inputCount);
      basketItem.appendChild(removeItem);
  
      return basketItem;
    }
  
    function generateBasketItems() {
      var basketItemsContainer = document.querySelector(".basket-items");
      var form = document.querySelector('.basket-form');

      basketItemsContainer.innerHTML = "";
  
      if (selectedProducts.length === 0) {
        var clear = document.createElement("p");
        clear.classList.add("basket-clear");
        clear.textContent = "Ви не додали ще жодного товару";
        basketItemsContainer.append(clear);
        return;
      }
  
      selectedProducts.forEach(function (product, index) {
        var productId = selectedProductIds[index];
        var basketItem = createBasketItem(product, productId);
        basketItemsContainer.appendChild(basketItem);
      });
    }
  
    loadSelectedProducts();
  
    function updateBasket() {
      selectedProducts = [];
      var fetchPromises = selectedProductIds.map(getProductById);
      Promise.all(fetchPromises)
        .then(function () {
          generateBasketItems();
          updateBasketCounter();
  
          var createOrderButton = document.querySelector('.create-order');
          var phoneContainer = document.querySelector('.phone-container');
  
          if (selectedProductIds.length > 0) {
            createOrderButton.style.display = 'block';
            phoneContainer.style.display = 'block';
          } else {
            createOrderButton.style.display = 'none';
            phoneContainer.style.display = 'none';
          }
        })
        .catch(function (error) {
          console.error(error);
        });
    }
  
  
    updateBasket();
  
    var button = document.querySelector(".basket-button");
    if (button) {
      button.addEventListener("click", function () {
        var overlay = document.querySelector(".overlay");
        var modal = document.querySelector(".modal");
        overlay.style.display = "block";
        modal.style.display = "block";
      });
    }
  
    function updateBasketCounter() {
      var basketItemsCount = document.querySelector(".basket-items-count");
      if (selectedProductIds.length !== 0) {
        var value = basketItemsCount.querySelector('p');
        value.textContent = selectedProductIds.length.toString();
        basketItemsCount.classList.add("show");
      } else {
        basketItemsCount.classList.remove("show");
      }
    }
  
  
    document.querySelector('.basket-form').addEventListener('submit', function (event) {
      event.preventDefault();
  
      var phoneInput = document.querySelector('.phone-input');
      var phoneNumber = phoneInput.value;
  
      var basketItems = document.querySelectorAll('.basket-item');
      var itemsData = [];
  
      basketItems.forEach(function (item) {
        var itemCount = item.querySelector('.input-count').value;
  
        var itemData = {
          productId: parseInt(item.dataset.id),
          quantity: parseInt(itemCount)
        };
        itemsData.push(itemData);
      });
  
      var orderData = {
        products: itemsData,
        phone: phoneNumber,
      };
  
      fetch('http://localhost:3000/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      })
        .then(function (response) {
          if (response.ok) {
            phoneInput.value = '';
            basketItems.forEach(function (item) {
              item.querySelector('.input-count').value = 1;
            });
  
            var basketItemsContainer = document.querySelector('.basket-items');
            basketItemsContainer.innerHTML = '';
            localStorage.removeItem('selectedProductIds');
            selectedProductIds = [];
            updateBasket();
  
            var overlay = document.querySelector(".overlay");
            var modal = document.querySelector(".modal");
            var thanks = document.querySelector(".thanks");
            modal.style.display = "none";
            thanks.style.display = "block";
            setTimeout(function () {
              thanks.style.display = "none";
              overlay.style.display = "none";
            }, 2000);
          }
        })
        .catch(function (error) {
          console.error('Помилка:', error);
        });
    });
  
  
  
    var closeButton = document.querySelector(".close-button");
    if (closeButton) {
      closeButton.addEventListener("click", function () {
        var overlay = document.querySelector(".overlay");
        var modal = document.querySelector(".modal");
        overlay.style.display = "none";
        modal.style.display = "none";
      });
    }
  
    window.addEventListener("scroll", function () {
      var button = document.querySelector(".basket-button");
      if (window.scrollY > 500) {
        button.classList.add("show");
      } else {
        button.classList.remove("show");
      }
    });
  });
  