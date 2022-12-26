import { defineStore } from 'pinia';
import { queryAllBlogs } from '@/api/article';
import { ref } from 'vue';
import type { Ref } from 'vue';
interface BlogType {
  blog_id: number;
  brief: string;
  create_time: string;
  ext_info: null | string;
  is_top: number;
  publish: number;
  title: string;
  update_time: string;
}
export default defineStore('topStore', () => {
  const isHeaderClose = ref(false);
  const header: Ref<HTMLElement | null> = ref(null);
  const getBlogsByLikeWords = (data: any): Promise<BlogType[]> => {
    return new Promise((resolve, reject) => {
      queryAllBlogs({
        type: 2,
        words: data.words
      })
        .then((res) => {
          if (res.code === 200) {
            resolve(res.data.blogs);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };
  const closeHeader = () => {
    if (header.value) {
      header!.value!.style.transform = 'translate3d(0,-100%,0)';
      isHeaderClose.value = true;
    }
  };
  const openHeader = () => {
    if (header.value) {
      header!.value!.style.transform = 'translateZ(0)';
      isHeaderClose.value = false;
    }
  };
  return {
    getBlogsByLikeWords,
    isHeaderClose,
    closeHeader,
    openHeader,
    header
  };
});
