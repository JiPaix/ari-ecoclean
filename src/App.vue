<script setup lang="ts">
import ecoclean from './assets/ecoclean.jpg';
import landscape from './assets/landscape.png';
import n1 from './assets/n1.jpg';
import pieces from './assets/pieces';
import './assets/style.css';
import { computed, onMounted, ref } from 'vue';

const reference = ref('');
const success = ref<'n5' | 'n6' | 'nope' | null>(null);
const input = ref<HTMLInputElement>();
const formClass = ref<string | null>('hidden');
const imgClass = "aspect-auto object-contain"; // height controlled by container
onMounted(() => {
  input.value?.focus();
  formClass.value = "w-full gap-2";
});

const found = computed(() => pieces.find(v => v.key === reference.value.toLocaleUpperCase()));

function first5HasLetterAndDigit(s: string) {
  let hasLetter = false;
  let hasDigit = false;
  for (let i = 0; i < 5 && i < s.length; i++) {
    const ch = s.charCodeAt(i);
    if (ch >= 48 && ch <= 57) hasDigit = true;
    if ((ch >= 65 && ch <= 90) || (ch >= 97 && ch <= 122)) hasLetter = true;
    if (hasLetter && hasDigit) return true;
  }
  return false;
}

function conditions(str: string): boolean {
  if (str.length < 5) return false
  if (str.startsWith('02000') || str.startsWith('2000')) return false
  if (str.includes('MAD') || str.includes('CGA')) return false
  if (str.startsWith('000')) return false
  if (!first5HasLetterAndDigit(str)) return false;
  return true
}

function go() {
  found.value ? success.value = "n6" : conditions(reference.value) ? success.value = "n5" : success.value = "nope";
}

function reset() {
  success.value = null;
  reference.value = "";
}
</script>

<template>
  <!-- full-screen no-scroll container -->
  <main class="w-screen h-screen overflow-hidden bg-slate-700 p-6 flex items-center justify-center">
    <!-- central column that can shrink; min-h-0 lets children flex properly -->
    <div class="w-full max-w-4xl h-full flex flex-col min-h-0">

      <!-- form view -->
      <form
        v-if="success === null"
        @submit.prevent="go"
        :class="formClass"
        class="flex flex-col items-stretch gap-4 bg-white/5 rounded-lg p-4 shadow-lg min-h-0"
        >

        <label for="reference" class="block text-white">
          <h1 class="text-[clamp(18px,4vw,32px)] leading-tight font-semibold">Référence</h1>
        </label>

        <input
          ref="input"
          v-model="reference"
          type="text"
          id="reference"
          class="bg-gray-300 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
          required
        />

        <!-- submit button kept reasonably tall but uses max-height so it won't force scroll -->
        <input
          type="submit"
          class="w-full bg-red-800 mt-2 h-14 sm:h-16 text-center text-white font-bold cursor-pointer rounded"
          value="Vérifier"
        />
        <!-- spacer that will shrink if needed -->
        <div class="flex-1 min-h-0"></div>
      </form>

      <!-- result / image view -->
      <div
        v-else
        class="mt-4 bg-white/5 rounded-lg p-4 flex flex-col items-center justify-between text-white min-h-0"
        style="height: calc(100% - 1rem);"
      >
        <div class="w-full flex-0">
          <h1 v-if="success === 'n5'" class="text-[clamp(20px,5vw,48px)] font-bold text-center">Conditionnement N5</h1>
          <h1 v-else-if="success === 'n6'" class="text-[clamp(20px,5vw,48px)] font-bold text-center">Cleanliness N6</h1>
          <h1 v-else class="text-[clamp(20px,5vw,48px)] font-bold text-center">Erreur</h1>
        </div>

        <!-- image container: limits image to available space and keeps aspect ratio -->
        <div class="w-full flex-1 flex items-center justify-center min-h-0 overflow-hidden py-4">
          <img v-if="success === 'n5'" :src="n1" :class="imgClass + ' max-h-[70vh] max-w-full'" />
          <img v-else-if="success === 'n6'" :src="ecoclean" :class="imgClass + ' max-h-[70vh] max-w-full'" />
          <img v-else :src="landscape" :class="imgClass + ' max-h-[70vh] max-w-full'" />
        </div>

        <div class="w-full flex-none mt-4">
          <button @click="reset" class="w-full bg-red-500 p-3 rounded text-white font-semibold">RECOMMENCER</button>
        </div>
      </div>

    </div>
  </main>
</template>

<style scoped>
/* small helper for responsive clamped text where Tailwind's clamp utilities aren't present */
h1 {
  margin: 0;
}

/* Ensure body/html don't add scrollbars from margins */
:root, html, body {
  height: 100%;
}
</style>