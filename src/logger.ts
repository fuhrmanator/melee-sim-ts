let isMute = true;
export function log(message: string) {
    // if (!isMute) console.log(message);
    if (!isMute) postMessage({ "cmd": "log", "message": message });
}

export function setMute(changeIsMute: boolean) {
    isMute = changeIsMute;
}
