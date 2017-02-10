var PipelineProvider = require("../../../../src/middleware/ci/pipelines/pipelineProvider.js");
var PipelineServer = require("../../../../src/middleware/ci/pipelines/pipelineServer.js");
var chai = require("chai");
var sinon = require("sinon")
var sinonChai = require("sinon-chai")
var chaiAsPromised = require("chai-as-promised")
var expect = chai.expect
chai.use(sinonChai)
chai.use(chaiAsPromised)


describe("A PipelineProvider", function () {

    var aPipelineProvider
    var aPipelineServer
    var aSecondPipelineServer

    beforeEach(function () {
        aPipelineProvider = new PipelineProvider()
        aPipelineServer = new PipelineServer()
        aSecondPipelineServer = new PipelineServer()
    });

    it("should register a pipeline server", function () {
        aPipelineProvider.adds(aPipelineServer)

        expect(aPipelineProvider.has(aPipelineServer)).to.be.true;
    });

    it("should register a second pipeline server", function () {
        aPipelineProvider.adds(aPipelineServer)
        aPipelineProvider.adds(aSecondPipelineServer)

        expect(aPipelineProvider.has(aPipelineServer)).to.be.true;
        expect(aPipelineProvider.has(aSecondPipelineServer)).to.be.true;
    });

    it("should not register a pipeline server twice", function () {
        aPipelineProvider.adds(aPipelineServer)
        aPipelineProvider.adds(aPipelineServer)

        expect(aPipelineProvider.has(aPipelineServer)).to.be.true;
    });

    it("should remove a pipeline server", function () {
        aPipelineProvider.adds(aPipelineServer)
        aPipelineProvider.adds(aSecondPipelineServer)
        aPipelineProvider.removes(aPipelineServer)

        expect(aPipelineProvider.has(aPipelineServer)).to.be.false;
        expect(aPipelineProvider.has(aSecondPipelineServer)).to.be.true;
    });

    it("should remove a not registered pipeline server silently", function () {
        aPipelineProvider.removes(aPipelineProvider)

        expect(aPipelineProvider.has(aPipelineServer)).to.be.false;
    });

    it("should list all registered pipeline servers", function () {
        aPipelineProvider.adds(aPipelineServer)
        aPipelineProvider.adds(aSecondPipelineServer)

        expect(aPipelineProvider.list()).to.have.members([aPipelineServer, aSecondPipelineServer])
    });

    it("should list all pipelines in alphabetical order", function () {
        aPipelineProvider.adds(aSecondPipelineServer)

        var aPipelineServerStub = sinon.stub(aPipelineServer, "list")
        var aPipelineOne = {id: 1, name: "pipeline1"}
        var aPipelineTwo = {id: 2, name: "pipeline2"}
        aPipelineServerStub.returns([aPipelineOne, aPipelineTwo])

        var expectedList = {"pipeline1": aPipelineOne, "pipeline2": aPipelineTwo}

        expect(aPipelineProvider.pipelines()).to.be.equal(expectedList)
        aPipelineServer.list.restore()
    });

    it("should list all pipelines of two servers in alphabetical order", function () {
        aPipelineProvider.adds(aSecondPipelineServer)
        aPipelineProvider.adds(aPipelineServer)

        var expectedList = {}
        expectedList[aPipelineServer.name] = {} //aPipelineServer.pipelines()
        expectedList[aSecondPipelineServer.name] = {} //aSecondPipelineServer.pipelines()

        expect(aPipelineProvider.pipelines()).to.be.equal(expectedList)
    });

    it("should list all pipelines of two servers without duplicates", function () {
        aPipelineProvider.adds(aPipelineServer)
        aPipelineProvider.adds(aSecondPipelineServer)

        var expectedList = {}
        expectedList[aPipelineServer.name] = {} //aPipelineServer.pipelines()
        expectedList[aSecondPipelineServer.name] = {} //aSecondPipelineServer.pipelines()

        expect(aPipelineProvider.pipelines()).to.be.equal(expectedList)
    });
})
;