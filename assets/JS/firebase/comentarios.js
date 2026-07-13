import { auth, db } from "./firebase-connect.js";

import {
    collection,
    query,
    where,
    orderBy,
    onSnapshot,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    serverTimestamp,
    getDocs,
    limit
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

function initComentarios() {

    const commentsList = document.getElementById("comments-list");
    const btnSend = document.getElementById("btn-send-comment");
    const commentInput = document.getElementById("comment-text");

    const deleteModal = document.getElementById("delete-modal");
    const confirmDeleteBtn = document.getElementById("confirm-delete");
    const cancelDeleteBtn = document.getElementById("cancel-delete");

    let commentToDelete = null;

    if (!btnSend) {
        console.warn("No existe #btn-send-comment");
    } else {

        btnSend.addEventListener("click", async () => {
            const user = auth.currentUser;
            const username = localStorage.getItem("username") || "Usuario";
            const warning = document.getElementById("comment-warning");
            const text = commentInput.value.trim();
            const pageId = document.body.dataset.page;

            if (!text) return;

            commentInput.value = ""; // Borra texto de la caja al apretar el botón comentar.

            // Abrir POP-UP login al querer comentar sin estar logueado
            if (!user) {
                if (warning) warning.style.display = "block";

                const loginBtn = document.getElementById("btn-abrir-login");
                if (loginBtn) loginBtn.click();

                return;
            }

            if (warning) warning.style.display = "none";

            try {
                await addDoc(collection(db, "comentarios"), {
                    text,
                    page: pageId,
                    userId: user.uid,
                    username,
                    createdAt: serverTimestamp()
                });

                
            } catch (error) {
                console.error("Error al guardar comentario:", error);

                commentInput.value = text; // Si falla, restaura el texto escrito.
            }
        });

    }

    if (!commentsList) {
        console.warn("No existe #comments-list en esta página");
    } else {

        const pageId = document.body.dataset.page;

        if (!pageId) {
            console.error("Falta data-page en el <body>");
        } else {

            const q = query(
                collection(db, "comentarios"),
                where("page", "==", pageId),
                orderBy("createdAt", "desc"),
                limit(50)
            );

            getDocs(q);

            console.log("QUERY DE COMENTARIOS CREADA");
            onSnapshot(q, snapshot => {

                console.log("SNAPSHOT RECIBIDO", snapshot.size);
                commentsList.innerHTML = "";

                if (snapshot.empty) {
                    commentsList.innerHTML = `
                    <p class="no-comments">Todavía no hay comentarios.</p>
                `;
                    return;
                }

                snapshot.forEach(commentDoc => {
                    const data = commentDoc.data();
                    const commentId = commentDoc.id;
                    const user = auth.currentUser;

                    const isOwner = user && user.uid === data.userId;

                    const commentEl = document.createElement("div");
                    commentEl.classList.add("comment");

                    commentEl.innerHTML = `
                    <div class="comment-header">
                        <span class="comment-user">${data.username}</span>
                        <span class="comment-date">
                            ${formatDate(data.createdAt)}
                        </span>
                    </div>

                    <p class="comment-text">${data.text}</p>

                ${isOwner ? `
                    <div class="comment-footer">
                        <button class="edit-comment-btn">Editar</button>
                        <button class="delete-comment-btn">Borrar</button>
                    </div>
                ` : ""}
            `;


                    // EDICIÓN Y ELIMINACIÓN DE COMENTARIOS
                    if (isOwner) {
                        const editBtn = commentEl.querySelector(".edit-comment-btn");
                        const deleteBtn = commentEl.querySelector(".delete-comment-btn");
                        const textEl = commentEl.querySelector(".comment-text");


                        // LÓGICA EDITAR
                        editBtn.addEventListener("click", () => {

                            editBtn.style.display = "none";

                            const originalText = data.text;

                            textEl.innerHTML = `
                            <textarea class="edit-textarea">${originalText}</textarea>
                                <div class="edit-actions">
                                    <button class="save-edit">Guardar</button>
                                    <button class="cancel-edit">Cancelar</button>
                                </div>
                            `;

                            const saveBtn = textEl.querySelector(".save-edit");
                            const cancelBtn = textEl.querySelector(".cancel-edit");
                            const textarea = textEl.querySelector(".edit-textarea");

                            // Guardar cambios
                            saveBtn.addEventListener("click", async () => {
                                const newText = textarea.value.trim();

                                if (!newText) return;

                                if (newText === originalText) {
                                    // No hubo cambios -> salir del modo edición
                                    textEl.textContent = originalText;
                                    editBtn.style.display = "inline";
                                    return;
                                }

                                await updateDoc(doc(db, "comentarios", commentId), {
                                    text: newText
                                });
                            });

                            // Cancelar edición
                            cancelBtn.addEventListener("click", () => {

                                // Restaurar texto
                                textEl.textContent = originalText;

                                // Volver a mostrar el botón Editar
                                editBtn.style.display = "inline";

                            });
                        });


                        //  LÓGICA BORRAR
                        if (deleteBtn) {
                            deleteBtn.addEventListener("click", () => {
                                commentToDelete = commentId;
                                deleteModal.classList.add("active");
                            });
                        }
                    }

                    commentsList.appendChild(commentEl);
                });
            });
        }
    }

    confirmDeleteBtn.addEventListener("click", async () => {
        if (!commentToDelete) return;

        // cerrar primero
        deleteModal.classList.remove("active");

        const idToDelete = commentToDelete;
        commentToDelete = null;

        try {
            await deleteDoc(doc(db, "comentarios", idToDelete));
        } catch (error) {
            console.error("Error al borrar:", error);
            alert("Hubo un error al borrar el comentario.");
        }
    });

    cancelDeleteBtn.addEventListener("click", () => {
        deleteModal.classList.remove("active");
        commentToDelete = null;
    });

    // CERRAR MODAL CON TECLA ESCAPE Y CLICKEANDO FUERA

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && deleteModal.classList.contains("active")) {
            deleteModal.classList.remove("active");
            commentToDelete = null;
        }
    });

    deleteModal.addEventListener("click", (e) => {
        if (e.target === deleteModal) {
            deleteModal.classList.remove("active");
            commentToDelete = null;
        }
    });


    // Formatear fecha
    function formatDate(timestamp) {
        if (!timestamp) return "";

        const date = timestamp.toDate();
        return date.toLocaleDateString("es-AR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });
    }

}

window.initComentarios = initComentarios;