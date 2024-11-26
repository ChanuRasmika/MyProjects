// Select the logout button
const logoutButton = document.getElementById("logoutBtn");

// Add a click event listener
logoutButton.addEventListener("click", () => {
    // Redirect to the desired page (e.g., login page)
    window.location.href = "index.html"; // Replace with your desired URL
});

document.addEventListener('DOMContentLoaded', function () {
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

document.addEventListener("DOMContentLoaded", function () {
    // Load orders
    loadOrders();

    // Load deliveries
    loadDeliveries();

    // Load customers
    loadCustomers();

    // Expose addDelivery globally (for button calls)
    window.addDelivery = addDelivery;
});

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
                <input type="text" id="productName" required>

                <label for="description">Description:</label>
                <textarea id="description" required></textarea>

                <label for="price">Price (LKR):</label>
                <input type="number" id="price" step="0.01" required>

                <label for="stockAvailability">Stock Availability:</label>
                <select id="stockAvailability">
                    <option value="true">Available</option>
                    <option value="false">Out of Stock</option>
                </select>

                <label for="imageUrl">Image URL:</label>
                <input type="text" id="imageUrl">

                <button type="button" onclick="addProduct()">Add Product</button>
            </form>
        </div>
    </div>
    `;

    console.log("Modal HTML created");

    // Create a temporary div to hold the modal
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modal;
    document.body.appendChild(modalContainer.firstChild);

    console.log("Modal added to body");
}

function closeAddProductModal() {
    const modal = document.getElementById('addProductModal');
    if (modal) {
        modal.remove();
    }
}

function addProduct() {
    // Collect form data
    const productName = document.getElementById('productName').value;
    const description = document.getElementById('description').value;
    const price = parseFloat(document.getElementById('price').value);
    const stockAvailability = document.getElementById('stockAvailability').value === 'true';
    const imageUrl = document.getElementById('imageUrl').value || ''; // Optional

    // Create product object
    const productData = {
        productName,
        productDescription: description,
        price,
        stockAvailability,
        imageUrl
    };

    // Validate inputs
    if (!productName || !description || isNaN(price)) {
        alert('Please fill in all required fields');
        return;
    }

    // Send POST request to backend
    fetch('http://localhost:8080/api/products/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData)
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(errorText => {
                throw new Error(errorText || 'Failed to add product');
            });
        }
        return response.json();
    })
    .then(newProduct => {
        alert('Product added successfully!');
        closeAddProductModal();
        loadProducts(); // Reload the products list
    })
    .catch(error => {
        console.error('Error adding product:', error);
        alert(`Failed to add product: ${error.message}`);
    });
}

