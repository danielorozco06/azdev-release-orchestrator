import "mocha";

import * as chai from "chai";
import * as TypeMoq from "typemoq";

import * as ci from "azure-devops-node-api/interfaces/CoreInterfaces";
import * as ri from "azure-devops-node-api/interfaces/ReleaseInterfaces";
import * as bi from "azure-devops-node-api/interfaces/BuildInterfaces";

import { IParameters, IReleaseDetails, IOrchestrator, IHelper, IDeployer, ReleaseType } from "../interfaces";
import { Orchestrator } from "../orchestrator";

describe("Orchestrator", () => {

    const mockProject = {

        id: "My-Project-Id",
        name: "My-Project"

    } as ci.TeamProject;

    const mockDefinition = {

        id: 1,
        name: "My-Definition",

    } as ri.ReleaseDefinition;

    const mockRelease = {

        id: 1,
        name: "My-Release",
        artifacts: [
            
            {

                isPrimary: true,
                alias: "My-Artifact",
                definitionReference: {},

            } as ri.Artifact,

        ]

    } as ri.Release;

    const mockDetails = {

        projectName: "My-Orchestrator",
        releaseName: "My-Orchestrator-20180101-1",
        requesterName: "My-Requester",
        requesterId: "15b9b1f7-ae1b-47ec-81e2-7647c0f195dc",
        endpointName: "My-Endpoint",

    } as IReleaseDetails;

    const mockParameters = {

        projectId: "My-Project-Id",
        definitionId: "1",
        releaseId: "",
        releaseType: ReleaseType.Undefined,
        stages: [ "DEV", "TEST", "PROD" ],
        artifact: "",

    } as IParameters;

    let consoleLog = console.log;
    let helperMock = TypeMoq.Mock.ofType<IHelper>();
    let deployerMock = TypeMoq.Mock.ofType<IDeployer>();

    helperMock.setup(x => x.getProject(TypeMoq.It.isAnyString())).returns(() => Promise.resolve(mockProject));
    helperMock.setup(x => x.getDefinition(TypeMoq.It.isAnyString(), TypeMoq.It.isAnyNumber())).returns(() => Promise.resolve(mockDefinition));

    deployerMock.setup(x => x.deployAutomated(TypeMoq.It.isAny(), TypeMoq.It.isAny())).returns(() => Promise.resolve());
    deployerMock.setup(x => x.deployManual(TypeMoq.It.isAny(), TypeMoq.It.isAny())).returns(() => Promise.resolve());

    it("Should deploy new automated release", async () => {

        const parameters = mockParameters;
        parameters.releaseType = ReleaseType.Create;

        const orchestrator: IOrchestrator = new Orchestrator(helperMock.target, deployerMock.target);
        const orchestratorMock: TypeMoq.IMock<IOrchestrator> = TypeMoq.Mock.ofInstance(orchestrator);
        
        orchestratorMock.setup(x => x.getRelease(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny())).returns(() => Promise.resolve(mockRelease));
        helperMock.setup(x => x.isAutomated(TypeMoq.It.isAny())).returns(() => Promise.resolve(true));

        // Hide console output
        console.log = function(){};

        // Run orchestrator
        await orchestratorMock.target.deployRelease(parameters, mockDetails);

        // Restore console output
        console.log = consoleLog;
        
    });

    it("Should deploy new manual release", async () => {

        const parameters = mockParameters;
        parameters.releaseType = ReleaseType.Create;

        const orchestrator: IOrchestrator = new Orchestrator(helperMock.target, deployerMock.target);
        const orchestratorMock: TypeMoq.IMock<IOrchestrator> = TypeMoq.Mock.ofInstance(orchestrator);
        
        orchestratorMock.setup(x => x.getRelease(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny())).returns(() => Promise.resolve(mockRelease));
        helperMock.setup(x => x.isAutomated(TypeMoq.It.isAny())).returns(() => Promise.resolve(false));

        // Hide console output
        console.log = function(){};

        // Run orchestrator
        await orchestratorMock.target.deployRelease(parameters, mockDetails);

        // Restore console output
        console.log = consoleLog;
        
    });

    it("Should re-deploy existing release", async () => {

        const parameters = mockParameters;
        parameters.releaseId = "1";
        parameters.releaseType = ReleaseType.Specific;

        const orchestrator: IOrchestrator = new Orchestrator(helperMock.target, deployerMock.target);
        const orchestratorMock: TypeMoq.IMock<IOrchestrator> = TypeMoq.Mock.ofInstance(orchestrator);

        orchestratorMock.setup(x => x.getRelease(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny())).returns(() => Promise.resolve(mockRelease));

        // Hide console output
        console.log = function(){};

        await orchestratorMock.target.deployRelease(parameters, mockDetails);

        // Restore console output
        console.log = consoleLog;
        
    });

    it("Should create new release", async () => {

        const parameters = mockParameters;
        parameters.releaseType = ReleaseType.Create;

        helperMock.setup(x => x.createRelease(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny())).returns(() => Promise.resolve(mockRelease));

        const orchestrator: IOrchestrator = new Orchestrator(helperMock.target, deployerMock.target);

        const result = await orchestrator.getRelease(parameters.releaseType, mockProject, mockDefinition, mockDetails, mockParameters);

        chai.expect(result).not.null;
        chai.expect(result.id).eq(mockRelease.id);
        chai.expect(result.name).eq(mockRelease.name);

    });

    it("Should get specific release", async () => {

        const parameters = mockParameters;
        parameters.releaseId = "1";
        parameters.releaseType = ReleaseType.Specific;

        helperMock.setup(x => x.getRelease(TypeMoq.It.isAny(), TypeMoq.It.isAnyNumber(), TypeMoq.It.isAny())).returns(() => Promise.resolve(mockRelease));

        const orchestrator: IOrchestrator = new Orchestrator(helperMock.target, deployerMock.target);

        const result = await orchestrator.getRelease(parameters.releaseType, mockProject, mockDefinition, mockDetails, mockParameters);

        chai.expect(result).not.null;
        chai.expect(result.id).eq(mockRelease.id);
        chai.expect(result.name).eq(mockRelease.name);

    });

    it("Should get latest release", async () => {

        const parameters = mockParameters;
        parameters.releaseType = ReleaseType.Latest;

        helperMock.setup(x => x.findRelease(TypeMoq.It.isAny(), TypeMoq.It.isAnyNumber(), TypeMoq.It.isAny())).returns(() => Promise.resolve(mockRelease));

        const orchestrator: IOrchestrator = new Orchestrator(helperMock.target, deployerMock.target);

        const result = await orchestrator.getRelease(parameters.releaseType, mockProject, mockDefinition, mockDetails, mockParameters);

        chai.expect(result).not.null;
        chai.expect(result.id).eq(mockRelease.id);
        chai.expect(result.name).eq(mockRelease.name);

    });

    it("Should get release matching tag filter", async () => {

        const parameters = mockParameters;
        parameters.releaseType = ReleaseType.Latest;
        parameters.releaseTag = [ "My-Release-Tag" ];

        const release = mockRelease;
        release.tags = parameters.releaseTag;

        helperMock.setup(x => x.findRelease(TypeMoq.It.isAny(), TypeMoq.It.isAnyNumber(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny())).returns(() => Promise.resolve(release));

        const orchestrator: IOrchestrator = new Orchestrator(helperMock.target, deployerMock.target);

        const result = await orchestrator.getRelease(parameters.releaseType, mockProject, mockDefinition, mockDetails, mockParameters);

        chai.expect(result).not.null;
        chai.expect(result.id).eq(mockRelease.id);
        chai.expect(result.name).eq(mockRelease.name);
        chai.expect(result.tags).eq(parameters.releaseTag);

    });

    it("Should get release matching artifact tag filter", async () => {

        const parameters = mockParameters;
        parameters.releaseType = ReleaseType.Latest;
        parameters.artifactTag = [ "My-Artifact-Tag" ];

        const release = mockRelease;

        const buildMock: bi.Build = {

            id: 1,
            buildNumber: "My-Build-Number",

        } as bi.Build;

        const versionReferenceMock = {

            id: "1",
            name: "My-Artifact-Name",

        } as ri.ArtifactSourceReference;

        const definitionReferenceMock = {

            id: "1",
            name: "My-Definition-Name",

        } as ri.ArtifactSourceReference;
        
        release.artifacts[0].definitionReference = {

            definition: definitionReferenceMock,
            version: versionReferenceMock,
        
        };

        helperMock.setup(x => x.findRelease(TypeMoq.It.isAny(), TypeMoq.It.isAnyNumber(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny())).returns(() => Promise.resolve(mockRelease));
        helperMock.setup(x => x.getArtifactDefinition(TypeMoq.It.isAny())).returns(() => Promise.resolve(definitionReferenceMock));
        helperMock.setup(x => x.findBuild(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny())).returns(() => Promise.resolve(buildMock));

        const orchestrator: IOrchestrator = new Orchestrator(helperMock.target, deployerMock.target);

        const result = await orchestrator.getRelease(parameters.releaseType, mockProject, mockDefinition, mockDetails, mockParameters);

        chai.expect(result).not.null;
        chai.expect(result.id).eq(mockRelease.id);
        chai.expect(result.name).eq(mockRelease.name);
        chai.expect(result.artifacts[0].definitionReference.version.id).eq(String(buildMock.id));

    });

});