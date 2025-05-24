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

                const mainNav = document.querySelector('header nav ul'); // Adicionado para garantir que está definido
                const navToggler = document.querySelector('.nav-toggler'); // Adicionado para garantir que está definido
                if (mainNav && navToggler && mainNav.classList.contains('active')) { // Adicionado navToggler na condição
                    mainNav.classList.remove('active');
                    navToggler.setAttribute('aria-expanded', 'false');
                    const icon = navToggler.querySelector('i'); // Definido icon aqui dentro
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
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

    if (darkModeToggle) { // Adicionado verificação para evitar erro se o botão não existir
        darkModeToggle.addEventListener('click', () => {
            const isDarkMode = body.classList.contains('dark-mode');
            applyTheme(isDarkMode ? 'light' : 'dark');
        });
    }


    // --- Scroll Reveal ---
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0) { // Adicionado verificação
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
    }


    // --- Active Nav Link on Scroll ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('header nav ul li a');

    if (sections.length > 0 && navLinks.length > 0) { // Adicionado verificação
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
    }

    
    // --- Mobile Nav Toggle ---
    const navTogglerForToggle = document.querySelector('.nav-toggler');
    const mainNavForToggle = document.querySelector('header nav ul');

    if (navTogglerForToggle && mainNavForToggle) {
        navTogglerForToggle.addEventListener('click', () => {
            mainNavForToggle.classList.toggle('active');
            const isExpanded = mainNavForToggle.classList.contains('active');
            navTogglerForToggle.setAttribute('aria-expanded', isExpanded.toString());
            
            const icon = navTogglerForToggle.querySelector('i');
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

    // --- Carrossel de Imagens do Projeto --- (Agora DENTRO do ÚNICO DOMContentLoaded)
    const todosOsProjetosItens = document.querySelectorAll('.projeto-item');

    todosOsProjetosItens.forEach(projetoItem => {
        const carrosselContainer = projetoItem.querySelector('.carrossel-container');
        const slides = Array.from(projetoItem.querySelectorAll('.carrossel-slide'));
        const prevButton = projetoItem.querySelector('.carrossel-btn.prev');
        const nextButton = projetoItem.querySelector('.carrossel-btn.next');
        
        if (!carrosselContainer || slides.length === 0) { // Removida verificação de botões daqui, pois serão escondidos se não houver slides suficientes
            if (prevButton) prevButton.classList.add('hidden');
            if (nextButton) nextButton.classList.add('hidden');
            return;
        }
        let currentIndex = 0;
        const totalSlides = slides.length;

        function updateCarrosselVisao() {
            if (carrosselContainer) { // Adicionado verificação
                 carrosselContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
            }
        }

        function mostrarSlide(index) {
            if (index >= totalSlides) {
                currentIndex = 0;
            } else if (index < 0) {
                currentIndex = totalSlides - 1;
            } else {
                currentIndex = index;
            }
            updateCarrosselVisao();
        }

        if (prevButton) { // Adicionado verificação
            prevButton.addEventListener('click', () => {
                mostrarSlide(currentIndex - 1);
            });
        }

        if (nextButton) { // Adicionado verificação
            nextButton.addEventListener('click', () => {
                mostrarSlide(currentIndex + 1);
            });
        }
        
        if (totalSlides <= 1) {
            if (prevButton) prevButton.classList.add('hidden');
            if (nextButton) nextButton.classList.add('hidden');
        } else {
            if (prevButton) prevButton.classList.remove('hidden');
            if (nextButton) nextButton.classList.remove('hidden');
        }

        updateCarrosselVisao();
    });

}); 