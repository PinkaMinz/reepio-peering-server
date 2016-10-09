///<reference path="../typings/index.d.ts"/>
"use strict";
var mockery = require("mockery");
var sinon = require("sinon");
var mock = require("mock-fs");
require("jasmine-sinon");
describe("CLILaunchOptionsProvider", function () {
    /**
     * @type CLILaunchOptionsProvider
     */
    var provider;
    var CLILaunchOptionsProvider;
    describe("with existing key file", function () {
        var commandMock;
        var fsMock;
        beforeEach(function () {
            commandMock = sinon.createStubInstance(require("commander").Command);
            commandMock.action.yields("/cert-file.pem");
            fsMock = mock.fs({
                "/cert-file.pem": "data"
            });
            mockery.enable({ useCleanCache: true });
            mockery.registerAllowable("../build/CLILaunchOptionsProvider");
            mockery.registerMock("fs", fsMock);
            mockery.registerMock("commander", commandMock);
            CLILaunchOptionsProvider = require("../build/CLILaunchOptionsProvider")
                .CLILaunchOptionsProvider;
            provider = new CLILaunchOptionsProvider();
        });
        afterEach(function () {
            mockery.deregisterAll();
            mockery.disable();
        });
        it("should read the cert from a cert-file", function () {
            expect(provider.options.cert).toEqual("data");
        });
        it("should parse port", function () {
            commandMock.port = 1000;
            expect(provider.options.port).toEqual(1000);
            expect(commandMock.option.calledWith("--port <n>", sinon.match.string, parseInt, sinon.match.number)).toBe(true);
        });
        it("should parse host", function () {
            commandMock.host = "my.host";
            expect(provider.options.host).toEqual("my.host");
            expect(commandMock.option.calledWith("--host [host]", sinon.match.string, "127.0.0.1")).toBe(true);
        });
        it("should parse path", function () {
            commandMock.path = "/test-path";
            expect(provider.options.path).toEqual("/test-path");
            expect(commandMock.option.calledWith("--path [path]", sinon.match.string, "/")).toBe(true);
        });
        it("should parse --limit-connections", function () {
            commandMock.limitConnections = 1000;
            expect(provider.options.limits.connections).toEqual(1000);
            expect(commandMock.option.calledWith("--limit-connections <n>", sinon.match.string, parseInt, 0)).toBe(true);
        });
        it("should parse --limit-requests", function () {
            commandMock.limitRequests = 1000;
            expect(provider.options.limits.requests).toEqual(1000);
            expect(commandMock.option.calledWith("--limit-requests <n>", sinon.match.string, parseInt, 0)).toBe(true);
        });
    });
});
