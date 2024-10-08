
function goToHomePage() {
    window.location.href = "index.html"; 
}

function goToLoginPage() {
    window.location.href = "signup.html"; 
}


document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault();  // Prevent the default form submission

        // Get the form data
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Prepare the data to send in the request body
        const loginData = {
            "email": email,
            "password": password
        };

        // Send the data to the backend
        fetch('http://localhost:8080/login', { // URL to your Spring Boot backend endpoint
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData), // Convert JS object to JSON string
        })
        .then(response => {
            if (response.ok) {
                return response.text(); // Extract the response text (success message)
            } else {
                throw new Error('Invalid email or password!');
            }
        })
        .then(data => {
            // Handle successful login (redirect to product page)
            window.location.href = 'products.html'; // Redirect to the product page
        })
        .catch(error => {
            // Handle error (display error message on the page)
            document.getElementById('error-message').textContent = error.message;
        });
    });
});
