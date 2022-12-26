import { onMounted, ref, reactive } from 'vue';
import type { Ref } from 'vue';
import { getCache, setCache } from '../utils/cache';
import useGlobalStore from '@/store/modules/global';
import { storeToRefs } from 'pinia';
export default () => {
  const globalStore = useGlobalStore();
  const { isDark } = storeToRefs(globalStore);
  type themeType = 'dark' | '';
  const bodyEl: Ref<null | HTMLHtmlElement> = ref(null);
  onMounted(() => {
    bodyEl.value = document.querySelector('html');
    const theme = getCache('theme');
    isDark.value = theme === 'dark';
    setTheme(theme);
  });
  const setTheme = (theme: themeType) => {
    if (bodyEl.value) {
      bodyEl.value.className = theme;
      setCache('theme', theme);
    }
  };
  return {
    setTheme,
    isDark
  };
};
