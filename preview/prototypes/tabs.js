// Tabbed Panel System JavaScript
// Implements accessible tab switching with keyboard navigation

class TabPanel {
    constructor(tabsContainer) {
        this.tabsContainer = tabsContainer;
        this.tabs = Array.from(tabsContainer.querySelectorAll('[role="tab"]'));
        this.panels = Array.from(
            tabsContainer.parentElement.querySelectorAll('[role="tabpanel"]')
        );

        this.init();
    }

    init() {
        // Add click listeners to tabs
        this.tabs.forEach((tab, index) => {
            tab.addEventListener('click', () => this.selectTab(index));
            tab.addEventListener('keydown', (e) => this.handleKeyDown(e, index));
        });

        // Set up initial state
        const activeIndex = this.tabs.findIndex(tab => tab.classList.contains('active'));
        if (activeIndex !== -1) {
            this.selectTab(activeIndex);
        }
    }

    selectTab(index) {
        // Deactivate all tabs and panels
        this.tabs.forEach((tab, i) => {
            const isSelected = i === index;

            tab.classList.toggle('active', isSelected);
            tab.setAttribute('aria-selected', isSelected);
            tab.setAttribute('tabindex', isSelected ? '0' : '-1');

            if (this.panels[i]) {
                this.panels[i].classList.toggle('active', isSelected);
                this.panels[i].hidden = !isSelected;
            }
        });

        // Focus the selected tab
        this.tabs[index].focus();
    }

    handleKeyDown(e, currentIndex) {
        let newIndex = currentIndex;

        switch (e.key) {
            case 'ArrowRight':
                e.preventDefault();
                newIndex = (currentIndex + 1) % this.tabs.length;
                break;

            case 'ArrowLeft':
                e.preventDefault();
                newIndex = (currentIndex - 1 + this.tabs.length) % this.tabs.length;
                break;

            case 'Home':
                e.preventDefault();
                newIndex = 0;
                break;

            case 'End':
                e.preventDefault();
                newIndex = this.tabs.length - 1;
                break;

            case 'Enter':
            case ' ':
                e.preventDefault();
                this.selectTab(currentIndex);
                return;

            default:
                return;
        }

        this.selectTab(newIndex);
    }
}

// Initialize all tab panels on the page
document.addEventListener('DOMContentLoaded', () => {
    const tabContainers = document.querySelectorAll('[role="tablist"]');

    tabContainers.forEach(container => {
        new TabPanel(container);
    });

    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
});
