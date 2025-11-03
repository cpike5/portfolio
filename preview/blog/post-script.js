// Blog post-specific JavaScript - Table of Contents generation and scroll spy

document.addEventListener('DOMContentLoaded', function() {
    generateTableOfContents();
    initScrollSpy();
});

// Generate Table of Contents from h2 and h3 headings
function generateTableOfContents() {
    const tocList = document.getElementById('tocList');
    const postContent = document.querySelector('.post-content');

    if (!tocList || !postContent) return;

    const headings = postContent.querySelectorAll('h2, h3');

    if (headings.length === 0) return;

    headings.forEach((heading, index) => {
        // Generate ID for heading if it doesn't have one
        if (!heading.id) {
            heading.id = generateSlug(heading.textContent);
        }

        // Create TOC list item
        const li = document.createElement('li');
        const a = document.createElement('a');

        a.href = `#${heading.id}`;
        a.textContent = heading.textContent;
        a.className = `toc-link toc-link-${heading.tagName.toLowerCase()}`;

        // Smooth scroll behavior
        a.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
                const mobileHeaderHeight = document.querySelector('.mobile-header')?.offsetHeight || 0;
                const offset = Math.max(navbarHeight, mobileHeaderHeight) + 20;

                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });

        li.appendChild(a);
        tocList.appendChild(li);
    });
}

// Generate slug from heading text
function generateSlug(text) {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-')
        .trim();
}

// Scroll spy - highlight active section in TOC
function initScrollSpy() {
    const tocLinks = document.querySelectorAll('.toc-link');
    const postContent = document.querySelector('.post-content');

    if (!tocLinks.length || !postContent) return;

    const headings = postContent.querySelectorAll('h2, h3');

    if (!headings.length) return;

    // Track active section
    function updateActiveLink() {
        const scrollPosition = window.scrollY;
        const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
        const mobileHeaderHeight = document.querySelector('.mobile-header')?.offsetHeight || 0;
        const offset = Math.max(navbarHeight, mobileHeaderHeight) + 100;

        let currentActiveId = null;

        // Find the current section
        headings.forEach(heading => {
            const headingTop = heading.offsetTop;

            if (scrollPosition + offset >= headingTop) {
                currentActiveId = heading.id;
            }
        });

        // Update active state
        tocLinks.forEach(link => {
            const linkId = link.getAttribute('href').substring(1);

            if (linkId === currentActiveId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // Throttle scroll events for performance
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }

        scrollTimeout = window.requestAnimationFrame(function() {
            updateActiveLink();
        });
    });

    // Initialize on load
    updateActiveLink();
}
