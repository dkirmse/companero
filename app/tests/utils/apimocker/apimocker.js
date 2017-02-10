var Promise = require("bluebird")
var ArgumentException = require("../../../src/common/errors").ArgumentException
var ConnectionException = require("../../../src/common/errors").ConnectionException

function ApiMocker(connectorToApimocker, connectorToMock) {
    if (!(this instanceof ApiMocker)) {
        return new ApiMocker(connectorToApimocker, connectorToMock);
    }

    var itsApimockerConnector = validateToBeGiven(connectorToApimocker, "Api mocker connector must be given")
    var itsConnectorToMock = validateToBeGiven(connectorToMock, "Connector to mock must be given")

    this.expect = function (functionName) {
        var storedReturnValue;
        return {
            returns: function (returnValue) {
                return new Promise(function (fulfill, reject) {
                    try {
                        validateStringToBeGiven(returnValue, "Invalid mock")
                    } catch (err) {
                        reject(err)
                    }
                    var theMock = {
                        verb: "get",
                        serviceUrl: itsConnectorToMock.findServiceUrlFor(functionName),
                        mockFile: JSON.parse(returnValue),
                        latency: 10,
                        contentType: "anythingyouwant"
                    }

                    itsApimockerConnector.setMock(theMock).then(function (result) {
                            fulfill(result)
                        },
                        function (err) {
                            reject(err)
                        })
                });
            }
        }
    }

    function validateStringToBeGiven(parameter, message) {
        if (parameter == null || !parameter.trim()) {
            throw new ArgumentException(message)
        }
        return parameter;
    }

    function validateToBeGiven(parameter, message) {
        if (parameter == null || parameter == undefined) {
            throw new ArgumentException(message)
        }
        return parameter;
    }
}

module.exports = ApiMocker