import type { App } from 'vue';
import registerElement from './register-element';
import registerIcons from './register-icons';
export default function registerApp(app: App) {
  // registerElement(app);
  registerIcons(app);
}
