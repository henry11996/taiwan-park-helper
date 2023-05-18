<script setup type="ts">
import { watch } from "vue";
import { useMemberFileUpload } from "../js/file";
import { useBridge } from "../js/bridge.js";

const { files, alert, data, options } = useMemberFileUpload();
const { sendMessage } = useBridge();

watch(data, (newVal) => {
  sendMessage(newVal);
});

const downloadExampleXlsx = () => {
  var anchor = document.createElement("a");
  anchor.setAttribute("href", "resources/登山人員範例檔.xlsx");
  anchor.setAttribute("download", "");
  document.body.appendChild(anchor);
  anchor.click();
  anchor.parentNode.removeChild(anchor);
};
</script>

<template>
  <v-card style="height: 492px">
    <v-card-text>
      <v-row class="no-gutter">
        <v-col cols="12">
          <v-btn
            variant="tonal"
            block
            prepend-icon="fas fa-download"
            @click="downloadExampleXlsx"
            >下載人員範例檔
          </v-btn>
        </v-col>
        <v-col cols="12">
          <v-file-input
            id="file-uploader"
            v-model="files"
            variant="outlined"
            density="compact"
            label="點此上傳人員檔案"
            hide-details
            accept=".xlsx"
          ></v-file-input>
          <v-alert
            class="my-4"
            v-model="alert.show"
            :text="alert.message"
            :type="alert.type"
            closable
            density="compact"
          ></v-alert>
          <v-checkbox
            label="自動修正電話開頭沒有0"
            hide-details
            density="compact"
            v-model="options.fixPhoneNumber"
          ></v-checkbox>
        </v-col>
      </v-row>
      <v-row>
        <v-alert>
          <span class="read-the-docs">
            1. 請先下載人員範例檔，並依照範例檔格式填寫人員資料<br />
            2. 切換分頁到入園申請填選人員的頁面 <br />
            3. 點選上傳人員檔案，選擇剛剛填寫好的人員檔案<br />
            4. 檔案上傳成功後，即可在畫面看到自動填入選項<br />
            5. 如果要修改人員資料，請重新上傳人員檔案即可<br />
          </span>
        </v-alert>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.read-the-docs {
  font-size: small;
  color: #d0caca;
}
</style>
