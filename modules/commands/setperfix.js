module.exports.config = {
	name: "setprefix",
	version: "1.0.1",
	hasPermssion: 1,
	credits: "Mirai Team",//Mod By Duy🙉
	description: "Đặt lại prefix của nhóm",//đổi luôn biệt danh bot
	commandCategory: "Qtv",
	usages: "[prefix/reset]",
	cooldowns: 5
};

module.exports.languages ={
  "vi": {
    "successChange": "Đã chuyển đổi prefix của nhóm thành: %1",
    "missingInput": "Phần Prefix cần đặt không được để trống",
    "resetPrefix": "Đã reset prefix về mặc định [ %1 ]",
    "confirmChange": "Bạn có chắc bạn muốn đổi Prefix của nhóm thành: %1"
  },
  "en": {
    "successChange": "Changed prefix into: %1",
    "missingInput": "Prefix have not to be blank",
    "resetPrefix": "Reset prefix to: %1",
    "confirmChange": "Are you sure that you want to change prefix into: %1"
  }
}
module.exports.handleEvent = async function ({ api, event }) {
  var { threadID, body } = event;
  const prefix = global.data.threadData.get(threadID)?.PREFIX || global.config.PREFIX;

  if (
    body.toLowerCase() == "prefix" ||
    body.toLowerCase() == "prefix bot là gì" ||
    body.toLowerCase() == "quên prefix r" ||
    body.toLowerCase() == "dùng sao"
  ) {
    api.sendMessage({ body: `╭Prefix Của Nhóm [ ${prefix} ]\n╰Prefix Hệ Thống  [ ${global.config.PREFIX} ]` }, event.threadID);
  }
};

module.exports.run = async ({ api, event, args }) => {};
module.exports.handleReaction = async ({ event, api, handleReaction, Currencies, Users }) => {};
module.exports.handleReaction = async function({ api, event, Threads, handleReaction, getText }) {
	try {
		if (event.userID != handleReaction.author) return;
		const { threadID, messageID } = event;
		var data = (await Threads.getData(String(threadID))).data || {};
		data["PREFIX"] = handleReaction.PREFIX;
		await Threads.setData(threadID, { data });
		await global.data.threadData.set(String(threadID), data);
		api.unsendMessage(handleReaction.messageID);
    
     api.changeNickname(`『 ${handleReaction.PREFIX} 』 • ${global.config.BOTNAME}`, event.threadID, event.senderID);
		return api.sendMessage(getText("successChange", handleReaction.PREFIX), threadID, messageID);
    
	} catch (e) { return console.log(e) }
}

module.exports.run = async ({ api, event, args, Threads , getText }) => {
	if (typeof args[0] == "undefined") return api.sendMessage(getText("missingInput"), event.threadID, event.messageID);
	let prefix = args[0].trim();
	if (!prefix) return api.sendMessage(getText("missingInput"), event.threadID, event.messageID);
	if (prefix == "reset") {
		var data = (await Threads.getData(event.threadID)).data || {};
		data["PREFIX"] = global.config.PREFIX;
		await Threads.setData(event.threadID, { data });
		await global.data.threadData.set(String(event.threadID), data);
    var uid = api.getCurrentUserID()
    api.changeNickname(`『 ${global.config.PREFIX} 』 • ${global.config.BOTNAME}`,event.threadID, uid);
    
		return api.sendMessage(getText("resetPrefix", global.config.PREFIX), event.threadID, event.messageID);
	} else return api.sendMessage(getText("confirmChange", prefix), event.threadID, (error, info) => {
		global.client.handleReaction.push({
			name: "setprefix",
			messageID: info.messageID,
			author: event.senderID,
			PREFIX: prefix
		})
	})
  }