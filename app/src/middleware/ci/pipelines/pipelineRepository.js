var utils = require("lodash/core")

function PipelineRepository() {
    var pipelineProviders = [];

    this.has = function (aPipelineProvider) {
        return pipelineProviders.filter(function (pipelineProvider) {
                return utils.isEqual(pipelineProvider, aPipelineProvider)
            }).length == 1
    }

    this.adds = function (aPipelineProvider) {
        if (!this.has(aPipelineProvider)) {
            pipelineProviders.push(aPipelineProvider)
        }
    }

    this.removes = function (aPipelineProvider) {
        pipelineProviders.splice(pipelineProviders.indexOf(aPipelineProvider), 1)
    }

    this.list = function () {
        return pipelineProviders
    }

    this.pipelines = function () {

    }
};

module.exports = PipelineRepository;
