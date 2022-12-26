/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

class InlineChunkHtmlPlugin {
  constructor(htmlWebpackPlugin, tests) {
    this.htmlWebpackPlugin = htmlWebpackPlugin;
    this.tests = tests;
  }

  getInlinedTag(publicPath, assets, tag) {
    if (tag.tagName !== 'link' || !(tag.attributes && tag.attributes.href)) {
      return tag;
    }
    const sourceName = publicPath
      ? tag.attributes.href.replace(publicPath, '')
      : tag.attributes.href;
    if (!this.tests.some(test => sourceName.match(test))) {
      return tag;
    }
    const asset = assets[sourceName];
    if (asset == null) {
      return tag;
    }
    return { tagName: 'style', innerHTML: asset.source(), closeTag: true };
  }

  apply(compiler) {
    let publicPath = compiler.options.output.publicPath || '';
    if (publicPath && !publicPath.endsWith('/')) {
      publicPath += '/';
    }

    compiler.hooks.compilation.tap('InlineChunkHtmlPlugin', compilation => {
      const tagFunction = tag =>
        this.getInlinedTag(publicPath, compilation.assets, tag);

      const hooks = this.htmlWebpackPlugin.getHooks(compilation);
      hooks.alterAssetTagGroups.tap('InlineChunkHtmlPlugin', assets => {
        assets.headTags = assets.headTags.map(tagFunction);
        // assets.bodyTags = assets.bodyTags.map(tagFunction);
      });
    });
  }
}

module.exports = InlineChunkHtmlPlugin;
