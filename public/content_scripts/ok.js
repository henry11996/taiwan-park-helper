console.log("ok loaded")

waitForElm("div.content ul li").then(() => {
    let applyDate = {}
    $("div.content ul li").each(function () {
        const texts = $(this).text().split('：')
        const key = texts[0]
        if (key.includes('日期')) {
            applyDate[key] = texts[1].split(' ~ ')
        } else if (key.includes('時間')) {
            applyDate[key] = new Date(texts[1])
        } else if (key.includes('編號')) {
            applyDate[key] = texts[1].split(' ')[0]
        } else {
            applyDate[texts[0]] = texts[1]?.trim()
        }
    })
    applyDate['url'] = window.location.href


    const btnDiv = $("<div></div>")
        .addClass("BU")
        .insertBefore($("div.alert"))

    $("<input>")
        .addClass("BUTTON_back")
        .css("background-color", "#377DB6")
        .attr("id", "save_to_extension")
        .attr("value", "儲存到 Climber 擴充功能")
        .appendTo(btnDiv)


    $("input#save_to_extension").on("click", function () {
        const tripName = window.prompt("請取個簡短方便記憶的名稱，例如：2021-01-01 玉山單攻", applyDate['入園日期'][0] + " " + applyDate['申請路線'])
        if (!tripName) return
        applyDate['tripName'] = tripName
        saveOk(applyDate)
    })
})

function saveOk(applyDate) {
    chrome.runtime.sendMessage({ applyDate: applyDate }, function (response) {
        console.log(response)
    })
}

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            attributes: true,
            subtree: true
        });
    });
}