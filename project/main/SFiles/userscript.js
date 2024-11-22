function handleSubmit(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const messageDiv = document.getElementById('message');

    if (validateEmail(email)) {
        // Fetch customer details from backend
        fetch(`http://localhost:8080/customer/find?email=${email}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Customer not found');
                }
                return response.json();
            })
            .then(customer => {
                // Redirect to details page with customer data
                localStorage.setItem('customerDetails', JSON.stringify(customer));
                window.location.href = 'customerDetails.html';
            })
            .catch(error => {
                messageDiv.innerHTML = `<p>Error: ${error.message}</p>`;
                messageDiv.style.color = "red";
            });
    } else {
        messageDiv.innerHTML = `<p>Please enter a valid email address.</p>`;
        messageDiv.style.color = "red";
    }
}

// Simple email validation function
function validateEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
}