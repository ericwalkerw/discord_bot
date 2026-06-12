import Emitter from "./Emitter.js";

export const registerEvent = function (eventCode, func, main) {
    if (!main.eventMap) {
        main.eventMap = [];
    }
    const funcKey = func.bind(main);
    main.eventMap.push({eventCode, funcKey});
    Emitter.instance.registerEvent(eventCode, funcKey);
};

export const removeEvent = function (eventCode, main) {
    if (!main.eventMap || !Emitter.instance) return;
    for (let i = main.eventMap.length - 1; i >= 0; i--) {
        const e = main.eventMap[i];
        if (e.eventCode === eventCode) {
            Emitter.instance.removeEvent(e.eventCode, e.funcKey);
            main.eventMap.splice(i, 1);
        }
    }
};
