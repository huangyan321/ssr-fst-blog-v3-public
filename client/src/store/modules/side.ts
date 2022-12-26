import { defineStore } from 'pinia';
import { ref, reactive } from 'vue';
import type { Ref } from 'vue';
import { queryAllTags } from '@/api/tags';
import { unique } from '@/utils/usual';
export default defineStore('sideStore', () => {
  const tags: Ref<any[]> = ref([]),
    sideBoxOpen: Ref<boolean> = ref(false),
    selectTags: any[] = reactive([]),
    selectTagsId: number[] = reactive([]),
    isInList: Ref<boolean> = ref(true),
    articleDir: Ref<any[]> = ref([]),
    loading: Ref<boolean> = ref(false);
  const getAllTags = async () => {
    const res = await queryAllTags();
    if (res.code === 200) {
      const uniqueArr = unique(res.data.tags, 'name');
      tags.value = uniqueArr;
    }
  };
  const toggleSideBox = () => {
    sideBoxOpen.value = !sideBoxOpen.value;
  };
  const closeSideBox = () => {
    sideBoxOpen.value = false;
  };
  const triggerSelectTags = (tag: any) => {
    const name = tag[0];
    const tag_id = tag[1].tag_id;
    if (typeof selectTags.find((e) => e.name === name) === 'undefined') {
      selectTags.push({
        name,
        tag_id
      });
      selectTagsId.push(tag_id);
    } else {
      const index = selectTags.findIndex((e) => e.name === name);
      if (~index) {
        selectTags.splice(index, 1);
        selectTagsId.splice(index, 1);
      }
    }
  };
  const resetSelectTags = () => {
    selectTagsId.length = selectTags.length = 0;
  };
  const triggerDir = (dir: any) => {
    articleDir.value = dir;
  };
  const triggerIsInList = (value: boolean) => {
    isInList.value = value;
  };
  return {
    tags,
    sideBoxOpen,
    selectTags,
    selectTagsId,
    isInList,
    articleDir,
    getAllTags,
    toggleSideBox,
    closeSideBox,
    triggerSelectTags,
    resetSelectTags,
    triggerDir,
    triggerIsInList,
    loading
  };
});
