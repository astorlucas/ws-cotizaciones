package com.soap.cotizaciones.ws;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

public class Rates {

    private int decimals;
    private double divisor;
    private Map<String, Rate> toFrom;
    private Map<String, Rate> fromTo;
    private List<String> currencies;

    public Rates(int d) {
        if (d <= 0) {
            throw new IllegalArgumentException("Number of decimals must be a positive integer.");
        }
        this.decimals = d;
        this.divisor = Math.pow(10, this.decimals);
        this.toFrom = new HashMap<>();
        this.fromTo = new HashMap<>();
    }

    public void add(Rate rate) {
        if (toFrom.containsKey(rate.keyToFrom()) || fromTo.containsKey(rate.keyFromTo())) {
            throw new IllegalArgumentException("Rate already exists for currency pair: " + rate.getFrom() + " to " + rate.getTo());
        }
        toFrom.put(rate.keyToFrom(), rate);
        fromTo.put(rate.keyFromTo(), rate);
        updateCurrencies(rate.getFrom(), rate.getTo());
    }

    private void updateCurrencies(String from, String to) {
        if (!currencies.contains(from)) {
            currencies.add(from);
        }
        if (!currencies.contains(to)) {
            currencies.add(to);
        }
    }

    public double getDeviation(String date) {
        // Implement logic to generate a deviation based on the date (similar to the JavaScript code)
        // ...
        // return calculated deviation;
        return 0.0; // Placeholder value
    }

    public double addDeviation(double rate, String date) {
        double deviation = getDeviation(date);
        double result = rate + deviation;
        return Double.parseDouble(String.format("%." + decimals + "f", result));
    }

    public Double getRate(String from, String to, String date) {
        Rate rate = fromTo.get(from + "-" + to);
        if (rate != null) {
            return addDeviation(rate.rateFromTo(), date);
        } else {
            rate = toFrom.get(to + "-" + from);
            if (rate != null) {
                return addDeviation(rate.rateToFrom(), date);
            }
        }
        return null;
    }

    public List<String> getCurrencies() {
        return currencies;
    }
}


