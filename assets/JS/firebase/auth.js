import { auth } from "./firebase-connect.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

// NUEVO
function initAuthUI() {

    // ELEMENTOS DEL HEADER
    const loginBtn = document.getElementById("btn-abrir-login");
    const userMenuBtn = document.getElementById("user-menu-btn");
    const userDropdown = document.getElementById("user-dropdown");
    const dropdownUsername = document.getElementById("dropdown-username");
    const logoutBtn = document.getElementById("dropdown-logout");

    // ESTADO INICIAL
    userMenuBtn.style.display = "none";

    // BOTÓN USUARIO -> ABRIR / CERRAR MENÚ DESPLEGABLE
    if (userMenuBtn && userDropdown) {
        userMenuBtn.addEventListener("click", () => {
            userDropdown.classList.toggle("active");
        });
    }

    // CERRAR MENÚ DESPLEGABLE AL HACER CLIC FUERA
    document.addEventListener("click", (e) => {
        if (!userDropdown.contains(e.target) && !userMenuBtn.contains(e.target)) {
            userDropdown.classList.remove("active");
        }
    });

    // CERRAR SESIÓN
    logoutBtn.addEventListener("click", async () => {
        await signOut(auth);
        localStorage.removeItem("username");
        window.location.reload(); // RECARGAR PÁGINA AL CERRAR SESIÓN
    });


    // ANTI-PARPADEO -> SI YA HAY USERNAME EN LOCALSTORAGE
    const usernameLS = localStorage.getItem("username");
    if (usernameLS) {
        dropdownUsername.textContent = usernameLS;

        // Ocultar botón login y mostrar el botón usuario
        loginBtn.style.display = "none";
        userMenuBtn.style.display = "flex";
    }


    // LISTENER DE FIREBASE
    onAuthStateChanged(auth, user => {
        if (user) {
            // Obtener nombre
            const username = localStorage.getItem("username") || "Usuario";
            dropdownUsername.textContent = username;

            // Mostrar menú usuario
            loginBtn.style.display = "none";
            userMenuBtn.style.display = "flex";

        } else {
            // Mostrar botón login
            loginBtn.style.display = "flex";

            // Ocultar menú usuario
            userMenuBtn.style.display = "none";
            userDropdown.classList.remove("active");
        }
    });

}

window.initAuthUI = initAuthUI;