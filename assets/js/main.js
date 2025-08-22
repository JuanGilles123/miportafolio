document.addEventListener('DOMContentLoaded', () => {

    // --- FUNCIONALIDAD 1: Header que cambia con scroll (sigue igual) ---
    const header = document.getElementById('main-header');
    if (header) {
        const handleScroll = () => {
            window.scrollY > 50 ? header.classList.add('header-scrolled') : header.classList.remove('header-scrolled');
        };
        window.addEventListener('scroll', handleScroll);
    }

    // --- FUNCIONALIDAD 2: Cargar proyectos dinámicamente ---
    const projectsContainer = document.getElementById('projects-container');

    if (projectsContainer) {
        // Comprobamos si estamos en la página de inicio (que tiene <body id="home-page">)
        const isHomePage = document.body.id === 'home-page';
        
        // Si es la página de inicio, pasamos un límite de 3. Si no, no pasamos límite.
        loadProjects(isHomePage ? 3 : null);
    }

    async function loadProjects(limit) {
        try {
            const response = await fetch('projects.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const allProjects = await response.json();

            const projectsToDisplay = limit ? allProjects.slice(0, limit) : allProjects;

            projectsContainer.innerHTML = ''; // Limpiamos el contenedor

            projectsToDisplay.forEach(project => {
                const card = document.createElement('div');
                card.className = 'glass-panel p-6 project-card flex flex-col';
                
                // ===== LÍNEA MODIFICADA =====
                // He cambiado 'object-cover' por 'object-contain' para que se vea la imagen completa.
                card.innerHTML = `
                    <img src="${project.image}" alt="${project.title}" class="rounded-xl mb-4 w-full h-48 object-contain">
                    <h4 class="text-xl font-bold mb-2">${project.title}</h4>
                    <p class="text-gray-300 mb-4 flex-grow">${project.description}</p>
                    <div class="flex items-center justify-between mt-auto">
                        <div class="flex flex-wrap gap-2">
                            ${project.tags.map(tag => `<span class="bg-white/20 text-xs font-semibold px-2 py-1 rounded-full">${tag}</span>`).join('')}
                        </div>
                        <a href="${project.link || '#'}" ${project.link && project.link !== '#' ? 'target="_blank" rel="noopener noreferrer"' : ''} class="text-white font-semibold hover:underline whitespace-nowrap">Ver más &rarr;</a>
                    </div>
                `;
                projectsContainer.appendChild(card);
            });
            
            initializeCardAnimations();

        } catch (error) {
            console.error("Error al cargar los proyectos:", error);
            projectsContainer.innerHTML = '<p class="text-center col-span-full">No se pudieron cargar los proyectos. Revisa que el archivo projects.json exista y no tenga errores.</p>';
        }
    }
    
    function initializeCardAnimations() {
        const projectCards = document.querySelectorAll('.project-card');
        if (projectCards.length === 0) return;

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        projectCards.forEach(card => {
            observer.observe(card);
        });
    }

    console.log("¡Portafolio dinámico cargado!");
});
