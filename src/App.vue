<script setup>
import Home from "./components/Home.vue";
import AddTrip from "./components/AddTrip.vue";
import Setting from "./components/Setting.vue";
// import Helper from "./components/Helper.vue";
import { ref } from "vue";

const tab = ref("main");
</script>

<template>
  <v-tabs fixed-tabs bg-color="#377DB6" color="white" v-model="tab">
    <v-tab stacked value="main">
      <v-icon size="x-small" start icon="fas fa-home" />
      主頁
    </v-tab>
    <v-tab stacked value="add" v-show="false">
      <v-icon size="x-small" start icon="fas fa-plus" />
      新增計畫
    </v-tab>
    <v-tab stacked value="setting">
      <v-icon size="x-small" start icon="fas fa-gear" />
      設定
    </v-tab>
  </v-tabs>
  <v-window v-model="tab">
    <v-window-item value="main">
      <Home />
    </v-window-item>
    <v-window-item value="add">
      <AddTrip />
    </v-window-item>
    <v-window-item value="setting">
      <Setting />
    </v-window-item>
  </v-window>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
