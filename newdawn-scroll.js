// Smooth Scroll Navigation System
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.side-nav .nav-link');
    const sections = document.querySelectorAll('.scroll-section');
    const navItems = document.querySelectorAll('.side-nav .nav-item');
    
    // Create scroll progress indicator
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.innerHTML = '<div class="scroll-progress-bar"></div>';
    document.body.appendChild(progressBar);
    
    const progressBarFill = progressBar.querySelector('.scroll-progress-bar');
    
    // Function to update active navigation
    function updateActiveNav() {
        let current = '';
        const scrollPosition = window.pageYOffset + 200;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        // Remove active class from all nav items
        navItems.forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active class to current nav item
        if (current) {
            const activeLink = document.querySelector(`.side-nav a[href="#${current}"]`);
            if (activeLink) {
                activeLink.closest('.nav-item').classList.add('active');
            }
        }
        
        // Update progress bar
        const scrollPercent = (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressBarFill.style.width = Math.min(scrollPercent, 100) + '%';
    }
    
    // Handle navigation clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // Remove active class from all items
                navItems.forEach(item => item.classList.remove('active'));
                
                // Add active class to clicked item
                this.closest('.nav-item').classList.add('active');
                
                // Smooth scroll to target
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Listen for scroll events
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        updateActiveNav();
        
        // Add scroll indicator to sections
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                section.classList.add('in-view');
            }
        });
        
        // Clear timeout and set new one for scroll end detection
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            // Scroll ended - could add additional functionality here
        }, 150);
    });
    
    // Intersection Observer for better performance
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '-50px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                
                // Update active navigation
                navItems.forEach(item => item.classList.remove('active'));
                const activeLink = document.querySelector(`.side-nav a[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.closest('.nav-item').classList.add('active');
                }
            }
        });
    }, observerOptions);
    
    // Observe all sections
    sections.forEach(section => {
        if (section.id) {
            observer.observe(section);
        }
    });
    
    // Initialize active state
    updateActiveNav();
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        const activeItem = document.querySelector('.side-nav .nav-item.active');
        let targetItem = null;
        
        if (e.key === 'ArrowDown' || e.key === 'PageDown') {
            targetItem = activeItem ? activeItem.nextElementSibling : navItems[0];
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            targetItem = activeItem ? activeItem.previousElementSibling : navItems[navItems.length - 1];
        } else if (e.key === 'Home') {
            targetItem = navItems[0];
        } else if (e.key === 'End') {
            targetItem = navItems[navItems.length - 1];
        }
        
        if (targetItem && (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'PageDown' || e.key === 'PageUp' || e.key === 'Home' || e.key === 'End')) {
            e.preventDefault();
            const link = targetItem.querySelector('.nav-link');
            if (link) {
                link.click();
            }
        }
    });
    
    // Touch/swipe support for mobile
    let touchStartY = 0;
    let touchEndY = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartY = e.changedTouches[0].screenY;
    });
    
    document.addEventListener('touchend', function(e) {
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartY - touchEndY;
        
        if (Math.abs(diff) > swipeThreshold) {
            const activeItem = document.querySelector('.side-nav .nav-item.active');
            let targetItem = null;
            
            if (diff > 0) { // Swipe up - next section
                targetItem = activeItem ? activeItem.nextElementSibling : navItems[0];
            } else { // Swipe down - previous section
                targetItem = activeItem ? activeItem.previousElementSibling : navItems[navItems.length - 1];
            }
            
            if (targetItem) {
                const link = targetItem.querySelector('.nav-link');
                if (link) {
                    link.click();
                }
            }
        }
    }
    
    // Auto-scroll on wheel event (section by section)
    let isScrolling = false;
    
    window.addEventListener('wheel', function(e) {
        if (isScrolling) return;
        
        const delta = e.deltaY;
        const activeItem = document.querySelector('.side-nav .nav-item.active');
        let targetItem = null;
        
        if (delta > 0) { // Scroll down
            targetItem = activeItem ? activeItem.nextElementSibling : navItems[0];
        } else { // Scroll up
            targetItem = activeItem ? activeItem.previousElementSibling : navItems[navItems.length - 1];
        }
        
        if (targetItem) {
            e.preventDefault();
            isScrolling = true;
            
            const link = targetItem.querySelector('.nav-link');
            if (link) {
                link.click();
            }
            
            setTimeout(() => {
                isScrolling = false;
            }, 1000);
        }
    }, { passive: false });
});
