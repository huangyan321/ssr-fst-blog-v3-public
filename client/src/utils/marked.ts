import hljs from 'highlight.js/lib/core';

import { marked } from 'marked';
const languages = [
  'cpp',
  'xml',
  'bash',
  'coffeescript',
  'css',
  'markdown',
  'http',
  'java',
  'javascript',
  'json',
  'less',
  'makefile',
  'nginx',
  'php',
  'python',
  'scss',
  'sql',
  'stylus'
];
hljs.registerLanguage('xml', require('highlight.js/lib/languages/xml'));
hljs.registerLanguage('bash', require('highlight.js/lib/languages/bash'));
hljs.registerLanguage('css', require('highlight.js/lib/languages/css'));
hljs.registerLanguage(
  'markdown',
  require('highlight.js/lib/languages/markdown')
);
hljs.registerLanguage('http', require('highlight.js/lib/languages/http'));
hljs.registerLanguage('java', require('highlight.js/lib/languages/java'));
hljs.registerLanguage(
  'javascript',
  require('highlight.js/lib/languages/javascript')
);
hljs.registerLanguage('json', require('highlight.js/lib/languages/json'));
hljs.registerLanguage('less', require('highlight.js/lib/languages/less'));
hljs.registerLanguage(
  'makefile',
  require('highlight.js/lib/languages/makefile')
);
hljs.registerLanguage('nginx', require('highlight.js/lib/languages/nginx'));
hljs.registerLanguage('php', require('highlight.js/lib/languages/php'));
hljs.registerLanguage('scss', require('highlight.js/lib/languages/scss'));
hljs.registerLanguage('sql', require('highlight.js/lib/languages/sql'));
hljs.registerLanguage('stylus', require('highlight.js/lib/languages/stylus'));
hljs.configure({
  classPrefix: 'hljs-' // don't append class prefix
});
marked.setOptions({
  renderer: new marked.Renderer(),
  highlight: function (code, lang) {
    if (!lang) {
      return;
    }
    if (!~languages.indexOf(lang)) {
      return hljs.highlightAuto(code).value;
    }
    return hljs.highlight(code, {
      language: lang
    }).value;
  }
});
export default marked;
