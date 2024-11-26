// Select the logout button
const logoutButton = document.getElementById("logoutBtn");

// Add a click event listener
logoutButton.addEventListener("click", () => {
    // Redirect to the desired page (e.g., login page)
    window.location.href = "index.html"; // Replace with your desired URL
});

document.addEventListener('DOMContentLoaded', function () {
    // Load orders
    loadOrders();

    // Load deliveries
    loadDeliveries();

    // Load customers
    loadCustomers();

    // Expose addDelivery globally (for button calls)
    window.addDelivery = addDelivery;

    // Load product count
    fetch('http://localhost:8080/api/products/count')
        .then(response => response.json()) // Convert the response to JSON
        .then(data => {
            // If backend returns a plain number:
            if (typeof data === 'number') {
                document.getElementById('product-count').textContent = data;
            }
            // If backend wraps it as { count: <number> }:
            else if (data.count !== undefined) {
                document.getElementById('product-count').textContent = data.count;
            }
        })
        .catch(error => console.error('Error fetching product count:', error));
});

// Function to fetch and display customers
function loadCustomers() {
    fetch("http://localhost:8080/customer/all")  // Replace with your backend API endpoint
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch customers");
            }
            return response.json();
        })
        .then(customers => {
            const customersTableBody = document.querySelector("#customers tbody");
            customersTableBody.innerHTML = ""; // Clear existing table rows

            customers.forEach(customer => {
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${customer.id}</td>
                    <td>${customer.firstName}</td>
                    <td>${customer.lastName}</td>
                    <td>${customer.email}</td>
                    <td>${customer.username}</td>
                `;
                customersTableBody.appendChild(row);
            });
        })
        .catch(error => console.error("Error loading customers:", error));
}

// Function to fetch and display orders
function loadOrders() {
    fetch("http://localhost:8080/order/all")
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch orders");
            }
            return response.json();
        })
        .then(orders => {
            const ordersTableBody = document.querySelector("#orders tbody");
            ordersTableBody.innerHTML = ""; // Clear existing table rows

            orders.forEach(order => {
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${order.orderId}</td>
                    <td>${order.customerId}</td>
                    <td>${order.description}</td>
                    <td>${order.status}</td>
                    <td>
                        <button class="action-btn" onclick="updateOrderStatus(${order.orderId})">Update Status</button>
                    </td>
                `;
                ordersTableBody.appendChild(row);
            });
        })
        .catch(error => console.error("Error loading orders:", error));
}

// Function to fetch and display deliveries
function loadDeliveries() {
    fetch("http://localhost:8080/api/deliveries/all")
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch deliveries");
            }
            return response.json();
        })
        .then(deliveries => {
            const deliveryTableBody = document.getElementById("deliveryTableBody");
            deliveryTableBody.innerHTML = ""; // Clear existing table rows

            deliveries.forEach(delivery => {
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${delivery.deliveryId}</td>
                    <td>${delivery.orderId}</td>
                    <td>${delivery.description}</td>
                    <td>${delivery.date}</td>
                    <td>${delivery.status}</td>
                    <td>
                        <button class="action-btn" onclick="updateDeliveryStatus(${delivery.deliveryId})">Update Status</button>
                    </td>
                `;
                deliveryTableBody.appendChild(row);
            });
        })
        .catch(error => console.error("Error loading deliveries:", error));
}

// Function to add a new delivery
function addDelivery() {
    const orderId = prompt("Enter Order ID:");
    const description = prompt("Enter Delivery Description:");
    const date = prompt("Enter Delivery Date (YYYY-MM-DD):");
    const status = prompt("Enter Delivery Status:");

    if (orderId && description && date && status) {
        const deliveryData = { orderId, description, date, status };

        fetch("http://localhost:8080/api/deliveries/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(deliveryData),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to add delivery");
                }
                return response.json();
            })
            .then(newDelivery => {
                alert("Delivery added successfully!");
                loadDeliveries(); // Reload deliveries after adding
            })
            .catch(error => {
                console.error("Error adding delivery:", error);
            });
    } else {
        alert("All fields are required!");
    }
}

// Function to fetch and display products in the Manage Products section
function loadProducts() {
    fetch("http://localhost:8080/api/products/all")
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch products");
            }
            return response.json();
        })
        .then(products => {
            const productGrid = document.getElementById("productGrid");
            productGrid.innerHTML = ""; // Clear existing product boxes

            products.forEach(product => {
                const productBox = document.createElement("div");
                productBox.classList.add("product-box");
                productBox.id = `product-${product.productId}`;

                productBox.innerHTML = `
                    <img src="${product.imageUrl}" alt="${product.productName}" class="product-image">
                    <div class="product-info">
                        <h3>${product.productName}</h3>
                        <p>${product.description}</p>
                        <p>Price: LKR ${product.price}</p>
                        <p>Stock: ${product.stockAvailability ? 'Available' : 'Out of stock'}</p>
                        <div class="button-container">
                            <button class="delete-btn" onclick="deleteProduct(${product.productId})">Delete Product</button>
                            <button class="update-btn" onclick="updateProduct(${product.productId}, '${product.price}')">Update</button>
                        </div>
                    </div>
                `;
                productGrid.appendChild(productBox);
            });
        })
        .catch(error => console.error("Error loading products:", error));
}

// Call loadProducts when the page loads
loadProducts();

// Function to delete a product
function deleteProduct(productId) {
    fetch(`http://localhost:8080/products/${productId}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
        console.log("Delete Response:", data);
        if (data.success) {
            alert("Product deleted successfully!"); // Success or error message from backend
        }
        // remove the product from the UI if it is deleted
        const productRow = document.getElementById(`product-${productId}`);
        if (productRow) {
            productRow.remove();
        } else {
            alert("Failed to delete product");
        }
    })
    .catch(error => console.error("Error deleting product:", error));
}

// Function to update product price
function updateProduct(productId, currentPrice) {
    const newPrice = prompt(`Current Price: LKR ${currentPrice}\nEnter new price:`);

    if (newPrice && !isNaN(newPrice)) {
        updateProductPrice(productId, parseFloat(newPrice));
    } else {
        alert("Invalid price. Please enter a valid number.");
    }
}

function updateProductPrice(productId, newPrice) {
    const url = `http://localhost:8080/api/products/update?productId=${productId}&price=${newPrice}`;

    fetch(url, {
        method: 'PUT',
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(errorText => {
                throw new Error(`Failed to update product price: ${errorText}`);
            });
        }
        return response.text();
    })
    .then(data => {
        alert("Product price updated successfully!"); 
        loadProducts(); 
    })
    .catch(error => {
        console.error('Complete error details:', error);
        alert('Error updating product price: ' + error.message);
    });
}

