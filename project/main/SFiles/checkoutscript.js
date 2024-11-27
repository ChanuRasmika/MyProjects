document.addEventListener('DOMContentLoaded', () => {
    const checkoutGrid = document.getElementById('checkoutGrid');
    const totalPriceElement = document.getElementById('totalPrice');
    const checkoutForm = document.getElementById('checkoutForm');

    // Load cart from localStorage
    let cart = JSON.parse(localStorage.getItem('checkoutCart')) || [];

    // Function to calculate total price
    const calculateTotalPrice = () => {
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        totalPriceElement.textContent = total.toFixed(2);
    };

    // Function to render checkout items as a table
    const renderCheckout = () => {
        checkoutGrid.innerHTML = ''; // Clear current grid

        if (cart.length === 0) {
            checkoutGrid.innerHTML = '<p>Your cart is empty.</p>';
            return;
        }

        // Create table structure
        const table = document.createElement('table');
        table.classList.add('checkout-table');

        // Create table header
        const thead = document.createElement('thead');
        thead.innerHTML = ` 
            <tr>
                <th>Image</th>
                <th>Product Name</th>
                <th>Price (LKR)</th>
                <th>Quantity</th>
                <th>Subtotal (LKR)</th>
            </tr>
        `;
        table.appendChild(thead);

        // Create table body
        const tbody = document.createElement('tbody');

        cart.forEach(item => {
            // Ensure quantity defaults to 1 if undefined or invalid
            item.quantity = item.quantity && item.quantity > 0 ? item.quantity : 1;

            const row = document.createElement('tr');

            row.innerHTML = `
                <td><img src="${item.imageUrl}" alt="${item.productName}" style="width: 50px; height: 50px;"></td>
                <td>${item.productName}</td>
                <td>${item.price.toFixed(2)}</td>
                <td>
                    <input type="number" value="${item.quantity}" min="1" data-id="${item.productId}" style="width: 60px;">
                </td>
                <td class="subtotal">${(item.price * item.quantity).toFixed(2)}</td>
            `;

            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        checkoutGrid.appendChild(table);

        calculateTotalPrice();
    };

    // Event listener for quantity changes
    checkoutGrid.addEventListener('input', (event) => {
        if (event.target.type === 'number') {
            const productId = event.target.getAttribute('data-id');
            const newQuantity = parseInt(event.target.value, 10);

            cart = cart.map(item => {
                if (item.productId === parseInt(productId, 10)) {
                    item.quantity = newQuantity;
                }
                return item;
            });

            localStorage.setItem('checkoutCart', JSON.stringify(cart));

            // Update subtotal for the changed row
            const row = event.target.closest('tr');
            const price = parseFloat(row.children[2].textContent);
            const subtotalCell = row.querySelector('.subtotal');
            subtotalCell.textContent = (price * newQuantity).toFixed(2);

            calculateTotalPrice();
        }
    });

    // Handle form submission
    checkoutForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent default form submission

        const userId = document.getElementById('customerId').value.trim();
        const totalPrice = parseFloat(totalPriceElement.textContent);
        const productNames = cart.map(item => item.productName).join(', ');

        // Validate user input
        if (!userId) {
            alert("Please enter your User ID.");
            return;
        }

        // Prepare the order data
        const orderData = {
            customerId: userId,
            description: `Total Price: LKR ${totalPrice}, Products: ${productNames}`,
            status: 'pending'
        };

        // Send data to backend
        fetch('http://localhost:8080/order/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        })
            .then(response => {
                const contentType = response.headers.get('Content-Type');
                if (response.ok) {
                    if (contentType && contentType.includes('application/json')) {
                        return response.json();
                    }
                    return response.text(); // Handle plain text or other responses
                }
                throw new Error('Failed to create order');
            })
            .then(data => {
                // Check if the response is a string (e.g., plain text message)
                if (typeof data === 'string') {
                    alert(data); // Show the message
                } else {
                    alert(`Order placed successfully! Order ID: ${data.orderId}`);
                }
                
                // Clear the cart and remove it from localStorage
                cart.length === 0 // Reset the cart array
                localStorage.removeItem('checkoutCart'); // Remove cart from localStorage

                // Optionally, re-render checkout (but it should be empty now)
                renderCheckout();

                // Redirect to the empty cart page
                window.location.href = 'cart.html'; // Directly redirect to the cart page (empty cart)
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Failed to place the order. Please try again.');
            });
    });

    // Initial render
    renderCheckout();
});
