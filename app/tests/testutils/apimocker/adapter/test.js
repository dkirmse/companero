var ApiMockerConnector = require("../../../utils/apimocker/adapter/apimocker.js");
var expect = require("chai").expect;
var ArgumentException = require("../../../../src/common/errors").ArgumentException
var ConnectionException = require("../../../../src/common/errors").ConnectionException


describe("ApiMocker Adapter", function () {
    var apiName = "fakeJenkins";
    var apiBaseUrl = "http://localhost:8080";
    var theFakeApi;

    beforeEach(function () {
        theFakeApi = new ApiMockerConnector(apiName, apiBaseUrl);
        theFakeApi.start().then(function (results) {
                console.log("Mock Server: " + results)
            },
            function (error) {
                console.log(error);
                expect(error).to.be.undefined
            }
        );

    });

    afterEach(function () {
        theFakeApi.stop().then(function (results) {
                console.log(results);
            },
            function (error) {
                expect(error).to.be.undefined
            }
        );
    })

    it("must throw when name not given", function () {
        var constructor = function () {
            new ApiMockerConnector(null, apiBaseUrl)
        }
        expect(constructor).to.throw(ArgumentException, /Name must be given/);
    });

    it("must throw when name undefined", function () {
        var constructor = function () {
            new ApiMockerConnector(undefined, apiBaseUrl)
        }
        expect(constructor).to.throw(ArgumentException, /Name must be given/);
    });

    it("must throw when name empty", function () {
        var constructor = function () {
            new ApiMockerConnector(' ', apiBaseUrl)
        }
        expect(constructor).to.throw(ArgumentException, /Name must be given/);
    });

    it("should provide name of the Api", function () {
        expect(theFakeApi.name()).to.equal(apiName);
    });

    it("must throw when url not given", function () {
        var constructor = function () {
            new ApiMockerConnector(apiName, null)
        }
        expect(constructor).to.throw(ArgumentException, /URL must be given/);
    });

    it("must throw when url undefined", function () {
        var constructor = function () {
            new ApiMockerConnector(apiName, undefined)
        }
        expect(constructor).to.throw(ArgumentException, /URL must be given/);
    });

    it("must throw when url empty", function () {
        var constructor = function () {
            new ApiMockerConnector(apiName, ' ')
        }
        expect(constructor).to.throw(ArgumentException, /URL must be given/);
    });

    it("should provide url of the Api", function () {
        expect(theFakeApi.url()).to.equal(apiBaseUrl);
    });

    it("should set a mock reply at the api mocker service", function () {
        var theMock = {
            verb: "get",
            serviceUrl: "third",
            mockFile: {},
            latency: 100,
            contentType: "anythingyouwant"
        }
        return theFakeApi.setMock(theMock)
            .then(function (results) {
                    console.log(results);
                },
                function (error) {
                    expect(error).to.be.undefined
                }
            );
    })
    ;

    it("must reject when configuring with empty json", function () {
        return theFakeApi.setMock("{}").then(function (results) {
                expect(results).to.be.undefined
            },
            function (error) {
                expect(error).to.be.instanceOf(ArgumentException, /Invalid mock/)
            }
        )
    });

    it("must reject when configuring with undefined json", function () {
        return theFakeApi.setMock(undefined).then(function (results) {
                expect(results).to.be.undefined
            },
            function (error) {
                expect(error).to.be.instanceOf(ArgumentException, /Invalid mock/)
            }
        )
    });

    it("must reject when configuring with null json", function () {
        return theFakeApi.setMock(null).then(function (results) {
                expect(results).to.be.undefined
            },
            function (error) {
                expect(error).to.be.instanceOf(ArgumentException, /Invalid mock/)
            }
        )
    });

    it("must throw when configuring at invalid URL", function () {
        var invalidApiMocker = new ApiMockerConnector(apiName, 'some.place.com');
        return invalidApiMocker.setMock("{}").then(function (results) {
                expect(results).to.be.undefined
            },
            function (error) {
                console.log(error)
                expect(error).to.be.instanceOf(ConnectionException, /Invalid URI/)
            }
        )
    });
})
;