function showAddProductModal() {
    console.log("showAddProductModal function called");

    const modal = `
    <div id="addProductModal" class="modal show">
        <div class="modal-content">
            <span class="close-btn" onclick="closeAddProductModal()">&times;</span>
            <h2>Add New Product</h2>
            <form id="addProductForm">
                <label for="productName">Product Name:</label>
                <input type="text" id="productName" name="productName" required><br><br>
                <label for="productDescription">Product Description:</label>
                <textarea id="productDescription" name="productDescription" required></textarea><br><br>
                <label for="productPrice">Product Price:</label>
                <input type="number" id="productPrice" name="productPrice" required><br><br>
                <label for="productStock">Product Stock Availability:</label>
                <input type="checkbox" id="productStock" name="productStock"><br><br>
                <button type="submit">Add Product</button>
            </form>
        </div>
    </div>
    `;
    document.body.insertAdjacentHTML("beforeend", modal);

    const addProductForm = document.getElementById('addProductForm');
    addProductForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const productName = document.getElementById('productName').value;
        const productDescription = document.getElementById('productDescription').value;
        const productPrice = document.getElementById('productPrice').value;
        const productStock = document.getElementById('productStock').checked;

        if (productName && productDescription && productPrice) {
            addProduct(productName, productDescription, productPrice, productStock);
        } else {
            alert("Please fill out all required fields.");
        }
    });
}


// Function to handle updating the order status
function updateOrderStatus(orderId) {
    const newStatus = prompt("Enter new order status:");

    if (newStatus) {
        fetch(`http://localhost:8080/order/update-status?orderId=${orderId}&status=${newStatus}`, {
            method: "PUT",
        })
            .then(response => response.json())
            .then(updatedOrder => {
                alert("Order status updated successfully!");
                loadOrders();  // Reload the orders after updating
            })
            .catch(error => {
                console.error("Error updating order status:", error);
            });
    }
}

// Function to handle updating the delivery status
function updateDeliveryStatus(deliveryId) {
    const newStatus = prompt("Enter new delivery status:");

    if (newStatus) {
        fetch(`http://localhost:8080/api/deliveries/update-status?deliveryId=${deliveryId}&status=${newStatus}`, {
            method: "PUT",
        })
            .then(response => response.json())
            .then(updatedDelivery => {
                alert("Delivery status updated successfully!");
                loadDeliveries();  // Reload the deliveries after updating
            })
            .catch(error => {
                console.error("Error updating delivery status:", error);
            });
    }
}
