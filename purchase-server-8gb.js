/** @param {NS} ns */
export async function main(ns) {
    const ram = 8
    const server_script = 'simple_shell.js'
    const server_script_ram = 1.8

    let i = 0
    while (i < ns.getPurchasedServerLimit()) {
        await ns.sleep(5000)
        if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram)) {
            let hostname = ns.purchaseServer("pserv-" + i, ram)
            ns.scp([server_script], hostname, "home")
            ns.exec(server_script, hostname, {threads: 3}, [target])
            ++i
        }
    }
}