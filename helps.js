/** @param {NS} ns */
export async function main(ns) {
    const args = ns.args
    if (args.length === 0) { show_help(ns) }
    const flag = args[0]
    switch (flag) {
        case 'help':
            show_help(ns)
        case '-l':
            list_servers(ns)
            break

        case '-r':
            rename_server(ns, args[1], args[2])
            break

        default:
            show_help(ns)
    }
}

function list_servers(ns) {
    const max_allowed_ram = 1_048_576
    const servers = ns.getPurchasedServers()
    servers.forEach((server) => {
        const current_ram = ns.getPurchasedServerMaxRam(server)
        const upgrade_cost = ns.getPurchasedServerUpgradeCost(server, current_ram)
        const is_maxed = current_ram === max_allowed_ram ? false : true;
        if (is_maxed) { ns.tprintf(`    ${server}  RAM: ${current_ram / 1024}GB`) }
        else { ns.tprintf(`    ${server}   RAM: ${current_ram / 1024}GB   Upgrade Price: ${prettify_money(upgrade_cost)}`) }
    })
}

function rename_server(ns, old_name, new_name) {
    if (old_name === undefined || new_name === undefined) {
        ns.tprint("Please select which server you'd like to rename\n");
        show_help(ns, 'rename')
        return
    }
    ns.renamePurchasedServer(old_name, new_name)
    ns.tprint(`Renamed: ${old_name} -> ${new_name}`)
    return
}

function show_help(ns, help_message, should_exit = true) {
    const helps = {
        'list': '-l | shows all purchased servers | run pserv_manager.js -l ',
        'rename': '-r <NAME> <NEWNAME> | renames a server | run pserv_manager.js -rename pserv-0 myserver'
    };

    ns.tprint('=----=----=----=')
    ns.tprint('PServer Manager')
    ns.tprint('=----=----=----=')
    ns.tprint('args:')

    if (helps[help_message] === undefined) {
        helps.array.forEach(element => {
            ns.tprint(`       ${helps[element]}`)
        });
    }
    else { ns.tprint(`      ${helps[help_message]}`) }

    if (should_exit) {
        ns.exit();
    }
}

function prettify_money(number) {
    if (typeof number !== 'number' || isNaN(number)) {
        return number;
    }

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
