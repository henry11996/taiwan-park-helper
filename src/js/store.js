import { reactive } from "vue";

const getStorage = () => {
    if (!chrome.storage) {
        console.debug("chrome.storage not found")
        return null
    }
    return chrome.storage
}

const store = reactive({
    trips: {},

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
            // this.trips = { "nnnnn": { "入園日期": ["2023-05-23", "2023-05-23"], "申請人數": "1", "申請時間": "2023-05-16T13:12:00.000Z", "申請狀態": "核准入園", "申請編號": "Y112063142", "申請路線": "玉山線 / 玉山前峰單日往返(塔塔加 - 玉山前峰 - 塔塔加 )", "隊伍名稱": "nnnnn" } }
        } else {
            this.trips = await chrome.storage.sync.get()
        }
        console.log(this.trips)
    },

    display() {
        this.loadFromStorage(() => {
            console.debug("displayTrips", this.trips)
        })
    }
})

export function useStore() {
    return store
}
