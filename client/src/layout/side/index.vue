<template>
  <aside class="sideBox">
    <div
      class="sideBox__mask"
      :class="{ 'sideBox__mask--show': sideBoxOpen }"
      @click="closeSideBox"
    ></div>
    <div
      class="sideBox__main"
      :class="{ 'sideBox__main--open': sideBoxOpen }"
      :style="maskStyles"
    >
      <router-link to="/">
        <el-avatar class="sideBox__avatar" :src="avatar" />
      </router-link>

      <p class="sideBox__name"></p>
      <p class="sideBox__autograph">just want something simpler...</p>
      <ul class="sideBox__iconList">
        <li
          v-for="(icon, idx) in iconList"
          :key="idx"
          class="sideBox__iconItem"
        >
          <a :href="icon.href"
            ><i class="iconfont" :class="'icon-' + icon.name"></i
          ></a>
        </li>
      </ul>
      <h3 class="sideBox__widget__title">
        {{ sideStore.isInList ? 'Tags' : 'Content' }}
      </h3>
      <ul class="sideBox__tagList" v-if="sideStore.isInList">
        <li
          v-for="tag in sideStore.tags"
          class="sideBox__tagItem"
          :class="{
            'sideBox__tagItem--active': sideStore.selectTags.find(
              (e) => tag[0] === e.name
            )
          }"
          @click="triggerSelectTags(tag)"
        >
          <span>{{ tag[0] }}</span
          ><i class="sideBox__tagItem__count">{{ tag[1].count }}</i>
        </li>
      </ul>
      <nav
        class="dirBox"
        :class="{ 'dirBox--fixed': scrollTop >= 240 }"
        :style="{
          maxHeight: dirHeight + 'px',
          height: dirHeight + 'px'
        }"
        ref="dirBox"
        v-else
      >
        <ul class="dirBox__body" ref="dirBody">
          <li
            v-for="(item, index) in sideStore.articleDir"
            :style="{ lineHeight: lineHeight + 'px' }"
            class="dirBox__item"
            :class="'dirBox__' + item.tagName"
          >
            <a
              class="dirBox__link"
              :class="{ dirBox__active: index == curActiveDirIndex }"
              @click="
                (e) => {
                  dirClick(e, index);
                }
              "
              >{{ item.text }}</a
            >
          </li>
        </ul>
      </nav>
    </div>
  </aside>
</template>

