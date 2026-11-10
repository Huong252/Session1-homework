// 1. Get elements from HTML

const signInForm = document.getElementById("sign-in-form");

const emailInput = document.getElementById("email");

const passwordInput = document.getElementById("password");

const rememberCheckbox = document.getElementById("save-loggin-checkbox");

const msg = document.getElementById("msg");

const validation = document.getElementById("login-validation");

const toast = document.getElementById("login-toast");

const error = document.getElementById("login-error");



// 2. Hide all messages

function hideMessages() {

    msg.classList.remove("show");

    validation.classList.add("hidden");

    toast.classList.add("hidden");

    error.classList.add("hidden");

    // Hide all validation messages

    const messages = validation.getElementsByTagName("p");

    for (let i = 0; i < messages.length; i++) {

        messages[i].classList.add("hidden");

    }

}



// 3. Show validation message

function showValidation(type) {

    hideMessages();

    msg.classList.add("show");

    validation.classList.remove("hidden");

    if (type === "password-cannot-blank") {

        const passwordError = document.getElementsByClassName("password-cannot-blank")[0];

        passwordError.classList.remove("hidden");

    }

    if (type === "email-cannot-blank") {

        const emailError = document.getElementsByClassName("email-cannot-blank")[0];

        emailError.classList.remove("hidden");

    }

}



// 4. Show error

function showError() {

    hideMessages();

    msg.classList.add("show");

    error.classList.remove("hidden");

}



// 5. Show success

function showSuccess() {

    hideMessages();

    msg.classList.add("show");

    toast.classList.remove("hidden");

}

// 6. Sign in form

signInForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const email = emailInput.value.trim();

    const password = passwordInput.value;

    hideMessages();

    // Check empty fields

    if (password === "") {

        showValidation("password-cannot-blank");

        return;

    }

    if (email === "") {

        showValidation("email-cannot-blank");

        return;

    }

    // Get user list from localStorage

    let userList = JSON.parse(localStorage.getItem("userList"));

    if (userList === null) {

        userList = [];

    }

    // Find user with matching email and password

    let user = null;

    for (let i = 0; i < userList.length; i++) {

        if (

            userList[i].email.toLowerCase() === email.toLowerCase() &&

            userList[i].password === password

        ) {

            user = userList[i];

            break;

        }

    }

    // Check login result

    if (user === null) {

        showError();

        return;

    }

    // Save signed-in user

    const loginData = JSON.stringify(user);

    if (rememberCheckbox.checked === true) {

        localStorage.setItem("currentUser", loginData);

        sessionStorage.removeItem("currentUser");
        } 
else {

        sessionStorage.setItem("currentUser", loginData);

        localStorage.removeItem("currentUser");

    }

    // Show success message

    showSuccess();

    // Redirect to dashboard

    setTimeout(function() {

        window.location.href = "./dashboard.html";

    }, 1000);

});

// 7. Close validation message

const closeButton = document.getElementsByClassName("close-btn")[0];

if (closeButton) {

    closeButton.addEventListener("click", function() {

        hideMessages();

    })
}