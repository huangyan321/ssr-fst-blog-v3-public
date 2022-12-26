<template>
  <div class="list">
    <!-- <div class="list__loading">loading</div> -->
    <ul class="list__article">
      <el-skeleton :loading="listStore.listLoading" animated>
        <template #template>
          <li class="list__article__item">
            <el-skeleton-item
              variant="h3"
              class="list__article__item__title"
              style="width: 50%"
            />
            <div class="list__article__item__info">
              <el-skeleton-item
                variant="text"
                class="list__article__item__time"
                style="width: 30%"
              />
              <div class="list__article__item__abstract markdown-body">
                <el-skeleton-item
                  variant="p"
                  style="width: 100%"
                  v-for="item in 4"
                />
              </div>
            </div>
          </li>
        </template>
        <template #default>
          <template v-if="listStore.blogs.length">
            <li class="list__article__item" v-for="blog in listStore.blogs">
              <h3 class="list__article__item__title">
                <router-link :to="'/main/post/' + blog.blog_id"
                  >{{ blog.title }}
                </router-link>
              </h3>
              <div class="list__article__item__info">
                <p class="list__article__item__time">
                  {{ blog.create_time }}
                </p>
                <div
                  class="list__article__item__abstract markdown-body"
                  v-html="compileMd2Html(blog.brief)"
                ></div>
              </div>
              <ul class="list__article__tags">
                <li class="list__article__tags__item" v-for="tag in blog.tags">
                  {{ tag.name }}
                </li>
              </ul>
              <hr />
            </li>
          </template>
          <no-data v-else />
        </template>
      </el-skeleton>
    </ul>
    <Pagination
      :small="true"
      :total="listStore.total"
      :limit="listStore.pageSize"
      :page="listStore.pageNum"
      @pagination="changePage"
    ></Pagination>
  </div>
</template>

<script lang="ts" setup>
import type { Ref } from 'vue';
import {
  ref,
  onMounted,
  onServerPrefetch,
  computed,
  watchEffect,
  watch
} from 'vue';
import compileMd2Html from '@/utils/marked';
import useListStore from '@/store/modules/list';
import useSideStore from '@/store/modules/side';
import list from '@/store/modules/list';
import Pagination from '@/common/Pagination.vue';
import NoData from '@/common/NoData.vue';
import { storeToRefs } from 'pinia';

const listStore = useListStore();
const sideStore = useSideStore();
// 数据预取
onServerPrefetch(listStore.getAllBlogs);
watch(
  sideStore.selectTags,
  () => {
    listStore.resetPageNum();
    listStore.getBlogsBySelectTags();
  },
  {
    deep: false
  }
);
onMounted(() => {
  // TODO 刷新时已经从服务器取到数据 第一次挂载时不必再请求
  listStore.getAllBlogs();
});
const changePage = () => {
  listStore.getAllBlogs();
};
</script>

<style lang="stylus" scoped>
.pulldown__wrapper
  display none
  position absolute
  z-index -1
  width 100%
  padding 30px
  box-sizing border-box
  transform translateY(-100%) translateZ(0)
  text-align center
  color #999
.list
  padding 5px
  max-width 1260px
  height 100%
  margin 0 auto
  &__article
    margin-left 325px
    &__tags
      &__item
        display inline-block
        border 1px solid rgba(255, 255, 255, 0.8)
        border-radius 999em
        padding 0 10px
        line-height 24px
        font-size 12px
        margin 0 1px 6px 1px
        margin-bottom 6px
        color gray
        border-color gray
        margin-right 5px
    &__item
      list-style none
      &__title
        a
          color var(--el-text-color-primary)
          font-size 1.15em
          font-weight normal
          margin-block 0
      &__abstract
        margin 10px 0
        cursor pointer
        min-height 50px
      &__info
      &__time
        font-size 14px
        color var(--el-text-color-secondary)
        font-weight 400
        margin-bottom 15px
        margin-top 10px
@media screen and (max-width 1024px)
  .pulldown-wrapper
    display block
  .list
    height auto
    position relative
    &__article
      margin-left 0
      &__item
        margin 0 auto
        padding 0 10px 10px 10px
        margin-bottom 15px
</style>
