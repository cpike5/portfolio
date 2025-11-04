// User Management Admin Page
// Mock data and UI functionality

// Sample user data
let users = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'Admin', status: 'Active', lastLogin: '2025-01-03' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', role: 'Editor', status: 'Active', lastLogin: '2025-01-02' },
    { id: 3, name: 'Bob Johnson', email: 'bob.johnson@example.com', role: 'Viewer', status: 'Active', lastLogin: '2025-01-01' },
    { id: 4, name: 'Alice Williams', email: 'alice.williams@example.com', role: 'Editor', status: 'Inactive', lastLogin: '2024-12-28' },
    { id: 5, name: 'Charlie Brown', email: 'charlie.brown@example.com', role: 'Viewer', status: 'Active', lastLogin: '2025-01-03' },
    { id: 6, name: 'Diana Prince', email: 'diana.prince@example.com', role: 'Admin', status: 'Active', lastLogin: '2025-01-03' },
    { id: 7, name: 'Eve Davis', email: 'eve.davis@example.com', role: 'Editor', status: 'Active', lastLogin: '2025-01-02' },
    { id: 8, name: 'Frank Miller', email: 'frank.miller@example.com', role: 'Viewer', status: 'Inactive', lastLogin: '2024-12-30' },
    { id: 9, name: 'Grace Lee', email: 'grace.lee@example.com', role: 'Editor', status: 'Active', lastLogin: '2025-01-03' },
    { id: 10, name: 'Henry Wilson', email: 'henry.wilson@example.com', role: 'Admin', status: 'Active', lastLogin: '2025-01-01' }
];

// State
let currentPage = 1;
const itemsPerPage = 8;
let filteredUsers = [...users];
let sortColumn = null;
let sortDirection = 'asc';
let currentUserId = null;
let deleteUserId = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderTable();
    setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
    // Search
    document.getElementById('searchInput').addEventListener('input', handleSearch);

    // Filters
    document.getElementById('roleFilter').addEventListener('change', handleFilter);
    document.getElementById('statusFilter').addEventListener('change', handleFilter);

    // Add User Button
    document.getElementById('addUserBtn').addEventListener('click', openAddUserModal);

    // Modal Close Buttons
    document.getElementById('closeModal').addEventListener('click', closeUserModal);
    document.getElementById('modalOverlay').addEventListener('click', closeUserModal);
    document.getElementById('cancelBtn').addEventListener('click', closeUserModal);

    // Delete Modal Close Buttons
    document.getElementById('closeDeleteModal').addEventListener('click', closeDeleteModal);
    document.getElementById('deleteModalOverlay').addEventListener('click', closeDeleteModal);
    document.getElementById('cancelDeleteBtn').addEventListener('click', closeDeleteModal);

    // Form Submit
    document.getElementById('userForm').addEventListener('submit', handleFormSubmit);

    // Delete Confirm
    document.getElementById('confirmDeleteBtn').addEventListener('click', confirmDelete);

    // Pagination
    document.getElementById('prevPage').addEventListener('click', () => changePage(-1));
    document.getElementById('nextPage').addEventListener('click', () => changePage(1));

    // Table Sorting
    document.querySelectorAll('.sortable').forEach(th => {
        th.addEventListener('click', () => handleSort(th.dataset.column));
    });
}

// Search Handler
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm)
    );
    applyFilters();
}

// Filter Handler
function handleFilter() {
    const roleFilter = document.getElementById('roleFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;

    filteredUsers = users.filter(user => {
        const matchesRole = !roleFilter || user.role === roleFilter;
        const matchesStatus = !statusFilter || user.status === statusFilter;
        return matchesRole && matchesStatus;
    });

    // Apply search if there is one
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    if (searchTerm) {
        filteredUsers = filteredUsers.filter(user =>
            user.name.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm)
        );
    }

    applyFilters();
}

function applyFilters() {
    currentPage = 1;
    renderTable();
}

