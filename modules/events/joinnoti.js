module.exports.config = {
  name: "joinNoti",
  eventType: ["log:subscribe"],
  version: "1.0.1",
  credits: "CatalizCS",
  description: "Thông báo bot hoặc người vào nhóm có random gif/ảnh/video",
  dependencies: {
    "fs-extra": "",
    "path": ""
  }
};

module.exports.onLoad = function () {
    const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
    const { join } = global.nodemodule["path"];

  const path = join(__dirname, "cache", "joinGif");
  if (existsSync(path)) mkdirSync(path, { recursive: true });	

  const path2 = join(__dirname, "cache", "joinGif", "randomgif");
    if (!existsSync(path2)) mkdirSync(path2, { recursive: true });

    return;
}


module.exports.run = async function({ api, event, Users, Threads }) {
    const { join } = global.nodemodule["path"];
  const { threadID } = event;
  const moment = require("moment-timezone");//D/MM/YYYY
  var gio = moment.tz("Asia/Ho_Chi_Minh").format("D/MM/YYYY || HH:mm:ss");
  const hours = moment.tz('Asia/Ho_Chi_Minh').format('HHmm');
  if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
    api.changeNickname(`『 ${global.config.PREFIX} 』 ⪼ ${(!global.config.BOTNAME) ? "tntxtrick" : global.config.BOTNAME}`, threadID, api.getCurrentUserID());
    return api.sendMessage(`Bot kết nối thành công!`, threadID);
  }
  else {
    try {
      const { createReadStream, existsSync, mkdirSync, readdirSync } = global.nodemodule["fs-extra"];
        const moment = require("moment-timezone");
  const time = moment.tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY || HH:mm:s");
  const hours = moment.tz("Asia/Ho_Chi_Minh").format("HH");
      let { threadName, participantIDs } = await api.getThreadInfo(threadID);
      const threadData = global.data.threadData.get(parseInt(threadID)) || {};
      const path = join(__dirname, "cache", "joinGif");
      const pathGif = join(path, `${threadID}.mp4`);

      var mentions = [], nameArray = [], memLength = [], i = 0;

      for (id in event.logMessageData.addedParticipants) {
        const userName = event.logMessageData.addedParticipants[id].fullName;
        nameArray.push(userName);
        mentions.push({ tag: userName, id });
        memLength.push(participantIDs.length - i++);
      }
      memLength.sort((a, b) => a - b);

      (typeof threadData.customJoin == "undefined") ? msg = "==[ Thành viên mới ]==\n👤 Xin chào bạn {name}.\n😻 Chào mừng đã đến với {threadName}.\n✅ Bạn là thành viên thứ {soThanhVien} của nhóm .": msg = threadData.customJoin;
      msg = msg
                .replace(/\{name}/g, nameArray.join(', '))
                .replace(/\{type}/g, (memLength.length > 1) ? '𝗖𝗮́𝗰 𝗰𝗮̣̂𝘂' : '𝗰𝗮̣̂𝘂')
                .replace(/\{soThanhVien}/g, memLength.join(', '))
                .replace(/\{threadName}/g, threadName)
                .replace(/\{session}/g, hours <= 10 ? "𝗦𝗮́𝗻𝗴" : 
    hours > 10 && hours <= 12 ? "𝗧𝗿𝘂̛𝗮 " :
    hours > 12 && hours <= 18 ? "𝗖𝗵𝗶𝗲̂̀𝘂 " : "𝗧𝗼̂́𝗶")
                .replace(/\{time}/g, time);  



      if (existsSync(path)) mkdirSync(path, { recursive: true });

      const randomPath = readdirSync(join(__dirname, "cache", "joinGif", "randomgif"));

      if (existsSync(pathGif)) formPush = { body: msg, attachment: createReadStream(pathGif), mentions }
      else if (randomPath.length != 0) {
        const pathRandom = join(__dirname, "cache", "joinGif", "randomgif", `${randomPath[Math.floor(Math.random() * randomPath.length)]}`);
        formPush = { body: msg, attachment: createReadStream(pathRandom), mentions }
      }
      else formPush = { body: msg, mentions }

      return api.sendMessage(formPush, threadID);

    } catch (e) { return console.log(e) };
  }
                       }
