// Select the logout button
const logoutButton = document.getElementById("logoutBtn");

// Add a click event listener
logoutButton.addEventListener("click", () => {
    // Redirect to the desired page (e.g., login page)
    window.location.href = "index.html"; // Replace with your desired URL
});

document.addEventListener("DOMContentLoaded", function () {
    // Function to fetch and display orders
    function loadOrders() {
        fetch("http://localhost:8080/order/all") // Replace with your API URL
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
            .catch(error => {
                console.error("Error loading orders:", error);
            });
    }

    // Function to fetch and display deliveries
    function loadDeliveries() {
        fetch("http://localhost:8080/api/deliveries/all")  // Your API endpoint for fetching all deliveries
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
            .catch(error => {
                console.error("Error loading deliveries:", error);
            });
    }

    // Function to add a new delivery
    function addDelivery() {
        const orderId = prompt("Enter Order ID:");
        const description = prompt("Enter Delivery Description:");
        const date = prompt("Enter Delivery Date (YYYY-MM-DD):");
        const status = prompt("Enter Delivery Status:");

        if (orderId && description && date && status) {
            const deliveryData = { orderId, description, date, status };

            fetch("http://localhost:8080/api/deliveries/add", { // Replace with your API endpoint
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

    // Load orders and deliveries when the page loads
    loadOrders();
    loadDeliveries();

    // Fetch all customers when the page loads
    fetch('http://localhost:8080/customer/all')
        .then(response => response.json())
        .then(customers => {
            const tableBody = document.getElementById("userTableBody");
            tableBody.innerHTML = ""; // Clear any existing rows

            customers.forEach(customer => {
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${customer.id}</td>
                    <td>${customer.userName}</td>
                    <td>${customer.firstName}</td>
                    <td>${customer.lastName}</td>
                    <td>${customer.email}</td>
                    <td>${customer.address}</td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error("Error fetching users:", error);
        });

    // Expose addDelivery globally (for button calls)
    window.addDelivery = addDelivery;
});

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
