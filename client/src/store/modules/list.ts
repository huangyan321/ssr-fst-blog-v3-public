import compileMd2Html from '@/utils/marked';
import useSideStore from './side';
import type { BlogType } from '@/@types/store.d';
import type { Ref } from 'vue';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { BScroll } from '@better-scroll/core/dist/types/BScroll';
import {
  queryAllBlogs,
  queryBlogsBySelectTags,
  queryOneBlog
} from '@/api/article';
export default defineStore('listStore', () => {
  const blogs: Ref<any[]> = ref([]),
    pageNum: Ref<number> = ref(1),
    pageSize: Ref<number> = ref(6),
    total: Ref<number> = ref(0),
    listLoading: Ref<boolean> = ref(false),
    articleLoading: Ref<boolean> = ref(false),
    currentBlog: Ref<BlogType> = ref({
      blog_id: void 0,
      content: null,
      create_time: '',
      update_time: '',
      is_top: 1,
      publish: 1,
      ext_info: null,
      title: void 0,
      brief: null,
      tags: []
    }),
    currentlyCompiledBlog: Ref<string> = ref(''),
    BScrollInstance: Ref<BScroll | null> = ref(null);
  const sideStore = useSideStore();
  const getAllBlogs = async () => {
    if (!sideStore.selectTags.length) {
      listLoading.value = true;
      const res = await queryAllBlogs({
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        type: 0
      });
      if (res.code === 200) {
        blogs.value = res.data.blogs;
        total.value = res.data.count;
      }
      listLoading.value = false;
    } else {
      getBlogsBySelectTags();
    }
  };
  const getOneBlog = async (id: number | string) => {
    if (currentBlog.value.blog_id == id) {
      return 'blog-equal';
    }
    articleLoading.value = true;
    const res = await queryOneBlog(id as number);
    currentBlog.value = res.data.blog;
    currentlyCompiledBlog.value = compileMd2Html(res.data.blog.content);
    articleLoading.value = false;
  };
  const getBlogsBySelectTags = async () => {
    if (sideStore.selectTagsId.length) {
      listLoading.value = true;
      const res = await queryBlogsBySelectTags({
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        tag_id: sideStore.selectTagsId.join(','),
        type: 1
      });
      if (res.code === 200) {
        blogs.value = res.data.blogs;
        total.value = res.data.count;
      }
      listLoading.value = false;
    } else {
      getAllBlogs();
    }
  };
  const triggerPage = (page: any) => {
    page.pageNum ? (pageNum.value = page.pageNum) : '';
    page.pageSize ? (pageSize.value = page.pageSize) : '';
  };
  const resetPageNum = () => {
    pageNum.value = 1;
  };
  return {
    blogs,
    pageNum,
    pageSize,
    total,
    currentBlog,
    currentlyCompiledBlog,
    getAllBlogs,
    getOneBlog,
    getBlogsBySelectTags,
    triggerPage,
    resetPageNum,
    listLoading,
    articleLoading,
    BScrollInstance
  };
});
