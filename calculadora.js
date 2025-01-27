// Variables y constantes
const idBtnPantalla = document.getElementById("btn-pantalla")
const idCientifica = document.getElementById("botones-cientifica")
const idTapa = document.getElementById("tapa-calc")
const idPantalla = document.getElementById("pantalla-calc")

let operacion = ""
operacion = operacion.replace(/,/g, '.')
let base = 0;
let estadoCientifica = true
let estadoUnidades = 'radianes';
var resultado = 0;
var mc = 0;

// Funciones básicas de interfaz
const actualizar = () => {
    document.getElementById("pantalla-calc").value = operacion;

    const preview = operacion
        .replace(/,/g, '.')
        .replace(/x/g, '*')
        .replace(/÷/g, '/');

    const resultadoPreview = eval(preview);
    if (resultadoPreview !== undefined) {
        document.getElementById("pantalla-calc2").value = resultadoPreview;
    } else {
        document.getElementById("pantalla-calc2").value = "";
    }



}

const concatenar = (a) => { operacion += a; actualizar() };

// Funciones de limpieza
const limpiarUltimaPoscion = () => { operacion = operacion.slice(0, -1); actualizar() }
const limpiarPantalla = () => { operacion = ""; document.getElementById("pantalla-calc2").value = ""; actualizar(); }

// Funciones científicas y de memoria
function ocultarCientifica() {
    if (estadoCientifica == false) {
        idCientifica.style.display = "none"
        estadoCientifica = true
        idTapa.classList.remove("tapa-calc-mode2")
        idTapa.classList.add("tapa-calc")
        idBtnPantalla.classList.remove("btn-pantalla-mode2")
        idBtnPantalla.classList.add("btn-pantalla")
    } else {
        idCientifica.style.display = "grid"
        estadoCientifica = false
        idTapa.classList.add("tapa-calc-mode2")
        idTapa.classList.remove("tapa-calc")
        idBtnPantalla.classList.add("btn-pantalla-mode2")
        idBtnPantalla.classList.remove("btn-pantalla")
    }
}

// Funciones de cálculo principal
function calcular() {
    try {
        const expression = operacion
            .replace(/π/g, Math.PI)
            .replace(/,/g, '.')
            .replace(/x/g, '*')
            .replace(/÷/g, '/')
            .replace(/\^/g, '**');

        let resultado;

        if (/[\+\-\*\/\*\*]/.test(expression) && !expression.startsWith("e**")) {
            resultado = eval(`(${expression})`);
        }
        else if (/^\d+√\d+(\.\d+)?$/.test(expression)) {
            const [indice, radicando] = expression.split("√").map(parseFloat);
            resultado = Math.pow(radicando, 1 / indice).toFixed(5);
        }
        else if (expression.startsWith("³√")) {
            resultado = Math.cbrt(parseFloat(expression.slice(2)));
        }
        else if (expression.startsWith("√")) {
            resultado = Math.sqrt(parseFloat(expression.slice(1)));
        }
        else if (expression.startsWith("e**")) {
            resultado = Math.exp(parseFloat(expression.slice(3)));
        }
        else {
            throw new Error("Formato de operación no válido.");
        }

        idPantalla.value = resultado;
        operacion = resultado.toString();
    } catch (error) {
        idPantalla.value = "ERROR";
        operacion = "";
    }
}

// Funciones matemáticas básicas
const numeroInverso = () => { operacion = 1 / parseFloat(operacion); actualizar() }
const calcularPorcentaje = () => { operacion = parseFloat(operacion) / 100; actualizar() }
const calcularRaiz = () => { operacion = Math.sqrt(operacion); actualizar() }
const calcularE = () => { operacion += Math.E.toString(); actualizar(); }
const elevar = (num) => { operacion = Math.pow(operacion, num); actualizar() }

// Funciones de memoria
const limpiarMemoria = () => { mc = 0; idPantalla.value = ""; limpiarPantalla() }
const mostrarMemoria = () => { idPantalla.value = mc; operacion = ""; }
const sumarMemoria = () => { mc += parseFloat(idPantalla.value); idPantalla.value = " "; limpiarPantalla() }
const multiplicarMemoria = () => { mc *= parseFloat(idPantalla.value); idPantalla.value = " "; limpiarPantalla() }
const restarMemoria = () => { mc -= parseFloat(idPantalla.value); idPantalla.value = " "; limpiarPantalla() }

// Funciones logarítmicas
function crearFuncionLogaritmo(funcionMath) {
    return function () {
        const valor = parseFloat(operacion);
        operacion = funcionMath(valor).toFixed(4);
        base = 0;
        actualizar();
    };
}

const ln = crearFuncionLogaritmo(Math.log);
const logaritmo = crearFuncionLogaritmo(Math.log2);
const logaritmo10 = crearFuncionLogaritmo(Math.log10);

// Funciones trigonométricas
function crearFuncionTrig(funcionMath, esInversa = false) {
    return function () {
        const valor = parseFloat(operacion);
        let resultado;

        if (esInversa) {
            resultado = funcionMath(valor);
            if (estadoUnidades === 'grados') {
                resultado = resultado * (180 / Math.PI);
            }
        } else {
            const angulo = estadoUnidades === 'grados'
                ? valor * (Math.PI / 180)
                : valor;
            resultado = funcionMath(angulo);
        }

        operacion = resultado.toFixed(4);
        base = 0;
        actualizar();
    };
}

const tangente = crearFuncionTrig(Math.tan);
const seno = crearFuncionTrig(Math.sin);
const senoh = crearFuncionTrig(Math.sinh);
const atan = crearFuncionTrig(Math.atan, true);
const cosh = crearFuncionTrig(Math.cosh);
const tanh = crearFuncionTrig(Math.tanh);
const acos = crearFuncionTrig(Math.acos, true);

// Funciones hiperbólicas
const acosh = () => { operacion = Math.acosh(parseFloat(operacion)).toFixed(4); actualizar(); }
const asinh = () => { operacion = Math.asinh(parseFloat(operacion)).toFixed(4); actualizar(); }
const atanh = () => { operacion = Math.atanh(parseFloat(operacion)).toFixed(4); actualizar(); }
const cos = () => { operacion = Math.cos(parseFloat(operacion)).toFixed(4); actualizar() }

// Funciones de conversión
function cambiarUnidades() {
    estadoUnidades = estadoUnidades === 'radianes' ? 'grados' : 'radianes';
    document.getElementById("btn-radianes").innerText = estadoUnidades === 'radianes' ? 'Rad' : 'Grad';
}

const generarNumeroAleatorio = () => { operacion = Math.floor(Math.random() * 30000); actualizar() }
const pasraAbinario = () => { operacion = parseInt(operacion).toString(2); actualizar(); }
const pasarHexa = () => { operacion = parseInt(operacion).toString(16); actualizar(); }
const pasarNegativoPostivo = () => { operacion = 0 > operacion ? Math.abs(operacion) : -Math.abs(operacion); actualizar(); }

function calcularfactorial() {
    for (let i = operacion - 1; i >= 1; i--) {
        operacion *= i;
    }
    actualizar()
}

const concatenarParentesis = () => {
    const apertura = (operacion.match(/\(/g) || []).length;
    const cierre = (operacion.match(/\)/g) || []).length;

    const ultimoCaracter = operacion.trim().slice(-1);
    if (apertura > cierre && ultimoCaracter !== "(" && ultimoCaracter !== "") {

        operacion += ')';
    } else {

        operacion += '(';
    }

    actualizar();
};
