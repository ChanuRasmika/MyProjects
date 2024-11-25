// Fetch all available products from the backend
fetch('http://localhost:8080/api/products')
    .then(response => response.json())
    .then(data => {
        const productGrid = document.querySelector('.product-grid');

        // Clear the grid
        productGrid.innerHTML = '';

        // Add each product to the grid
        data.forEach(product => {
            const productElement = `
                <div class="product-box">
                    <img src="${product.imageUrl}" alt="${product.productName}">
                   <div>
                     <h3>${product.productName}</h3>
                     <p>${product.description}</p>
                     <p>Price: LKR ${product.price}</p>
                     <p>Stock: ${product.stockAvailability ? 'Available' : 'Out of stock'}</p>
                       <div class="button-container">
                         <button class="buy-now">Buy Now</button>
                         <button class="add-to-cart">Add to Cart</button>
                       </div>
                   </div>
                </div>
            `;
            productGrid.innerHTML += productElement;
        });
    })
    .catch(error => {
        console.error('Error:', error);
        const productGrid = document.querySelector('.product-grid');
        productGrid.innerHTML = '<p>Failed to load products. Please try again later.</p>';
    });