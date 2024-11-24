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

        // Determine the URL based on the email
        let loginUrl = email === 'admin@example.com' ? 'http://localhost:8080/admin/login' : 'http://localhost:8080/login/log';

        // Send the data to the backend
        fetch(loginUrl, { 
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData), // Convert JS object to JSON string
        })
        .then(response => {
            // Always parse response as JSON
            return response.json().then(data => {
                if (response.ok) {
                    return data; // Return the parsed JSON data
                } else {
                    throw new Error(data.message); // Throw error with message from response
                }
            });
        })
        .then(data => {
            // Handle successful login (redirect based on role)
            if (data.role === 'ADMIN') {
                window.location.href = 'dashboard.html'; 
            } else {
                window.location.href = 'index1.html'; 
            }
        })
        .catch(error => {
            // Display error message on the page
            document.getElementById('error-message').textContent = error.message;
        });
    });
});
