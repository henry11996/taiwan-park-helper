<script setup>
import { reactive, ref } from "vue";
import { useStore } from "../js/store.js";

const store = useStore();
const trip = reactive({
  id: null,
  serial: null,
  name: "",
  date: "",
  description: "",
  members: [],
  archive: false,
});

const valid = ref(false);

const saveTrip = () => {
  store.saveTrip(trip);
  store.display();
};
</script>

<template>
  <v-form v-model="valid" @submit.prevent>
    <v-card>
      <v-card-title>新增登山計畫</v-card-title>
      <v-card-text>
        <v-row no-gutters>
          <v-col cols="12">
            <v-text-field
              v-model="trip.name"
              variant="outlined"
              label="登山計畫名稱"
              :rules="[(v) => !!v || '請輸入登山計畫名稱']"
              outlined
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="trip.date"
              variant="outlined"
              type="date"
              label="出發日"
              :rules="[(v) => !!v || '請輸入出發日']"
              outlined
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-textarea
              v-model="trip.description"
              variant="outlined"
              label="登山計畫簡介"
              outlined
            ></v-textarea>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="trip.serial"
              label="入園申請編號(申請成功後填)"
              variant="outlined"
              name="name"
              rows="5"
              textarea
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-file-input
              v-model="files"
              variant="outlined"
              label="點此上傳人員檔案"
              accept=".xlsx"
            ></v-file-input>
            <v-alert
              v-model="alert.show"
              :text="alert.message"
              :type="alert.type"
              density="compact"
            ></v-alert>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="primary"
          type="submit"
          block
          variant="outlined"
          @click="saveTrip"
          >新增</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-form>
</template>


<style>
</style>