import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Ref } from 'vue';
import { queryAllBlogs } from '@/api/article';
export default defineStore('articleStore', () => {
  const blogs: Ref<any[]> = ref([]);
});
