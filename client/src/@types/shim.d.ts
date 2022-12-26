declare module '*.vue' {
  import { ComponentOptions } from 'vue';
  const componentOptions: ComponentOptions;
  export default componentOptions;
}
interface Window {
  __INITIAL_STATE__: string;
}
