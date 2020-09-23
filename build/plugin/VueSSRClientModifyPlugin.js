const fs = require('fs');

module.exports = class VueSSRClientModifyPlugin {
  constructor(options) {
    this.options = options || {};
  }

  // 主要将生成 vue-ssr-client-manifest.json 中的 initial 的内容进行修改
  // 将 read_runtime.min.js 改为 read_runtime.min.[hash:8].js?cors=1
  apply(compiler) {
    compiler.hooks.afterEmit.tap('VueSSRClientModifyPlugin', async (compliation) => {
      const ssrClientManifestName = this.options.name || 'vue-ssr-client-manifest.json';
      const ssrClientManifestObj = compliation.assets['vue-ssr-client-manifest.json'] || {};
      const ssrClientManifestPath = ssrClientManifestObj.existsAt || '';
      let ssrClientManifestSource = ssrClientManifestObj.source();
      const matchedRuntimeChunkObj = /read_runtime.min.\w{8}.js/.exec(ssrClientManifestSource);
      const targetRuntimeChunkName = matchedRuntimeChunkObj && matchedRuntimeChunkObj[0];
      if (targetRuntimeChunkName) {
        let targetPath;
        const outputPath = this.options.outputPath;
        if (outputPath) {
          if (!fs.existsSync(outputPath)) fs.mkdirSync(outputPath);
          targetPath = `${outputPath}/${ssrClientManifestName}`;
          fs.unlinkSync(ssrClientManifestPath);
        } else {
          targetPath = ssrClientManifestPath;
        }
        ssrClientManifestSource = ssrClientManifestSource.replace('read_runtime.min.js', `${targetRuntimeChunkName}?cors=1`).replace(/\r\n|\r|\n|\s/g, '');

        const now = new Date();
        const times = [now.getFullYear(), fixChar(now.getMonth() + 1, '0', 2), fixChar(now.getDate(), '0', 2), fixChar(now.getHours(), '0', 2), fixChar(now.getMinutes(), '0', 2)];
        const output = `
<SSR>
  SSRClientVersion=${times.join('')}
  ClientManifest=${ssrClientManifestSource}
</SSR>`;
        fs.writeFileSync(targetPath, output);
      }
    });
  }
};

function fixChar(str, char, len) {
  str = str.toString();
  while (str.length < len) str = char + str;
  return str;
}
