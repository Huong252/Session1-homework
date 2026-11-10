// 1. Get elements from HTML

const signUpForm = document.getElementById("sign-up-form");

const emailInput = document.getElementById("email");

const usernameInput = document.getElementById("username");

const passwordInput = document.getElementById("password");

const msg = document.getElementById("msg");

const validation = document.getElementById("sign-up-validation");

const toast = document.getElementById("sign-up-toast");

const error = document.getElementById("sign-up-error");

// 2. Get password eye icons

const eyeIcon = document.getElementsByClassName("fa-eye")[0];

const eyeSlashIcon = document.getElementsByClassName("fa-eye-slash")[0];

// 3. Hide all messages

function hideMessages() {

    msg.classList.remove("show");

    validation.classList.add("hidden");

    toast.classList.add("hidden");

    error.classList.add("hidden");

    // Hide validation messages

    const validationMessages = validation.getElementsByTagName("p");

    for (let i = 0; i < validationMessages.length; i++) {

        validationMessages[i].classList.add("hidden");

    }

    // Hide error messages

    const errorMessages = error.children;

    for (let i = 0; i < errorMessages.length; i++) {

        errorMessages[i].classList.add("hidden");

    }

}

// 4. Show validation message

function showValidation(type) {

    hideMessages();

    msg.classList.add("show");

    validation.classList.remove("hidden");

    const message = document.getElementsByClassName(type)[0];

    if (message) {

        message.classList.remove("hidden");

    }

}

// 5. Show error message

function showError(type) {

    hideMessages();

    msg.classList.add("show");

    error.classList.remove("hidden");

    const message = document.getElementsByClassName(type)[0];

    if (message) {

        message.classList.remove("hidden");

    }

}

// 6. Show success message

function showSuccess() {

    hideMessages();

    msg.classList.add("show");

    toast.classList.remove("hidden");

}

// 7. Show / hide password

eyeIcon.addEventListener("click", function() {

    passwordInput.type = "text";

    eyeIcon.style.display = "none";

    eyeSlashIcon.style.display = "block";

});

eyeSlashIcon.addEventListener("click", function() {

    passwordInput.type = "password";

    eyeSlashIcon.style.display = "none";

    eyeIcon.style.display = "block";

});

// 8. Sign up form

signUpForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const email = emailInput.value.trim();

    const username = usernameInput.value.trim();

    const password = passwordInput.value;

    hideMessages();

    // Check empty fields

    if (password === "") {

        showValidation("password-cannot-blank");

        return;

    }

    if (username === "") {

        showValidation("username-cannot-blank");

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

    // Check email format

    const atPosition = email.indexOf("@");

    const dotPosition = email.lastIndexOf(".");

    if (

        atPosition <= 0 ||

        dotPosition < atPosition + 2 ||

        dotPosition === email.length - 1

    ) {

        showError("email-error");

        return;

    }

    // Check whether email already exists

    let emailExists = false;

    for (let i = 0; i < userList.length; i++) {

        if (userList[i].email.toLowerCase() === email.toLowerCase()) {

            emailExists = true;

            break;

        }

    }

    if (emailExists === true) {

        showError("email-exist");

        return;

    }

    // Check password rules

    if (password.length < 8) {

        showError("password-min-length-error");

        return;

    }

    let hasNumber = false;

    let hasUppercase = false;

    let hasLowercase = false;

    for (let i = 0; i < password.length; i++) {

        if (password[i] >= "0" && password[i] <= "9") {

            hasNumber = true;

        }

        if (password[i] >= "A" && password[i] <= "Z") {

            hasUppercase = true;

        }

        if (password[i] >= "a" && password[i] <= "z") {

            hasLowercase = true;

        }

    }

    if (hasNumber === false) {

        showError("password-number-required-error");

        return;

    }

    if (hasUppercase === false || hasLowercase === false) {

        showError("password-uppercase-lowercase-error");

        return;

    }

    // Generate the next user code

    let maxCode = 0;

    for (let i = 0; i < userList.length; i++) {

        const number = Number(userList[i].usercode.substring(1));

        if (number > maxCode) {

            maxCode = number;

        }

    }

    let nextCode = maxCode + 1;

    let userCode = "U";

    if (nextCode < 10) {

        userCode = userCode + "00" + nextCode;

    } else if (nextCode < 100) {

        userCode = userCode + "0" + nextCode;

    } else {

        userCode = userCode + nextCode;

    }

    // Create a new user

    const newUser = {

        usercode: userCode,

        username: username,

        email: email,

        password: password,

        role: "user",

        birthday: "",

        status: "Active",

        description: ""

    };

    // Save the new user

    userList.push(newUser);

    localStorage.setItem("userList", JSON.stringify(userList));

    // Show success message

    showSuccess();

    signUpForm.reset();

    // Redirect to sign in page

    setTimeout(function() {

        window.location.href = "./sign-in.html";

    }, 1200);

});

// 9. Close validation message

const validationHeader = document.getElementsByClassName("sign-up-validation-header")[0];

if (validationHeader) {const closeButton = validationHeader.getElementsByClassName("fa-circle-xmark")[0];

    if (closeButton) {

        closeButton.addEventListener("click", function() {

            hideMessages();

        });
    }
}