// Sorting
function handleSort(column) {
    if (sortColumn === column) {
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        sortColumn = column;
        sortDirection = 'asc';
    }

    filteredUsers.sort((a, b) => {
        let aVal = a[column];
        let bVal = b[column];

        // Handle numeric IDs
        if (column === 'id') {
            aVal = parseInt(aVal);
            bVal = parseInt(bVal);
        }

        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    // Update sort indicators
    document.querySelectorAll('.sortable').forEach(th => {
        th.classList.remove('asc', 'desc');
    });
    document.querySelector(`[data-column="${column}"]`).classList.add(sortDirection);

    renderTable();
}

// Render Table
function renderTable() {
    const tbody = document.getElementById('usersTableBody');
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    if (paginatedUsers.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-state">
                    <p>No users found</p>
                </td>
            </tr>
        `;
    } else {
        tbody.innerHTML = paginatedUsers.map(user => `
            <tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td><span class="role-badge">${user.role}</span></td>
                <td><span class="status-badge ${user.status.toLowerCase()}">${user.status}</span></td>
                <td>${formatDate(user.lastLogin)}</td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn" onclick="editUser(${user.id})" aria-label="Edit user">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>
                        </button>
                        <button class="action-btn delete" onclick="deleteUser(${user.id})" aria-label="Delete user">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    updatePagination();
}

// Format Date
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// Pagination
function updatePagination() {
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    document.getElementById('currentPage').textContent = currentPage;
    document.getElementById('totalPages').textContent = totalPages;

    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage === totalPages || totalPages === 0;
}

function changePage(delta) {
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const newPage = currentPage + delta;

    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        renderTable();
    }
}

// Modal Functions
function openAddUserModal() {
    currentUserId = null;
    document.getElementById('modalTitle').textContent = 'Add User';
    document.getElementById('userForm').reset();
    document.getElementById('userId').value = '';
    document.getElementById('userModal').classList.add('active');
}

function editUser(id) {
    const user = users.find(u => u.id === id);
    if (!user) return;

    currentUserId = id;
    document.getElementById('modalTitle').textContent = 'Edit User';
    document.getElementById('userId').value = user.id;
    document.getElementById('userName').value = user.name;
    document.getElementById('userEmail').value = user.email;
    document.getElementById('userRole').value = user.role;
    document.getElementById('userStatus').value = user.status;
    document.getElementById('userModal').classList.add('active');
}

function closeUserModal() {
    document.getElementById('userModal').classList.remove('active');
    document.getElementById('userForm').reset();
    clearErrors();
}

function deleteUser(id) {
    const user = users.find(u => u.id === id);
    if (!user) return;

    deleteUserId = id;
    document.getElementById('deleteUserInfo').textContent = `${user.name} (${user.email})`;
    document.getElementById('deleteModal').classList.add('active');
}

function closeDeleteModal() {
    document.getElementById('deleteModal').classList.remove('active');
    deleteUserId = null;
}

function confirmDelete() {
    if (deleteUserId) {
        users = users.filter(u => u.id !== deleteUserId);
        filteredUsers = filteredUsers.filter(u => u.id !== deleteUserId);
        renderTable();
        closeDeleteModal();
        showNotification('User deleted successfully');
    }
}

// Form Validation
function validateForm() {
    let isValid = true;
    clearErrors();

    const name = document.getElementById('userName').value.trim();
    const email = document.getElementById('userEmail').value.trim();
    const role = document.getElementById('userRole').value;

    if (!name) {
        showError('nameError', 'Name is required');
        isValid = false;
    }

    if (!email) {
        showError('emailError', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('emailError', 'Please enter a valid email address');
        isValid = false;
    }

    if (!role) {
        showError('roleError', 'Role is required');
        isValid = false;
    }

    return isValid;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(elementId, message) {
    document.getElementById(elementId).textContent = message;
}

function clearErrors() {
    document.querySelectorAll('.form-error').forEach(el => el.textContent = '');
}

// Form Submit
function handleFormSubmit(e) {
    e.preventDefault();

    if (!validateForm()) return;

    const submitButton = document.getElementById('saveUserBtn');
    submitButton.disabled = true;

    // Simulate API call
    setTimeout(() => {
        const name = document.getElementById('userName').value.trim();
        const email = document.getElementById('userEmail').value.trim();
        const role = document.getElementById('userRole').value;
        const status = document.getElementById('userStatus').value;

        if (currentUserId) {
            // Edit existing user
            const user = users.find(u => u.id === currentUserId);
            if (user) {
                user.name = name;
                user.email = email;
                user.role = role;
                user.status = status;
            }
            showNotification('User updated successfully');
        } else {
            // Add new user
            const newUser = {
                id: Math.max(...users.map(u => u.id)) + 1,
                name,
                email,
                role,
                status,
                lastLogin: 'Never'
            };
            users.push(newUser);
            showNotification('User created successfully');
        }

        filteredUsers = [...users];
        handleFilter(); // Reapply filters
        closeUserModal();
        submitButton.disabled = false;
    }, 1000);
}

// Notification (simple console log for prototype)
function showNotification(message) {
    console.log('Notification:', message);
    // In a real app, this would show a toast notification
}
