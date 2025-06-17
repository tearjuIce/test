// src/mocks/handlers.js
import { http, HttpResponse } from 'msw';

export const handlers = [
    http.get('https://interview.switcheo.com/prices.json', () => {
        return HttpResponse.json([{
            currency: "BLUR",
            date: "2023-08-29T07:10:40.000Z",
            price: 0.20811525423728813
        },
        {
            currency: "bNEO",
            date: "2023-08-29T07:10:50.000Z",
            price: 7.1282679
        },
        ]);
    }),
];