<script setup lang="ts">
import {
  ref,
  reactive,
  toRefs,
  onBeforeMount,
  onMounted,
  watchEffect,
  computed,
  watch,
  onServerPrefetch,
  Ref
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { UserFilled } from '@element-plus/icons-vue';
import { iconList } from '@/config/top_conf';
import useSideStore from '@/store/modules/side';
import dirGeneratorHook from '@/hooks/dir-generator-hook';
import { throttle } from '@/utils/usual';
import { storeToRefs } from 'pinia';
import { IsPC } from '@/utils/usual';
const sideStore = useSideStore();
const { sideBoxOpen } = storeToRefs(sideStore);
// 数据预取
onServerPrefetch(async () => {
  try {
    await sideStore.getAllTags();
  } catch (e) {
    console.log(e);
  }
});
const dirBox: Ref<HTMLElement | null> = ref(null);
const dirBody: Ref<HTMLElement | null> = ref(null);
const prevOverflow = ref('auto');
const { dirHeight, curActiveDirIndex, lineHeight, dirClick } = dirGeneratorHook(
  {
    dirBox,
    dirBody
  }
);
/**
 * 仓库
 */
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
const avatar = require('@/assets/img/avatar.png');

// mask宽度
const fitMaskWidth = ref('300px');
const maskStyles = computed(() => {
  if (IsPC()) return {};
  return sideBoxOpen.value
    ? {
        width: fitMaskWidth.value
      }
    : {
        width: fitMaskWidth.value,
        transform: `translateX(-${fitMaskWidth.value})`
      };
});
watch(sideBoxOpen, (n) => {
  if (typeof window !== 'undefined') {
    fitMaskWidth.value = document.body.clientWidth * 0.8 + 'px';

    if (n) {
      prevOverflow.value = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = prevOverflow.value;
    }
  }
});

// 控制 mask 开启或关闭
const closeSideBox = () => {
  sideStore.closeSideBox();
};

// 选中标签后的逻辑
const triggerSelectTags = (tag: any) => {
  sideStore.triggerSelectTags(tag);
};

// 监听当前所在页面，控制侧边栏显示目录还是标签
watchEffect(() => {
  if (route.params.id) {
    sideStore.triggerIsInList(false);
  } else {
    sideStore.triggerIsInList(true);
  }
});
const scrollTop = ref(0);
const getScrollTop = () => {
  let bodyScrollTop = 0,
    bodyDocumentScrollTop = 0;
  if (document.body) {
    if (document.body.clientWidth < 850) {
      return;
    }
    bodyScrollTop = document.body.scrollTop;
  }
  if (document.documentElement) {
    bodyDocumentScrollTop = document.documentElement.scrollTop;
  }
  scrollTop.value = bodyScrollTop + bodyDocumentScrollTop;
};
onBeforeMount(() => {});
watchEffect(() => {
  if (!sideStore.isInList && typeof window !== 'undefined') {
    window.onscroll = throttle(getScrollTop, 50);
  }
});
onBeforeMount(() => {
  //console.log('2.组件挂载页面之前执行----onBeforeMount')
});
onMounted(async () => {
  await sideStore.getAllTags();
  //console.log('3.-组件挂载到页面之后执行-------onMounted')
});
watchEffect(() => {});
// 使用toRefs解构
// let { } = { ...toRefs(data) }
defineExpose({});
</script>
<style scoped lang="stylus">
@import "@/styles/stylus/main.styl"
.sideBox
  width 300px
  float left
  text-align center
  user-select none
  &__widget__title
    padding-left 15px
    text-align start
    font-size: 16px;
    letter-spacing: 1px;
    padding-bottom: 5px;
    font-weight: 300;
    color var(--el-text-color-secondary);
    border-bottom: 1px solid var(--hr-color);
  &__avatar
    width 80px
    height 80px
    border-radius 100%
    overflow hidden
    margin 20px auto
    text-align center
    box-shadow 1px 1px 2px black
  &__autograph
    color $grey
    margin 8px 0
  &__iconList
    margin-bottom 8px
  &__iconItem
    display inline-block
    margin-bottom 8px
    .iconfont
      font-size 28px
      &:hover
        color black
  &__tagList
    max-height 300px
    overflow-y auto
    overflow-x hidden
    margin 10px 0
  &__tagItem
    box-sizing border-box
    display inline-block
    border 1px solid rgba(255, 255, 255, 0.8)
    border-radius 999em
    padding 0 10px 0 10px
    line-height 24px
    font-size 12px
    margin 0 1px 6px 1px
    margin-bottom 6px
    color var(--el-text-color-secondary)
    border-color gray
    margin-right 5px
    cursor pointer
    &--active
      color red
    &__count
      vertical-align: super
      font-size .6em
      opacity .6
      top -0.5em
  .dirBox
    padding-right 15px
    will-change transform
    overflow auto
    width 300px
    transform translateY(15px)
    transition transform .4s
    &::-webkit-scrollbar
      width 6px
      height 80px
      &-thumb
        outline none
        border-radius 2px
        background-color #e4e6eb
      &-track
        box-shadow none
        border-radius 2px
    &--fixed
      position fixed
      top 0
      z-index 1
      transform translateY(150px)
      transition transform .3s
    &__body
      transition transform .3s
      // margin-top 15px
    &__item
      position relative
      list-style none
      text-align left
      font-size: 12px;
      text-overflow ellipsis
      overflow hidden
      white-space nowrap
    &__link
      position relative
      text-overflow ellipsis
      overflow hidden
      white-space nowrap
      transition color .05s
      cursor pointer
      &:hover
        color var( --el-text-color-hover)
    &:deep(.el-link__inner)
      width 246px
      overflow hidden
      text-overflow ellipsis
      white-space nowrap
      display inline-block
    &__active
      color #409eff
    &__h1
      margin-left 5px
    &__h2
      margin-left 15px
    &__h3
      margin-left 25px
@media screen and (max-width 1024px)
  .dirBox
    margin 0 0 20px 20px
    &--fixed
      position static !important
      transform translateY(0) !important
      top 0
      left 0
  .sideBox
    position absolute
    top 0
    left 0
    &__main
      position fixed
      left 0
      top 60px
      bottom 0
      z-index 1
      width 300px
      transform translateX(-300px) translateY(0px) translateZ(2px);
      transition transform .4s,box-shadow .4s
      background-color var(--theme-background-sidebar)
      box-shadow var(--box-shadow)
      &--open
        box-shadow 0 0 10px rgba(0, 0, 0, 0.2)
        transform translateX(0px) translateY(0px) translateZ(2px);
        transition transform .4s,box-shadow .4s
    &__mask
      position fixed
      top 60px
      left 300px
      right 0
      bottom 0
      display block
      z-index 1
      display none
    &__mask--show
      display block
</style>
