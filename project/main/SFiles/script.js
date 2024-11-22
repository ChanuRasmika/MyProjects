//this file contains some functions that are used to go from one place to another for index and sign up
function goToHomePage() {
    window.location.href = "index.html"; 
}

function goToLoginPage() {
    window.location.href = "signup.html"; 
}


function validateForm() {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const userName = document.getElementById('userName').value;
    const address = document.getElementById('address').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    const errorMessageDiv = document.getElementById('error-message');
    errorMessageDiv.textContent = '';  // Clear any previous error messages

    // Regular expression to match names
    const namePattern = /^[A-Za-z]+$/;

    // Function to highlight invalid fields
    function highlightField(fieldId) {
        document.getElementById(fieldId).style.border = '2px solid red';
    }

    // Clear field highlights
    function clearHighlight(fieldId) {
        document.getElementById(fieldId).style.border = '';
    }

    // Reset highlights
    clearHighlight('firstName');
    clearHighlight('lastName');
    clearHighlight('userName');
    clearHighlight('address');
    clearHighlight('email');
    clearHighlight('password');
    clearHighlight('confirmPassword');

    // Check if any field is empty
    if (firstName === '' || lastName === '' || userName === '' || address === '' || email === '' || password === '' || confirmPassword === '') {
        errorMessageDiv.textContent = 'All fields are required.';
        
        // Highlight empty fields
        if (firstName === '') highlightField('firstName');
        if (lastName === '') highlightField('lastName');
        if (userName === '') highlightField('userName');
        if (address === '') highlightField('address');
        if (email === '') highlightField('email');
        if (password === '') highlightField('password');
        if (confirmPassword === '') highlightField('confirmPassword');
        
        return false;
    }

    // Validate that first name and last name do not contain numbers
    if (!namePattern.test(firstName)) {
        errorMessageDiv.textContent = 'First name cannot contain numbers or special characters.';
        highlightField('firstName');
        return false;
    }

    if (!namePattern.test(lastName)) {
        errorMessageDiv.textContent = 'Last name cannot contain numbers or special characters.';
        highlightField('lastName');
        return false;
    }

    // Check if the password is at least 8 characters long
    if (password.length < 8) {
        errorMessageDiv.textContent = 'Password must be at least 8 characters long.';
        highlightField('password');
        return false;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
        errorMessageDiv.textContent = 'Passwords do not match.';
        highlightField('confirmPassword');
        return false;      
    }

    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        errorMessageDiv.textContent = 'Invalid email format.';
        highlightField('email');
        return false;
    }

    return true; // Indicate that the form validation was successful
}

document.getElementById('signupForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent default form submission behavior

    // Validate the form
    if (!validateForm()) {
        return; // Stop submission if validation fails
    }

    // Get form values
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const userName = document.getElementById('userName').value;
    const address = document.getElementById('address').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Prepare data to be sent to the server
    const formData = {
        firstName,
        lastName,
        userName,
        address,
        email,
        password
    };

    try {
        // Send data to the server
        const response = await fetch('http://localhost:8080/customer/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData) // Convert form data to JSON
        });

        if (response.ok) {
            // Optionally, clear the form
            document.getElementById('signupForm').reset();

            // Redirect to the home page (index.html)
            window.location.href = 'index1.html'; // Adjust path as needed
        } else {
            alert('Error registering customer. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
    }
});


// Product filtering function
function filterProducts() {
    const searchInput = document.getElementById('search').value.toLowerCase();
    const productBoxes = document.querySelectorAll('.product-box');
    
    productBoxes.forEach(box => {
        const productName = box.getAttribute('data-name').toLowerCase();
        if (productName.includes(searchInput)) {
            box.classList.remove('hidden');
        } else {
            box.classList.add('hidden');
        }
    });
}





