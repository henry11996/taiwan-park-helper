export const useBridge = () => {
    const sendMessage = (message) => {
        console.log('Trying to send message.' + message)
        if (!chrome.tabs) return
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, message, function (response) {
                console.log(response)
            })
        })
    }
    return {
        sendMessage
    }
}

