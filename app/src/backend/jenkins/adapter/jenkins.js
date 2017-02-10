var async = require("async");
var Promise = require("bluebird");
var ArgumentException = require("../../common/errors").ArgumentException
var ConnectionException = require("../../common/errors").ConnectionException

function JenkinsConnector(name, url) {
    if (!(this instanceof JenkinsConnector)) {
        return new JenkinsConnector(name, url);
    }

    var pathMap = {
        jobs: "/api/json"
    }
    var itsName = validateToBeGiven(name, "Name must be given");
    var itsUrl = validateToBeGiven(url, "URL must be given");

    var theJenkins = require('jenkins')({
        baseUrl: /*"http://127.0.0.1:8888" */itsUrl,
        crumbIssuer: true,
        promisify: true
    });

    this.findServiceUrlFor = function (functionName) {
        return pathMap[functionName]
    }

    this.jobs = function () {
        return new Promise(function (fulfill, reject) {
            theJenkins.info({depth: 2},
                function (err, data) {
                    console.log("------------------------------------------")
                    console.log(data)
                    console.log("------------------------------------------")
                    if (err) {
                        if (err.code == 'ECONNREFUSED') {
                            reject(new ConnectionException("Could not connect to Jenkins '" + itsUrl + '"'))
                        }
                        else {
                            reject(err);
                        }
                    }
                    else fulfill(data.jobs);
                }
            )
        })
    };

    this.name = function () {
        return itsName
    };

    this.url = function () {
        return itsUrl
    };

    function validateToBeGiven(parameter, message) {
        if (parameter == null || !parameter.trim()) {
            throw new ArgumentException(message)
        }
        return parameter;
    }
};

module.exports = JenkinsConnector;
