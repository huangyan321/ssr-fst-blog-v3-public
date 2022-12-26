<template>
  <div id="sandbox" ref="sandbox">
    <div class="codeArea">
      <div class="left">
        <p><i class="iconfont icon-HTML" />html</p>
        <editor
          ref="htmlRef"
          language="html"
          :initialFragment="templateHtml"
          @contentChanged="contentChanged"
        ></editor>
      </div>
      <div class="medium">
        <p><i class="iconfont icon-css" />css</p>
        <editor
          ref="cssRef"
          language="css"
          :initialFragment="templateCss"
          @contentChanged="contentChanged"
        ></editor>
      </div>
      <div class="right">
        <p><i class="iconfont icon-javascript" />js</p>
        <editor
          ref="javascriptRef"
          language="javascript"
          :initialFragment="templateJs"
          @contentChanged="contentChanged"
        ></editor>
      </div>
    </div>
    <div class="renderArea">
      <iframe class="view-panel" frameborder="0" ref="previewEl"></iframe>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  reactive,
  toRefs,
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
  watchEffect,
  computed,
  watch,
  nextTick
} from 'vue';
import type { Ref } from 'vue';
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router';
import editor from '@/common/monaco-editor/index.vue';
import { setCache, getCache } from '@/utils/cache';
import useTopStore from '@/store/modules/top';
import { storeToRefs } from 'pinia';
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
const topStore = useTopStore();
const { isHeaderClose } = storeToRefs(topStore);
const sandbox: Ref<HTMLElement | null> = ref(null);
const htmlRef: Ref<InstanceType<typeof editor> | null> = ref(null);
const javascriptRef: Ref<InstanceType<typeof editor> | null> = ref(null);
const cssRef: Ref<InstanceType<typeof editor> | null> = ref(null);

onBeforeRouteLeave(() => {
  setCache('template', {
    templateJs: templateJs.value,
    templateHtml: templateHtml.value,
    templateCss: templateCss.value
  });
});
const templateJs = ref('');
const templateHtml = ref(`
<div class="container">

</div>
`);
const templateCss = ref(`
.container {
  width: 100%;
  height: 100%;
  background-color: gray;
}
`);
const previewEl: Ref<HTMLIFrameElement | null> = ref(null);
const contentChanged = (content: string, language: string) => {
  switch (language) {
    case 'html':
      templateHtml.value = content;
      break;
    case 'css':
      templateCss.value = content;
      break;
    case 'javascript':
      templateJs.value = content;
      break;
  }
  run();
};
const run = () => {
  const html = templateHtml.value;
  const css = templateCss.value;
  const js = templateJs.value;
  let code =
    '<!DOCTYPE html>\n' +
    '<html lang="zh">\n' +
    '<head>\n' +
    '<meta charset="utf-8" />\n' +
    '<meta http-equiv="X-UA-Compatible" content="IE=edge" />\n' +
    '<meta name="viewport" content="width=device-width,initial-scale=1.0" />\n' +
    '<title>Editor<\/title>\n' +
    '<style>\n' +
    css +
    '<\/style>\n' +
    '<\/head>\n' +
    ' <body>\n' +
    html +
    '<script>\n' +
    js +
    '<\/script>\n' +
    '<\/body>\n' +
    '<\/html>\n';
  previewEl.value?.setAttribute('srcdoc', code);
};
onBeforeMount(() => {
  //console.log('2.组件挂载页面之前执行----onBeforeMount')
});
onBeforeUnmount(() => {
  stopWatcher();
});
onMounted(() => {
  const template = getCache('template');
  if (template) {
    templateJs.value = template.templateJs;
    templateHtml.value = template.templateHtml;
    templateCss.value = template.templateCss;
  }
  run();
});
const stopWatcher = watch(isHeaderClose, (n) => {
  if (n) {
    sandbox.value!.style!.paddingTop = '0';
  } else {
    sandbox.value!.style!.paddingTop = '60px';
  }
  nextTick(() => {
    const height = document.body.clientHeight;
    const width = document.body.clientWidth;
    const params = {
      height: height / 2,
      width: width / 3
    };
    htmlRef.value?.layout(params);
    javascriptRef.value?.layout(params);
    cssRef.value?.layout(params);
  });
});
watchEffect(() => {});
</script>
<style scoped lang="stylus">
#sandbox
  padding-top 60px
  width 100vw
  height 100vh
  transition padding .4s
  .codeArea
    width 100vw
    height 50%
    overflow hidden
    display flex
    flex-flow row nowrap
    .left,.medium,.right
      width 33.3%
      height 100%
      font-size 18px
    .left
      color #f7622c
    .medium
      color #2196f3
    .right
      color #ffca28
  .renderArea
    width 100%
    height 50%
    overflow hidden
    .view-panel
      width 100%
      height 100%
</style>
