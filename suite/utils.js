var ns;

export function setNs(ns_) {
    ns = ns_;
}

/** Returns an array of all the available servers ns.scan can access */
export function getAllServers(location = "home", set = new Set()) {
    let connections = ns.scan(location)
    let next = connections.filter(c => !set.has(c))
    next.forEach(n => {
        set.add(n)
        return getAllServers(n, set)
    })
    return Array.from(set.keys())
}

/** This includes ALL purchased servers! */
export const aquired_servers = function () {
    const all = ns.scan('home');
    let roots = []
    for (const _hostname of all) {
        const server = ns.getServer(_hostname);
        if (server.hasAdminRights) { roots.push(server.hostname); };
    }
    return roots;
}
