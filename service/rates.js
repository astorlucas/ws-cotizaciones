const crypto = require('crypto');

class Rates {

    decimals;
    divisor;

    toFrom = {};
    fromTo = {};

    currencies = [];

    /**
     * @param {number} d Cantidad de decimales que debe tener la cotización generada
     */
    constructor(d) {
        if (typeof d != 'number' || Number.isNaN(d)) {
            throw new Error('Debe proporcionar la cantidad de decimales que se deben manejar en la cotización')
        }

        this.decimals = d;
        this.divisor = Math.pow(10, this.decimals * Math.log10(10));
    }

    /**
     * Agrega una relación entre dos monedas, y el valor de la compra venta entre ellas
     * @param {Rate} rate Relación de compra venta entre dos monedas
     */
    add(rate) {
        if (this.toFrom[rate.keyToFrom()] != undefined || this.fromTo[rate.keyFromTo()] != undefined) {
            throw new Error(`Existe registro rate para from ${rate.getFrom()} to ${rate.getTo()}`);
        }

        this.toFrom[rate.keyToFrom()] = rate;
        this.fromTo[rate.keyFromTo()] = rate;

        const result = [];
        for (const rate of Object.values(this.fromTo)) {
            result.push(rate.getFrom());
            result.push(rate.getTo());
        }
        this.currencies = [... new Set(result)].sort((a, b) => a < b ? -1 : (a > b ? 1 : 0) );
    }

    /**
     * Función determinista, siempre genera un número determinado para un mismo string.
     * @param {string} date Fecha en base a la que se debe generar un número double
     * @returns double entre 0.0 y 9.99999999...
     */
    getDeviation(date) {
        /**
         * Genera un hash MD5 con la fecha recibida
         */
        const hash = crypto.createHash('md5').update(date).digest('hex');

        /**
         * Recorre cada carácter del hash MD5 y lo convierte a un número entre 0 y 65535 
         * que representa la unidad de código UTF-16 del carácter.
         */
        const numbers = Array.from(hash).map(char => char.charCodeAt(0)).join('');

        /**
         * Para asegurar que se generará un valor con 5 decimales
         * A) se sustituye el número cero por uno en la cadena generada 
         *  Ej: con cero 15454878754540/100000 > 154548787.5454 cuatro decimales
         *  Ej: sin cero 15454878754541/100000 > 154548787.54541 cinco decimales
         * B) se toman solo los primeros 10 caracteres, para evitar que la función Number 
         * al recibir la cadena con más de 15-17 dígitos aproximará el valor, y hará 
         * que sus dígitos a la derecha sean cero
         *  Ej: Number('12345678910121313')  > 12345678910121312
         *  Ej: Number('123456789101213131') > 123456789101213140
         * C) Divide el valor generado por 100000 para que generé un número con 5 decimales
         */
        const number = Number(numbers.replace(/0/g, '1').substr(0, 10)) / this.divisor;

        /**
         * Extrae la parte entera del número
         */
        const whole = Math.floor(number);

        /**
         * Extrae los decimales
         */
        const decimals = number - whole;

        /**
         * Retorna el último valor entero y los decimales
         */
        return Number(Array.from(`${whole}`).pop()) + decimals;
    }

    /**
     * @param {number} rate Cotización
     * @param {string} date Fecha para la cotización
     * @returns rate más el valor numérico generado para date
     */
    addDeviation(rate, date) {
        const deviation = this.getDeviation(date);
        const result = rate + deviation;
        return Number(result.toFixed(this.decimals));
    }

    /**
     * @param {string} from Moneda desde la que se desea convertir
     * @param {string} to Moneda a la que se desea convertir
     * @param {string} date Fecha para la que se desea la cotización
     * @returns Cotización para convertir from en to en la fecha recibida
     */
    getRate(from, to, date) {
        const key = `${from}-${to}`;

        if (this.fromTo[key]) {
            return this.addDeviation(this.fromTo[key].rateFromTo(), date);
        } else if (this.toFrom[key]) {
            return this.addDeviation(this.toFrom[key].rateToFrom(), date);
        }

        return null;
    }

    getCurrencies() {
        return this.currencies;
    }

}

module.exports = Rates;