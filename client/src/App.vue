<template>
  <div class="app-wrap">
    <div class="wrap">
      <Top></Top>
      <div class="main">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component"></component>
          </transition>
        </router-view>
      </div>
      <el-backtop :right="100" :bottom="100" />
      <!-- <Footer></Footer> -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watchEffect, computed } from 'vue';
import { useRouter } from 'vue-router';
import useSideStore from '@/store/modules/side';
import { Top, Footer } from '@/layout/index';
const router = useRouter();
const sideStore = useSideStore();
router.beforeEach((to, form, next) => {
  if (to.params.id) {
    sideStore.articleDir = [];
  }
  next();
});
</script>

<style lang="stylus">
@import "@/assets/fonts/iconfont.css"
@import "@/styles/themes/var.css"
@import '@/styles/stylus/main.styl'
@import '@/styles/md-themes/highlight.styl'
.app-wrap
  width 100vw
  height 100vh
.fade-enter-active, .fade-leave-active
  transition all 0.3s ease
.fade-enter, .fade-leave-active
  opacity 0
.wrap
  min-height 100%
  margin-bottom -($footer-height)
  background var(--el-bg-color)
  transition: color .3s,background-color .3s;
// .wrap:after
//   content ''
//   display block
//   height $footer-height
a
  text-decoration none
  color $blue-link
  &:hover
    text-decoration underline
@media screen and (max-width 1024px)
  .fade-enter
    transform translate(30px, 0px)
  .fade-leave-active
    transform translate(-30px, 0px)
  .side
    padding-top: 60px
/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
// ::-webkit-scrollbar {
//   width: 3px;
//   height: 6px;
//   background-color: #f5f5f5;
// }

// /*定义滚动条轨道 内阴影+圆角*/
// ::-webkit-scrollbar-track {
//   -webkit-box-shadow: inset 0 0 6px #bfbfbf;
//   border-radius: 10px;
//   background-color: #fff;
// }

// /*定义滑块 内阴影+圆角*/
// ::-webkit-scrollbar-thumb {
//   border-radius: 10px;
//   -webkit-box-shadow: inset 0 0 6px #bfbfbf;
//   background-color: #aaa;
// }
</style>
