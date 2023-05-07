<script setup>
import { ref } from "vue";

defineProps({
  msg: String,
});

const count = ref(0);
</script>

<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-sm-4">
        <button class="btn btn shadow" id="btnSwitch">Toggle Mode</button>
        <div class="form-control">
          <label for="file-uploader" class="form-label">點此上傳檔案</label>
          <input
            type="file"
            id="file-uploader"
            data-target="file-uploader"
            accept=".xlsx"
          />
        </div>
        <select class="form-select" aria-label="Default select example">
          <option selected>Open this select menu</option>
          <option value="1">One</option>
          <option value="2">Two</option>
          <option value="3">Three</option>
        </select>
      </div>
    </div>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
