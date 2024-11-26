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
                    <td>${customer.userName}</td>
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

function showAddDeliveryModal() {
    const modal = `
    <div id="addDeliveryModal" class="modal show">
        <div class="modal-content">
            <span class="close-btn" onclick="closeAddDeliveryModal()">&times;</span>
            <h2>Add New Delivery</h2>
            <form id="addDeliveryForm">
                <label for="orderId">Order ID:</label>
                <input type="number" id="orderId" name="orderId" required><br><br>

                <label for="description">Delivery Description:</label>
                <textarea id="description" name="description" required></textarea><br><br>

                <label for="date">Delivery Date:</label>
                <input type="date" id="date" name="date" required><br><br>

                <label for="status">Delivery Status:</label>
                <input type="text" id="status" name="status" required><br><br>

                <button type="submit">Add Delivery</button>
            </form>
        </div>
    </div>
    `;
    document.body.insertAdjacentHTML("beforeend", modal);

    // Event listener for form submission
    const addDeliveryForm = document.getElementById('addDeliveryForm');
    addDeliveryForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const orderId = document.getElementById('orderId').value;
        const description = document.getElementById('description').value;
        const date = document.getElementById('date').value;
        const status = document.getElementById('status').value;

        if (orderId && description && date && status) {
            const deliveryData = {
                orderId: orderId,
                description: description,
                date: date,
                status: status
            };

            fetch('http://localhost:8080/api/deliveries/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(deliveryData),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to add delivery');
                }
                return response.json();
            })
            .then(newDelivery => {
                alert('Delivery added successfully');
                closeAddDeliveryModal();
                loadDeliveries(); // Reload deliveries to show the new one
            })
            .catch(error => {
                console.error('Error adding delivery:', error);
                alert('Failed to add delivery. Please try again later.');
            });
        } else {
            alert("Please fill out all required fields.");
        }
    });
}

// Function to close the add delivery modal
function closeAddDeliveryModal() {
    const modal = document.getElementById('addDeliveryModal');
    if (modal) {
        modal.remove(); // Removes the modal from the DOM
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
                            <button class="delete-btn" onclick="deleteProduct(${product.productId})">Delete</button>
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

function deleteProduct(productId) {
    fetch(`http://localhost:8080/api/products/delete?productId=${productId}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(errorMsg => {
                throw new Error(errorMsg);
            });
        }
        return response.text();
    })
    .then(message => {
        const productRow = document.getElementById(`product-${productId}`);
        if (productRow) {
            productRow.remove();
        }
        alert(message); // "Product deleted successfully."
    })
    .catch(error => {
        console.error("Error deleting product:", error);
        alert(error.message || "Failed to delete product");
    });
}

// Function to update product price
function updateProduct(productId, currentPrice, currentStockAvailability) {
    const modal = `
    <div id="updateProductModal" class="modal show">
        <div class="modal-content">
            <span class="close-btn" onclick="closeUpdateProductModal()">&times;</span>
            <h2>Update Product</h2>
            <form id="updateProductForm">
                <label for="newPrice">Price (Current: LKR ${currentPrice}):</label>
                <input type="number" id="newPrice" name="newPrice" value="${currentPrice}" step="0.01" required><br><br>

                <label for="stockAvailability">Stock Availability:</label>
                <input type="checkbox" id="stockAvailability" name="stockAvailability" ${currentStockAvailability ? 'checked' : ''}><br><br>

                <button type="submit">Update Product</button>
            </form>
        </div>
    </div>
    `;
    document.body.insertAdjacentHTML("beforeend", modal);

    // Event listener for form submission
    const updateProductForm = document.getElementById('updateProductForm');
    updateProductForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const newPrice = document.getElementById('newPrice').value;
        const stockAvailability = document.getElementById('stockAvailability').checked;

        if (newPrice && !isNaN(newPrice)) {
            updateProductDetails(productId, parseFloat(newPrice), stockAvailability);
        } else {
            alert("Invalid price. Please enter a valid number.");
        }
    });
}

function updateProductDetails(productId, newPrice, stockAvailability) {
    const stockStatus = stockAvailability ? true : false;

    const url = `http://localhost:8080/api/products/update?productId=${productId}&price=${newPrice}&stockAvailability=${stockAvailability}`;

    fetch(url, {
        method: 'PUT',
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(errorText => {
                throw new Error(`Failed to update product: ${errorText}`);
            });
        }
        return response.text();
    })
    .then(data => {
        alert("Product updated successfully!"); 
        closeUpdateProductModal();
        loadProducts(); 
    })
    .catch(error => {
        console.error('Complete error details:', error);
        alert('Error updating product: ' + error.message);
    });
}
function closeUpdateProductModal() {
    const modal = document.getElementById('updateProductModal');
    if (modal) {
        modal.remove(); // Removes the modal from the DOM
    }
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

                <label for="price">Product Price:</label>
                <input type="number" id="price" name="price" required><br><br>

                <label for="stockAvailability">Product Stock Availability:</label>
                <input type="checkbox" id="stockAvailability" name="stockAvailability"><br><br>

                <label for="productImage">Product Image (Upload or URL):</label>
                <input type="file" id="productImage" name="productImage" accept="image/*">
                <input type="url" id="imageUrl" name="imageUrl" placeholder="Enter external image URL"><br><br>

                <button type="submit">Add Product</button>
            </form>
        </div>
    </div>
    `;
    document.body.insertAdjacentHTML("beforeend", modal);

    // Event listener for form submission
    const addProductForm = document.getElementById('addProductForm');
    addProductForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const productName = document.getElementById('productName').value;
        const productDescription = document.getElementById('productDescription').value;
        const price = document.getElementById('price').value;
        const stockAvailability = document.getElementById('stockAvailability').checked;
        const imageUrlInput = document.getElementById('imageUrl').value;
        const productImageFile = document.getElementById("productImage").files[0];  

        const imageUrl = productImageFile ? `style/Images/${productImageFile.name}` : imageUrlInput || './images/default.jpg';
        
        if (productName && productDescription && price && imageUrl) {
            // Create a product object
            const productData = {
                productName: productName,
                productDescription: productDescription,
                price: price,
                stockAvailability: stockAvailability,
                imageUrl: imageUrl
            };

            // Send product data to the backend using Fetch API
            fetch('http://localhost:8080/api/products/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(createdProduct => {
                // The response is now the created ProductDTO directly
                alert('Product added successfully');
                closeAddProductModal();
                loadProducts();  // Reload products to show the new product
            })
            .catch(error => {
                console.error('Error adding product:', error);
                alert('Failed to add product. Please try again later.');
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while adding the product. Please try again later.');
            });
        } else {
            alert("Please fill out all required fields.");
        }
    });
}

// Function to close the modal
function closeAddProductModal() {
    const modal = document.getElementById('addProductModal');
    if (modal) {
        modal.remove(); // Removes the modal from the DOM
    }
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
