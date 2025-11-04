// Role Management Admin Page
// Mock data and UI functionality

// Sample role data
let roles = [
    {
        id: 1,
        name: 'Admin',
        description: 'Full system access with all permissions',
        permissions: ['users.view', 'users.create', 'users.edit', 'users.delete', 'roles.view', 'roles.create', 'roles.edit', 'roles.delete', 'content.view', 'content.create', 'content.edit', 'content.delete', 'content.publish', 'settings.view', 'settings.edit', 'logs.view'],
        userCount: 3
    },
    {
        id: 2,
        name: 'Editor',
        description: 'Can create and edit content',
        permissions: ['users.view', 'content.view', 'content.create', 'content.edit', 'content.publish'],
        userCount: 4
    },
    {
        id: 3,
        name: 'Viewer',
        description: 'Read-only access to content',
        permissions: ['content.view'],
        userCount: 3
    },
    {
        id: 4,
        name: 'Content Manager',
        description: 'Manages all content operations',
        permissions: ['content.view', 'content.create', 'content.edit', 'content.delete', 'content.publish'],
        userCount: 0
    }
];

// State
let filteredRoles = [...roles];
let currentRoleId = null;
let deleteRoleId = null;

// Permission labels mapping
const permissionLabels = {
    'users.view': 'View Users',
    'users.create': 'Create Users',
    'users.edit': 'Edit Users',
    'users.delete': 'Delete Users',
    'roles.view': 'View Roles',
    'roles.create': 'Create Roles',
    'roles.edit': 'Edit Roles',
    'roles.delete': 'Delete Roles',
    'content.view': 'View Content',
    'content.create': 'Create Content',
    'content.edit': 'Edit Content',
    'content.delete': 'Delete Content',
    'content.publish': 'Publish Content',
    'settings.view': 'View Settings',
    'settings.edit': 'Edit Settings',
    'logs.view': 'View Logs'
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderRoles();
    setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
    // Search
    document.getElementById('searchInput').addEventListener('input', handleSearch);

    // Add Role Button
    document.getElementById('addRoleBtn').addEventListener('click', openAddRoleModal);

    // Modal Close Buttons
    document.getElementById('closeModal').addEventListener('click', closeRoleModal);
    document.getElementById('modalOverlay').addEventListener('click', closeRoleModal);
    document.getElementById('cancelBtn').addEventListener('click', closeRoleModal);

    // Delete Modal Close Buttons
    document.getElementById('closeDeleteModal').addEventListener('click', closeDeleteModal);
    document.getElementById('deleteModalOverlay').addEventListener('click', closeDeleteModal);
    document.getElementById('cancelDeleteBtn').addEventListener('click', closeDeleteModal);

    // Form Submit
    document.getElementById('roleForm').addEventListener('submit', handleFormSubmit);

    // Delete Confirm
    document.getElementById('confirmDeleteBtn').addEventListener('click', confirmDelete);
}

// Search Handler
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    filteredRoles = roles.filter(role =>
        role.name.toLowerCase().includes(searchTerm) ||
        role.description.toLowerCase().includes(searchTerm)
    );
    renderRoles();
}

