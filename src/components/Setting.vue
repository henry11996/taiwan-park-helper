<script setup>
import { reactive, ref } from "vue";
import { useStore } from "../js/store.js";


</script>

<template>
  <v-card color="#CCE0E9">
    <v-card-text>
      <v-col>
        <v-btn prepend-icon="fa-brands fa-facebook" href="https://npm.cpami.gov.tw/apply_1.aspx"
          target="__blank">
          入員申請
        </v-btn>
      </v-col>
      <v-col>
        <v-btn prepend-icon="fa-brands fa-facebook" href="https://www.facebook.com/groups/935203886528583/"
          target="__blank">
          登山通報站
        </v-btn>
      </v-col>
      <v-col>
        <v-btn prepend-icon="fa-solid fa-road" href="https://168.thb.gov.tw/thb168" target="__blank">
          公路資訊
        </v-btn>
      </v-col>
      <v-col>
        <v-btn prepend-icon="fa-solid fa-person-hiking" href="https://www.sunriver.com.tw/map_hiking_index.htm" target="__blank">
          百岳步程示意圖
        </v-btn>
      </v-col>
      <v-icon></v-icon>
    </v-card-text>
  </v-card>
</template>


<style></style>