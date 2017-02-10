var utils = require("lodash/core")

function PipelineProvider() {
    var pipelineServers = [];

    this.has = function (aPipelineServer) {
        return pipelineServers.filter(function (pipelineServer) {
                return utils.isEqual(pipelineServer, aPipelineServer)
            }).length == 1
    }

    this.adds = function (aPipelineServer) {
        if (!this.has(aPipelineServer)) {
            pipelineServers.push(aPipelineServer)
        }
    }

    this.removes = function (aPipelineServer) {
        pipelineServers.splice(pipelineServers.indexOf(aPipelineServer), 1)
    }

    this.list = function () {
        return pipelineServers
    }

    this.pipelines = function () {

    }
};

module.exports = PipelineProvider;
