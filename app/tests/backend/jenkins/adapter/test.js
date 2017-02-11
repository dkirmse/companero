var JenkinsConnector = require("../../../../src/backend/jenkins/adapter/jenkins.js");
var ApiMockerConnector = require("../../../utils/apimocker/adapter/apimocker.js");
var ApiMocker = require("../../../utils/apimocker/apimocker.js");

var process = require("process")

var expect = require("chai").expect;
var async = require("async");
var Promise = require("bluebird");
var ArgumentException = require("../../../../src/common/errors").ArgumentException
var ConnectionException = require("../../../../src/common/errors").ConnectionException


describe("Jenkins Adapter", function () {
    var jenkinsName = "some jenkins";
    var jenkinsUrl = process.env.TEST_JENKINS;
    var fakeJenkinsUrl = process.env.FAKE_JENKINS;
    var theJenkins;
    var theFakeJenkins;

    beforeEach(function () {
        theJenkins = new JenkinsConnector(jenkinsName, jenkinsUrl);
        theFakeJenkins = new JenkinsConnector(jenkinsName, fakeJenkinsUrl);

        theFakeApisConnector = new ApiMockerConnector(jenkinsName, fakeJenkinsUrl);
        theFakeApisConnector.start().then(function (results) {
            },
            function (error) {
                fail(error)
            }
        );
        theFakeApi = new ApiMocker(theFakeApisConnector, theFakeJenkins);
    });

    afterEach(function () {
        theFakeApisConnector.stop().then(function (results) {
                console.log(results);
            },
            function (error) {
                fail(error)
            }
        );
    })

    var fail = function (error) {
        console.log(error);
        expect(error).to.be.undefined
    }

    it("must throw when name not given", function () {
        var constructor = function () {
            new JenkinsConnector(null, jenkinsUrl)
        }
        expect(constructor).to.throw(ArgumentException, /Name must be given/);
    });

    it("must throw when name undefined", function () {
        var constructor = function () {
            new JenkinsConnector(undefined, jenkinsUrl)
        }
        expect(constructor).to.throw(ArgumentException, /Name must be given/);
    });

    it("must throw when name empty", function () {
        var constructor = function () {
            new JenkinsConnector(' ', jenkinsUrl)
        }
        expect(constructor).to.throw(ArgumentException, /Name must be given/);
    });

    it("should provide name of the Jenkins", function () {
        expect(theJenkins.name()).to.equal(jenkinsName);
    });

    it("must throw when url not given", function () {
        var constructor = function () {
            new JenkinsConnector(jenkinsName, null)
        }
        expect(constructor).to.throw(ArgumentException, /URL must be given/);
    });

    it("must throw when url undefined", function () {
        var constructor = function () {
            new JenkinsConnector(jenkinsName, undefined)
        }
        expect(constructor).to.throw(ArgumentException, /URL must be given/);
    });

    it("must throw when url empty", function () {
        var constructor = function () {
            new JenkinsConnector(jenkinsName, ' ')
        }
        expect(constructor).to.throw(ArgumentException, /URL must be given/);
    });

    it("should provide url of the Jenkins", function () {
        expect(theJenkins.url()).to.equal(jenkinsUrl);
    });

    it("should provide a list of jobs known to the jenkins", function () {
        console.log("test body")
        var jobList = [];
        theFakeApi.expect("jobs").returns(twoJobs).then(function (results, error) {
                return theFakeJenkins.jobs().then(function (results) {
                jobList = jobList.concat(results)
                console.log(results);
                expect(jobList).to.be.not.empty;
                    },
                    function (error) {
                        fail(error)
                    }
                )
            },
            function (error) {
                fail(error)
            }
        )
        console.log("test body")
    });

    it("should provide empty list of jobs when getting invalid list of jobs", function () {
        var jobList = [];
        theFakeApi.expect("jobs").returns(anInvalidJobList).then(
            function (results) {
                return theFakeJenkins.jobs().then(function (results) {
                        jobList = jobList.concat(results)
                        console.log("Fake: " + results);
                        expect(jobList).to.be.empty;
                    },
                    function (error) {
                        fail(error)
                    })
            },
            function (error) {
                fail(error)
            }
        )
    });

    it("must throw when getting list of jobs from invalid URL", function () {
        var jobList = [];
        var invalidJenkins = new JenkinsConnector(jenkinsName, 'some.place.com');
        return invalidJenkins.jobs().then(function (results) {
                expect(1).to.be.false
            },
            function (error) {
                expect(error).to.be.instanceOf(ConnectionException, /Could not connect to Jenkins/)
            }
        )
    });

    it("should return undefined as service url for unknown api function", function () {
        expect(theFakeJenkins.findServiceUrlFor("someFantasyFunction")).to.be.undefined
    })

    it("should return '/api/json' as service url for unknown api function", function () {
        expect(theFakeJenkins.findServiceUrlFor("jobs")).to.equal("/api/json")
    })
});


var twoJobs =
    "[ { \"actions\": {}, \
    \"description\": \"\", \
    \"displayName\": \"Adhoc_Job_Deploy\"}]"

var anInvalidJobList =
    "[ { \"actions\": {}, \
    \"description\": \"\", \]"
/*, \
 displayNameOrNull: null, \
 name: '
 Adhoc_Job_Deploy
 ', \
 url: '
 https://diaasjenkins-cockpit-prod.mo.sap.corp/job/Adhoc_Job_Deploy/', \
 buildable: true,
 \
 builds: {
 }
 , \
 color: 'red',
 \
 firstBuild: {
 }
 , \
 healthReport: {
 }
 , \
 inQueue: false,
 \
 keepDependencies: false,
 \
 lastBuild: {
 }
 , \
 lastCompletedBuild: {
 }
 , \
 lastFailedBuild: {
 }
 , \
 lastStableBuild: {
 }
 , \
 lastSuccessfulBuild: {
 }
 , \
 lastUnstableBuild: null,
 \
 lastUnsuccessfulBuild: {
 }
 , \
 nextBuildNumber: 5,
 \
 property: {
 }
 , \
 queueItem: null,
 \
 concurrentBuild: false,
 \
 downstreamProjects: [],
 \
 scm: {
 }
 , \
 upstreamProjects: []
 }, \
 {
 actions: {
 }
 , \
 description: 'Create ChangeLog manually, select all commits for repo between \'since\' and \'until\' and write to output file (relative in workspace or absolute in product landscape, e.g. /var/mnt/hdipool).', \
 displayName: 'ChangeLogGeneration', \
 displayNameOrNull: null, \
 name: 'ChangeLogGeneration', \
 url: 'https://diaasjenkins-cockpit-prod.mo.sap.corp/job/ChangeLogGeneration/', \
 buildable: false, \
 builds: {
 }
 , \
 color: 'disabled', \
 firstBuild: {
 }
 , \
 healthReport: {
 }
 , \
 inQueue: false, \
 keepDependencies: false, \
 lastBuild: {
 }
 , \
 lastCompletedBuild: {
 }
 , \
 lastFailedBuild: null, \
 lastStableBuild: {
 }
 , \
 lastSuccessfulBuild: {
 }
 , \
 lastUnstableBuild: null, \
 lastUnsuccessfulBuild: null, \
 nextBuildNumber: 9, \
 property: {
 }
 , \
 queueItem: null, \
 concurrentBuild: false, \
 downstreamProjects: [], \
 scm: {
 }
 , \
 upstreamProjects: []
 }
 ]
 "
 */