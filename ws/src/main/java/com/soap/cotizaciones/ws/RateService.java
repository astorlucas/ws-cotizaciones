package com.soap.cotizaciones.ws;

import java.util.List;

@Service
public class RateService {

    private Rates rates; // Initialize rates object here

    public double getRate(String from, String to, String date) {
        // Implement logic to get rate based on from, to, and date
        return rates.getRate(from, to, date);
    }

    public List<String> getCurrencies() {
        // Implement logic to get currencies
        return rates.getCurrencies();
    }
}
