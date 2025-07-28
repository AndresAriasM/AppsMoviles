// Función para mostrar/ocultar contraseña
function togglePassword() {
    const claveInput = document.getElementById('clave');
    const toggleIcon = document.querySelector('.toggle-password');
    
    if (claveInput.type === 'password') {
        claveInput.type = 'text';
        toggleIcon.textContent = '🙈';
    } else {
        claveInput.type = 'password';
        toggleIcon.textContent = '👁️';
    }
}

// Función para validar la clave
function validarClave() {
    const documento = document.getElementById('documento').value;
    const clave = document.getElementById('clave').value;
    const mensajeDiv = document.getElementById('mensaje');
    
    // Limpiar mensaje anterior
    mensajeDiv.textContent = '';
    mensajeDiv.className = 'mensaje';
    
    // Validaciones básicas
    if (!documento) {
        mostrarMensaje('Por favor ingresa tu número de documento', 'error');
        return;
    }
    
    if (!clave) {
        mostrarMensaje('Por favor ingresa tu clave', 'error');
        return;
    }
    
    if (documento.length < 6) {
        mostrarMensaje('El número de documento debe tener al menos 6 dígitos', 'error');
        return;
    }
    
    if (clave.length < 4) {
        mostrarMensaje('La clave debe tener al menos 4 caracteres', 'error');
        return;
    }
    
    // Simulación de validación (en un caso real sería contra un servidor)
    // Para el ejercicio, usamos una clave simple
    const claveCorrecta = '1234';
    const documentoValido = '12345678';
    
    if (documento === documentoValido && clave === claveCorrecta) {
        mostrarMensaje('¡Ingreso exitoso! Bienvenido a tu Sucursal Virtual', 'exito');
        
        // Simular redirección después de 2 segundos
        setTimeout(() => {
            alert('En una aplicación real, serías redirigido al panel principal');
        }, 2000);
        
    } else {
        mostrarMensaje('Documento o clave incorrectos. Intenta nuevamente.', 'error');
    }
}

// Función para mostrar mensajes
function mostrarMensaje(texto, tipo) {
    const mensajeDiv = document.getElementById('mensaje');
    mensajeDiv.textContent = texto;
    mensajeDiv.className = `mensaje ${tipo}`;
}

// Permitir envío con Enter
document.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        validarClave();
    }
});

// Mostrar credenciales de prueba al cargar la página
window.addEventListener('load', function() {
    setTimeout(() => {
        mostrarMensaje('Para probar: Documento: 12345678, Clave: 1234', 'exito');
    }, 1000);
});