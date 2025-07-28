const campoTexto = document.getElementById('campoTexto');
const numeroCaracteres = document.getElementById('numeroCaracteres');

campoTexto.addEventListener('input', function() {
    const cantidadCaracteres = campoTexto.value.length;
    numeroCaracteres.textContent = cantidadCaracteres;
});