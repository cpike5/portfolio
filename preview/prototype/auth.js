// Authentication Form Handler

// OAuth Handlers
const handleOAuthLogin = (provider) => {
    console.log(`Initiating ${provider} OAuth login...`);
    showFormMessage(`Redirecting to ${provider}...`, 'success');

    // In a real app, this would redirect to OAuth provider
    // Example: window.location.href = `/auth/${provider.toLowerCase()}`;

    setTimeout(() => {
        console.log(`${provider} OAuth flow would continue here`);
    }, 1500);
};

// Google OAuth buttons
const googleLoginButton = document.getElementById('googleLogin');
if (googleLoginButton) {
    googleLoginButton.addEventListener('click', () => handleOAuthLogin('Google'));
}

const googleRegisterButton = document.getElementById('googleRegister');
if (googleRegisterButton) {
    googleRegisterButton.addEventListener('click', () => handleOAuthLogin('Google'));
}

// Microsoft OAuth buttons
const microsoftLoginButton = document.getElementById('microsoftLogin');
if (microsoftLoginButton) {
    microsoftLoginButton.addEventListener('click', () => handleOAuthLogin('Microsoft'));
}

const microsoftRegisterButton = document.getElementById('microsoftRegister');
if (microsoftRegisterButton) {
    microsoftRegisterButton.addEventListener('click', () => handleOAuthLogin('Microsoft'));
}

// Form validation utilities
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validatePassword = (password) => {
    return password.length >= 8;
};

const validateName = (name) => {
    return name.trim().length >= 2;
};

const showError = (fieldId, message) => {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(`${fieldId}Error`);

    if (field && errorElement) {
        field.classList.add('error');
        field.classList.remove('success');
        field.setAttribute('aria-invalid', 'true');
        errorElement.textContent = message;
        errorElement.classList.add('visible');
    }
};

const clearError = (fieldId) => {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(`${fieldId}Error`);

    if (field && errorElement) {
        field.classList.remove('error');
        field.setAttribute('aria-invalid', 'false');
        errorElement.textContent = '';
        errorElement.classList.remove('visible');
    }
};

const showSuccess = (fieldId) => {
    const field = document.getElementById(fieldId);
    if (field) {
        field.classList.add('success');
        field.classList.remove('error');
    }
};

const showFormMessage = (message, type) => {
    const messageElement = document.getElementById('formMessage');
    if (messageElement) {
        messageElement.textContent = message;
        messageElement.className = `form-message visible ${type}`;

        setTimeout(() => {
            messageElement.classList.remove('visible');
        }, 5000);
    }
};

// Login Form Handler
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        let isValid = true;

        // Get form values
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        // Clear previous errors
        clearError('email');
        clearError('password');

        // Validate email
        if (!email) {
            showError('email', 'Email is required');
            isValid = false;
        } else if (!validateEmail(email)) {
            showError('email', 'Please enter a valid email address');
            isValid = false;
        } else {
            showSuccess('email');
        }

        // Validate password
        if (!password) {
            showError('password', 'Password is required');
            isValid = false;
        } else {
            showSuccess('password');
        }

        if (!isValid) {
            return;
        }

        // Simulate login
        const submitButton = document.getElementById('submitButton');
        submitButton.classList.add('loading');
        submitButton.disabled = true;

        // Simulate API call
        setTimeout(() => {
            submitButton.classList.remove('loading');
            submitButton.disabled = false;

            // Demo: Show success message
            showFormMessage('Login successful! Redirecting...', 'success');

            // Simulate redirect after 2 seconds
            setTimeout(() => {
                // In a real app, redirect to dashboard
                console.log('Redirecting to dashboard...');
            }, 2000);
        }, 1500);
    });

    // Real-time validation
    document.getElementById('email').addEventListener('blur', function() {
        if (this.value.trim()) {
            if (validateEmail(this.value.trim())) {
                clearError('email');
                showSuccess('email');
            } else {
                showError('email', 'Please enter a valid email address');
            }
        }
    });
}

// Register Form Handler
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        let isValid = true;

        // Get form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const terms = document.getElementById('terms').checked;

        // Clear previous errors
        clearError('name');
        clearError('email');
        clearError('password');
        clearError('confirmPassword');

        // Validate name
        if (!name) {
            showError('name', 'Name is required');
            isValid = false;
        } else if (!validateName(name)) {
            showError('name', 'Name must be at least 2 characters');
            isValid = false;
        } else {
            showSuccess('name');
        }

        // Validate email
        if (!email) {
            showError('email', 'Email is required');
            isValid = false;
        } else if (!validateEmail(email)) {
            showError('email', 'Please enter a valid email address');
            isValid = false;
        } else {
            showSuccess('email');
        }

        // Validate password
        if (!password) {
            showError('password', 'Password is required');
            isValid = false;
        } else if (!validatePassword(password)) {
            showError('password', 'Password must be at least 8 characters');
            isValid = false;
        } else {
            showSuccess('password');
        }

        // Validate confirm password
        if (!confirmPassword) {
            showError('confirmPassword', 'Please confirm your password');
            isValid = false;
        } else if (password !== confirmPassword) {
            showError('confirmPassword', 'Passwords do not match');
            isValid = false;
        } else {
            showSuccess('confirmPassword');
        }

        // Validate terms
        if (!terms) {
            showFormMessage('Please accept the Terms & Conditions', 'error');
            isValid = false;
        }

        if (!isValid) {
            return;
        }

        // Simulate registration
        const submitButton = document.getElementById('submitButton');
        submitButton.classList.add('loading');
        submitButton.disabled = true;

        // Simulate API call
        setTimeout(() => {
            submitButton.classList.remove('loading');
            submitButton.disabled = false;

            // Demo: Show success message
            showFormMessage('Account created successfully! Redirecting to login...', 'success');

            // Simulate redirect after 2 seconds
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        }, 1500);
    });

    // Real-time validation
    document.getElementById('name').addEventListener('blur', function() {
        if (this.value.trim()) {
            if (validateName(this.value.trim())) {
                clearError('name');
                showSuccess('name');
            } else {
                showError('name', 'Name must be at least 2 characters');
            }
        }
    });

    document.getElementById('email').addEventListener('blur', function() {
        if (this.value.trim()) {
            if (validateEmail(this.value.trim())) {
                clearError('email');
                showSuccess('email');
            } else {
                showError('email', 'Please enter a valid email address');
            }
        }
    });

    document.getElementById('password').addEventListener('input', function() {
        if (this.value) {
            if (validatePassword(this.value)) {
                clearError('password');
                showSuccess('password');
            }
        }
    });

    document.getElementById('confirmPassword').addEventListener('input', function() {
        const password = document.getElementById('password').value;
        if (this.value && password) {
            if (this.value === password) {
                clearError('confirmPassword');
                showSuccess('confirmPassword');
            } else {
                showError('confirmPassword', 'Passwords do not match');
            }
        }
    });
}

// Clear error on focus
document.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('focus', function() {
        const fieldId = this.id;
        const errorElement = document.getElementById(`${fieldId}Error`);
        if (errorElement && errorElement.classList.contains('visible')) {
            clearError(fieldId);
        }
    });
});
