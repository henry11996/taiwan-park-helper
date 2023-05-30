import { reactive } from "vue";

const getStorage = () => {
    if (!chrome.storage) {
        console.debug("chrome.storage not found")
        return null
    }
    return chrome.storage
}

const store = reactive({
    trips: [],

    saveTrip(trip) {
        this.trips.push(trip)
        this.saveToStorage()
    },

    async saveToStorage() {
        const storage = getStorage()
        if (!storage) return
        await chrome.storage.sync.set({ trips: JSON.stringify(this.trips) })
    },

    async loadFromStorage() {
        const storage = getStorage()
        if (!storage) {
            this.trips = [{ "申請編號": "Yxxxxxxxxx", "隊伍名稱": "xxxxx", "申請時間": "2023-01-01 00:00:00", "申請人數": "1", "申請路線": "峰 - 塔塔加 )", "入園日期": ["2023-05-01", "2023-01-10"], "申請狀態": "核准入園", "url": "https://npm.cpami.gov.tw/apply_ok.aspx?serial=Y112063142&a_id=1666654", "tripName": "2023-05-23 玉山線 / 玉山前峰單日往返(塔塔加 - 玉山前峰 - 塔塔加 )" }, { "申請編號": "Yxxxxxxxxx", "隊伍名稱": "xxxxx", "申請時間": "2023-01-01 00:00:00", "申請人數": "1", "申請路線": "玉山線 / 玉山前峰單日往返(塔塔加 - 玉山前峰 - 塔塔加 )", "入園日期": ["2023-02-01", "2023-01-10"], "申請狀態": "核准入園", "url": "https://npm.cpami.gov.tw/apply_ok.aspx?serial=Y112063142&a_id=1666654", "tripName": "2023-05-23 玉山線 / 玉山前峰單日往返(塔塔加 - 玉山前峰 - 塔塔加 )" } ]
        } else {
            this.trips = await chrome.storage.sync.get()
        }
        this.trips.sort((a, b) => new Date(a['入園日期'][0]) - new Date(b['入園日期'][0]))
        console.log(this.trips)
    },

    delete(tripSerial) {
        this.trips = this.trips.filter(trip => trip['申請編號'] !== tripSerial)
        this.saveToStorage()
    }
})

export function useStore() {
    return store
}
