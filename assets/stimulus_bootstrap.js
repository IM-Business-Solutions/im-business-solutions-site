import { Application } from '@hotwired/stimulus';
import HelloController from './controllers/hello_controller.js';
import { generateCsrfHeaders, generateCsrfToken, removeCsrfToken } from './controllers/csrf_protection_controller.js';

const app = Application.start();
app.register('hello', HelloController);

document.addEventListener('submit', function (event) {
    generateCsrfToken(event.target);
}, true);

document.addEventListener('turbo:submit-start', function (event) {
    const headers = generateCsrfHeaders(event.detail.formSubmission.formElement);
    Object.keys(headers).forEach(function (key) {
        event.detail.formSubmission.fetchRequest.headers[key] = headers[key];
    });
});

document.addEventListener('turbo:submit-end', function (event) {
    removeCsrfToken(event.detail.formSubmission.formElement);
});
