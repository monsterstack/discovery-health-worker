'use strict';
const HealthService = require('../libs/healthService').HealthService;

describe('health-check-test', (done) => {
    before((done) => {
        done();
    });

    // Test Checking Url for Accessibility (i.e health.check.good event)
    it('Health Check Url That is Accessible', (done) => {
        let healthService = new HealthService();
        let healthIsGood = false;

        let timeoutHandle = null;
        healthService.onHealthCheckSucceeded((event) => {
            healthIsGood = true;
            clearTimeout(timeoutHandle);

            // Check Event For expected format
            if(event.hasOwnProperty('serviceId')) {
                done();
            } else {
                done(new Error('Expecting Service Id field in received event'));
            }
        });

        healthService.checkHealth('1111', 'http://www.google.com');

        timeoutHandle = setTimeout(() => {
            if(!healthIsGood) {
                done(new Error('Expecting Good Health Result'));
            } else {
                done();
            }
        }, 22000);

    }).timeout(25000);


    // Test Checking Url for Inaccessibility (i.e. health.check.bad event)
    it('Health Check Url That is Inaccessible', (done) => {
        let healthService = new HealthService();
        let healthIsGood = true;

        let timeoutHandle = null;
        healthService.onHealthCheckFailed((event) => {
            healthIsGood = false;
            clearTimeout(timeoutHandle);

            done();
        });

        healthService.checkHealth('1111', 'http://11.1.1.21/health');

        timeoutHandle = setTimeout(() => {
            if(healthIsGood) {

                done(new Error('Expecting Bad Health Result'));
            } else {
                done();
            }
        }, 22000);
    }).timeout(25000);

    after((done) => {
        done();
    });
});