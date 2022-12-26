<template>
  <div class="hg-theme f fjc-c fai-c">
    <button class="hg-switch" @click="switchTheme">
      <span class="hg-switch-check">
        <span class="hg-switch-icon f fjc-c fai-c"
          ><i class="iconfont icon-sun icon" v-show="!isDark"></i
          ><i class="iconfont icon-moon icon" v-show="isDark"></i
        ></span>
      </span>
    </button>
  </div>
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
import useSetThemeHook from '@/hooks/set-theme-hook';

const { setTheme, isDark } = useSetThemeHook();
const value = ref(false);
/**
 * 路由对象
 */
const route = useRoute();
/**
 * 路由实例
 */
const router = useRouter();
//console.log('1-开始创建组件-setup')
/**
 * 数据部分
 */
const data = reactive({});
const switchTheme = () => {
  isDark.value = !isDark.value;
  if (isDark.value) {
    setTheme('dark');
  } else {
    setTheme('');
  }
};
onBeforeMount(() => {
  //console.log('2.组件挂载页面之前执行----onBeforeMount')
});
onMounted(() => {
  //console.log('3.-组件挂载到页面之后执行-------onMounted')
});
watchEffect(() => {});
// 使用toRefs解构
// let { } = { ...toRefs(data) }
defineExpose({
  ...toRefs(data)
});
</script>
<style lang="stylus">
.hg-theme
  height 100%
  padding 0 20px
  .hg-switch
    position relative
    border-radius 11px
    display block
    width 35px
    height 20px
    flex-shrink 0
    border 1px solid rgba(60, 60, 60, .29)
    background-color #f1f1f1
    transition border-color .25s,background-color .25s
    &:hover
      border-color gray
    &-check
      position absolute
      top 2px
      left 2px
      width 14px
      height 14px
      border-radius 50%
      background-color #ffffff
      box-shadow 0 1px 2px rgba(0, 0, 0, .04), 0 1px 2px rgba(0, 0, 0, .06)
      transition background-color .25s,transform .25s
    &-icon
      position relative
      width 14px
      height 14px
      border-radius 50%
      overflow hidden
      .icon
        font-size 12px !important
.dark
  .hg-theme
    .hg-switch
      background-color #2f2f2f
      &:hover
        border-color gray
      &-check
        transform: translate(16px);
        background-color: #1a1a1a;
      .icon
        color #fecd57
        font-size 14px !important
</style>
