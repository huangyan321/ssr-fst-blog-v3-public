import type { App } from 'vue';
import { Expand, Fold } from '@element-plus/icons-vue';
const icons = [Expand, Fold];
export default (app: App) => {
  for (const icon of icons) {
    app.component(icon.name + 'Icon', icon);
  }
};
