// Contact Messages Admin JavaScript

// Sample message data
const messages = [
    {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        subject: 'Website Development Inquiry',
        message: `Hey, I came across your portfolio and was really impressed with your work. I'd like to discuss a potential project for my startup. We're building a cloud-based SaaS platform and need someone with strong .NET and Azure experience.

Would you be available for a quick call next week to discuss the details?

Looking forward to hearing from you!`,
        date: 'Jan 4, 2025 at 2:34 PM',
        timeAgo: '2 hours ago',
        ip: '192.168.1.100',
        status: 'unread'
    },
    {
        id: 2,
        name: 'Jane Smith',
        email: 'jane.smith@techcorp.com',
        subject: 'Collaboration Opportunity',
        message: `Hi! I'm a product manager at TechCorp and we're looking for talented developers for a collaboration opportunity. Would love to chat about a potential partnership.

We're building some exciting new features and your expertise would be a great fit.`,
        date: 'Jan 4, 2025 at 11:15 AM',
        timeAgo: '5 hours ago',
        ip: '192.168.1.101',
        status: 'unread'
    },
    {
        id: 3,
        name: 'Bob Johnson',
        email: 'bob.johnson@email.com',
        subject: 'Quick Question',
        message: `I noticed you're using Blazor for this portfolio. How has your experience been with it compared to React or Vue?

I'm considering it for my next project and would love your insights.`,
        date: 'Jan 3, 2025 at 3:22 PM',
        timeAgo: '1 day ago',
        ip: '192.168.1.102',
        status: 'read'
    },
    {
        id: 4,
        name: 'Sarah Williams',
        email: 'sarah.w@consulting.com',
        subject: 'Speaking Engagement',
        message: `We're organizing a tech meetup next month and would love to have you speak about your experience with .NET and cloud architecture.

The event will be on February 15th. Would you be interested?`,
        date: 'Jan 2, 2025 at 10:45 AM',
        timeAgo: '2 days ago',
        ip: '192.168.1.103',
        status: 'read'
    },
    {
        id: 5,
        name: 'Mike Chen',
        email: 'mchen@startupxyz.io',
        subject: 'Freelance Project Proposal',
        message: `Our startup is building a SaaS platform and we need someone with your backend expertise. The project timeline is 3-4 months.

Would you be interested in discussing this opportunity? We can hop on a call this week.`,
        date: 'Jan 1, 2025 at 4:12 PM',
        timeAgo: '3 days ago',
        ip: '192.168.1.104',
        status: 'read'
    }
];

// Modal functionality
const modal = document.getElementById('messageModal');
const modalOverlay = document.getElementById('modalOverlay');
const closeModalBtn = document.getElementById('closeModal');

// Function to open modal with message data
function openMessageModal(messageId) {
    const message = messages.find(m => m.id === messageId);
    if (!message) return;

    // Update modal content
    document.querySelector('#messageModal .modal-body').innerHTML = `
        <div class="form-group">
            <label class="form-label">From</label>
            <p style="color: var(--color-text); font-weight: 600; margin-bottom: 0.25rem;">${message.name}</p>
            <a href="mailto:${message.email}" style="color: var(--color-primary); text-decoration: none;">${message.email}</a>
        </div>

        <div class="form-group">
            <label class="form-label">Subject</label>
            <p style="color: var(--color-text); margin: 0;">${message.subject}</p>
        </div>

        <div class="form-group">
            <label class="form-label">Message</label>
            <div style="color: var(--color-text); line-height: 1.7; background-color: rgba(255, 255, 255, 0.02); padding: 1rem; border: 1px solid rgba(183, 65, 254, 0.1); border-radius: 4px;">
                ${message.message.split('\n\n').map(p => `<p style="margin: 0 0 1rem 0;">${p}</p>`).join('')}
            </div>
        </div>

        <div class="form-group">
            <label class="form-label">Metadata</label>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; background-color: rgba(255, 255, 255, 0.02); padding: 1rem; border: 1px solid rgba(183, 65, 254, 0.1); border-radius: 4px;">
                <div>
                    <span style="color: var(--color-text-light); font-size: 0.875rem;">Received:</span>
                    <p style="color: var(--color-text); margin: 0.25rem 0 0 0;">${message.date}</p>
                </div>
                <div>
                    <span style="color: var(--color-text-light); font-size: 0.875rem;">IP Address:</span>
                    <p style="color: var(--color-text); margin: 0.25rem 0 0 0;">${message.ip}</p>
                </div>
                <div>
                    <span style="color: var(--color-text-light); font-size: 0.875rem;">Status:</span>
                    <p style="margin: 0.25rem 0 0 0;">
                        <span class="status-badge ${message.status === 'unread' ? '' : 'active'}" style="${message.status === 'unread' ? 'background-color: rgba(183, 65, 254, 0.2); color: var(--color-primary-hover); border: 1px solid rgba(183, 65, 254, 0.3);' : ''}">${message.status.toUpperCase()}</span>
                    </p>
                </div>
            </div>
        </div>

        <div class="form-group" style="margin-bottom: 0;">
            <label class="form-label">Admin Notes</label>
            <textarea class="form-input" placeholder="Add private notes about this message..." rows="4" id="adminNotes"></textarea>
        </div>
    `;

    // Store current message ID on modal
    modal.dataset.messageId = messageId;

    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Function to close modal
function closeMessageModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Close modal event listeners
closeModalBtn.addEventListener('click', closeMessageModal);
modalOverlay.addEventListener('click', closeMessageModal);

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeMessageModal();
    }
});

