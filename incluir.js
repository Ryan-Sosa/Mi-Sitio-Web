function esperarFuncion(nombre, callback, intentos = 50) {
    if (window[nombre]) {
        callback();
    } else if (intentos > 0) {
        setTimeout(() => esperarFuncion(nombre, callback, intentos - 1), 8);
    } else {
        console.warn("No se encontró la función:", nombre);
    }
}


// Cargar el header dinámicamente
$("#header-placeholder").load("/assets/html/header.html", function () {
    console.log("HEADER CARGADO");

    // Cargar el JS del header dinámicamente
    $.getScript("/assets/JS/header.js")
        .done(() => {
            console.log("HEADER.JS CARGADO");

            if (typeof initHeader === "function") {
                initHeader();  // Inicializa Header. Esto hace que los dropdowns funcionen.
            }

            // Inicializar auth inmediatamente
            esperarFuncion("initAuthUI", () => {
                initAuthUI();
            });

            // Cargar script.js, después de cargar header.js.
            $.getScript("/assets/JS/script.js")
                .done(() => {
                    console.log("SCRIPT.JS CARGADO");

                    if (typeof initScript === "function") {
                        initScript(); // Inicializa el script
                    }
                })
                .fail(() => console.error("No se pudo cargar SCRIPT.JS"));
        })
        .fail(() => console.error("No se pudo cargar HEADER.JS"));
});


// Cargar footer
$("#footer-placeholder").load("/assets/html/footer.html");


// Cargar sidebar
$("#sidebar-placeholder").load("/assets/html/sidebar.html", function () {
    const paginaActual = window.location.pathname.split("/").pop();

    $(".sidebar a").each(function () {
        const paginaLink = $(this).attr("href").split("/").pop();

        if (paginaLink === paginaActual) {
            $(this).addClass("actual"); // <-- Marcamos la página actual
        }
    });
});


// Cargar comentarios
fetch("/assets/html/comentarios.html")
    .then(res => res.text())
    .then(html => {

        const cont = document.getElementById("comments-placeholder");
        if (!cont) return;

        cont.innerHTML = html;

        console.log("COMENTARIOS HTML CARGADO");

        esperarFuncion("initComentarios", () => {
            initComentarios();
        });

    })
    .catch(err => console.error("Error cargando comentarios:", err));