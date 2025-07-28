// Variables para el sonido ambiente
let audioContext;
let sonidoAmbiente;
let estaReproduciendo = false;

// Función para inicializar el sonido ambiente automáticamente
function iniciarSonidoAmbiente() {
    try {
        // Crear contexto de audio
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Crear oscilador para simular sonido de viento suave
        sonidoAmbiente = audioContext.createOscillator();
        let ganancia = audioContext.createGain();
        
        // Configurar el oscilador
        sonidoAmbiente.type = 'sine';
        sonidoAmbiente.frequency.setValueAtTime(180, audioContext.currentTime);
        
        // Volumen del ambiente
        ganancia.gain.setValueAtTime(0.03, audioContext.currentTime);
        
        // Conectar los nodos de audio
        sonidoAmbiente.connect(ganancia);
        ganancia.connect(audioContext.destination);
        
        // Iniciar el sonido
        sonidoAmbiente.start();
        estaReproduciendo = true;
        
        // Variación en la frecuencia para simular viento natural
        setInterval(() => {
            if (estaReproduciendo && sonidoAmbiente) {
                const nuevaFrecuencia = 150 + Math.random() * 80;
                try {
                    sonidoAmbiente.frequency.setValueAtTime(nuevaFrecuencia, audioContext.currentTime);
                } catch(e) {
                    // Si hay error, reiniciar el sonido
                    console.log('Reiniciando sonido ambiente');
                }
            }
        }, 3000);
        
    } catch (error) {
        console.log('El navegador no soporta Web Audio API o el usuario debe interactuar primero');
    }
}

// Función para crear sonido de clic cuando se toca un objeto
function crearSonidoClic() {
    if (!audioContext) return;
    
    try {
        // Crear un oscilador temporal para el clic
        let clickOscilador = audioContext.createOscillator();
        let clickGanancia = audioContext.createGain();
        
        // Configurar sonido de clic
        clickOscilador.type = 'square';
        clickOscilador.frequency.setValueAtTime(600, audioContext.currentTime);
        
        // Volumen inicial y disminución rápida
        clickGanancia.gain.setValueAtTime(0.1, audioContext.currentTime);
        clickGanancia.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        
        // Conectar y reproducir
        clickOscilador.connect(clickGanancia);
        clickGanancia.connect(audioContext.destination);
        
        clickOscilador.start();
        clickOscilador.stop(audioContext.currentTime + 0.2);
        
    } catch (error) {
        console.log('Error al crear sonido de clic');
    }
}

// Agregar eventos de clic a todos los objetos del paisaje
function agregarEventosDeClick() {
    const objetos = document.querySelectorAll('.objeto');
    
    objetos.forEach(objeto => {
        objeto.addEventListener('click', () => {
            crearSonidoClic();
            // Pequeño efecto visual al hacer clic
            objeto.style.transform = 'scale(0.95)';
            setTimeout(() => {
                objeto.style.transform = 'scale(1)';
            }, 100);
        });
        
        // Cambiar cursor para indicar que es clickeable
        objeto.style.cursor = 'pointer';
    });
}

// Función para intentar iniciar audio con interacción del usuario
function intentarIniciarAudio() {
    document.addEventListener('click', () => {
        if (!estaReproduciendo) {
            iniciarSonidoAmbiente();
        }
    }, { once: true }); // Solo se ejecuta una vez
}

// Inicializar todo cuando la página carga
document.addEventListener('DOMContentLoaded', () => {
    console.log('Paisaje animado cargado');
    
    // Agregar events de clic a los objetos
    agregarEventosDeClick();
    
    // Intentar iniciar sonido (algunos navegadores requieren interacción del usuario)
    iniciarSonidoAmbiente();
    
    // Si no funciona automáticamente, esperar a que el usuario haga clic
    intentarIniciarAudio();
    
    console.log('Haz clic en los objetos para escuchar sonidos');
});