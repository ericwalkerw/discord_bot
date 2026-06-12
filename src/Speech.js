import Emitter from "./Common/Emitter.js";

export default class Speech {
    static instance = null;
    constructor() {
        console.log("SPEECH STARTED");
        Speech.instance = this;
    }

    async showTyping(data) {
        await data.channel.sendTyping();
    }

    async sendReply(data, replyText) {
        await data.reply(`${replyText}`);
    }
}