console.log("background.js loaded")

chrome.runtime.onMessage.addListener(async function (message, sender, sendResponse) {
    console.log("message received")
    sendResponse({ message: "message save" })
    await save(message['applyData'])
})

async function save(value) {
    const data = await chrome.storage.sync.get("trips")
    let trips = data.trips || []
    trips = trips.filter(trip => trip['申請編號'] !== value['申請編號'])
    trips.push(value)
    return await chrome.storage.sync.set({ trips })
}