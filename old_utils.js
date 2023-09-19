/** @param {NS} ns */
// export async function main(ns) {
    
// }

let ns

export const default_server_excludes = ["home", "darkweb", "0"]


export function set_ns(ns_) { ns = ns_ }

export function prettify_money(number) {
    if (typeof number !== 'number' || isNaN(number)) { return number }

    if (number >= 1e12) {
        // Trillion or more
        return (number / 1e12).toFixed(3).replace(/\.0+$/, '') + 't';
    } else if (number >= 1e9) {
        // Billion
        return (number / 1e9).toFixed(3).replace(/\.0+$/, '') + 'b';
    } else if (number >= 1e6) {
        // Million
        return (number / 1e6).toFixed(3).replace(/\.0+$/, '') + 'm';
    } else if (number >= 1e3) {
        // Thousand
        return (number / 1e3).toFixed(3).replace(/\.0+$/, '') + 'k';
    } else {
        // Less than a thousand
        return number.toFixed(2).replace(/\.00$/, '');
    }
}

/**
 * Prints a string to the terminal without the script's name before it 
 * Wrapper for ns.tprintf()
*/
export function printf(string) {
    let string_ = string !== undefined ? string : "  "
    ns.tprintf(string_)
}

export function compile_servers_list_with_root(root = "home", excludes = default_server_excludes) {
    const all_servers = get_all_servers(root, new Set(), excludes)
    let  servers_with_root = []
    for (const server of all_servers) {
        if (ns.hasRootAccess(server)) {
            servers_with_root.push({
                hostname: server,
                ram: ns.getServerMaxRam(server)
            })
        }
    }
    return servers_with_root
}

export function get_all_servers_as_server_obj(root = "home", excludes = default_server_excludes) {
    const all_servers = get_all_servers(root, new Set(), excludes)
    let server_objects = []
    for (const server in all_servers) {
        server_objects.push(ns.getServer(server + ""))
    }
}

export function get_all_servers(root = "home", set = new Set(), excludes = default_server_excludes) {
    let connections = ns.scan(root);
    let next = connections.filter(c => !excludes.includes(c) && !set.has(c));
    next.forEach(n => {
        set.add(n);
        return get_all_servers(n, set, excludes);
    });
    return Array.from(set.keys());
}

export function resolve_best_target() {
    const player_level = ns.getHackingLevel()
    const all_servers = get_all_servers()
    all_servers.forEach((servername) => {
        ns.tprint(`Server Name: '${servername}'`)
    })
    let usable_servers = []

    for (const server in all_servers) {
        try {
            if (ns.getServerRequiredHackingLevel(server) <= Math.floor(player_level / 2)) {
                const score = ns.getServerMaxMoney(server) / ns.getServerMinSecurityLevel(server)
                usable_servers.push({hostname: server, score: score})
            }
        } catch (err) {
            ns.tprint(`Unknown Hostname: '${server}'`)
        }
    }
    usable_servers.sort((a, b) => b.score - a.score);
    ns.tprint(usable_servers)
    ns.tprint("Best Server: " + usable_servers[0][hostname])
    return usable_servers[0][hostname]
}