document.addEventListener('DOMContentLoaded', () => {
    /* ==========================================================================
       Header Scroll Effect
       ========================================================================== */
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    /* ==========================================================================
       Mobile Navigation Toggle
       ========================================================================== */
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');

    mobileBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = mobileBtn.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close mobile menu when a link is clicked
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = mobileBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });

    /* ==========================================================================
       Services Tabs
       ========================================================================== */
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked button
            btn.classList.add('active');

            // Show corresponding content
            const targetId = btn.getAttribute('data-tab') + '-services';
            document.getElementById(targetId).classList.add('active');
        });
    });

    /* ==========================================================================
       Smooth Scrolling for Anchor Links
       ========================================================================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            
            // Only scroll if it's a valid ID (not just "#")
            if (targetId !== "#" && document.querySelector(targetId)) {
                e.preventDefault();
                
                const targetElement = document.querySelector(targetId);
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    /* ==========================================================================
       Contact Form Submission
       ========================================================================== */
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Get button and original text
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            
            // Show loading state
            btn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
            btn.style.opacity = '0.8';
            btn.disabled = true;

            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const message = document.getElementById('message').value;

            try {
                // Real API call to Next.js / Vercel Serverless Function
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name, email, phone, message }),
                });

                const result = await response.json();

                if (response.ok) {
                    // Show success state
                    btn.innerHTML = 'Message Sent! <i class="fas fa-check"></i>';
                    btn.style.background = '#10b981'; // Success green color
                    btn.style.opacity = '1';
                    
                    // Reset form
                    contactForm.reset();
                } else {
                    // Show error state
                    btn.innerHTML = 'Error! <i class="fas fa-times"></i>';
                    btn.style.background = '#ef4444'; // Error red color
                    console.error('Error from server:', result.error);
                    alert(`Failed to send message: ${result.error}`);
                }
            } catch (error) {
                // Show network error state
                btn.innerHTML = 'Error! <i class="fas fa-times"></i>';
                btn.style.background = '#ef4444'; 
                console.error('Network error:', error);
                alert('Network error. Please try again later.');
            } finally {
                // Reset button after 3 seconds
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = ''; // Revert to default CSS
                    btn.disabled = false;
                }, 3000);
            }
        });
    }
});
