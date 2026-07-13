function initScript() {
    console.log("INIT SCRIPT EJECUTADO");

    // --- CAMBIO DE TEMA CLARO/OSCURO ---
    const toggleButton = document.getElementById("toggle-theme"); // Botón que alterna el tema
    const themeIcon = document.getElementById("theme-icon"); // Contenedor del ícono (SVG)

    if (!toggleButton || !themeIcon) { // Si no se encuentran los elementos, no sigue
        console.warn("No se encontró el botón de tema o el ícono");
        return;
    }

    // SVG para ícono de modo claro
    const lightIcon = `
        <svg xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="icon icon-tabler icon-tabler-bulb">
            <path stroke="none" d="M0 0h24v0z" fill="none"/>
            <path d="M3 12h1m8 -9v1m8 8h1m-15.4 -6.4l.7 .7m12.1 -.7l-.7 .7" />
            <path d="M9 16a5 5 0 1 1 6 0a3.5 3.5 0 0 0 -1 3a2 2 0 0 1 -4 0a3.5 3.5 0 0 0 -1 -3" />
            <path d="M9.7 17l4.6 0" />
        </svg>`;

    // SVG para ícono de modo oscuro
    const darkIcon = `
        <svg xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="icon icon-tabler icon-tabler-bulb-off">
            <path stroke="none" d="M0 0h24v0z" fill="none"/>
            <path d="M3 12h1m8 -9v1m8 8h1m-15.4 -6.4l.7 .7m12.1 -.7l-.7 .7" />
            <path d="M11.089 7.083a5 5 0 0 1 5.826 5.84m-1.378 2.611a5.012 5.012 0 0 1 -.537 .466a3.5 3.5 0 0 0 -1 3a2 2 0 1 1 -4 0a3.5 3.5 0 0 0 -1 -3a5 5 0 0 1 -.528 -7.544" />
            <path d="M9.7 17h4.6" />
            <path d="M3 3l18 18" />
        </svg>`;

    // Función que aplica el tema según el valor (claro u oscuro)
    function setTheme(isLight) {

        if (isLight) {
            document.documentElement.classList.add("light-theme"); // Agrega clase al body
            themeIcon.innerHTML = lightIcon; // Cambia ícono
            localStorage.setItem("theme", "light"); // Guarda preferencia del tema
        } else {
            document.documentElement.classList.remove("light-theme");
            themeIcon.innerHTML = darkIcon;
            localStorage.setItem("theme", "dark");
        }
    }

    // Solución al ícono estático a la hora de actualizar la página teniendo el modo light activado y guardado.
    if (themeIcon) {
        // Mostrar el ícono
        themeIcon.style.visibility = 'visible';

        // Marcar como cargado para que la animación funcione en el toggle
        setTimeout(() => themeIcon.classList.add('loaded'), 50);
    }
    // --------------------------------------------------------------------------------------------------------

    const savedTheme = localStorage.getItem("theme"); // Lee el tema guardado en el navegador
    const isLight = savedTheme === "light"; // Verifica si es claro
    setTheme(isLight); // Aplica el tema al cargar

    toggleButton.addEventListener("click", () => { // Cuando el usuario hace clic en el botón
        const isLightNow = document.documentElement.classList.contains("light-theme"); // Detecta el tema actual
        setTheme(!isLightNow); // Cambia al opuesto
    });



    // IMÁGENES SOBRE LA MISMA PÁGINA -OVERLAY DE IMÁGENES-
    const imagenesAmpliables = document.querySelectorAll(".img-ampliable");

    if (imagenesAmpliables.length > 0) {

        const imageOverlay = document.createElement("div");
        imageOverlay.id = "image-overlay";
        imageOverlay.innerHTML = `
        <button class="overlay-close" aria-label="Cerrar imagen">✕</button>
        <img id="overlay-image">
    `;
        document.body.appendChild(imageOverlay);

        const overlayImage = imageOverlay.querySelector("#overlay-image");
        const closeButton = imageOverlay.querySelector(".overlay-close");

        function abrirImagen(src) {
            overlayImage.src = src;
            imageOverlay.classList.add("visible");
            document.body.style.overflow = "hidden";
        }

        function cerrarImagen() {
            imageOverlay.classList.remove("visible");
            overlayImage.src = "";
            document.body.style.overflow = "";
        }

        imageOverlay.addEventListener("click", (e) => {
            if (e.target === imageOverlay) {
                cerrarImagen();
            }
        });

        closeButton.addEventListener("click", cerrarImagen);

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && imageOverlay.classList.contains("visible")) {
                cerrarImagen();
            }
        });

        imagenesAmpliables.forEach(img => {
            img.addEventListener("click", () => abrirImagen(img.src));
        });
    }
    // IMÁGENES SOBRE LA MISMA PÁGINA -OVERLAY DE IMÁGENES- (FIN)

    // IGUALAR ALTURA DE TARJETAS DE SUBSECCIONES DE GUÍAS
    function igualarAlturaTarjetas() {
        if (window.innerWidth <= 576) {
            const cards = document.querySelectorAll(".pages-hcard");

            let alturaMax = 0;

            cards.forEach(card => {
                card.style.height = "auto";
                alturaMax = Math.max(alturaMax, card.offsetHeight);
            });

            cards.forEach(card => {
                card.style.height = `${alturaMax}px`;
            });
        }
    }

    window.addEventListener("load", igualarAlturaTarjetas);
    window.addEventListener("resize", igualarAlturaTarjetas);
    // IGUALAR ALTURA DE TARJETAS DE SUBSECCIONES DE GUÍAS (FIN)

}