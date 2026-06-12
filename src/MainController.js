import { Client, GatewayIntentBits } from "discord.js";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { registerEvent } from "./Common/Utils.js";
import Brain from "./Brain.js";
import Speech from "./Speech.js";

dotenv.config();

export default class MainController {
    static instance = null;
    constructor() {
        MainController.instance = this;

        this.discordToken = process.env.DISCORD_TOKEN;
        this.geminiApiKey = process.env.GEMINI_API_KEY;

        this.onLoad();
    }

    onLoad() {
        this.initDiscord();
        this.initEvents();
        this.onLoginDiscord();
        this.initModel();
    }

    initDiscord() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
            ],
        });
    }

    initModel() {
        const model = "gemini-3.5-flash";
        const ai = new GoogleGenAI({});
        Brain.instance.initModel(ai, model)
    }

    initEvents() {
        this.client.once("clientReady", () => {
            console.log("================================");
            console.log(`🤖 ${this.client.user.tag} -> đã Online!`);
            console.log("================================");
        });

        this.client.on('messageCreate', async (message) => {
            await this.handleMessage(message);
        });
    }

    async handleMessage(data) {
        if (data.author.bot) return;

        // Kiểm tra xem bot có được tag không
        if (data.mentions.has(this.client.user)) {
            const mes = data.content.replace(/<@!?\d+>/g, '').trim();
            if (!mes) {
                return data.reply("Muốn hỏi dè hỏi đê");
            }

            try {
                await Speech.instance.showTyping(data);
                const aiResponse = await Brain.instance.onSendRequest(mes);
                await Speech.instance.sendReply(data, aiResponse);

            } catch (error) {
                await data.reply("❌ Ẹc!! lỗi rùi :)))");
            }
        }
    }

    onLoginDiscord() {
        this.client.login(this.discordToken);
    }
}