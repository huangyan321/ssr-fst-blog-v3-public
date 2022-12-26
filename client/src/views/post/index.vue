<template>
  <div class="post">
    <div class="side">
      <Side></Side>
    </div>
    <router-view v-slot="{ Component }">
      <!-- <div :style="{ height: listHeight + 'px' }" ref="listRef"> -->
        <!-- <div class="scroller"> -->
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        <!-- </div> -->
      <!-- </div> -->
    </router-view>
  </div>
</template>

<script lang="ts" setup>
import { Side } from '@/layout/index';
// import bScrollHooks from '@/hooks/bscroll-hook';
// 为bs提供下拉刷新能力
// const { listRef, listHeight, beforePullDown, isPullingDown, bs } =
//   bScrollHooks();
</script>

<style lang="stylus" scoped>
.side
  padding 10px
  max-width 1260px
  margin 0 auto
  padding-top 80px
@media screen and (max-width 1024px)
  .side
    padding 60px 0 0 0
</style>
