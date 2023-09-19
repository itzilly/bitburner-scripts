/** @param {NS} ns */
export async function main(ns) {
    let targets = []
    const args = ns.args
    const hosts = dpList()

    // Check usage
    if (args === undefined) {
        ns.tprint("Usage: run attack.js -a")
        ns.tprint("Usage: run attack.js n00dles")
    }

    // Asign Target(s)
    if (args[0] === '-a') { targets = hosts }
    else { targets = [args[0]] }

    targets.forEach((target) => {
        if (hosts.includes(target)) { attack(ns, target) }
        else { ns.tprint(`[ERR] Unresolved hostname: '${target}'`) }
    })
}

function attack(ns, host) {
    ns.brutessh(host)
    ns.ftpcrach(host)

    if (!ns.hasRootAccess(host)) {
        ns.tprint("Unable to gain access to " + host)
        return
    }

    ns.tprint("Gained access to " + host)
}

function dpList(ns, current = "home", set = new Set(), forbidden = ["home"]) {
    let connections = ns.scan(current);
    let next = connections.filter(c => !forbidden.includes(c) && !set.has(c));
    next.forEach(n => {
        set.add(n);
        return dpList(ns, n, set, forbidden);
    });
    return Array.from(set.keys());
}