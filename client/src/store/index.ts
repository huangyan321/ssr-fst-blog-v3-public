// import { createStore as _createStore } from 'vuex'
import { createPinia as _createStore } from 'pinia';
export default () => {
  const _pinia = _createStore();

  return _pinia;
};
