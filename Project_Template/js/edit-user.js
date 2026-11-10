// 1. Get elements from HTML

const editForm = document.getElementById('edit-user-form');

const userCodeInput = document.getElementById('user-code');

const usernameInput = document.getElementById('username');

const emailInput = document.getElementById('email');

const passwordInput = document.getElementById('password');

const roleInput = document.getElementById('role');

const birthdayInput = document.getElementById('dob');

const descriptionInput = document.querySelector('.description-text-input');

const messageBox = document.getElementById('msg');

const toast = document.getElementById('edit-toast');

const errorBox = document.getElementById('edit-error');

// 2. Get user list

function getUsers() {

    let data = localStorage.getItem('userList');

    if (data === null) {

        return [];

    }

    return JSON.parse(data);

}

// 3. Get logged-in user

function getLoggedInUser() {

    let data = localStorage.getItem('currentUser');

    if (data === null) {

        data = sessionStorage.getItem('currentUser');

    }

    if (data === null) {

        return null;

    }

    return JSON.parse(data);

}

// 4. Get user code from URL

let url = window.location.href;

let selectedUserCode = '';

if (url.includes('?usercode=')) {

    selectedUserCode = url.split('?usercode=')[1];

}

// 5. Get data

let loggedInUser = getLoggedInUser();

let users = getUsers();

let selectedUser = null;

// 6. Find selected user

for (let i = 0; i < users.length; i++) {

    if (users[i].usercode == selectedUserCode) {

        selectedUser = users[i];

        break;

    }

}

// 7. Check login and permission

if (loggedInUser === null) {

    window.location.href = './sign-in.html';

} else if (loggedInUser.role !== 'admin') {

    alert('Bạn không có quyền sửa user.');

    window.location.href = './dashboard.html';

} else if (selectedUser === null) {

    alert('Không tìm thấy user cần sửa.');

    window.location.href = './dashboard.html';

} else {

    // Display user information

    userCodeInput.value = selectedUser.usercode;

    usernameInput.value = selectedUser.username || '';

    emailInput.value = selectedUser.email || '';

    passwordInput.value = selectedUser.password || '';

    roleInput.value = selectedUser.role || 'user';

    birthdayInput.value = selectedUser.birthday || '';

    descriptionInput.value = selectedUser.description || '';

    // Display status

    let status = selectedUser.status || 'Active';

    let statusRadio = document.querySelector(

        'input[name="status"][value="' + status + '"]'

    );

    if (statusRadio !== null) {

        statusRadio.checked = true;

    }

}

// 8. Hide messages

function hideMessages() {

    messageBox.classList.remove('show');

    toast.classList.add('hidden');

    errorBox.classList.add('hidden');

    let errors = errorBox.querySelectorAll(':scope > div');

    for (let i = 0; i < errors.length; i++) {

        errors[i].classList.add('hidden');
        }

}

// 9. Show error

function showError(className) {

    hideMessages();

    messageBox.classList.add('show');

    errorBox.classList.remove('hidden');

    let error = errorBox.querySelector('.' + className);

    if (error !== null) {

        error.classList.remove('hidden');

    }

}

// 10. Show success

function showSuccess() {

    hideMessages();

    messageBox.classList.add('show');

    toast.classList.remove('hidden');

}

// 11. Show and hide password

const eyeIcon = document.querySelector('.password-input .fa-eye');

const eyeSlashIcon = document.querySelector('.password-input .fa-eye-slash');

if (eyeIcon !== null && eyeSlashIcon !== null) {

    eyeIcon.addEventListener('click', function() {

        passwordInput.type = 'text';

        eyeIcon.style.display = 'none';

        eyeSlashIcon.style.display = 'block';

    });

    eyeSlashIcon.addEventListener('click', function() {

        passwordInput.type = 'password';

        eyeSlashIcon.style.display = 'none';

        eyeIcon.style.display = 'block';

    });

}

// 12. Back button

document.querySelector('.back-btn').addEventListener('click', function() {

    window.location.href = './dashboard.html';

});

// 13. Sign out

let signOutLinks = document.querySelectorAll('.sign-out-link');

for (let i = 0; i < signOutLinks.length; i++) {

    signOutLinks[i].addEventListener('click', function(event) {

        event.preventDefault();

        localStorage.removeItem('currentUser');

        sessionStorage.removeItem('currentUser');

        window.location.href = './sign-in.html';

    });

}

// 14. Edit user

editForm.addEventListener('submit', function(event) {

    event.preventDefault();

    hideMessages();

    // Check admin permission

    if (loggedInUser === null || loggedInUser.role !== 'admin') {

        alert('Bạn không có quyền thực hiện thao tác này.');

        return;

    }

    // Get input values

    let username = usernameInput.value.trim();

    let password = passwordInput.value;

    // Check empty fields

    if (username === '' || password === '') {

        showError('username-and-password-empty');

        return;

    }

    // Check password length

    if (password.length < 8) {

        showError('password-min-length-error');

        return;

    }

    // Check password number

    if (!/[0-9]/.test(password)) {

        showError('password-number-required-error');

        return;

    }

    // Check uppercase and lowercase

    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) {

        showError('password-uppercase-lowercase-error');

        return;

    }

    // Get latest user list

    users = getUsers();

    let userIndex = -1;

    // Find user again

    for (let i = 0; i < users.length; i++) {

        if (users[i].usercode == selectedUserCode) {

            userIndex = i;

            break;

        }

    }

    if (userIndex === -1) {

        alert('User không còn tồn tại.');