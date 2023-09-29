package com.soap.cotizaciones.ws;

public class Rate {

    private String from;
    private String to;
    private double fromTo;
    private double toFrom;

    public Rate(String from, String to, double rft, double rtf) {
        this.from = from;
        this.to = to;
        this.fromTo = rft;
        this.toFrom = rtf;
    }

    public String getFrom() {
        return from;
    }

    public String getTo() {
        return to;
    }

    public String keyToFrom() {
        return to + "-" + from;
    }

    public double rateToFrom() {
        return toFrom;
    }

    public String keyFromTo() {
        return from + "-" + to;
    }

    public double rateFromTo() {
        return fromTo;
    }
}

