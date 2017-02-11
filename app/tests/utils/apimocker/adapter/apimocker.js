var Promise = require("bluebird");
var ArgumentException = require("../../../../src/common/errors").ArgumentException
var ConnectionException = require("../../../../src/common/errors").ConnectionException
var HttpRequest = require("request-promise")
var ApiMocker = require("apimocker")

function ApiMockerConnector(name, url) {
    if (!(this instanceof ApiMockerConnector)) {
        return new ApiMockerConnector(name, url);
    }

    var itsName = validateToBeGiven(name, "Name must be given");
    var itsUrl = validateToBeGiven(url, "URL must be given");

    var options = {}
    var apiMocker = ApiMocker.createServer(options)
        .setConfigFile('app/tests/utils/apimocker/adapter/config.json')

    this.setMock = function (theMock) {
        return new Promise(function (fulfill, reject) {
                var options = {
                    method: 'POST',
                    resolveWithFullResponse: true,
                    uri: itsUrl + "/admin/setMock",
                    body: theMock,
                    json: true // Automatically stringifies the body to JSON
                };

                try {
                    validateToBeGiven(JSON.stringify(theMock))
                }
                catch (err) {
                    reject(err)
                }

                HttpRequest(options)
                    .then(function (parsedBody) {
                        fulfill(parsedBody)
                    })
                    .catch(function (err) {
                        if (err.statusCode == 400 || err.statusCode == 404) {
                            reject(new ArgumentException(err.message))
                        } else {
                            reject(new ConnectionException(err.message))
//                    }
//                    else {
//                        reject(err)
                        }
                    });
            }
        )
    }
    ;

    this.name = function () {
        return itsName
    };

    this.url = function () {
        return itsUrl
    };

    this.start = function () {
        return new Promise(function (fulfill, reject) {
            apiMocker.start(8080, function (err, result) {
                if (err) {
                    reject(err)
                }
                else {
                    fulfill(result)
                }
            })
        })
    }

    this.stop = function () {
        return new Promise(function (fulfill, reject) {
            apiMocker.stop(function (err, result) {
                if (err) {
                    reject(err)
                }
                else {
                    fulfill(result)
                }
            })
        })
    }
    function validateToBeGiven(parameter, message) {
        if (parameter == null || !parameter.trim()) {
            throw new ArgumentException(message)
        }
        return parameter;
    }
}
;

module.exports = ApiMockerConnector;
