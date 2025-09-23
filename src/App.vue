<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted, onUnmounted, ref } from 'vue'
import ecoclean from './assets/ecoclean.jpg'
import landscape from './assets/landscape.png'
import n1 from './assets/n1.jpg'
import pieces from './assets/pieces'
import './assets/style.css'

const isLandscape = ref(false)

onMounted(() => {
  const mql = window.matchMedia('(orientation: landscape)')
  // set initial value
  isLandscape.value = mql.matches

  // update on change
  const handler = (e: MediaQueryListEvent) => {
    isLandscape.value = e.matches
  }
  mql.addEventListener('change', handler)

  onUnmounted(() => {
    mql.removeEventListener('change', handler)
  })
})


const decodedText = ref('')
const toclean = computed(() => pieces.find(l => l.key === decodedText.value))

const StreamBarcodeReader = defineAsyncComponent(async () => {
  const imp = await import('@teckel/vue-barcode-reader')
  return imp.StreamBarcodeReader
})

function conditions(str: string): boolean {
  if (str.length < 5) return false
  if (str.startsWith('02000') || str.startsWith('2000')) return false
  if (str.includes('MAD') || str.includes('CGA')) return false
  if (str.startsWith('000')) return false
  return true
}

function onDecode(result: string) {
  if (!conditions(result)) {
    return
  }
  decodedText.value = result
  scan.value = false
}

function resetScan() {
  decodedText.value = ''
  scan.value = true
}

const scan = ref(true)

</script>

<template>
  <main class="flex flex-row h-[100dvh] bg-slate-700 text-white overflow-hidden">
    <!-- Rotate warning overlay -->
    <div
      v-if="!isLandscape"
      id="rotate-warning"
      class="text-xl flex flex-col fixed inset-0 bg-slate-700 text-white items-center justify-center"
    >
      Veuillez orienter votre appareil en mode paysage
      <img :src="landscape" class="invert" />
    </div>

    <!-- Left side -->
    <div
      v-if="isLandscape"
      class="main-content flex-grow flex items-center justify-center p-2 min-h-0 min-w-0"
    >
      <template v-if="scan">
        <div
          class="w-full h-full max-w-3xl aspect-[16/9] bg-black rounded-lg overflow-hidden"
        >
          <StreamBarcodeReader
            class="h-full w-full object-cover"
            :ms-between-decoding="50"
            @decode="onDecode"
            :no-front-cameras="true"
          />
        </div>
      </template>

      <template v-else-if="decodedText">
        <div
          v-if="toclean"
          class="flex flex-col items-center gap-4 px-4 max-h-full overflow-hidden"
        >
          <div class="text-4xl font-semibold">{{ toclean.key }}</div>
          <div class="text-2xl">{{ toclean.value }}</div>
          <img
            loading="lazy"
            :src="ecoclean"
            class="max-h-[60%] object-contain"
          />
        </div>
        <div
          v-else
          class="flex flex-col items-center gap-4 px-4 max-h-full overflow-hidden"
        >
          <div class="text-4xl font-semibold">{{ decodedText }}</div>
          <img
            loading="lazy"
            :src="n1"
            class="max-h-[60%] object-contain"
          />
        </div>
      </template>
    </div>

    <!-- Right side -->
    <div
      v-if="isLandscape"
      class="main-content w-1/3 flex flex-col justify-center items-center p-6 bg-slate-800 min-h-0"
    >
      <button
        @click="resetScan()"
        type="button"
        class="px-8 py-4 text-2xl cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300 font-medium rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        {{ decodedText ? 'RECOMMENCER' : '' }}
      </button>
    </div>
  </main>
</template>

<style>
video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
@media screen and (orientation: landscape) {
  .main-content {
    display: flex;
  }
  #rotate-warning {
    display: none;
  }
}
@media screen and (orientation: portrait) {
  .main-content {
    display: none;
  }
  #rotate-warning {
    display: flex;
  }
}
</style>