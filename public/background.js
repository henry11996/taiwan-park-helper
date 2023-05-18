console.log("background.js loaded")

chrome.runtime.onMessage.addListener(async function (message, sender, sendResponse) {
    console.log("message received")
    sendResponse({ message: "message save" })
    await save(message['applyDate']['隊伍名稱'], message['applyDate'])
})

function save(key, value) {
    return chrome.storage.sync.set({ [key]: value })
}