// Add click handlers to all view buttons
document.addEventListener('click', (e) => {
    if (e.target.closest('.action-btn.view') || e.target.closest('button[title="View Message"]')) {
        const row = e.target.closest('tr');
        const rowIndex = Array.from(row.parentElement.children).indexOf(row);
        const message = messages[rowIndex];
        if (message) {
            openMessageModal(message.id);
        }
    }
});

// Modal action buttons
document.addEventListener('click', (e) => {
    const target = e.target;
    const messageId = parseInt(modal.dataset.messageId);

    if (!messageId) return;

    // Mark as Read button
    if (target.textContent.includes('Mark as Read')) {
        const message = messages.find(m => m.id === messageId);
        if (message) {
            message.status = 'read';
            closeMessageModal();
            // Refresh table would go here
            showNotification('Message marked as read');
        }
    }

    // Archive button
    if (target.textContent.includes('Archive')) {
        const message = messages.find(m => m.id === messageId);
        if (message) {
            message.status = 'archived';
            closeMessageModal();
            showNotification('Message archived');
        }
    }

    // Delete button
    if (target.classList.contains('btn-danger') && modal.classList.contains('active')) {
        if (confirm('Are you sure you want to delete this message? This action cannot be undone.')) {
            const index = messages.findIndex(m => m.id === messageId);
            if (index !== -1) {
                messages.splice(index, 1);
                closeMessageModal();
                showNotification('Message deleted');
            }
        }
    }

    // Save Notes button
    if (target.textContent.includes('Save Notes')) {
        const notes = document.getElementById('adminNotes')?.value;
        if (notes) {
            showNotification('Notes saved successfully');
        }
    }
});

// Simple notification function
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        background-color: var(--color-primary);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 2000;
        animation: slideInUp 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutDown 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes slideOutDown {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(20px);
        }
    }
`;
document.head.appendChild(style);

// Status filter functionality
const statusButtons = {
    allTab: document.getElementById('allTab'),
    unreadTab: document.getElementById('unreadTab'),
    readTab: document.getElementById('readTab'),
    archivedTab: document.getElementById('archivedTab')
};

Object.entries(statusButtons).forEach(([key, button]) => {
    if (button) {
        button.addEventListener('click', () => {
            // Update active state
            Object.values(statusButtons).forEach(btn => {
                btn.classList.remove('btn-primary');
                btn.classList.add('btn-secondary');
                btn.style.backgroundColor = '';
                btn.style.color = '';
            });

            button.classList.remove('btn-secondary');
            button.classList.add('btn-primary');
            button.style.backgroundColor = 'var(--color-primary)';
            button.style.color = 'white';

            // Filter logic would go here
            const filter = key.replace('Tab', '');
            console.log('Filter by:', filter);
        });
    }
});

console.log('Contact Messages Admin JS loaded');
