var ApiMockerConnector = require("../../utils/apimocker/adapter/apimocker.js");
var ApiMocker = require("../../utils/apimocker/apimocker.js");
var JenkinsConnector = require("../../../src/backend/jenkins/adapter/jenkins")
var chai = require("chai");
var ArgumentException = require("../../../src/common/errors").ArgumentException
var ConnectionException = require("../../../src/common/errors").ConnectionException
var sinon = require("sinon")
var sinonChai = require("sinon-chai")
var chaiAsPromised = require("chai-as-promised")
var expect = chai.expect
chai.use(sinonChai)
chai.use(chaiAsPromised)

describe("ApiMocker Adapter", function () {
    var apiName = "fakeJenkins";
    var apiBaseUrl = "http://localhost:8080";
    var theFakeApi;
    var theFakeApisConnector;
    var connectorToMock;

    beforeEach(function () {
        connectorToMock = new JenkinsConnector(apiName, apiBaseUrl)
        theFakeApisConnector = new ApiMockerConnector(apiName, apiBaseUrl);
        theFakeApi = new ApiMocker(theFakeApisConnector, connectorToMock);
    });

    it("must throw when api mocker connector not given", function () {
        var constructor = function () {
            new ApiMocker(null, connectorToMock)
        }
        expect(constructor).to.throw(ArgumentException, /Api mocker connector must be given/);
    });

    it("must throw when api mocker connector undefined", function () {
        var constructor = function () {
            new ApiMocker(undefined, connectorToMock)
        }
        expect(constructor).to.throw(ArgumentException, /Api mocker connector must be given/);
    });

    it("must throw when connector to mock not given", function () {
        var constructor = function () {
            new ApiMocker(theFakeApisConnector, null)
        }
        expect(constructor).to.throw(ArgumentException, /Connector to mock must be given/);
    });

    it("must throw when connector to mock undefined", function () {
        var constructor = function () {
            new ApiMocker(theFakeApisConnector, undefined, apiBaseUrl)
        }
        expect(constructor).to.throw(ArgumentException, /Connector to mock must be given/);
    });

    it("should set an empty mock reply at the api mocker service", function () {

        var setMockSpy = sinon.spy(theFakeApisConnector, "setMock")

        var theExpectedMock = {
            verb: "get",
            serviceUrl: "/api/json",
            mockFile: {},
            latency: 10,
            contentType: "anythingyouwant"
        }

        theFakeApi.expect("jobs").returns("{}")
        expect(setMockSpy).to.have.been.calledWith(theExpectedMock)
        setMockSpy.restore()
    });

    it("should set a mock reply at the api mocker service", function () {

        var setMockSpy = sinon.spy(theFakeApisConnector, "setMock")

        var theExpectedMock = {
            verb: "get",
            serviceUrl: "/api/json",
            mockFile: {
                id: "id1",
                name: "someName"
            },
            latency: 10,
            contentType: "anythingyouwant"
        }

        theFakeApi.expect("jobs").returns("{ \"id\": \"id1\", \"name\": \"someName\"}")
        expect(setMockSpy).to.have.been.calledWith(theExpectedMock)
        setMockSpy.restore()
    });

    it("must reject when configuring with undefined json", function () {
        expect(theFakeApi.expect("jobs").returns(undefined)).to.eventually.be.rejectedWith(ArgumentException, /Invalid mock/)
    });

    it("must reject when configuring with null json", function () {
        expect(theFakeApi.expect("jobs").returns(null)).to.eventually.be.rejectedWith(ArgumentException, /Invalid mock/)
    });

    it("must throw when configuring at invalid URL", function () {
        var invalidApisConnector = new ApiMockerConnector(apiName, "http://some.invalid.place");
        var invalidApiMocker = new ApiMocker(invalidApisConnector, connectorToMock);
        expect(theFakeApi.expect("jobs").returns("{}")).to.eventually.be.rejectedWith(ConnectionException, /Invalid URL/)
    });
})
;