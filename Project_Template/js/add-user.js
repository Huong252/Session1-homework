const addForm = document.getElementById('add-new-user-form');
const userCodeInput = document.getElementById('user-code');
const usernameInput = document.getElementById('username');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const roleInput = document.getElementById('role');
const birthdayInput = document.getElementById('dob');
const descriptionInput = document.querySelector('.description-text-input');
const messageBox = document.getElementById('msg');
const toast = document.getElementById('add-toast');
const errorBox = document.getElementById('add-error');

function getUsers() {
  return JSON.parse(localStorage.getItem('userList')) || [];
}
function getLoggedInUser() {
  const savedUser = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
  return savedUser ? JSON.parse(savedUser) : null;
}
function nextUserCode(users) {
  const maxNumber = users.reduce((max, user) => {
    const match = String(user.usercode || '').match(/^U(\d+)$/);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0);
  return `U${String(maxNumber + 1).padStart(3, '0')}`;
}
function hideMessages() {
  messageBox.classList.remove('show');
  toast.classList.add('hidden');
  errorBox.classList.add('hidden');
  errorBox.querySelectorAll(':scope > div').forEach(item => item.classList.add('hidden'));
}
function showError(className) {
  hideMessages();
  messageBox.classList.add('show');
  errorBox.classList.remove('hidden');
  const errorMessage = errorBox.querySelector(`.${className}`);
  if (errorMessage) errorMessage.classList.remove('hidden');
}
function showSuccess() {
  hideMessages();
  messageBox.classList.add('show');
  toast.classList.remove('hidden');
}

const loggedInUser = getLoggedInUser();
if (!loggedInUser) {
  window.location.href = './sign-in.html';
} else if (loggedInUser.role !== 'admin') {
  alert('Bạn không có quyền thêm user.');
  window.location.href = './dashboard.html';
}

userCodeInput.value = nextUserCode(getUsers());

// Show / hide password
const eyeIcon = document.querySelector('.password-input .fa-eye');
const eyeSlashIcon = document.querySelector('.password-input .fa-eye-slash');
if (eyeIcon && eyeSlashIcon) {
  eyeIcon.addEventListener('click', () => {
    passwordInput.type = 'text';
    eyeIcon.style.display = 'none';
    eyeSlashIcon.style.display = 'block';
  });
  eyeSlashIcon.addEventListener('click', () => {
    passwordInput.type = 'password';
    eyeSlashIcon.style.display = 'none';
    eyeIcon.style.display = 'block';
  });
}

document.querySelector('.back-btn').addEventListener('click', () => {
  window.location.href = './dashboard.html';
});
document.querySelectorAll('.sign-out-link').forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
    window.location.href = './sign-in.html';
  });
});

addForm.addEventListener('submit', event => {
  event.preventDefault();
  hideMessages();

  if (!loggedInUser || loggedInUser.role !== 'admin') {
    showError('role-not-admin');
    return;
  }

  const username = usernameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const users = getUsers();

  if (!username || !email || !password) {
    showError('email-username-password-empty');
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showError('email-error');
    return;
  }
  if (users.some(user => user.email.toLowerCase() === email.toLowerCase())) {
    showError('email-exist');
    return;
  }
  if (password.length < 8) {
    showError('password-min-length-error');
    return;
  }
  if (!/[0-9]/.test(password)) {
    showError('password-number-required-error');
    return;
  }
  if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
    showError('password-uppercase-lowercase-error');
    return;
  }

  const selectedStatus = document.querySelector('input[name="status"]:checked');
  const newUser = {
    usercode: nextUserCode(users),
    username,
    email,
    password,
    role: roleInput.value,
    birthday: birthdayInput.value,
    status: selectedStatus ? selectedStatus.value : 'Active',
    description: descriptionInput.value.trim()
  };

  users.push(newUser);
  localStorage.setItem('userList', JSON.stringify(users));
  showSuccess();
  addForm.reset();
  userCodeInput.value = nextUserCode(users);
  document.getElementById('status-active').checked = true;
});
