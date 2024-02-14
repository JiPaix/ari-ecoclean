<script setup lang="ts">
import { ref, computed } from 'vue';

import pieces from './assets/pieces'
import ecoclean from './assets/ecoclean.jpg'
import n1 from './assets/n1.jpg'
import {defineAsyncComponent} from "vue";



const decodedText = ref('')
const decoded = computed(() => conditions(decodedText.value))

const StreamBarcodeReader = defineAsyncComponent(async () => {
  const imp = await import('@teckel/vue-barcode-reader')
  return imp.StreamBarcodeReader
})



function conditions(str: string):boolean {
  if(str.length < 5) return false;
  if(str.startsWith('02000') || str.startsWith('2000')) return false;
  if(str.includes('MAD') || str.includes('CGA')) return false;
  if(str.startsWith('000')) return false;
  return true;
}

function onDecode(result: string) {
  if(!conditions(result)) {
    return;
  }
  decodedText.value = result
}

function reset() {
  decodedText.value = ''
}
</script>

<template>
<v-app>
  <v-main>
    <v-container
      class="bg-surface fill-height"
      fluid
    >
      <v-row
        v-if="decoded"
      >
        <v-col cols="12">
          <div class="text-center h3">
            {{ decodedText }}
          </div>
        </v-col>
        <v-col cols="12">
          <v-img
            cover
            :src="pieces.includes(decodedText) ? ecoclean : n1"
          ></v-img>
        </v-col>
        <v-col cols="12" class="text-center">
          <v-btn prepend-icon="$barcode-scan" class="bg-grey-darken-3" @click="reset">
            RECOMMENCER
          </v-btn>
        </v-col>
      </v-row>
      <v-row v-else>
        <v-col cols="12">
          <v-alert
            density="compact"
            color="info"
            variant="elevated"
          >
            <template #prepend>
              <v-progress-circular indeterminate  />
            </template>
            <template #title>
                Scan en cours
            </template>
          </v-alert>
        </v-col>
        <v-col cols="12">
          <StreamBarcodeReader :ms-between-decoding="50" @decode="onDecode"/>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</v-app>
</template>
<style scoped>
.h3 {
  font-size: 6vw;
  font-weight: bold;
}
@media screen and (orientation: landscape) {
  video {
    height: 100%;
    max-height: 50vh;
    width: auto;
  }
}


</style>