// Render Roles Grid
function renderRoles() {
    const grid = document.getElementById('rolesGrid');

    if (filteredRoles.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
                <h3>No roles found</h3>
                <p>Try adjusting your search or create a new role</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = filteredRoles.map(role => `
        <div class="role-card">
            <div class="role-card-header">
                <h3 class="role-card-title">${role.name}</h3>
                <div class="action-buttons">
                    <button class="action-btn" onclick="editRole(${role.id})" aria-label="Edit role">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                    </button>
                    <button class="action-btn delete" onclick="deleteRole(${role.id})" aria-label="Delete role">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                    </button>
                </div>
            </div>
            <p class="role-card-description">${role.description}</p>
            <div class="role-card-stats">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
                ${role.userCount} user${role.userCount !== 1 ? 's' : ''}
            </div>
            <div class="role-card-permissions">
                <span class="permissions-label">Permissions (${role.permissions.length})</span>
                <div class="permission-tags">
                    ${role.permissions.slice(0, 5).map(perm =>
                        `<span class="permission-tag">${permissionLabels[perm] || perm}</span>`
                    ).join('')}
                    ${role.permissions.length > 5 ?
                        `<span class="permission-tag">+${role.permissions.length - 5} more</span>`
                        : ''}
                </div>
            </div>
        </div>
    `).join('');
}

// Modal Functions
function openAddRoleModal() {
    currentRoleId = null;
    document.getElementById('modalTitle').textContent = 'Add Role';
    document.getElementById('roleForm').reset();
    document.getElementById('roleId').value = '';

    // Uncheck all permissions
    document.querySelectorAll('input[name="permissions"]').forEach(checkbox => {
        checkbox.checked = false;
    });

    document.getElementById('roleModal').classList.add('active');
}

function editRole(id) {
    const role = roles.find(r => r.id === id);
    if (!role) return;

    currentRoleId = id;
    document.getElementById('modalTitle').textContent = 'Edit Role';
    document.getElementById('roleId').value = role.id;
    document.getElementById('roleName').value = role.name;
    document.getElementById('roleDescription').value = role.description;

    // Check permissions
    document.querySelectorAll('input[name="permissions"]').forEach(checkbox => {
        checkbox.checked = role.permissions.includes(checkbox.value);
    });

    document.getElementById('roleModal').classList.add('active');
}

function closeRoleModal() {
    document.getElementById('roleModal').classList.remove('active');
    document.getElementById('roleForm').reset();
    clearErrors();
}

function deleteRole(id) {
    const role = roles.find(r => r.id === id);
    if (!role) return;

    deleteRoleId = id;
    document.getElementById('deleteRoleInfo').textContent = `${role.name}`;
    document.getElementById('deleteModal').classList.add('active');
}

function closeDeleteModal() {
    document.getElementById('deleteModal').classList.remove('active');
    deleteRoleId = null;
}

function confirmDelete() {
    if (deleteRoleId) {
        const role = roles.find(r => r.id === deleteRoleId);

        // Check if role has users
        if (role && role.userCount > 0) {
            alert(`Cannot delete role "${role.name}" because it has ${role.userCount} assigned user(s). Please reassign these users first.`);
            closeDeleteModal();
            return;
        }

        roles = roles.filter(r => r.id !== deleteRoleId);
        filteredRoles = filteredRoles.filter(r => r.id !== deleteRoleId);
        renderRoles();
        closeDeleteModal();
        showNotification('Role deleted successfully');
    }
}

// Form Validation
function validateForm() {
    let isValid = true;
    clearErrors();

    const name = document.getElementById('roleName').value.trim();

    if (!name) {
        showError('nameError', 'Role name is required');
        isValid = false;
    }

    return isValid;
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

    const submitButton = document.getElementById('saveRoleBtn');
    submitButton.disabled = true;

    // Simulate API call
    setTimeout(() => {
        const name = document.getElementById('roleName').value.trim();
        const description = document.getElementById('roleDescription').value.trim();

        // Get selected permissions
        const permissions = Array.from(document.querySelectorAll('input[name="permissions"]:checked'))
            .map(checkbox => checkbox.value);

        if (currentRoleId) {
            // Edit existing role
            const role = roles.find(r => r.id === currentRoleId);
            if (role) {
                role.name = name;
                role.description = description;
                role.permissions = permissions;
            }
            showNotification('Role updated successfully');
        } else {
            // Add new role
            const newRole = {
                id: Math.max(...roles.map(r => r.id)) + 1,
                name,
                description,
                permissions,
                userCount: 0
            };
            roles.push(newRole);
            showNotification('Role created successfully');
        }

        filteredRoles = [...roles];
        renderRoles();
        closeRoleModal();
        submitButton.disabled = false;
    }, 1000);
}

// Notification (simple console log for prototype)
function showNotification(message) {
    console.log('Notification:', message);
    // In a real app, this would show a toast notification
}
