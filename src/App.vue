<script setup lang="ts">
import n6 from './assets/n6.jpg';
import n5 from './assets/n5.jpg';
import badscan from './assets/badscan.png'
import pieces from './assets/pieces';
import './assets/style.css';
import { computed, onMounted, ref } from 'vue';

// Validate strings very fast according to the rules described.
const RE_REJECT_200 = /^0?200/;            // règle 3 : commence par 200 ou 0200 -> refuse
const RE_REJECT_MAD = /^MAD/;              // règle 4 : commence par MAD -> refuse
const RE_REJECT_CGA = /CGA/;               // règle 5 : contient CGA -> refuse

const RE_ACCEPT_FORMAT1 = /^[A-Za-z]?\d{3}[A-Za-z]\d+$/; // règle 1 (LETTRE_NOMBRE_NOMBRE_NOMBRE_LETTRE_NOMBRE++)
const RE_ACCEPT_FORMAT2 = /^\d{5,8}$/;                   // règle 2 (ENTRE 5 ET 8 NOMBRE)

const imgClass = "aspect-auto object-contain"; // height controlled by container

const reference = ref('');
const success = ref<'n5' | 'n6' | 'nope' | null>(null);
const input = ref<HTMLInputElement>();
const formClass = ref<string | null>('hidden');

onMounted(() => {
  input.value?.focus();
  formClass.value = "w-full gap-2";
});


const found = computed(() => pieces.find(v => v.key === reference.value.toLocaleUpperCase()));
const ispart = computed(() => {
  const upref = reference.value.toLocaleUpperCase()
  if(found.value) return true;
  // Rejets d'abord (court-circuit)
  if (RE_REJECT_200.test(upref)) return false;
  if (RE_REJECT_MAD.test(upref)) return false;
  if (RE_REJECT_CGA.test(upref)) return false;

  // Acceptions ensuite
  if (RE_ACCEPT_FORMAT1.test(upref)) return true;
  if (RE_ACCEPT_FORMAT2.test(upref)) return true;

  // Par défaut, rejeter
  return false;
})

function go() {
  !ispart.value ? success.value = "nope" : found.value ? success.value = "n6" : success.value = "n5"
}

function reset() {
  success.value = null;
  reference.value = "";
}
</script>

<template>
<main class="w-screen h-screen overflow-hidden bg-slate-700 p-6 flex items-center justify-center">
  <div class="w-full max-w-4xl h-full flex flex-col min-h-0">

    <!-- form view -->
    <form
      v-if="success === null"
      @submit.prevent="go"
      :class="formClass"
      class="flex flex-col gap-4 bg-white/5 rounded-lg p-4 shadow-lg min-h-0 h-full"
    >
      <label for="reference" class="block text-white">
        <h1 class="leading-tight font-semibold text-[clamp(18px,calc(1.6vw+0.35vh),48px)]">Référence</h1>
      </label>

      <input
        ref="input"
        v-model="reference"
        type="text"
        id="reference"
        class="block w-full p-3 text-[clamp(13px,calc(1vw+0.25vh),18px)] rounded-lg bg-slate-600 border border-slate-500 text-white
               placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 transition-colors"
        placeholder="Entrez la référence"
        required
      />

      <input
        type="submit"
        class="w-full rounded-lg font-bold text-white text-center cursor-pointer shadow-sm
               bg-red-600 hover:bg-red-700 active:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-300
               transition-colors text-[clamp(14px,calc(1.1vw+0.25vh),18px)] py-[clamp(10px,calc(1.2vw+0.3vh),14px)]"
        value="Vérifier"
      />

      <!-- spacer flexible pour garder tout visible -->
      <div class="flex-1 min-h-0"></div>
    </form>

    <!-- result / image view -->
    <div
      v-else
      class="mt-4 bg-white/5 rounded-lg p-4 flex flex-col items-center justify-between text-white min-h-0 h-full"
    >
      <div class="w-full flex-none text-center mb-2">
        <h1 v-if="success === 'n5'" class="font-bold text-center text-[clamp(20px,calc(2.2vw+0.4vh),48px)]">Conditionnement N5</h1>
        <h1 v-else-if="success === 'n6'" class="font-bold text-center text-[clamp(20px,calc(2.2vw+0.4vh),48px)]">Cleanliness N6</h1>
        <h1 v-else class="font-bold text-center text-[clamp(20px,calc(2.2vw+0.4vh),48px)]">Erreur</h1>
        <span class="block text-[clamp(16px,calc(1.3vw+0.4vh),18px)] mt-1 truncate">{{ reference }}</span>
      </div>

      <div class="w-full flex-1 flex items-center justify-center min-h-0 overflow-hidden py-4">
        <img
          v-if="success === 'n5'"
          :src="n5"
          :class="imgClass + ' object-contain max-h-[calc(100vh-220px)] max-w-full'"
        />
        <img
          v-else-if="success === 'n6'"
          :src="n6"
          :class="imgClass + ' object-contain max-h-[calc(100vh-220px)] max-w-full'"
        />
        <img
          v-else
          :src="badscan"
          :class="imgClass + ' object-contain max-h-[calc(100vh-220px)] max-w-full'"
        />
      </div>

      <div class="w-full flex-none mt-4">
        <button
          @click="reset"
          class="w-full rounded-lg font-bold text-white text-center cursor-pointer shadow-sm
                 bg-red-600 hover:bg-red-700 active:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-300
                 transition-colors text-[clamp(14px,calc(1.1vw+0.25vh),18px)] py-[clamp(10px,calc(1.2vw+0.3vh),14px)] uppercase"
        >
          RECOMMENCER
        </button>
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