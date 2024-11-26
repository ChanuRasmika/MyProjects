document.addEventListener('DOMContentLoaded', () => {
    // Fetch all products
    fetch('http://localhost:8080/api/products/all')
        .then(response => response.json())
        .then(data => {
            const productGrid = document.querySelector('.product-grid');
            
            // Clear the grid
            productGrid.innerHTML = '';
            
            // Add each product to the grid
            data.forEach(product => {
                const productElement = document.createElement('div');
                productElement.classList.add('product-box');
                
                productElement.innerHTML = `
                    <img src="${product.imageUrl}" alt="${product.productName}">
                    <div>
                        <h3>${product.productName}</h3>
                        <p>${product.description}</p>
                        <p>Price: LKR ${product.price}</p>
                        <p>Stock: ${product.stockAvailability ? 'Available' : 'Out of stock'}</p>
                        <div class="button-container">
                            <button class="buy-now">Buy Now</button>
                            <button class="add-to-cart" data-id="${product.productId}"><i class="fas fa-cart-plus"></i></button>
                        </div>
                    </div>
                `;
                
                productGrid.appendChild(productElement);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            const productGrid = document.querySelector('.product-grid');
            productGrid.innerHTML = '<p>Failed to load products. Please try again later.</p>';
        });

    // Add to cart event listener
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('add-to-cart')) {
            const productId = event.target.getAttribute('data-id');
            
            // Fetch product by ID
            fetch(`http://localhost:8080/api/products/get?id=${productId}`)
                .then(response => response.json())
                .then(product => {
                    // Get existing cart from localStorage
                    let cart = JSON.parse(localStorage.getItem('cart')) || [];
                    
                    // Check if product already exists in the cart
                    const isProductInCart = cart.some(item => item.productId === product.productId);
                    
                    if (!isProductInCart) {
                        cart.push(product);
                        localStorage.setItem('cart', JSON.stringify(cart));
                        alert(`${product.productName} has been added to your cart.`);
                    } else {
                        alert(`${product.productName} is already in your cart.`);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Failed to add product to cart.');
                });
        }
    });
});