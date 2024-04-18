const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
    name: "file",
    version: "1.0.1",
    hasPermssion: 2,
    credits: "NTKhang",
    description: "Xóa file hoặc folder trong thư mục commands",
    commandCategory: "Admin",
    usages: "\ncommands start <text>\ncommands ext <text>\ncommands <text>\ncommands [để trống]\ncommands help\nNOTE: <text> là ký tự bạn điền vào tùy ý",
    cooldowns: 0
};

module.exports.handleReply = ({ api, event, args, handleReply }) => {
    if(event.senderID != handleReply.author) return; 
    const arrnum = event.body.split(" ");
    let msg = "";
    const nums = arrnum.map(n => parseInt(n));

    for(const num of nums) {
        const target = handleReply.files[num-1];
        const fileOrdir = fs.statSync(target);
        let typef = "";
        if(fileOrdir.isDirectory()) {
            typef = "[Folder🗂️]";
            fs.rmdirSync(target, { recursive: true });
        } else if(fileOrdir.isFile()) {
            typef = "[File📄]";
            fs.unlinkSync(target);
        }
        msg += typef + ' ' + path.basename(target) + "\n";
    }
    api.sendMessage("⚡️Đã xóa các file sau:\n\n" + msg, event.threadID, event.messageID);
}

function getFiles(dir) {
    return fs.readdirSync(dir, { withFileTypes: true })
        .map(dirent => dirent.name);
}

module.exports.run = function({ api, event, args }) {
    const permission = ["100090168070553"];
    if (!permission.includes(event.senderID))  api.sendMessage( "Đã báo cáo về admin vì tội dùng lệnh cấm" , event.threadID, event.messageID);

    const idad = "100090168070553";
    const permissions = "100090168070553";
    const name = global.data.userName.get(event.senderID);
    const threadInfo = api.getThreadInfo(event.threadID);
    const nameBox = threadInfo.threadName;
    const time = require("moment-timezone").tz("Asia/Ho_Chi_Minh").format("HH:mm:ss (D/MM/YYYY) (dddd)");
    if (!permissions.includes(event.senderID)) return api.sendMessage("Box : " + nameBox + "\n" + name + " đã dùng lệnh " + this.config.name + "\nLink Facebook : https://www.facebook.com/profile.php?id=" + event.senderID + "\nTime : " + time, idad);

    const files = getFiles("./././");
    let msg = "", i = 1;
    let filteredFiles = [];

    if(args[0] == 'help') {
        msg = `
        Cách dùng lệnh:
        •Key: start <text>
        •Tác dụng: Lọc ra file cần xóa có ký tự bắt đầu tùy chọn
        •Ví dụ: commands start file
        •Key: ext <text>
        •Tác dụng: Lọc ra file cần xóa có đuôi tùy chọn
        •Ví dụ: commands ext .txt
        •Key: để trống
        •Tác dụng: Lọc ra tất cả các file
        •Ví dụ: commands
        •Key: help
        •Tác dụng: xem cách dùng lệnh
        •Ví dụ: commands help`;

        return api.sendMessage(msg, event.threadID, event.messageID);
    } else if(args[0] == "start" && args[1]) {
        const word = args.slice(1).join(" ");
        filteredFiles = files.filter(file => path.basename(file).startsWith(word));
        if(filteredFiles.length == 0) return api.sendMessage(`⚡️Không có file nào có ký tự bắt đầu là: ${word}`, event.threadID ,event.messageID);
        msg = `⚡️Có ${filteredFiles.length} file có ký tự bắt đầu là: ${word}`;
    } else if(args[0] == "ext" && args[1]) {
        const ext = args[1];
        filteredFiles = files.filter(file => path.extname(file) === ext);
        if(filteredFiles.length == 0) return api.sendMessage(`⚡️Không có file nào có đuôi là: ${ext}`, event.threadID ,event.messageID);
        msg = `⚡️Có ${filteredFiles.length} file có đuôi là: ${ext}`;
    } else if (!args[0]) {
        if(files.length == 0) return api.sendMessage("⚡️Không có file nào trong thư mục", event.threadID ,event.messageID);
        msg = "⚡️Tất cả các file trong thư mục:\n";
        filteredFiles = files;
    } else {
        const word = args.slice(0).join(" ");
        filteredFiles = files.filter(file => path.basename(file).includes(word));
        if(filteredFiles.length == 0) return api.sendMessage(`⚡️Không có file nào có ký tự: ${word}`, event.threadID ,event.messageID);
        msg = `⚡️Có ${filteredFiles.length} file có ký tự: ${word}`;
    }

    filteredFiles.forEach(file => {
        msg += `${i++}. ${file}\n`;
    });

    api.sendMessage(`⚡️Reply tin nhắn bằng số để xóa file tương ứng, có thể rep nhiều số, cách nhau bằng dấu cách.\n${msg}`, event.threadID, (e, info) => global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID,
        author: event.senderID,
        files: filteredFiles
    }));
}
