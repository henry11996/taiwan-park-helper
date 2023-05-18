<script setup type="ts">
import { reactive, ref, watch } from "vue";
import { useStore } from "../js/store.js";

const store = useStore();

store.loadFromStorage();

const getCorrectTime = (date) => {
  let yourDate = new Date(date);
  const offset = yourDate.getTimezoneOffset();
  yourDate = new Date(yourDate.getTime() - offset * 60 * 1000);
  return yourDate.toISOString();
};
</script>

<template>
  <v-card>
    <v-card-text v-if="Object.keys(store.trips).length !== 0">
      <v-card
        class="mt-2"
        v-for="(trip, name) in store.trips"
        :key="name"
        :title="trip['申請路線']"
        :subtitle="trip['入園日期'].join(' ~ ')"
        variant="outlined"
      >
        <v-card-text>
          <p>申請編號：{{ trip["申請編號"] }}</p>
          <p>申請人數：{{ trip["申請人數"] }}</p>
          <p>申請狀態：{{ trip["申請狀態"] }}</p>
          <p>申請時間：{{ getCorrectTime(trip["申請時間"]) }}</p>
          <p>申請路線：{{ trip["申請路線"] }}</p>
        </v-card-text>
      </v-card>
    </v-card-text>
    <v-card-text v-else>
      <p>已注入自動選取功能到申請人員填入頁面</p>
      <p>
        <a href="https://npm.cpami.gov.tw/apply_1.aspx"
          >請至登山人員申請頁面查看</a
        >
      </p>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
