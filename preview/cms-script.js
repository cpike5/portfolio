// CMS Management Interface Script

document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    initializeCheckboxes();
    initializeActionButtons();
    initializeSearch();
    initializeMobileMenu();
});

// Master checkbox functionality
function initializeCheckboxes() {
    const masterCheckbox = document.querySelector('thead .checkbox');
    const rowCheckboxes = document.querySelectorAll('tbody .checkbox');

    if (masterCheckbox) {
        masterCheckbox.addEventListener('change', function() {
            rowCheckboxes.forEach(checkbox => {
                checkbox.checked = masterCheckbox.checked;
            });
            updateSelectionCount();
        });
    }

    rowCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateMasterCheckbox();
            updateSelectionCount();
        });
    });
}

function updateMasterCheckbox() {
    const masterCheckbox = document.querySelector('thead .checkbox');
    const rowCheckboxes = document.querySelectorAll('tbody .checkbox');
    const checkedCount = Array.from(rowCheckboxes).filter(cb => cb.checked).length;

    if (masterCheckbox) {
        masterCheckbox.checked = checkedCount === rowCheckboxes.length;
        masterCheckbox.indeterminate = checkedCount > 0 && checkedCount < rowCheckboxes.length;
    }
}

function updateSelectionCount() {
    const rowCheckboxes = document.querySelectorAll('tbody .checkbox');
    const checkedCount = Array.from(rowCheckboxes).filter(cb => cb.checked).length;

    // Could display selection count in header
    console.log(`${checkedCount} items selected`);
}

// Action button handlers
function initializeActionButtons() {
    const editButtons = document.querySelectorAll('.action-btn[title="Edit"]');
    const deleteButtons = document.querySelectorAll('.action-btn[title="Delete"]');

    editButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const row = button.closest('tr');
            const title = row.querySelector('.table-cell-primary').textContent;
            console.log('Edit:', title);
            // Add your edit logic here
        });
    });

    deleteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const row = button.closest('tr');
            const title = row.querySelector('.table-cell-primary').textContent;

            if (confirm(`Are you sure you want to delete "${title}"?`)) {
                row.style.opacity = '0';
                setTimeout(() => {
                    row.remove();
                    updateMasterCheckbox();
                }, 300);
            }
        });
    });
}

// Search functionality
function initializeSearch() {
    const searchInput = document.querySelector('.search-box input');
    const filterSelect = document.querySelector('.filter-select');

    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filterTable(searchInput.value, filterSelect?.value || 'All Status');
        });
    }

    if (filterSelect) {
        filterSelect.addEventListener('change', function() {
            filterTable(searchInput?.value || '', filterSelect.value);
        });
    }
}

function filterTable(searchTerm, statusFilter) {
    const rows = document.querySelectorAll('.data-table tbody tr');
    const lowerSearchTerm = searchTerm.toLowerCase();

    rows.forEach(row => {
        const title = row.querySelector('.table-cell-primary')?.textContent.toLowerCase() || '';
        const author = row.cells[2]?.textContent.toLowerCase() || '';
        const status = row.querySelector('.status-badge')?.textContent || '';
        const category = row.cells[4]?.textContent.toLowerCase() || '';

        const matchesSearch = !searchTerm ||
            title.includes(lowerSearchTerm) ||
            author.includes(lowerSearchTerm) ||
            category.includes(lowerSearchTerm);

        const matchesStatus = statusFilter === 'All Status' ||
            status.toLowerCase().includes(statusFilter.toLowerCase());

        if (matchesSearch && matchesStatus) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });

    updatePaginationInfo();
}

function updatePaginationInfo() {
    const visibleRows = Array.from(document.querySelectorAll('.data-table tbody tr'))
        .filter(row => row.style.display !== 'none');
    const paginationInfo = document.querySelector('.pagination-info');

    if (paginationInfo) {
        const total = visibleRows.length;
        const showing = Math.min(8, total);
        paginationInfo.innerHTML = `Showing <strong>1-${showing}</strong> of <strong>${total}</strong> entries`;
    }
}

// Mobile menu functionality
function initializeMobileMenu() {
    // Add mobile menu button to navbar on mobile
    if (window.innerWidth <= 768) {
        const navbar = document.querySelector('.top-navbar');
        const brand = document.querySelector('.navbar-brand');

        if (navbar && !document.querySelector('.mobile-toggle')) {
            const menuButton = document.createElement('button');
            menuButton.className = 'mobile-toggle navbar-item';
            menuButton.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
            `;

            navbar.insertBefore(menuButton, brand);

            menuButton.addEventListener('click', function() {
                const sidebar = document.querySelector('.sidebar');
                sidebar.classList.toggle('mobile-open');

                // Add overlay
                if (sidebar.classList.contains('mobile-open')) {
                    const overlay = document.createElement('div');
                    overlay.className = 'sidebar-overlay';
                    overlay.style.cssText = `
                        position: fixed;
                        top: 64px;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background-color: rgba(0, 0, 0, 0.6);
                        z-index: 99;
                    `;
                    document.body.appendChild(overlay);

                    overlay.addEventListener('click', function() {
                        sidebar.classList.remove('mobile-open');
                        overlay.remove();
                    });
                } else {
                    const overlay = document.querySelector('.sidebar-overlay');
                    if (overlay) overlay.remove();
                }
            });
        }
    }
}

// Handle window resize
window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.querySelector('.sidebar-overlay');

        if (sidebar) sidebar.classList.remove('mobile-open');
        if (overlay) overlay.remove();
    }
});

// User menu dropdown (placeholder)
const userMenu = document.querySelector('.user-menu');
if (userMenu) {
    userMenu.addEventListener('click', function() {
        console.log('User menu clicked - implement dropdown here');
        // Add dropdown menu functionality here
    });
}

// Header action buttons
const addNewBtn = document.querySelector('.btn-primary');
const exportBtn = document.querySelector('.btn-secondary');

if (addNewBtn) {
    addNewBtn.addEventListener('click', function() {
        console.log('Add new item');
        // Add your logic here
    });
}

if (exportBtn) {
    exportBtn.addEventListener('click', function() {
        console.log('Export data');
        // Add your export logic here
    });
}

// Notification button
const notificationBtn = document.querySelector('.navbar-item');
if (notificationBtn) {
    notificationBtn.addEventListener('click', function() {
        console.log('Show notifications');
        // Add notification panel logic here
    });
}
