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
    const username = document.getElementById('username').value;
    const address = document.getElementById('address').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    const errorMessageDiv = document.getElementById('error-message');
    errorMessageDiv.textContent = '';  // Clear any previous error messages

    // Regular expression to match numbers
    const namePattern = /^[A-Za-z]+$/;

    // Check if any field is empty
    if (firstName === '' || lastName === '' || username === '' || address === '' || email === '' || password === '' || confirmPassword === '') {
        errorMessageDiv.textContent = 'All fields are required.';
        return false;
    }

    // Validate that first name and last name do not contain numbers
    if (!namePattern.test(firstName)) {
        errorMessageDiv.textContent = 'First name cannot contain numbers or special characters.';
        return false;
    }

    if (!namePattern.test(lastName)) {
        errorMessageDiv.textContent = 'Last name cannot contain numbers or special characters.';
        return false;
    }

    //check if the password is 8 char or not
    if (password.length < 8) {
        errorMessageDiv.textContent = 'Password must be at least 8 characters long.';
        return false;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
        errorMessageDiv.textContent = 'Passwords do not match.';
        return false;      
    }

    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        errorMessageDiv.textContent = 'Invalid email format.';
        return false;
    }
   
    return true;
}


function validateLogin(){

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    const errorMessageDiv = document.getElementById('error-message');
    errorMessageDiv.textContent = '';  // Clear any previous error messages

    // Check if any field is empty
    if (username === '' || password === '') {
        errorMessageDiv.textContent = 'All fields are required.';
        return false;
    }

    return true;
}