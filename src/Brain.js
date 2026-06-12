import Emitter from "./Common/Emitter.js";

export default class Brain {
    static instance = null;
    constructor() {
        console.log("BRAIN STARTED");
        Brain.instance = this;
    }

    initModel(client, model) {
        this.client = client;
        this.model = model;
    }

    async onSendRequest(prompt) {
        try {
            const mes = prompt.replace(/^<@!?\d+>\s*/, "");
            const response = await this.client.models.generateContent({
                model: this.model,
                contents: mes
            })
            return response.text;
        } catch (error) {
            console.error("❌ Lỗi xảy ra tại class AIBrain:", error);
            throw error;
        }
    }
}