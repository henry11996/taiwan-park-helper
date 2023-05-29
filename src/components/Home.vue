<script setup type="ts">
import dayjs from "dayjs";
import { useStore } from "../js/store.js";

const store = useStore();

store.loadFromStorage();

const copy = async function (text) {
  try {
    await navigator.clipboard.writeText(text);
    console.log('Content copied to clipboard');
  } catch (err) {
    console.error('Failed to copy: ', err);
  }
}

</script>
<template>
  <v-card>
    <v-card-text v-if="Object.keys(store.trips).length !== 0">
      <v-card class="mt-2" v-for="(trip, name) in store.trips" :key="name" :title="trip['tripName']"
        :subtitle="trip['入園日期'].join(' ~ ')" variant="outlined">
        <v-card-text class="py-0">
          <p>申請編號：{{ trip["申請編號"] }} <v-btn variant="outlined" size="x-small" @click="copy(trip['申請編號'])">複製</v-btn></p>
          <p>申請人數：{{ trip["申請人數"] }}</p>
          <p>申請狀態：{{ trip["申請狀態"] }}</p>
          <p>申請時間：{{ dayjs(trip["申請時間"]).locale('zh-tw').format('YYYY-MM-DD HH:mm:ss') }}</p>
          <p>申請路線：{{ trip["申請路線"] }}</p>
        </v-card-text>

        <v-btn class="float-left pl-4" color="primary" :href="trip['url']" target="__blank" size="x-small"
          icon="fa-solid fa-arrow-up-right-from-square" variant="text">
        </v-btn>

        <v-btn class="float-right pr-4" color="red" @click="store.delete(trip['申請編號'])" size="x-small" icon="fa-solid fa-trash"
          variant="text">
        </v-btn>

      </v-card>
    </v-card-text>
    <v-card-text v-else>
      <p>已注入自動選取功能到申請人員填入頁面</p>
      <p>
        <a target="_blank" href="https://npm.cpami.gov.tw/apply_1.aspx">請至登山人員申請頁面查看</a>
      </p>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
