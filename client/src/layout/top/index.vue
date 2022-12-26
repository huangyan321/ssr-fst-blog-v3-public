<template>
  <header class="top-header f fjc-b fai-c" ref="header">
    <!-- 移动端渲染 -->
    <el-icon :size="30" @click="toggleSideBox" class="top-header__menu-button">
      <expand-icon v-show="!sideBoxOpen" /><fold-icon v-show="sideBoxOpen"
    /></el-icon>
    <!-- web渲染 -->
    <div class="title">
      <router-link to="/" class="top-header__main-icon"
        ><el-image
          :src="titleImg"
          :data-set="white"
          alt="title"
          class="icon"
          fit="contain"
      /></router-link>
    </div>
    <div class="top-header__right">
      <div class="autocomplete">
        <client-only>
          <el-autocomplete
            v-model="searchKey"
            :fetch-suggestions="querySearch"
            value-key="title"
            :trigger-on-focus="true"
            clearable
            :teleported="true"
            placeholder="Search"
            highlight-first-item
            @select="handleSelect"
            v-if="~$route.path.indexOf('main')"
          />
        </client-only>
      </div>
      <ul class="top-header__right__menu f fjc-c fai-c">
        <li
          class="top-header__right__menu__item"
          v-for="link in topLink"
          :key="link.id"
        >
          <router-link
            :class="{
              'top-header__right__menu__item--click': ~$route.path.indexOf(
                link.route
              )
            }"
            :to="link.route"
            v-if="!link.noLink"
            >{{ link.name }}</router-link
          >
          <template
            v-if="
              (link.widget &&
                ~$route.path.indexOf(link.route) &&
                !link.noLink) ||
              (link.widget && link.noLink)
            "
          >
            <component :is="typeComponentsMap[link.widget]" />
          </template>
        </li>
      </ul>

      <div class="right-dropdown">
        <client-only>
          <el-dropdown
            class="avatar-container"
            trigger="click"
            :teleported="true"
            size="large"
            :hide-on-click="false"
          >
            <el-icon class="el-icon--right" :size="20">
              <arrow-down />
            </el-icon>
            <template #dropdown>
              <el-dropdown-menu class="user-dropdown">
                <template v-for="link in topLink" :key="link.id">
                  <template v-if="itCanBeShow('mobile', link)">
                    <el-dropdown-item
                      :class="{
                        'top-header__menu__item--click': true
                      }"
                    >
                      <router-link :to="link.route" v-if="!link.noLink">
                        <span>{{ link.name }}</span>
                      </router-link>
                      <component
                        v-else-if="link.noLink && link.widget"
                        :is="typeComponentsMap[link.widget]"
                      />
                    </el-dropdown-item>
                  </template>
                </template>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </client-only>
      </div>
    </div>
  </header>
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
  Ref,
  watch
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { topLink } from '@/config/top_conf';
import { ArrowDown } from '@element-plus/icons-vue';
import { throttle, IsPC } from '@/utils/usual';
import { storeToRefs } from 'pinia';
import useSideStore from '@/store/modules/side';
import useTopStore from '@/store/modules/top';
import useGlobalStore from '@/store/modules/global';
import collapse from '@/common/widget/Collapse.vue';
import theme from '@/common/widget/Theme.vue';
import { topLinkType, platformType } from '@/@types/types';
import ClientOnly from '@/common/ClientOnly';
import type { AutocompleteFetchSuggestionsCallback } from 'element-plus';
const typeComponentsMap: any = {
  collapse,
  theme
};
const router = useRouter();
const sideStore = useSideStore();
const topStore = useTopStore();
const globalStore = useGlobalStore();
const { isDark } = storeToRefs(globalStore);
const { isInList, sideBoxOpen } = storeToRefs(sideStore);
const { header } = storeToRefs(topStore);
const searchKey = ref('');
const querySearch = (
  queryString: string,
  cb: AutocompleteFetchSuggestionsCallback
): void => {
  topStore
    .getBlogsByLikeWords({
      words: queryString
    })
    .then((results) => {
      cb(results);
    });
  // call callback function to return suggestions
};
const handleSelect = (item: any) => {
  if (searchKey.value) searchKey.value = '';
  router.push('/main/post/' + item.blog_id);
};

const toggleSideBox = () => {
  sideStore.toggleSideBox();
};
const dark = require('@/assets/img/title_dark.png');
const white = require('@/assets/img/title_white.png');
const titleImg = ref(dark);
watchEffect(() => {
  isDark.value ? (titleImg.value = white) : (titleImg.value = dark);
});
// PC端向下滚动时收起header
const handleScroll = () => {
  if (!isInList.value) {
    if (searchKey.value) searchKey.value = '';
    let toTop = document.documentElement.scrollTop || document.body.scrollTop;
    let isTop = toTop === 0;
    if (IsPC() && header.value) {
      isTop ? topStore.openHeader() : topStore.closeHeader();
    }
  }
};
watch(isInList, topStore.openHeader);
onMounted(() => {
  if (typeof window !== undefined) {
    window.addEventListener('scroll', throttle(handleScroll, 200));
  }
});
const itCanBeShow = (platform: platformType, link: topLinkType) => {
  if (!link.platform) return true;
  return link.platform === platform || link.platform === 'all';
};
defineExpose({});
</script>
<style scoped lang="stylus">
.autocomplete
  display: block
.top-header
  width 100%
  margin-right calc(100% - 100vw)
  height 60px
  position fixed
  top 0
  line-height 60px
  overflow hidden
  transition all .2s;
  transform translateZ(0)
  box-shadow var(--theme-box-shadow)
  padding 0 40px
  // backdrop-filter saturate(50%) blur(4px)
  background-color var(--theme-header-bg)
  z-index 999
  .title
    height: 60px;
  &__menu-button
    width 32px
    height 32px
    display none
  &__main-icon
    text-decoration none
    font-weight 600
    font-size 20px
    height 100%
    display flex
    align-items center
    .icon
      height 40%
  &__right
    display flex
    &__menu
      margin-right 30px
      &__item
        display inline-block
        height 100%
        &--click
          color var(--el-text-color-hover) !important
          opacity 1  !important
        a
          text-decoration none
          opacity 0.8
          color var(--el-text-color-secondary)
          padding 0 20px
          &:hover
            color var(--el-text-color-hover)
            opacity 1
            text-decoration none
.right-dropdown
  float right
  height 100%
  line-height 50px
  display none
  .avatar-container
    margin-right 30px
    .avatar-wrapper
      margin-top 5px
      position relative
      .user-avatar
        cursor pointer
        width 40px
        height 40px
        border-radius 10px
      .el-icon-caret-bottom
        cursor pointer
        position absolute
        right -20px
        top -7px
        font-size 12px
        &::before
          font-size 20px
/* fade-transform */
.move-enter-active,
.move-leave-active {
  transition: opacity 0.3s ease;
}

.move-enter-from,
.move-leave-to {
  opacity: 0;
}
// 屏幕宽度小于850px时 字体居中
@media screen and (max-width: 1024px)
  .autocomplete
    display: none
  .input-bar
    display none
  .top-header
    text-align center
    padding 0
    &__right
      &__menu
        display none
    &__menu
      display none
    &__menu-button
      display flex
      margin-left 10px
    &__main-icon
      justify-content center
  .right-dropdown
    display flex
    justify-content center
    align-items center
</style>
<style lang="stylus">
.el-dropdown-menu__item
  justify-content center
</style>
