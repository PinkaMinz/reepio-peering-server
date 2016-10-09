///<reference path="../typings/index.d.ts"/>

import {CLILaunchOptionsProvider} from "./CLILaunchOptionsProvider";

let cliOptsProvider = new CLILaunchOptionsProvider();
let opts = cliOptsProvider.options;

console.log( opts );