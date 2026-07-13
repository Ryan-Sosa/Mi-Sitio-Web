import { auth, db } from "./firebase-connect.js";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    deleteUser
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

import {
    doc,
    setDoc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

import { mostrarMensaje } from "../../../incluir-firebase.js";

// FUNCIÓN PARA CAMBIAR EL MENSAJE DE ERROR DE FIREBASE
function traducirErrorFirebase(code) {
    switch (code) {
        case "auth/invalid-email":
            return "El correo no es válido.";

        case "auth/user-not-found":
        case "auth/wrong-password":
        case "auth/invalid-credential":
            return "Correo o contraseña incorrectos.";

        case "auth/email-already-in-use":
            return "Este correo ya está registrado.";

        case "auth/weak-password":
            return "La contraseña debe tener al menos 6 caracteres.";

        case "auth/too-many-requests":
            return "Demasiados intentos. Intenta más tarde.";

        default:
            return "Ocurrió un error. Intenta nuevamente.";
    }
}

// ESCUCHAR LOGIN
document.addEventListener("firebase-login", (e) => {
    const { email, pass } = e.detail;

    signInWithEmailAndPassword(auth, email, pass)
        .then(async (cred) => {

            // obtener username desde Firestore
            const userDoc = await getDoc(doc(db, "usuarios", cred.user.uid));
            const data = userDoc.data();

            localStorage.setItem("username", data.username);

            //  ACTUALIZAR HEADER INMEDIATAMENTE
            document.getElementById("dropdown-username").textContent = data.username;
            document.getElementById("btn-abrir-login").style.display = "none";
            document.getElementById("user-menu-btn").style.display = "flex";

            mostrarMensaje("success", "Sesión iniciada con éxito");

            // REFRESCAR PÁGINA AL INICIAR SESIÓN
            setTimeout(() => {
                window.location.reload();
            }, 800);
        })
        .catch(err => {
            console.error(err);
            const mensaje = traducirErrorFirebase(err.code);
            mostrarMensaje("error", mensaje);
        });

});


// ESCUCHAR REGISTRO
document.addEventListener("firebase-registro", async (e) => {
    let { email, pass, username } = e.detail;

    try {
        // NORMALIZAR USERNAME
        const usernameOriginal = username.trim();          // Ejemplo: RyaN
        const usernameLower = usernameOriginal.toLowerCase(); // Ejemplo: ryan


        // CREAR CUENTA (AUTH)
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        const user = userCredential.user;


        // VERIFICA SI YA EXISTE EL USERNAME
        const usernameRef = doc(db, "usernames", usernameLower);
        const usernameSnap = await getDoc(usernameRef);

        if (usernameSnap.exists()) {
            await deleteUser(user); // (borrar usuario creado)
            mostrarMensaje("error", "El nombre de usuario ya está en uso.");
            return;
        }


        // 3) GUARDAR USERNAME (--ÚNICO--)
        await setDoc(usernameRef, {
            uid: user.uid
        });


        // GUARDAR USUARIO
        await setDoc(doc(db, "usuarios", user.uid), {
            username: usernameOriginal, // se muestra tal cual como se escribió
            email: user.email,
            createdAt: new Date()
        });


        // MENSAJE (TOAST)
        mostrarMensaje("success", "Cuenta creada con éxito. Por favor, inicie sesión.");

        document.getElementById("form-registro").style.display = "none";
        document.getElementById("form-login").style.display = "flex";

    } catch (err) {
        console.error(err);
        const mensaje = traducirErrorFirebase(err.code);
        mostrarMensaje("error", mensaje);
    }
});
