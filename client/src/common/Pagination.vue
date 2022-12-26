<template>
  <div class="pagination-container">
    <el-pagination
      :total="total"
      :small="small"
      :background="background"
      v-model:current-page="currentPage"
      :page-size.sync="pageSize"
      :layout="layout"
      :page-sizes="[2, 5, 10, 15]"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      hide-on-single-page
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import useListStore from '@/store/modules/list';
import { scrollTo } from '@/utils/scroll-to';
const listStore = useListStore();
const emit = defineEmits(['pagination']);
const props = defineProps({
  total: {
    required: true,
    type: Number
  },
  page: {
    type: Number,
    default: 1
  },
  limit: {
    type: Number,
    default: 20
  },
  pageSizes: {
    type: Array<number>,
    default: () => [2, 5, 10, 15]
  },
  layout: {
    type: String,
    default: 'prev, pager, next,->'
  },
  background: {
    type: Boolean,
    default: false
  },
  autoScroll: {
    type: Boolean,
    default: true
  },
  hidden: {
    type: Boolean,
    default: false
  },
  small: {
    type: Boolean,
    default: false
  }
});
const currentPage = computed({
  get: () => {
    return props.page;
  },
  set: (val) => {
    listStore.triggerPage({ pageNum: val });
  }
});
const pageSize = computed({
  get: () => {
    return props.limit;
  },
  set: (val) => {
    listStore.triggerPage({ pageSize: val });
  }
});
const handleSizeChange = (val: number) => {
  emit('pagination', { page: currentPage.value, limit: val });
  if (props.autoScroll) {
    scrollTo(0, 800);
  }
};
const handleCurrentChange = (val: number) => {
  emit('pagination', { page: val });
  if (props.autoScroll) {
    scrollTo(0, 800);
  }
};
</script>
<style scoped lang="stylus">
.pagination-container
  padding 32px 16px
  display flex
  justify-content center
.pagination-container.hidden
  display none
</style>
