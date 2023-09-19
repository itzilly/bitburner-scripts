import { setNs, getAllServers, aquired_servers } from "utils";
import { Logger } from "logger";

var logger = new Logger('info');

/** @param {NS} ns */
export async function main(ns) {
    init(ns);
    // unlockAll(ns);
    injectAll(ns);
    // await startPurchasingServers(ns);
}

function init(ns_) {
    setNs(ns_);
}

function unlockAll(ns) {
    let systems_unlocked = 0;
    let servers = getAllServers();
    const ignores = ['home', 'darkweb']
    servers = servers.filter(item => !ignores.includes(item));

    for (const target of servers) {
        if (ns.getServer(target).hasAdminRights) {
            logger.debug(`Found server with root privileges: '${target}'`)
        } else {
            logger.debug(`No root privileges for: '${target}'`)
            logger.debug(`Attempting to unlock: '${target}'`)

            ns.exec('unlock.js', home, {}, [target]);
            if (ns.getServer(target).hasAdminRights) {
                logger.debug(`Gained access to: '${target}'`)
                ++systems_unlocked;
            } else {
                logger.debug(`Unable to gain root privileges for: '${target}'`)
            }
        }

        logger.info(`Started scripts on ${systems_unlocked} systems`);

    }
}

function injectAll(ns) {
    const all = aquired_servers();
    const pservs = ns.getPurchasedServers();
    const servers = all.filter(server => !pservs.includes(server));

    for (const server of servers) {
        injectScript(ns, 'simplehack.js', server);
    }

}

function injectScript(ns, scripts, host) {
    try {
        ns.scp(script_name);
    } catch (err) {
        const err_msg = String(err);
        ns.tprint(`Error injecting script '${scripts}' to '${host}'`);
        ns.tprint(err_msg);
    }
}

async function startPurchasingServers(ns) {

}