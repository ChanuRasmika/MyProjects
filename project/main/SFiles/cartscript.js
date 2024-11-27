document.addEventListener('DOMContentLoaded', () => {
    const cartGrid = document.querySelector('.cart-grid');
    const clearCartButton = document.getElementById('clearCart');
    const proceedButton = document.getElementById('proceed');

    // Load cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Function to render cart items
    const renderCart = () => {
        cartGrid.innerHTML = ''; // Clear current grid

        if (cart.length === 0) {
            cartGrid.innerHTML = '<p>Your cart is empty.</p>';
            return;
        }

        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');

            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.imageUrl}" alt="${item.productName}">
                </div>
                <div class="cart-item-details">
                    <h3>${item.productName}</h3>
                    <p>${item.description}</p>
                    <p><strong>Price:</strong> LKR ${item.price}</p>
                    <button class="remove-from-cart" data-id="${item.productId}">Remove</button>
                </div>
            `;

            cartGrid.appendChild(cartItem);
        });
    };

    // Initial render
    renderCart();

    // Event listener to remove an item from the cart
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-from-cart')) {
            const productId = event.target.getAttribute('data-id');
            cart = cart.filter(item => item.productId !== parseInt(productId, 10));
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart();
        }
    });

    // Clear entire cart
    clearCartButton.addEventListener('click', () => {
        localStorage.removeItem('cart');
        cart = [];
        renderCart();
        alert('Cart cleared!');
    });

    // Proceed to checkout
    proceedButton.addEventListener('click', () => {
        localStorage.setItem('checkoutCart', JSON.stringify(cart));
        window.location.href = 'checkout.html';
    });
});
