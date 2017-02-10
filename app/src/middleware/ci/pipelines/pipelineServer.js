var utils = require("lodash/core")

function PipelineServer() {
    var pipelines = [];

    this.has = function (aPipeline) {
        return pipelines.filter(function (pipeline) {
                return utils.isEqual(pipeline, aPipeline)
            }).length == 1
    }

    this.adds = function (aPipeline) {
        if (!this.has(aPipeline)) {
            pipelines.push(aPipeline)
        }
    }

    this.removes = function (aPipeline) {
        pipelines.splice(pipelines.indexOf(aPipeline), 1)
    }

    this.list = function () {
        return pipelines
    }
};

module.exports = PipelineServer;
