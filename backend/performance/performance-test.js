import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';


// =====================================
// CONFIGURACIÓN DE LA PRUEBA
// =====================================

// URL base del backend
const BASE_URL = __ENV.BASE_URL || 'http://localhost:5000';

export const options = {

    // Un usuario simulado ejecutando el flujo de prueba
    vus: 1,

    // Cantidad de veces que se ejecuta el escenario completo
    iterations: 30,

    // Criterios de aceptación del rendimiento
    thresholds: {
        http_req_failed: ['rate<0.01'],      // Menos del 1% de errores
        http_req_duration: ['p(95)<1000'],   // 95% responde antes de 1 segundo
    },
};


// =====================================
// CARGA DE DATOS EXTERNOS
// =====================================

// Lee los endpoints desde un archivo JSON externo
const endpoints = new SharedArray('Endpoints', () => {
    return JSON.parse(open('./endpoints.json'));
});


// =====================================
// EJECUCIÓN DE PRUEBAS
// =====================================

export default function () {


    // Ejecuta una prueba para cada endpoint definido
    endpoints.forEach((endpoint) => {


        // Realiza la petición HTTP al servicio
        const response = http.get(
            `${BASE_URL}${endpoint.url}`
        );


        // Verifica código HTTP y tiempo de respuesta
        check(response, {

            [`${endpoint.name} responde correctamente`]:
                (r) => r.status === 200,

            [`${endpoint.name} tiempo menor a 1 segundo`]:
                (r) => r.timings.duration < 1000,

        });


        // Obtiene y valida los datos retornados por la API
        let body;

        try {

            body = response.json();

        } catch (error) {

            body = null;

        }


        check(body, {

            [`${endpoint.name} devuelve información`]:
                (data) => data !== null,

        });

    });


    // Simula tiempo de espera entre acciones del usuario
    sleep(1);

}



// =====================================
// GENERACIÓN DE REPORTE
// =====================================

export function handleSummary(data) {

    return {

        // Reporte visual HTML con métricas recopiladas
        'report.html': htmlReport(data),

        // Resultados completos en consola
        stdout: JSON.stringify(data, null, 2),

    };
}