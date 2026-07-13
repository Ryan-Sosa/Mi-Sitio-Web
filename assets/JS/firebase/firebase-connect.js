// Importar funciones de Firebase usando módulos ES (v12.6.0)
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import {
    getFirestore,
    enableIndexedDbPersistence
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// Mi configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBCKVbIi579Hm7NBFq0lPArrxrUSw7rxYQ",
    authDomain: "d-tecno-7a97d.firebaseapp.com",
    projectId: "d-tecno-7a97d",
    storageBucket: "d-tecno-7a97d.firebasestorage.app",
    messagingSenderId: "311736435393",
    appId: "1:311736435393:web:9acebafc56011bdf290a40"
};

// Inicialización de Firebase
const app = initializeApp(firebaseConfig);

// Inicialización de servicios
const auth = getAuth(app);
const db = getFirestore(app);

// Caché Offline
enableIndexedDbPersistence(db).catch(err => {
    console.warn("Firestore persistence error:", err.code);
});

// Exportación
export { auth, db };