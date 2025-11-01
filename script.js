// Active Navigation State
const navLinks = document.querySelectorAll('.nav-links a');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
const allNavLinks = [...navLinks, ...mobileNavLinks];
const sections = document.querySelectorAll('section[id]');

const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
};

const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const activeId = entry.target.getAttribute('id');
            allNavLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${activeId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}, observerOptions);

sections.forEach(section => navObserver.observe(section));

// Back to Top Button
const backToTopButton = document.getElementById('backToTop');
const hero = document.getElementById('home');

window.addEventListener('scroll', () => {
    const heroRect = hero.getBoundingClientRect();
    if (heroRect.bottom < 0) {
        backToTopButton.classList.add('visible');
    } else {
        backToTopButton.classList.remove('visible');
    }
});

backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Scroll Animations
const fadeInElements = document.querySelectorAll('.fade-in');

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-visible');
        }
    });
}, {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
});

fadeInElements.forEach(element => fadeInObserver.observe(element));

// Section Title Underline Animation
const sectionTitles = document.querySelectorAll('.section-title');

const titleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-underline');
        }
    });
}, {
    root: null,
    rootMargin: '0px',
    threshold: 0.5
});

sectionTitles.forEach(title => titleObserver.observe(title));

// Contact Form Validation and Submission
const contactForm = document.getElementById('contactForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');
const submitButton = document.getElementById('submitButton');
const formMessage = document.getElementById('formMessage');
const charCounter = document.getElementById('charCounter');
const formOverlay = document.getElementById('formOverlay');
const formWrapper = document.querySelector('.form-wrapper');
const successState = document.getElementById('successState');

// Validation functions
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validateField(input, errorElement, validator) {
    const value = input.value.trim();
    let errorMessage = '';

    if (!value) {
        errorMessage = 'This field is required';
    } else if (validator && !validator(value)) {
        if (input.type === 'email') {
            errorMessage = 'Please enter a valid email address';
        } else {
            errorMessage = 'Invalid input';
        }
    }

    if (errorMessage) {
        input.classList.add('error');
        input.classList.remove('success');
        input.setAttribute('aria-invalid', 'true');
        errorElement.textContent = errorMessage;
        errorElement.classList.add('visible');
        return false;
    } else {
        input.classList.remove('error');
        input.classList.add('success');
        input.setAttribute('aria-invalid', 'false');
        errorElement.textContent = '';
        errorElement.classList.remove('visible');
        return true;
    }
}

function clearFieldValidation(input, errorElement) {
    input.classList.remove('error', 'success');
    input.setAttribute('aria-invalid', 'false');
    errorElement.textContent = '';
    errorElement.classList.remove('visible');
}

// Character counter for message field
function updateCharCounter() {
    const maxLength = 500;
    const currentLength = messageInput.value.length;
    const remaining = maxLength - currentLength;

    charCounter.textContent = `${remaining} character${remaining !== 1 ? 's' : ''} remaining`;

    charCounter.classList.remove('warning', 'limit');
    if (remaining <= 0) {
        charCounter.classList.add('limit');
    } else if (remaining <= 50) {
        charCounter.classList.add('warning');
    }
}

messageInput.addEventListener('input', updateCharCounter);

// Real-time validation on blur
nameInput.addEventListener('blur', () => {
    validateField(nameInput, document.getElementById('nameError'), null);
});

emailInput.addEventListener('blur', () => {
    validateField(emailInput, document.getElementById('emailError'), validateEmail);
});

messageInput.addEventListener('blur', () => {
    validateField(messageInput, document.getElementById('messageError'), null);
});

// Clear validation on focus
nameInput.addEventListener('focus', () => {
    clearFieldValidation(nameInput, document.getElementById('nameError'));
});

emailInput.addEventListener('focus', () => {
    clearFieldValidation(emailInput, document.getElementById('emailError'));
});

messageInput.addEventListener('focus', () => {
    clearFieldValidation(messageInput, document.getElementById('messageError'));
});

// Show form message
function showFormMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = 'form-message visible ' + type;

    // Auto-hide after 5 seconds
    setTimeout(() => {
        formMessage.classList.remove('visible');
    }, 5000);
}

// Form submission
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate all fields
    const isNameValid = validateField(nameInput, document.getElementById('nameError'), null);
    const isEmailValid = validateField(emailInput, document.getElementById('emailError'), validateEmail);
    const isMessageValid = validateField(messageInput, document.getElementById('messageError'), null);

    if (!isNameValid || !isEmailValid || !isMessageValid) {
        showFormMessage('Please fix the errors above', 'error');
        return;
    }

    // Show overlay and disable form
    formOverlay.classList.add('visible');
    submitButton.disabled = true;

    // Simulate form submission (2 second delay)
    try {
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Success! Hide overlay, hide form, show success state
        formOverlay.classList.remove('visible');

        // Wait for overlay to fade out, then show success state
        setTimeout(() => {
            formWrapper.style.display = 'none';
            successState.classList.add('visible');
        }, 300);

    } catch (error) {
        // Error handling
        formOverlay.classList.remove('visible');
        submitButton.disabled = false;
        showFormMessage('Oops! Something went wrong. Please try again.', 'error');
    }
});

// Mobile Menu Toggle
const mobileMenuButton = document.getElementById('mobileMenuButton');
const mobileMenu = document.getElementById('mobileMenu');
const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
const mobileMenuClose = document.getElementById('mobileMenuClose');

function openMobileMenu() {
    mobileMenu.classList.add('active');
    mobileMenuOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
    mobileMenu.classList.remove('active');
    mobileMenuOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Open menu when button is clicked
mobileMenuButton.addEventListener('click', openMobileMenu);

// Close menu when close button is clicked
mobileMenuClose.addEventListener('click', closeMobileMenu);

// Close menu when overlay is clicked
mobileMenuOverlay.addEventListener('click', closeMobileMenu);

// Close menu when a nav link is clicked
mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
});
