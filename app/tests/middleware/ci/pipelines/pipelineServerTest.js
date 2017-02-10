var PipelineServer = require("../../../../src/middleware/ci/pipelines/pipelineServer.js");
var chai = require("chai");
var sinon = require("sinon")
var sinonChai = require("sinon-chai")
var chaiAsPromised = require("chai-as-promised")
var expect = chai.expect
chai.use(sinonChai)
chai.use(chaiAsPromised)


describe("A PipelineServer", function () {

    var aPipelineServer
    var aPipeline
    var aSecondPipeline

    beforeEach(function () {
        aPipelineServer = new PipelineServer()
        aPipeline = {id: "p1", name: "gerrit"}
        aSecondPipeline = {id: "p2", name: "conti"}
    });

    it("should register a pipeline", function () {
        aPipelineServer.adds(aPipeline)

        expect(aPipelineServer.has(aPipeline)).to.be.true;
    });

    it("should register a second pipeline server", function () {
        aPipelineServer.adds(aPipeline)
        aPipelineServer.adds(aSecondPipeline)

        expect(aPipelineServer.has(aPipeline)).to.be.true;
        expect(aPipelineServer.has(aSecondPipeline)).to.be.true;
    });

    it("should not register a pipeline server twice", function () {
        aPipelineServer.adds(aPipeline)
        aPipelineServer.adds(aPipeline)

        expect(aPipelineServer.has(aPipeline)).to.be.true;
    });

    it("should remove a pipeline server", function () {
        aPipelineServer.adds(aPipeline)
        aPipelineServer.adds(aSecondPipeline)
        aPipelineServer.removes(aPipeline)

        expect(aPipelineServer.has(aPipeline)).to.be.false;
        expect(aPipelineServer.has(aSecondPipeline)).to.be.true;
    });

    it("should remove a not registered pipeline server silently", function () {
        aPipelineServer.removes(aPipeline)

        expect(aPipelineServer.has(aPipeline)).to.be.false;
    });

    it("should list all registered pipelines", function () {
        aPipelineServer.adds(aPipeline)
        aPipelineServer.adds(aSecondPipeline)

        expect(aPipelineServer.list()).to.have.members([aPipeline, aSecondPipeline])
    });
})
;