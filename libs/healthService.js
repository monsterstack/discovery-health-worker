'use strict';
const EventEmitter = require('events');
const HttpStatus = require('http-status');
const request = require('request');

class HealthService extends EventEmitter {
    constructor() {
        super();
    }

    checkHealth(serviceId, healthUrl) {
        let self = this;
        request.get(healthUrl, {timeout: 20000}, (error, response, body) => {
            if(error) {
                self.emit('health.check.bad', {
                    serviceId: serviceId,
                    error: error
                });
            } else if(response.statusCode === 200) {
                self.emit('health.check.good', {
                    serviceId: serviceId
                });
            } else {
                self.emit({
                    serviceId: serviceId,
                    error: new Error(HttpStatus[response.statusCode])
                });
            }
      });
    }


    onHealthCheckFailed(cb) {
        this.on('health.check.bad', cb);
    }

    onHealthCheckSucceeded(cb) {
        this.on('health.check.good', cb);
    }
}

module.exports.HealthService = HealthService;