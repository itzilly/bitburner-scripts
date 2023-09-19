/** @param {NS} ns */
export async function main(ns) {
    const args = ns.args
    const all_hosts = dpList(ns)

    const current_hacker_level = ns.getHackingLevel()
    const inject_script_ram = 2.35

    const target_hostname = args[1]
    if (target_hostname === undefined) {
        ns.tprint('Usage: run post_augment.js')
        ns.tprint('Flags: ')
        ns.tprint('       -u Update Flag | run post_augment.js script.js n00dles')
        return
    }
    
    // Update
    if (args[0] !== undefined && args[0] === "-u") {
        upload_and_start(ns, host, injected_script, inject_script_ram, target_hostname)
    }
    
    const injected_script = args[0]
    if (injected_script === undefined || await !ns.fileExists(injected_script)) {
        ns.tprint('Please specify a file to copy and make sure it exists')
        return
    }
    
    let zero_port_hosts = []
    let one_port_hosts = []

    // Sort all the hosts
    all_hosts.forEach((host) => {
        const ports_required = ns.getServerNumPortsRequired(host)
        
        if (ports_required === 0) { zero_port_hosts.push(host) }
        else if (ports_required === 1) { one_port_hosts.push(host) }
    })

    // Check valid hostname
    if (!zero_port_hosts.includes(target_hostname)) {
        ns.tprint('[ERR] Could not resolve hostname')
        return
    }

    // Infultrate zero level systems
    zero_port_hosts.forEach((host) => {
        ns.nuke(host)
        upload_and_start(ns, host, injected_script, inject_script_ram, target_hostname)
    })

    // Wait for level 2 infultration
    while (await !ns.fileExists('BruteSSH.exe')) {
        ns.sleep(10000)
    }

    // Infultrate one level systems
    one_port_hosts.forEach((host) => {
        ns.brutessh(host)
        ns.nuke(host)
        upload_and_start(ns, host, injected_script, inject_script_ram, target_hostname)
    })
}

function upload_and_start(ns, host, script, script_size, target) {
    ns.killall(host)
    const max_ram = ns.getServerMaxRam(host)
    const max_threads = Math.floor(max_ram / script_size)
    ns.scp(script, host)
    ns.exec(script, host, {threads: max_threads}, target)
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