"use strict";
import MainController from "./MainController.js";
import Emitter from "./Common/Emitter.js";
import Brain from "./Brain.js";
import Speech from "./Speech.js";
const ver = "0.0.2";
class AIAgent {
    constructor() {
        this.onLoad();
    }
    
    onLoad() {
        console.log("BOT version: ", ver);
        console.log("GENERAL INIT MODULE");
        Emitter.instance = new Emitter();
        Brain.instance = new Brain();
        Speech.instance = new Speech();
        MainController.instance = new MainController();
    }
}

new AIAgent();