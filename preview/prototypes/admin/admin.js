// Admin Panel JavaScript - Interactive Functionality

// DOM Elements
const searchInput = document.getElementById('searchInput');
const messagesList = document.getElementById('messagesList');
const tabs = document.querySelectorAll('.tab');
const actionBtns = document.querySelectorAll('.action-btn.view');
const modal = document.getElementById('messageModal');
const modalClose = document.querySelector('.modal-close');
const modalOverlay = document.querySelector('.modal-overlay');

// State
let currentFilter = 'all';
let searchTerm = '';

// Tab Filtering
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Update active tab
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Update filter
        currentFilter = tab.dataset.status;

        // Apply filter
        filterMessages();
    });
});

// Search Functionality
let searchTimeout;
searchInput.addEventListener('input', (e) => {
    // Debounce search
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        searchTerm = e.target.value.toLowerCase();
        filterMessages();
    }, 300);
});

// Filter Messages
function filterMessages() {
    const messageCards = document.querySelectorAll('.message-card');

    messageCards.forEach(card => {
        const isUnread = card.classList.contains('unread');
        const senderName = card.querySelector('.sender-name').textContent.toLowerCase();
        const senderEmail = card.querySelector('.sender-email').textContent.toLowerCase();
        const subject = card.querySelector('.message-subject').textContent.toLowerCase();
        const preview = card.querySelector('.message-preview').textContent.toLowerCase();

        // Check filter match
        let filterMatch = true;
        if (currentFilter === 'unread') {
            filterMatch = isUnread;
        } else if (currentFilter === 'read') {
            filterMatch = !isUnread;
        } else if (currentFilter === 'archived') {
            filterMatch = false; // No archived messages in this prototype
        }

        // Check search match
        let searchMatch = true;
        if (searchTerm) {
            searchMatch =
                senderName.includes(searchTerm) ||
                senderEmail.includes(searchTerm) ||
                subject.includes(searchTerm) ||
                preview.includes(searchTerm);
        }

        // Show/hide card
        if (filterMatch && searchMatch) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });

    // Update empty state (if needed)
    const visibleCards = document.querySelectorAll('.message-card[style="display: block;"], .message-card:not([style])');
    if (visibleCards.length === 0 && (currentFilter !== 'all' || searchTerm)) {
        // Could show empty state message here
        console.log('No messages match the current filter');
    }
}

// Modal Functionality
actionBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openModal();
    });
});

function openModal() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', closeModal);

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
    }
});

// Action Button Handlers
document.querySelectorAll('.action-btn.archive').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const card = btn.closest('.message-card');
        if (confirm('Archive this message?')) {
            card.style.opacity = '0.5';
            setTimeout(() => {
                card.remove();
            }, 300);
        }
    });
});

document.querySelectorAll('.action-btn.spam').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const card = btn.closest('.message-card');
        if (confirm('Mark this message as spam?')) {
            card.style.opacity = '0.5';
            setTimeout(() => {
                card.remove();
            }, 300);
        }
    });
});

// Mark as Read Button in Modal
document.querySelector('.modal-footer .btn-secondary:first-child').addEventListener('click', () => {
    console.log('Marked as read');
    closeModal();
});

// Save Notes Button
document.querySelector('.modal-footer .btn-primary').addEventListener('click', () => {
    const notes = document.querySelector('.admin-notes').value;
    console.log('Saving notes:', notes);
    alert('Notes saved successfully!');
});

// Export CSV Button
document.querySelector('.export-btn').addEventListener('click', () => {
    console.log('Exporting to CSV...');
    alert('Export functionality would download a CSV file with all messages');
});

// Pagination
document.querySelectorAll('.page-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        if (!btn.disabled && !btn.classList.contains('active')) {
            // Remove active from all
            document.querySelectorAll('.page-btn').forEach(b => b.classList.remove('active'));
            // Add active to clicked (if it's a number)
            if (!isNaN(btn.textContent)) {
                btn.classList.add('active');
            }
            console.log('Navigate to page:', btn.textContent);
        }
    });
});

// Initialize
console.log('Admin panel loaded');
