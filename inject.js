import { aquired_servers } from "utils";

var ns;
const default_target = 'n00dles';

let zero_systems;
let one_systems;
let script;
let target;


/** @param {NS} ns */
export async function main(ns) {
    init(ns);

    let admin_servers = aquired_servers();
    for (const hostname_ of admin_servers) {
        injectScript(script, hostname_);
        startScript(script, target)
    }
}

function init(ns_) {
    ns = ns_;
    zero_systems = [];
    one_systems = [];

    // Parse script arg
    script = ns.args[0];
    if (script === undefined || !ns.fileExists(script)) {
        ns.tprintf('[ERR]  - Unknown script file');
        printUsage();
        ns.exit();
    }

    // Parse target arg
    const target_arg = ns.args[1]
    if (target_arg === undefined) {
        printUsage()
        ns.tprintf(`[WRN] - No target specified, using target '${default_target}'`);
        target = default_target;
    } else {
        target = target_arg;
    }
}

function injectScript(scripts, host) {
    try {
        ns.scp(script_name);
    } catch (err) {
        const err_msg = String(err);
        ns.tprint(`Error injecting script '${scripts}' to '${host}'`);
        ns.tprint(err_msg);
    }
}

function startScript(script_name, target_hostname) {
    const pid = ns.exec(script_name, target_hostname);
    if (pid !== 0) {
        ns.tprintf(`[ERR] - Unable to start script on ${target_hostname}`);
    }
}

function printUsage() {
    ns.tprintf('Usage:  ');
    ns.tprintf('        run inject.js script.js n00dles');
    ns.tprintf('        run inject.js hack.js');
}

// const aquired_servers = function () {
//     const all = ns.scan('home');
//     let roots = []
//     for (const _hostname of Array.all(all)) {
//         const server = ns.getServer(_hostname);
//         if (server.hasAdminRights) { roots.push(server.hostname); };
//     }
//     return roots;
// }