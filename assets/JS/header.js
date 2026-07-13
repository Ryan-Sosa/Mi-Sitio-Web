// Función que inicializa dropdowns y el cambio de tema
function initHeader() {
    console.log("INIT HEADER EJECUTADO"); // Mensaje para confirmar que se ejecuta



    // ------MENÚ HAMBURGUESA RESPONSIVE------

    // Elementos principales
    const menuHamburguesa = document.getElementById("menu-hamburguesa");
    const menuCloseBtn = document.getElementById("menu-close");
    const hamburgerBtn = document.getElementById("hamburger-btn");

    // Seleccionamos todos los elementos focusables dentro del menú
    const menuLinks = menuHamburguesa.querySelectorAll("a, button");

    // Inicializamos menú cerrado: los links no son focusables
    menuLinks.forEach(el => el.setAttribute("tabindex", "-1"));

    // Función para abrir el menú
    function abrirMenu() {
        menuHamburguesa.classList.add("active");
        menuLinks.forEach(el => el.setAttribute("tabindex", "0")); // Focusable
    }

    // Función para cerrar el menú
    function cerrarMenu() {
        menuHamburguesa.classList.remove("active");
        menuLinks.forEach(el => el.setAttribute("tabindex", "-1")); // No focusable
    }

    // Toggle menú lateral con el botón hamburguesa
    hamburgerBtn.addEventListener("click", () => {
        if (menuHamburguesa.classList.contains("active")) {
            cerrarMenu();
        } else {
            abrirMenu();
        }
    });

    // Toggle submenús
    document.querySelectorAll('.submenu-toggle').forEach(button => {
        button.addEventListener('click', e => {
            const li = button.closest('.li-con-submenu');
            li.classList.toggle('open');
        });
    });

    // Botón cerrar menú
    menuCloseBtn.addEventListener("click", cerrarMenu);

    // Cerrar menú si se hace click fuera de él
    document.addEventListener("click", function (event) {
        if (
            menuHamburguesa.classList.contains("active") &&
            !menuHamburguesa.contains(event.target) &&
            !hamburgerBtn.contains(event.target)
        ) {
            cerrarMenu();
        }
    });

    


    // --- CONFIGURACIÓN DE DROPDOWNS ---
    const dropdowns = document.querySelectorAll('.navbar .dropdown'); // Selecciona todos los dropdowns del navbar
    let timeout; // Variable para manejar el retardo de cierre

    dropdowns.forEach(function (dropdown) {
        const toggle = dropdown.querySelector('.dropdown-toggle'); // Botón que activa el menú
        const bsDropdown = new bootstrap.Dropdown(toggle); // Instancia de Bootstrap Dropdown para controlarlo

        dropdown.addEventListener('mouseenter', function () { // Cuando el mouse entra al dropdown
            clearTimeout(timeout); // Cancela cualquier cierre programado
            dropdowns.forEach(function (otherDropdown) { // Cierra otros menús abiertos
                if (otherDropdown !== dropdown) {
                    const otherToggle = otherDropdown.querySelector('.dropdown-toggle');
                    const otherMenu = bootstrap.Dropdown.getInstance(otherToggle);
                    if (otherMenu) otherMenu.hide(); // Cierra los demás
                }
            });
            bsDropdown.show(); // Muestra este menú

            const menu = dropdown.querySelector('.dropdown-menu'); // Selecciona el menú desplegable
            if (menu) {
                setTimeout(() => menu.classList.add('fade-in'), 10); // Le da un efecto de animación
            }
        });

        dropdown.addEventListener('mouseleave', function () { // Cuando el mouse sale del dropdown
            timeout = setTimeout(() => { // Programa el cierre con retardo (200ms)
                const menu = dropdown.querySelector('.dropdown-menu');
                if (menu) menu.classList.remove('fade-in'); // Quita animación
                bsDropdown.hide(); // Oculta el menú
            }, 200);
        });

        const menu = dropdown.querySelector('.dropdown-menu'); // Para manejar interacción dentro del menú
        if (menu) {
            menu.addEventListener('mouseenter', () => clearTimeout(timeout)); // Cancela cierre si el mouse entra al menú
            menu.addEventListener('mouseleave', () => { // Programa cierre cuando el mouse sale del menú
                timeout = setTimeout(() => {
                    menu.classList.remove('fade-in');
                    bsDropdown.hide();
                }, 200);
            });
        }
    });


    // ARREGLO DE ACCESIBILIDAD EN LOS NAV-LINKS
    let usingKeyboard = false;

    // Detecta si el usuario está usando teclado
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') usingKeyboard = true;
    });

    // Detecta si el usuario está usando mouse
    window.addEventListener('mousedown', () => {
        usingKeyboard = false;
    });

    // Aplica efecto de foco solo si es de teclado
    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
        link.addEventListener('focus', (e) => {
            if (!usingKeyboard) {
                e.target.blur(); // quita foco si no viene de TAB
            }
        });
    });




    /* FORMULARIO */
    const btnAbrir = document.getElementById("btn-abrir-login");
    const overlay = document.getElementById("login-popup-overlay");
    const btnCerrar = document.getElementById("btn-cerrar-login");

    const formLogin = document.getElementById("form-login");
    const formRegistro = document.getElementById("form-registro");

    const linkRegistro = document.getElementById("link-a-registro");
    const linkLogin = document.getElementById("link-a-login");

    const passwordInput = document.getElementById("password-reg");
    const confirmPasswordInput = document.getElementById("confirm-password-reg");
    const errorMessage = document.getElementById("error-message");

    function validarCoincidencia() {
        if (confirmPasswordInput.value === "") {
            errorMessage.style.display = "none";
            confirmPasswordInput.classList.remove("input-error");
            return;
        }
        if (passwordInput.value !== confirmPasswordInput.value) {
            errorMessage.style.display = "block";
            errorMessage.textContent = "Las contraseñas no coinciden.";
            confirmPasswordInput.classList.add("input-error");
        } else {
            errorMessage.style.display = "none";
            errorMessage.textContent = "";
            confirmPasswordInput.classList.remove("input-error");
        }
    }

    btnAbrir.addEventListener("click", () => {
        overlay.classList.add("active");
        formLogin.style.display = "flex";
        formRegistro.style.display = "none";
        errorMessage.style.display = "none";
        errorMessage.textContent = "";
        formLogin.reset();
        formRegistro.reset();
        document.getElementById("email").focus();
    });

    btnCerrar.addEventListener("click", () => {
        overlay.classList.remove("active");
    });

    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
            overlay.classList.remove("active");
        }
    });

    linkRegistro.addEventListener("click", (e) => {
        e.preventDefault();
        formLogin.style.display = "none";
        formRegistro.style.display = "flex";
        errorMessage.style.display = "none";
        errorMessage.textContent = "";
        formRegistro.reset();
        document.getElementById("username-reg").focus();
    });

    linkLogin.addEventListener("click", (e) => {
        e.preventDefault();
        formRegistro.style.display = "none";
        formLogin.style.display = "flex";
        errorMessage.style.display = "none";
        errorMessage.textContent = "";
        formLogin.reset();
        document.getElementById("email").focus();
    });

    passwordInput.addEventListener("input", validarCoincidencia);
    confirmPasswordInput.addEventListener("input", validarCoincidencia);

    // Validar al enviar el formulario de registro
    formRegistro.addEventListener("submit", (e) => {
        e.preventDefault();
        if (passwordInput.value !== confirmPasswordInput.value) {
            errorMessage.style.display = "block";
            errorMessage.textContent = "Las contraseñas no coinciden.";
            confirmPasswordInput.classList.add("input-error");
            confirmPasswordInput.focus();
            return;
        }
        errorMessage.style.display = "none";
        errorMessage.textContent = "";
        confirmPasswordInput.classList.remove("input-error");

        // Enviar datos a Firebase
        const email = document.getElementById("email-reg").value;
        const pass = document.getElementById("password-reg").value;
        const usernameInput = document.getElementById("username-reg");
        const username = usernameInput.value.trim();
        

        // VALIDACIONES USERNAME
        if (username.length < 3) {
            errorMessage.style.display = "block";
            errorMessage.textContent = "El nombre debe tener al menos 3 caracteres.";
            usernameInput.classList.add("input-error");
            usernameInput.focus();
            return;
        }

        if (username.length > 20) {
            errorMessage.style.display = "block";
            errorMessage.textContent = "Máximo 20 caracteres.";
            usernameInput.classList.add("input-error");
            usernameInput.focus();
            return;
        }

        // Solo letras, números y _
        const regex = /^[a-zA-Z0-9_]+$/;

        if (!regex.test(username)) {
            errorMessage.style.display = "block";
            errorMessage.textContent = "Solo letras, números y guiones bajos (_).";
            usernameInput.classList.add("input-error");
            usernameInput.focus();
            return;
        }

        // Evento personalizado para Firebase
        document.dispatchEvent(new CustomEvent("firebase-registro", {
            detail: { email, pass, username }
        }));

    });

    // LOGIN
    formLogin.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const pass = document.getElementById("password").value;

        // Evento personalizado para Firebase
        document.dispatchEvent(new CustomEvent("firebase-login", {
            detail: { email, pass }
        }));
    });


}
