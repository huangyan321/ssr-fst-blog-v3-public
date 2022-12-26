<template>
  <div ref="editorContainer" class="editorContainer"></div>
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
  nextTick,
  toRaw
} from 'vue';
import type { Ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { debounce } from '../../utils/usual';
import type { editor } from 'monaco-editor/esm/vs/editor/editor.api';
const props = defineProps({
  language: {
    type: String,
    default: ''
  },
  initialFragment: {
    type: String,
    default: ''
  }
});
const emits = defineEmits(['contentChanged']);
/**
 * 路由对象
 */
const route = useRoute();
/**
 * 路由实例
 */
const router = useRouter();
//console.log('1-开始创建组件-setup')
const editorContainer: Ref<HTMLElement | null> = ref(null);
let monacoInstance: editor.IStandaloneCodeEditor | null = null;
const init = async () => {
  const monaco = registerMonaco();
  const monacoApi = await monaco.api();
  // @ts-ignore
  await monaco[props.language]?.();
  await monaco.fc();
  const instance = monacoApi.editor.create(
    editorContainer?.value as unknown as HTMLElement,
    {
      theme: 'vs-dark', // 主题
      value: props.initialFragment,
      language: props.language
    }
  );
  const event = debounce(() => {
    emits('contentChanged', instance.getValue(), props.language);
  }, 500);
  instance.onDidChangeModelContent(event);
  // @ts-ignore
  monacoInstance = instance;
};
onMounted(init);
const layout = (dimension: editor.IDimension | undefined) => {
  // @ts-ignore
  monacoInstance?.layout(dimension);
};
const registerMonaco = () => {
  return {
    api: () => import('monaco-editor/esm/vs/editor/editor.api.js'),
    javascript: () =>
      import(
        // @ts-ignore
        'monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution'
      ),
    html: () =>
      import(
        // @ts-ignore
        'monaco-editor/esm/vs/basic-languages/html/html.contribution'
      ),
    css: () =>
      import(
        // @ts-ignore
        'monaco-editor/esm/vs/basic-languages/css/css.contribution'
      ),
    fc: () =>
      import(
        // @ts-ignore
        'monaco-editor/esm/vs/editor/contrib/find/browser/findController.js'
      )
  };
};
const dispose = () => {
  if (monacoInstance) {
    if (monacoInstance?.getModel()) {
      monacoInstance?.getModel()?.dispose();
    }
    monacoInstance?.dispose();
    monacoInstance = null;
  }
};
onBeforeUnmount(() => {
  dispose();
});
watchEffect(() => {});
// 使用toRefs解构
// let { } = { ...toRefs(data) }
defineExpose({
  layout,
  dispose,
  init
});
</script>
<style scoped lang="stylus">
.editorContainer
  width 100%
  height 100%
</style>
