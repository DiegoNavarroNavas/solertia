document.addEventListener('DOMContentLoaded', function() {
    // Function to load external HTML into a specific element
    function includeHTML(id, url, callback) {
        fetch(url)
            .then(response => response.text())
            .then(data => {
                const element = document.getElementById(id);
                if (element) {
                    element.innerHTML = data;
                    if (callback) callback(); // Execute callback function after content is loaded
                } else {
                    console.error(`Element with ID "${id}" not found.`);
                }
            })
            .catch(error => console.error('Error fetching HTML:', error));
    }

    // Inject header and footer and set up mobile menu after header loads
    includeHTML('header', 'header.html', setupMobileMenu);
    includeHTML('footer', 'footer.html', initializeToggleButtons);

    // Function to set up mobile menu functionality
    function setupMobileMenu() {
        // Toggle Mobile Menu
        const menuToggle = document.querySelector('.menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (menuToggle && navMenu) {
            menuToggle.addEventListener('click', function() {
                navMenu.classList.toggle('active');
                this.classList.toggle('active');
            });
        }
        
        // Mobile Dropdown Menus
        const dropdowns = document.querySelectorAll('.dropdown');
        
        dropdowns.forEach(dropdown => {
            const link = dropdown.querySelector('a');
            
            link.addEventListener('click', function(e) {
                if (window.innerWidth <= 992) {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                }
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (navMenu && menuToggle && !navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
                
                dropdowns.forEach(dropdown => {
                    dropdown.classList.remove('active');
                });
            }
        });
        
        // Smooth Scrolling for Internal Links
        const internalLinks = document.querySelectorAll('a[href^="#"]');
        
        internalLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // Skip for dropdown toggles on mobile
                if (this.parentElement.classList.contains('dropdown') && window.innerWidth <= 992) {
                    return;
                }
                
                const targetId = this.getAttribute('href');
                
                // Skip for links that don't point to an element
                if (targetId === '#') {
                    e.preventDefault();
                    return;
                }
                
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    
                    const navbarHeight = document.querySelector('.navbar').offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu after clicking a link
                    navMenu.classList.remove('active');
                    menuToggle.classList.remove('active');
                }
            });
        });
    }
    
    function initializeToggleButtons() {
        const toggleButtons = document.querySelectorAll(".toggle-btn");
        toggleButtons.forEach(button => {
            button.addEventListener("click", function () {
                const card = button.closest('.deck-details-card');  // Find the closest card
                const textContent = card.querySelector('.text-content');  // Get the specific card's text content
                
                // Get all text contents within the same context of deck-details
                const allTextContents = document.querySelectorAll('.deck-details-card .text-content');
    
                // Collapse all other text contents
                allTextContents.forEach(content => {
                    if (content !== textContent) {
                        content.style.display = 'none'; // Collapse all other contents
                        content.classList.remove('active'); // Optional: If you manage classes
                    }
                });
    
                // Toggle the specific card's text content
                const isActive = textContent.style.display === 'block';
                textContent.style.display = isActive ? 'none' : 'block'; // Toggle display
    
                // Update button text
                button.textContent = isActive ? 'Show Details' : 'Hide Details';
            });
        });
    }
    
    // Form Validation
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple validation
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');
            
            let isValid = true;
            
            if (!nameInput.value.trim()) {
                isValid = false;
                showError(nameInput, 'Please enter your name');
            } else {
                clearError(nameInput);
            }
            
            if (!emailInput.value.trim()) {
                isValid = false;
                showError(emailInput, 'Please enter your email');
            } else if (!isValidEmail(emailInput.value)) {
                isValid = false;
                showError(emailInput, 'Please enter a valid email address');
            } else {
                clearError(emailInput);
            }
            
            if (!messageInput.value.trim()) {
                isValid = false;
                showError(messageInput, 'Please enter your message');
            } else {
                clearError(messageInput);
            }
            
            if (isValid) {
                // Replace with actual form submission
                alert('Thank you for your message! We will get back to you soon.');
                contactForm.reset();
            }
        });
    }
    
    // Helper Functions
    function showError(input, message) {
        const formGroup = input.parentElement;
        
        if (!formGroup.querySelector('.error-message')) {
            const errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.textContent = message;
            errorElement.style.color = 'red';
            errorElement.style.fontSize = '0.8rem';
            errorElement.style.marginTop = '5px';
            
            formGroup.appendChild(errorElement);
            
            input.style.borderColor = 'red';
        }
    }
    
    function clearError(input) {
        const formGroup = input.parentElement;
        const errorElement = formGroup.querySelector('.error-message');
        
        if (errorElement) {
            formGroup.removeChild(errorElement);
        }
        
        input.style.borderColor = '';
    }
    
    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    // Load Tidio Chat Plugin
    const tidioScript = document.createElement('script');
    tidioScript.src = "//code.tidio.co/juqngvnvhh06ab25xeussmxiimsn6lyg.js";
    tidioScript.async = true;
    document.body.appendChild(tidioScript);
});