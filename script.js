let mazo = [];
let mesa = [];
let manoJugador = [];
let manoComputadora = [];
let pistas = 6;
let descartesJugador = 0;
let descartesComputadora = 0;
let turnosSinJugar = 0;
const maxDescartes = 3;
const maxTurnosSinJugar = 5;

// Inicializar el juego
function iniciarJuego() {
    mazo = crearMazo();
    mazo = barajarMazo(mazo);

    manoJugador = repartirCartas(5);
    manoComputadora = repartirCartas(5);

    mesa = [];
    pistas = 6;
    descartesJugador = 0;
    descartesComputadora = 0;
    turnosSinJugar = 0;

    actualizarInterfaz();
    actualizarEstado("¡El juego ha comenzado!");
}

// Crear mazo
function crearMazo() {
    let mazo = [];
    for (let i = 1; i <= 10; i++) {
        for (let j = 0; j < 2; j++) { // 2 cartas de cada número
            mazo.push(i);
        }
    }
    return mazo;
}

// Barajar mazo
function barajarMazo(mazo) {
    return mazo.sort(() => Math.random() - 0.5);
}

// Repartir cartas
function repartirCartas(cantidad) {
    let mano = [];
    for (let i = 0; i < cantidad; i++) {
        mano.push(mazo.pop());
    }
    return mano;
}

// Jugar carta
function jugarCarta(indice) {
    const carta = manoJugador[indice];
    if (carta === mesa.length + 1) {
        mesa.push(carta);
        manoJugador.splice(indice, 1);
        if (mazo.length > 0) {
            manoJugador.push(mazo.pop());
        }
        turnosSinJugar = 0; // Resetea los turnos sin jugar
        actualizarEstado("Has jugado una carta.");
    } else {
        actualizarEstado("No puedes jugar esta carta.");
    }

    verificarFinJuego();
    actualizarInterfaz();
}

// Dar pista
function darPista() {
    if (pistas > 0) {
        pistas--;
        const numero = mesa.length + 1;
        const indices = manoComputadora
            .map((carta, index) => (carta === numero ? index : -1))
            .filter(index => index !== -1);
        if (indices.length > 0) {
            actualizarEstado(`La computadora tiene el número ${numero} en las posiciones: ${indices.join(", ")}`);
        } else {
            actualizarEstado("La computadora no tiene cartas con el número necesario.");
        }
    } else {
        actualizarEstado("No quedan pistas disponibles.");
    }
}

// Descartar carta
function descartarCarta() {
    if (descartesJugador < maxDescartes) {
        manoJugador.pop();
        descartesJugador++;
        if (mazo.length > 0) {
            manoJugador.push(mazo.pop());
        }
        actualizarEstado("Carta descartada.");
        actualizarInterfaz();
    } else {
        actualizarEstado("Ya has descartado el máximo de cartas permitido.");
    }
}

// Finalizar turno
function finalizarTurno() {
    turnosSinJugar++;
    if (turnosSinJugar >= maxTurnosSinJugar) {
        actualizarEstado("¡Han perdido! Se han pasado demasiados turnos sin jugar.");
        verificarFinJuego();
    } else {
        turnoComputadora();
    }
}

// Turno de la computadora
function turnoComputadora() {
    const numero = mesa.length + 1;
    const indice = manoComputadora.findIndex(carta => carta === numero);

    if (indice !== -1) {
        mesa.push(manoComputadora.splice(indice, 1)[0]);
        if (mazo.length > 0) {
            manoComputadora.push(mazo.pop());
        }
        turnosSinJugar = 0; // Resetea los turnos sin jugar
        actualizarEstado("La computadora jugó una carta.");
    } else {
        if (descartesComputadora < maxDescartes) {
            manoComputadora.pop();
            descartesComputadora++;
            if (mazo.length > 0) {
                manoComputadora.push(mazo.pop());
            }
            actualizarEstado("La computadora descartó una carta.");
        } else {
            actualizarEstado("¡Han perdido! La computadora no puede continuar.");
            verificarFinJuego();
        }
    }

    verificarFinJuego();
    actualizarInterfaz();
}

// Verificar fin del juego
function verificarFinJuego() {
    if (mesa.length === 10) {
        actualizarEstado("¡Han ganado el juego!");
    } else if (mazo.length === 0 && manoJugador.length === 0 && manoComputadora.length === 0) {
        actualizarEstado("No hay más cartas para jugar. ¡Han perdido!");
    }
}

// Actualizar la interfaz
function actualizarInterfaz() {
    const mesaDiv = document.getElementById("mesa");
    mesaDiv.innerHTML = mesa.map(carta => `<div class="card">${carta}</div>`).join("");

    const manoJugadorDiv = document.getElementById("mano-jugador");
    manoJugadorDiv.innerHTML = manoJugador.map((carta, index) => `<div class="card" onclick="jugarCarta(${index})">${carta}</div>`).join("");

    const manoComputadoraDiv = document.getElementById("mano-computadora");
    manoComputadoraDiv.innerHTML = manoComputadora.map(() => `<div class="card">?</div>`).join("");
}

// Actualizar estado
function actualizarEstado(mensaje) {
    document.getElementById("estado").textContent = mensaje;
}

// Iniciar el juego
iniciarJuego();