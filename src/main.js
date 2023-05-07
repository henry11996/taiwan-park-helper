import { createApp } from 'vue'
import * as bootstrap from 'bootstrap'
import './css/styles.scss'
import App from './App.vue'

createApp(App).mount('#app')


function popup() {
    console.log("popup")
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { greeting: "hello" }, function (response) {
            // alert(response.farewell)
        })
    })
}

function saveMembers(members, callback) {
    if (!chrome.storage) {
        console.debug("chrome.storage not found")
        return
    }
    chrome.storage.sync.set(
        { members: JSON.stringify(members) }, callback
    )
}

function xlsxToArray(data, key) {
    const workbook = XLSX.read(data, { type: 'binary', cellDates: true, dateNF: 'yyyy-mm-dd' });
    const rows = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { dateNF: 'yyyy-mm-dd' })
    console.log(rows)
    return rows.reduce(function (r, e) {
        r[e[key]] = e;
        return r;
    }, {});
}

document.addEventListener("DOMContentLoaded", function () {
    this.querySelector('#file-uploader').addEventListener('change', async (e) => {
        e.stopImmediatePropagation()
        const file = e.target.files[0];
        const rows = xlsxToArray(await file.arrayBuffer(), '信箱')
        saveMembers(rows, () => {
            // Update status to let user know options were saved.
            const status = document.getElementById('status')
            status.textContent = '上傳成功(Upload Success)'
            setTimeout(() => {
                status.textContent = ''
            }, 3200)
        })
    })
})
