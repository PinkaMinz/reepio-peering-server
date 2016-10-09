import {ILaunchOptionsProvider} from "./ILaunchOptionsProvider";
import {ILaunchOptions} from "./ILaunchOptions";
import * as commander from "commander";
import * as fs from "fs";

export class CLILaunchOptionsProvider implements ILaunchOptionsProvider {
    protected cert:string;
    private _options:ILaunchOptions;

    get options():ILaunchOptions {
        if ( !this._options ) {
            this._options = this.readOptionsFromArgv();
        }

        return this._options;
    }

    constructor( protected argv = process.argv ) {
    }

    /**
     * parses process.argv and generates launch options
     */
    private readOptionsFromArgv():ILaunchOptions {
        commander.version( "2.0.0" );
        commander.description( "The reep.io peering server.\n  Listens for incoming connections " +
            "on [host]:[port]/[path] and returns a url with a unique token to the " +
            "client. \n  The client can use the token to share with peers and " +
            "establish a RTCPeerConnection between them." );
        commander.usage( "[options] <cert-file>" );
        commander.option( "--host [host]", "hostname", "127.0.0.1" );
        commander.option( "--path [path]", "url suffix", "/" );
        commander.option( "--port <n>", "port", parseInt, 9100 );
        commander.option( "--limit-connections <n>",
            "limit connections per ip address (0 to disable)", parseInt, 0 );
        commander.option( "--limit-requests <n>",
            "limit requests per ip address per second (0 to disable)", parseInt, 0 );
        commander.action( this.action.bind( this ) );
        commander.parse( this.argv );

        if ( !this.cert ) {
            throw new Error( `no cert-file given or not readable` );
        }

        return {
            host: commander[ "host" ],
            port: <number>commander[ "port" ],
            path: commander[ "path" ],
            cert: this.cert,
            limits: {
                connections: <number>commander[ "limitConnections" ],
                requests: <number>commander[ "limitRequests" ],
            }
        };
    }

    /**
     * parses the required cli arguments
     * @param certFile
     */
    private action( certFile:string ) {
        this.cert = fs.readFileSync( certFile ).toString();
    }
}