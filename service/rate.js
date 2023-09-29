class Rate {

    from;
    to;

    fromTo;
    toFrom;

    constructor(from, to, rft, rtf) {
        this.from = from;
        this.to = to;
        this.fromTo = rft;
        this.toFrom = rtf;
    }

    getFrom() {
        return this.from;
    }

    getTo() {
        return this.to;
    }

    keyToFrom() {
        return `${this.to}-${this.from}`;
    }

    rateToFrom() {
        return this.toFrom;
    }

    keyFromTo() {
        return `${this.from}-${this.to}`;
    }

    rateFromTo() {
        return this.fromTo;
    }

}

module.exports = Rate;