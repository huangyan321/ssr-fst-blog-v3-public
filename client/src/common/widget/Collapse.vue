<template>
  <teleport to="body" :disabled="!topStore.isHeaderClose">
    <i
      ref="collapseRef"
      class="iconfont collapse"
      :class="[
        topStore.isHeaderClose ? 'icon-arrow-down overflows' : 'icon-arrow-up'
      ]"
      @click="triggerHeader"
    ></i>
  </teleport>
</template>

<script setup lang="ts">
import {
  ref,
  reactive,
  toRefs,
  onBeforeMount,
  onMounted,
  watchEffect,
  computed
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import useTopStore from '@/store/modules/top';
const topStore = useTopStore();
const triggerHeader = () => {
  topStore.isHeaderClose ? topStore.openHeader() : topStore.closeHeader();
};

defineExpose({});
</script>
<style scoped lang="stylus">
.collapse
  cursor pointer
.overflows
  position fixed
  right 20px
  top 5px
</style>
