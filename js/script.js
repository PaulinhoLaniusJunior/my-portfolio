document.addEventListener('DOMContentLoaded', () => {
    // --- Smooth Scroll ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                let headerOffset = 0;
                const header = document.querySelector('header');
                if (header) {
                    headerOffset = header.offsetHeight;
                }
                
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Fecha o menu mobile se estiver aberto após clicar em um link
                if (mainNav && mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    navToggler.setAttribute('aria-expanded', 'false');
                    if (navToggler.querySelector('i')) {
                         navToggler.querySelector('i').classList.remove('fa-times');
                         navToggler.querySelector('i').classList.add('fa-bars');
                    }
                }
            }
        });
    });

    // --- Dark Mode Toggle ---
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    const moonIconClass = 'fa-moon';
    const sunIconClass = 'fa-sun';

    const setIcon = (isDarkMode) => {
        const iconElement = darkModeToggle.querySelector('i');
        if (iconElement) {
            iconElement.classList.remove(isDarkMode ? moonIconClass : sunIconClass);
            iconElement.classList.add(isDarkMode ? sunIconClass : moonIconClass);
        }
    };
    
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            body.classList.add('dark-mode');
            setIcon(true);
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.remove('dark-mode');
            setIcon(false);
            localStorage.setItem('theme', 'light');
        }
    };

    const preferredTheme = localStorage.getItem('theme') || 
                           (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    applyTheme(preferredTheme);

    darkModeToggle.addEventListener('click', () => {
        const isDarkMode = body.classList.contains('dark-mode');
        applyTheme(isDarkMode ? 'light' : 'dark');
    });

    // --- Scroll Reveal ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // revealObserver.unobserve(entry.target); // Descomente para animar apenas uma vez
            } else {
                // entry.target.classList.remove('visible'); // Descomente para re-animar ao sair e reentrar
            }
        });
    }, { threshold: 0.1 }); // 0.1 = 10% do elemento visível

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- Active Nav Link on Scroll ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('header nav ul li a');

    window.addEventListener('scroll', () => {
        let current = '';
        let headerHeight = 0;
        const header = document.querySelector('header');
        if (header) {
            headerHeight = header.offsetHeight;
        }
        

        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 70; // Ajuste o offset se necessário (70 é um valor de margem)
            if (window.pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    }, {passive: true}); // Otimização para scroll
    
    // --- Mobile Nav Toggle ---
    const navToggler = document.querySelector('.nav-toggler');
    const mainNav = document.querySelector('header nav ul');

    if (navToggler && mainNav) {
        navToggler.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            const isExpanded = mainNav.classList.contains('active');
            navToggler.setAttribute('aria-expanded', isExpanded.toString());
            
            const icon = navToggler.querySelector('i');
            if (icon) {
                if (isExpanded) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    }

    // --- Footer Current Year ---
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
});