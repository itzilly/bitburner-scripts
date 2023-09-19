import { setNs, aquired_servers, getAllServers } from "utils";
import { Logger } from "logger";

var ns;
var logger;
var mode;


/** @param {NS} ns */
export async function main(ns) {
    init(ns);
    
    if (mode === undefined) {
        printUsage()
        logger.panic('Undefined Args');
    } else if (mode === '-a') {
        unlockAll();
        return;
    } else {
        const target = mode;
        unlockTarget(target);
    }
}

function init(ns_) {
    ns = ns_;
    setNs(ns);
    logger = new Logger(ns, 'debug');
    mode = ns.args[0];
}

function unlockAll() {
    let servers =  getAllServers();
    const roots = aquired_servers().concat(['home', 'darkweb']);
    let gained_servers = [];
    let locked_servers = [];

    // Get all the servers that we havent hacked
    servers = servers.filter(item => !roots.includes(item));

    for (const hostname_ of servers) {
        const server = ns.getServer(hostname_);
        if (!server.hasAdminRights) {
            attack(server.hostname);
            if (ns.hasRootAccess(server.hostname)) { gained_servers.push(server.hostname); }
            else { locked_servers.push(server.hostname); }
        }
    }
}

function unlockTarget(target) {
    let servers =  getAllServers();
    const roots = aquired_servers().concat(['home', 'darkweb']);
    servers = servers.filter(item => !roots.includes(item));

    let target_server;

    try {
        target_server = ns.getServer(target);
    } catch (err) {
        printUsage();
        logger.panic(`Unknown hostname or error: '${target}'`);
    }
    
    const hostname = target_server.hostname;
    if (target_server.hasAdminRights) {
        logger.info(`You already have root privileges to '${hostname}'`);
        return;
    }

    attack(hostname);
    if (target_server.hasAdminRights) {
        logger.error(`Could not gain root privileges '${hostname}'`);
        return;
    }
    
    logger.info(`Gained root privileges to '${hostname}'`);
}

function attack(host) {
    try {
        ns.brutessh(host);
        ns.ftpcrack(host);
        ns.relaysmtp(host);
        ns.httpworm(host);
        ns.sqlinject(host);
    } catch (err) {
        ns.nuke(host);
    }
}

function printUsage() {
    ns.tprintf('Usage:  ');
    ns.tprintf('        run unlock.js n00dles  | Attemps to gain root access of a specific target');
    ns.tprintf('        run unlock.js -a       | Attemps to gain root access of all known servers');
}

// function getAllServers(list = new Set()) {
//     let scan = ns.scan();
//     let all = scan.filter(s => !list.has(s));
//     all.forEach(sub => {
//         list.add(sub);
//         return all_servers(sub, list);
//     });
//     return Array.from(list.keys())
// }
// 
// const aquired_servers = function () {
//     const all = ns.scan('home');
//     let roots = []
//     for (const _hostname of Array.all(all)) {
//         const server = ns.getServer(_hostname);
//         if (server.hasAdminRights) { roots.push(server.hostname); };
//     }
//     return roots;
// }