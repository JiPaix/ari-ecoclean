<script setup lang="ts">
import { ref } from 'vue';
import { StreamBarcodeReader } from "@teckel/vue-barcode-reader";
import pieces from './pieces.json';

const decodedText = ref('')
const decoded = ref(false);


const onDecode = (result: string) => {
  decodedText.value = result
  decoded.value = true;
}

const onLoaded = () => {
  console.log('loaded')
}

function reset() {
  decodedText.value = ''
  decoded.value = false
}
</script>

<template>
  <div v-if="decoded">
    <div v-if="pieces.includes(decodedText)">
      <h2>{{ decodedText }}</h2>
      <img height="150" src="./assets/ecoclean.jpg">
    </div>
    <h1 v-else class="text-red">
      <h2>{{ decodedText }}</h2>
      <img height="150" src="./assets/n1.jpg">
    </h1>
    <div>
      <button class="xl" @click="reset">SCANNER UNE AUTRE REF</button>
    </div>
  </div>
  <div v-else>
    <StreamBarcodeReader @decode="onDecode" @loaded="onLoaded" no-front-cameras></StreamBarcodeReader>
  </div>
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
