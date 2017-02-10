var PipelineRepository = require("../../../../src/middleware/ci/pipelines/pipelineRepository.js");
var expect = require("chai").expect;


describe("A PipelineRepository", function () {

    var aPipelineProvider
    var aSecondPipelineProvider
    var aPipelineRepository

    beforeEach(function () {
        aPipelineRepository = new PipelineRepository()
        aPipelineProvider = {id: "1", name: "provider1"}
        aSecondPipelineProvider = {id: "2", name: "provider2"}
    });

    it("should register a pipeline provider", function () {
        aPipelineRepository.adds(aPipelineProvider)

        expect(aPipelineRepository.has(aPipelineProvider)).to.be.true;
    });

    it("should register a second pipeline provider", function () {
        aPipelineRepository.adds(aPipelineProvider)
        aPipelineRepository.adds(aSecondPipelineProvider)

        expect(aPipelineRepository.has(aPipelineProvider)).to.be.true;
        expect(aPipelineRepository.has(aSecondPipelineProvider)).to.be.true;
    });

    it("should not register a pipeline provider twice", function () {
        aPipelineRepository.adds(aPipelineProvider)
        aPipelineRepository.adds(aPipelineProvider)

        expect(aPipelineRepository.has(aPipelineProvider)).to.be.true;
    });

    it("should remove a pipeline provider", function () {
        aPipelineRepository.adds(aPipelineProvider)
        aPipelineRepository.adds(aSecondPipelineProvider)
        aPipelineRepository.removes(aPipelineProvider)

        expect(aPipelineRepository.has(aPipelineProvider)).to.be.false;
        expect(aPipelineRepository.has(aSecondPipelineProvider)).to.be.true;
    });

    it("should remove a not registered pipeline provider silently", function () {
        aPipelineRepository.removes(aPipelineProvider)

        expect(aPipelineRepository.has(aPipelineProvider)).to.be.false;
    });

    it("should list all registered pipeline providers", function () {
        aPipelineRepository.adds(aPipelineProvider)
        aPipelineRepository.adds(aSecondPipelineProvider)

        expect(aPipelineRepository.list()).to.have.members([aPipelineProvider, aSecondPipelineProvider])
    });

    it("should list all pipelines grouped by provider in alphabetical order", function () {
        aPipelineRepository.adds(aSecondPipelineProvider)
        aPipelineRepository.adds(aPipelineProvider)

        var expectedList = {}
        expectedList[aPipelineProvider.name] = {} //aPipelineProvider.pipelines()
        expectedList[aSecondPipelineProvider.name] = {} //aSecondPipelineProvider.pipelines()

        expect(aPipelineRepository.pipelines()).to.be.equal(expectedList)
    });
});