<template>
  <div class="article">
    <div class="article__main">
      <div class="article__title">
        <el-skeleton :loading="listStore.articleLoading" animated>
          <template #template>
            <div class="article__content markdown-body">
              <el-skeleton-item variant="h1" style="width: 30%" />
            </div>
          </template>
          <template #default>
            <h1>{{ currentBlog?.title || '' }}</h1>
          </template>
        </el-skeleton>
      </div>
      <div class="article__header">
        <div class="article__header__time">
          <i class="iconfont icon-clock-filling clock"></i>&nbsp;<span>{{
            currentBlog.create_time
          }}</span>
        </div>
        <div class="article__header__tags">
          <i class="iconfont icon-tag tag"></i>
          <el-link
            v-for="tag in currentBlog?.tags"
            type="primary"
            class="article__header__tags__item"
            @click="filterOutTags(tag)"
            >{{ tag.name }}</el-link
          >
        </div>
      </div>
      <el-skeleton :loading="listStore.articleLoading" animated>
        <template #template>
          <div class="article__content markdown-body">
            <el-skeleton-item variant="h1" style="width: 50%" />
            <hr style="article__hr" />
            <el-skeleton-item variant="text" v-for="i in 8" />
            <el-skeleton-item variant="text" style="width: 80%" />
          </div>
        </template>
        <template #default>
          <div
            class="article__content markdown-body"
            ref="blogRef"
            v-html="currentBlog?.content && compileMd2Html(currentBlog.content)"
          ></div>
          <div class="article__lastUpdateTime">
            update: {{ currentBlog?.update_time }}
          </div>

          <div class="social-section">
            <div id="gitalk-container"></div>
          </div>
        </template>
      </el-skeleton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { BlogType } from '@/@types/store.d';
import compileMd2Html from '@/utils/marked';
import {
  ref,
  onMounted,
  watchEffect,
  onServerPrefetch,
  reactive,
  nextTick
} from 'vue';
import type { Ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import useListStore from '@/store/modules/list';
import useSideStore from '@/store/modules/side';
import Gitalk from 'gitalk';
import 'viewerjs/dist/viewer.css';
import Viewer from 'viewerjs';

const route = useRoute();
const router = useRouter();
const showLoading = ref(false);
const listStore = useListStore();
const sideStore = useSideStore();
const { currentBlog } = storeToRefs(listStore);
const filterOutTags = (tag: any) => {
  const name = tag.name;
  router.push('/main/list');
  // sideStore.resetSelectTags();
  if (sideStore.selectTags.find((tag) => tag.name === name)) return;
  sideStore.triggerSelectTags([
    tag.name,
    {
      tag_id: tag.tag_id
    }
  ]);
};

const blogRef = ref<InstanceType<typeof HTMLElement>>();
// 生成文章目录
const generateDirectory = () => {
  const dirs = Array.from(
    blogRef.value?.querySelectorAll('h1,h2,h3') || []
  ).map((tag: any, index) => {
    tag.id = tag.localName + '-' + index;
    return {
      tag,
      tagName: tag.localName,
      text: tag.innerText,
      href: '#' + tag.localName + '-' + index
    };
  });
  sideStore.triggerDir(dirs);
  if (typeof window !== 'undefined') {
    const gitalk = new Gitalk({
      clientID: 'bf99b2f7d92181a37ef2',
      clientSecret: '997fc59c3949b149cbcdc70fe95f5f6b1b4c7171',
      repo: 'ssr-fst-blog-comment',
      owner: 'huangyan321',
      admin: ['huangyan321'],
      id: currentBlog.value
        ? String((currentBlog.value as unknown as BlogType).blog_id)
        : 'default', // Ensure uniqueness and length less than 50
      distractionFreeMode: false // Facebook-like distraction free mode
    });
    gitalk.render('gitalk-container');
  }
};

const getPost = async () => {
  sideStore.articleDir = [];
  const id = route.params.id as string;
  await listStore.getOneBlog(id);
  nextTick(() => {
    generateDirectory();
    if (blogRef.value) {
      const gallery = new Viewer(blogRef.value);
    }
  });
};

// onMounted(getPost);
watchEffect(() => {
  if (route.params.id) {
    getPost();
  }
});

// 数据预取
onServerPrefetch(async () => {
  try {
    const id = route.params.id as string;
    await listStore.getOneBlog(id);
  } catch (err) {
    console.log('err:', err);
  }
});
</script>
<style scoped>
@import '@/styles/css/gitalk.css';
</style>
<style lang="stylus" scoped>
.article
  padding 5px
  max-width 1260px
  margin 0 auto
  font-size 14px
  &__hr
    box-sizing: content-box;
    height: 0;
    overflow: visible;
    margin: 20px 0;
    border: 0;
    border-top: 1px solid #eee;
  &__main
    margin-left 325px
    min-height 100%
  &__title
    margin-bottom 10px
    > h1
      color var(--text-color) !important
      font-size 1.5em
      font-weight normal
      margin-block 0
  &__lastUpdateTime
    color: #7f8c8d
    font-weight: 200
    margin-top: 15px
    font-size: 12px
    text-align: right
  &__header
    display flex
    align-items center
    margin 10px 0 15px
    &__tags
      margin-left 10px
      .tag {
        font-size 14px
      }
      &__item
        margin-left 10px
        line-height 1
        display inline-block
        list-style none
        font-size 12px
    &__time
      line-height 1
      text-rendering auto
      color var(--el-text-color-secondary) !important
      .clock
        color #999999
        font-size 12px
@media screen and (max-width: 1024px)
  .article
    position relative
    padding 8px
    &__main
      margin-left 0
    &__loading
      position absolute
      top 200px
      left 50%
      width 300px
      margin-left -(@width/2)
</style>
