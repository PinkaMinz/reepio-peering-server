"use strict";
var commander = require("commander");
var fs = require("fs");
var CLILaunchOptionsProvider = (function () {
    function CLILaunchOptionsProvider(argv) {
        if (argv === void 0) { argv = process.argv; }
        this.argv = argv;
    }
    Object.defineProperty(CLILaunchOptionsProvider.prototype, "options", {
        get: function () {
            if (!this._options) {
                this._options = this.readOptionsFromArgv();
            }
            return this._options;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * parses process.argv and generates launch options
     */
    CLILaunchOptionsProvider.prototype.readOptionsFromArgv = function () {
        commander.version("2.0.0");
        commander.description("The reep.io peering server.\n  Listens for incoming connections " +
            "on [host]:[port]/[path] and returns a url with a unique token to the " +
            "client. \n  The client can use the token to share with peers and " +
            "establish a RTCPeerConnection between them.");
        commander.usage("[options] <cert-file>");
        commander.option("--host [host]", "hostname", "127.0.0.1");
        commander.option("--path [path]", "url suffix", "/");
        commander.option("--port <n>", "port", parseInt, 9100);
        commander.option("--limit-connections <n>", "limit connections per ip address (0 to disable)", parseInt, 0);
        commander.option("--limit-requests <n>", "limit requests per ip address per second (0 to disable)", parseInt, 0);
        commander.action(this.action.bind(this));
        commander.parse(this.argv);
        if (!this.cert) {
            throw new Error("no cert-file given or not readable");
        }
        return {
            host: commander["host"],
            port: commander["port"],
            path: commander["path"],
            cert: this.cert,
            limits: {
                connections: commander["limitConnections"],
                requests: commander["limitRequests"],
            }
        };
    };
    /**
     * parses the required cli arguments
     * @param certFile
     */
    CLILaunchOptionsProvider.prototype.action = function (certFile) {
        this.cert = fs.readFileSync(certFile).toString();
    };
    return CLILaunchOptionsProvider;
}());
exports.CLILaunchOptionsProvider = CLILaunchOptionsProvider;
//# sourceMappingURL=CLILaunchOptionsProvider.js.map