fetch("http://localhost:3000/orders")
  .then((response) => response.json())
  .then((data) => {
    const orders = data;
    console.log(orders);

    orders.forEach((order) => {
      const tr = document.createElement("tr");

      const idCell = document.createElement("td");
      idCell.textContent = order.id;
      tr.appendChild(idCell);

      const productsCell = document.createElement("td");
      const productsList = document.createElement("ul");
      order.products.forEach((product) => {
        const productItem = document.createElement("li");
        fetch(`http://localhost:3000/products/${product.productId}`)
          .then((response) => response.json())
          .then((data) => {
            productItem.textContent = `${data.name} (x${product.quantity}) : ${product.quantity * data.price} грн.`;
          })
          .catch((error) => {
            console.error("Сталася помилка під час отримання даних про продукт:", error);
          });
        productsList.appendChild(productItem);
      });
      productsCell.appendChild(productsList);
      tr.appendChild(productsCell);

      const totalAmountCell = document.createElement("td");
      totalAmountCell.textContent = order.totalAmount;
      tr.appendChild(totalAmountCell);

      const phoneCell = document.createElement("td");
      phoneCell.textContent = order.phone;
      tr.appendChild(phoneCell);

      const statusCell = document.createElement("td");
      statusCell.textContent = order.status ? "Виконано" : "Не виконано";
      tr.appendChild(statusCell);

      if (order.status) {
        tr.classList.add("inactive-row"); 
      }

      const actionsCell = document.createElement("td");
      const updateStatusButton = document.createElement("button");
      updateStatusButton.textContent = "Змінити статус";
      updateStatusButton.addEventListener("click", () => {
        updateOrderStatus(order.id);
      });
      actionsCell.appendChild(updateStatusButton);
      tr.appendChild(actionsCell);

      document.querySelector("tbody").appendChild(tr);
    });
  })
  .catch((error) => {
    console.error("Сталася помилка під час отримання даних:", error);
  });

function updateOrderStatus(orderId) {
  event.preventDefault();

  const data = { status: true };

  fetch(`http://localhost:3000/orders/${orderId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.ok) {
        location.reload(); 
      } else {
        throw new Error("Не вдалося оновити статус замовлення.");
      }
    })
    .catch((error) => {
      console.error(error);
    });
}
