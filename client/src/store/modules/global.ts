import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Ref } from 'vue';
export default defineStore('globalStore', () => {
  const isDark: Ref<boolean> = ref(false);
  return {
    isDark
  };
});
