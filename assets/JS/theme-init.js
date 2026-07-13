// Esto aplica inmediatamente la clase light-theme si fue guardada en el localStorage
if (localStorage.getItem('theme') === 'light') {
    document.documentElement.classList.add('light-theme');
}
