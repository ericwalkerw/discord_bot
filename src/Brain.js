import Emitter from "./Common/Emitter.js";

export default class Brain {
    static instance = null;
    constructor() {
        console.log("BRAIN STARTED");
        Brain.instance = this;
        this.sessions = new Map();
    }

    initModel(client, model) {
        this.client = client;
        this.model = model;
    }

    getChatSession(sessionId) {
        if (!this.sessions.has(sessionId)) {
            const chat = this.client.chats.create({
                model: this.model,
            });
            this.sessions.set(sessionId, chat);
        }
        return this.sessions.get(sessionId);
    }

    resetSession(sessionId) {
        this.sessions.delete(sessionId);
    }

    async onSendRequest(prompt, sessionId = 'default') {
        const mes = prompt.replace(/^<@!?\d+>\s*/, "");
        const maxAttempts = 3;
        let attempt = 0;
        let lastError = null;
        const chatSession = this.getChatSession(sessionId);

        while (attempt < maxAttempts) {
            try {
                const response = await chatSession.sendMessage({ message: mes });

                if (!response) return '';
                if (typeof response.text === 'string' && response.text.trim().length) return response.text;
                if (response.output && typeof response.output.text === 'string') return response.output.text;

                return '';
            } catch (error) {
                lastError = error;
                attempt += 1;
                const backoff = 500 * Math.pow(2, attempt); // exponential backoff
                console.warn(`AI request failed (attempt ${attempt}):`, error);
                if (attempt < maxAttempts) {
                    await new Promise(res => setTimeout(res, backoff));
                }
            }
        }

        console.error('❌ Lỗi xảy ra tại class AIBrain sau retries:', lastError);
        throw lastError;
    }
}