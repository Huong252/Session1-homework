// 1. Get elements from HTML

const tableBody = document.getElementById('table-body');

const searchBox = document.getElementById('search-box');

const paginationList = document.getElementById('pagination-list');

const previousButton = document.querySelector('.arrow-left');

const nextButton = document.querySelector('.arrow-right');

// 2. Set variables

const PAGE_SIZE = 10;

let currentPage = 1;

let filteredUsers = [];

// 3. Get user list from localStorage

function getUsers() {

    let data = localStorage.getItem('userList');

    if (data === null) {

        return [];

    }

    return JSON.parse(data);

}

// 4. Get logged-in user

function getLoggedInUser() {

    let user = localStorage.getItem('currentUser');

    if (user === null) {

        user = sessionStorage.getItem('currentUser');

    }

    if (user === null) {

        return null;

    }

    return JSON.parse(user);

}

// 5. Sign out

function signOut() {

    localStorage.removeItem('currentUser');

    sessionStorage.removeItem('currentUser');

    window.location.href = './sign-in.html';

}

// 6. Check login and admin role

const loggedInUser = getLoggedInUser();

if (loggedInUser === null) {

    window.location.href = './sign-in.html';

} else if (loggedInUser.role !== 'admin') {

    alert('Bạn không có quyền truy cập trang quản lý user.');

    window.location.href = './sign-in.html';

}

// 7. Handle sign out button

const signOutLinks = document.querySelectorAll('.sign-out-link');

for (let i = 0; i < signOutLinks.length; i++) {

    signOutLinks[i].addEventListener('click', function(event) {

        event.preventDefault();

        signOut();

    });

}

// 8. Display user table

function renderTable() {

    // Calculate starting position

    let start = (currentPage - 1) * PAGE_SIZE;

    // Get users for current page

    let usersOnPage = [];

    for (let i = start; i < start + PAGE_SIZE; i++) {

        if (filteredUsers[i] !== undefined) {

            usersOnPage.push(filteredUsers[i]);

        }

    }

    // Clear old table data

    tableBody.innerHTML = '';

    // Check if there are users

    if (usersOnPage.length === 0) {

        let row = document.createElement('tr');

        let cell = document.createElement('td');

        cell.colSpan = 7;

        cell.textContent = 'Không tìm thấy user.';

        cell.style.textAlign = 'center';

        row.appendChild(cell);

        tableBody.appendChild(row);

    } else {

        // Display each user

        for (let i = 0; i < usersOnPage.length; i++) {

            let user = usersOnPage[i];

            let row = document.createElement('tr');

            // User code

            let codeCell = document.createElement('td');

            codeCell.textContent = user.usercode || '';

            row.appendChild(codeCell);

            // Username

            let nameCell = document.createElement('td');

            nameCell.textContent = user.username || '';
            row.appendChild(nameCell);

            // Email

            let emailCell = document.createElement('td');

            emailCell.textContent = user.email || '';

            row.appendChild(emailCell);

            // Role

            let roleCell = document.createElement('td');

            roleCell.textContent = user.role || '';

            roleCell.className = 'uppercase';

            row.appendChild(roleCell);

            // Birthday

            let birthdayCell = document.createElement('td');

            birthdayCell.textContent = user.birthday || '';

            row.appendChild(birthdayCell);

            // Status

            let statusCell = document.createElement('td');

            let status = user.status || 'Active';

            let statusSpan = document.createElement('span');

            statusSpan.className = 'status-cell';

            if (status.toLowerCase() === 'active') {

                statusSpan.classList.add('active');

            } else {

                statusSpan.classList.add('deactive');

            }

            let dot = document.createElement('span');

            dot.className = 'dot';

            statusSpan.appendChild(dot);

            statusSpan.appendChild(document.createTextNode(status));

            statusCell.appendChild(statusSpan);

            row.appendChild(statusCell);

            // Action buttons

            let actionCell = document.createElement('td');

            let deleteButton = document.createElement('i');

            deleteButton.className = 'fa-solid fa-trash';

            deleteButton.setAttribute('role', 'button');

            deleteButton.setAttribute('tabindex', '0');

            deleteButton.title = 'Delete';

            deleteButton.addEventListener('click', function() {

                deleteUser(user.usercode);

            });

            let editButton = document.createElement('i');

            editButton.className = 'fa-solid fa-pen';

            editButton.setAttribute('role', 'button');

            editButton.setAttribute('tabindex', '0');

            editButton.title = 'Edit';

            editButton.addEventListener('click', function() {

                window.location.href = './edit-user.html?usercode=' +

                    encodeURIComponent(user.usercode);

            });

            actionCell.appendChild(deleteButton);

            actionCell.appendChild(editButton);

            row.appendChild(actionCell);

            tableBody.appendChild(row);

        }

    }

    renderPagination();

}

// 9. Search users

function searchUsers() {

    let keyword = searchBox.value.toLowerCase().trim();

    let allUsers = getUsers();

    filteredUsers = [];

    for (let i = 0; i < allUsers.length; i++) {

        let user = allUsers[i];

        let username = (user.username || '').toLowerCase();

        let email = (user.email || '').toLowerCase();

        let usercode = (user.usercode || '').toLowerCase();

        if (username.includes(keyword) ||

            email.includes(keyword) ||

            usercode.includes(keyword)

        ) {

            filteredUsers.push(user);

        }

    }

    currentPage = 1;

    renderTable();

}

// 10. Delete user

function deleteUser(userCode) {

    if (loggedInUser && loggedInUser.usercode === userCode) {

        alert('Bạn không thể xóa tài khoản đang đăng nhập.');

        return;

    }

    let answer = confirm('Bạn có chắc muốn xóa user này không?');

    if (answer === false) {

        return;

    }

    let allUsers = getUsers();

    let remainingUsers = [];

    for (let i = 0; i < allUsers.length; i++) {

        if (allUsers[i].usercode !== userCode) {

            remainingUsers.push(allUsers[i]);

        }

    }

    localStorage.setItem('userList', JSON.stringify(remainingUsers));

    searchUsers();

}

// 11. Display pagination

function renderPagination() {

    let totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);

    paginationList.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {

        let li = document.createElement('li');

        let button = document.createElement('button');

        button.type = 'button';

        button.textContent = i;

        button.className = 'pagination-element';

        if (i === currentPage) {

            button.classList.add('highlight');

        }

        button.addEventListener('click', function() {

            currentPage = i;

            renderTable();

        });

        li.appendChild(button);

        paginationList.appendChild(li);

    }

    // Previous button

    if (currentPage === 1 || totalPages <= 1) {

        previousButton.classList.add('hidden');

    } else {

        previousButton.classList.remove('hidden');

    }

    // Next button

    if (currentPage === totalPages || totalPages <= 1) {

        nextButton.classList.add('hidden');

    } else {

        nextButton.classList.remove('hidden');

    }

}

// 12. Search when typing

searchBox.addEventListener('input', function() {

    searchUsers();

});

// 13. Previous page

previousButton.addEventListener('click', function() {

    if (currentPage > 1) {

        currentPage--;

        renderTable();

    }

});

// 14. Next page

nextButton.addEventListener('click', function() {

    let totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);

    if (currentPage < totalPages) {

        currentPage++;

        renderTable();

    }

});

// 15. Show users when opening Dashboard

if (loggedInUser !== null && loggedInUser.role === 'admin') {

    searchUsers();

}