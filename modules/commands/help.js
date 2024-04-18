module.exports.config = {
    name: "help",
    version: "1.0.0",
    hasPermission: 0,
    credits: "tnt",
    description: "Xem cách sử dụng các lệnh",
    commandCategory: "công cụ",
    usages: "[tên lệnh]",
    cooldowns: 0
};

module.exports.languages = {
    "vi": {},
    "en": {}
}

module.exports.run = async function({ api, event, args }) {
    const { threadID: tid, messageID: mid } = event;
    const type = args[0] ? args[0].toLowerCase() : "";
    const cmds = global.client.commands;
    const TIDdata = global.data.threadData.get(tid) || {};
    const prefix = TIDdata.PREFIX || global.config.PREFIX;
    let msg = "";

    if (!type) {
        CmdCategory();
        array.sort(S("nameModule"));
        for (const category of array) {
            msg += `Category: ${category.cmdCategory}\n`;
            for (const moduleName of category.nameModule) {
                msg += ` - ${moduleName}\n`;
            }
        }
    } else {
        const cmd = cmds.get(type);
        if (!cmd) {
            const stringSimilarity = require('string-similarity');
            const commandValues = Array.from(cmds.keys());
            const checker = stringSimilarity.findBestMatch(type, commandValues);
            const similarCommand = checker.bestMatch.target;
            msg = `❗ Lệnh '${type}' không tồn tại.`;
        } else {
            const { name, version, hasPermission, credits, description, commandCategory, usages, cooldowns } = cmd.config;
            msg = `📃 Tên lệnh: ${name} (${version})\n`;
            msg += `🔰 Mô tả: ${description}\n`;
            msg += `🤖 Thuộc nhóm: ${commandCategory}\n`;
            msg += `⚠️ Cách sử dụng: ${prefix}${name} ${usages}\n`;
            msg += `⏰ Thời gian hồi: ${cooldowns}s\n`;
            msg += `👤 Quyền hạn: ${TextPr(hasPermission)}\n`;
            msg += `😻 Tác giả: ${credits}\n`;
        }
    }

    api.sendMessage(msg, tid, mid);
}

function CmdCategory() {
    const cmds = global.client.commands;
    const array = [];
    for (const cmd of cmds.values()) {
        const { commandCategory, hasPermission, name: nameModule } = cmd.config;
        const foundCategory = array.find(i => i.cmdCategory === commandCategory);
        if (!foundCategory) {
            array.push({
                cmdCategory: commandCategory,
                nameModule: [nameModule]
            });
        } else {
            foundCategory.nameModule.push(nameModule);
        }
    }
    return array;
}

function S(k) {
    return function(a, b) {
        return b[k].length - a[k].length;
    }
}

function TextPr(permission) {
    switch (permission) {
        case 0:
            return "Thành Viên";
        case 1:
            return "Admin Box";
        case 2:
            return "Admin bot";
        default:
            return "Toàn Quyền";
    }
}
