// Conexión principal Firebase
import "./assets/JS/firebase/firebase-connect.js";

// Lógica del formulario (login/registro)
import "./assets/JS/firebase/formulario.js";

// Importar auth.js
import "./assets/JS/firebase/auth.js";

// Importar comentarios.js
import "./assets/JS/firebase/comentarios.js";


// MENSAJES GLOBALES (TOASTS)
export function mostrarMensaje(tipo, texto) {
    const msg = document.getElementById("global-message");

    // Resetear clases previas
    msg.className = "global-message";

    msg.textContent = texto;
    msg.classList.add(tipo); // success / error / info

    // Mostrar
    msg.classList.add("show");

    // Ocultar luego de 3 segundos
    setTimeout(() => {
        msg.classList.remove("show");
    }, 3000);
}
