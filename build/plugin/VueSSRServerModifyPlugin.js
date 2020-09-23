const fs = require('fs');

module.exports = class VueSSRServerModifyPlugin {
  constructor(options) {
    this.options = options || {};
  }

  apply(compiler) {
    compiler.hooks.afterEmit.tap('VueSSRServerModifyPlugin', async (compliation) => {
      const ssrServerName = this.options.name || 'vue-ssr-server-bundle.json';
      const ssrServerObj = compliation.assets['vue-ssr-server-bundle.json'] || {};
      const ssrServerPath = ssrServerObj.existsAt || '';
      let ssrServerSource = ssrServerObj.source();
      let targetPath;
      const outputPath = this.options.outputPath;
      if (outputPath) {
        if (!fs.existsSync(outputPath)) fs.mkdirSync(outputPath);
        targetPath = `${outputPath}/${ssrServerName}`;
        fs.unlinkSync(ssrServerPath);
      } else {
        targetPath = ssrServerPath;
      }
      ssrServerSource = ssrServerSource.replace(/\r\n|\r|\n/g, '');

      const now = new Date();
      const times = [now.getFullYear(), fixChar(now.getMonth() + 1, '0', 2), fixChar(now.getDate(), '0', 2), fixChar(now.getHours(), '0', 2), fixChar(now.getMinutes(), '0', 2)];
      const output = `
<SSR>
SSRServerVersion=${times.join('')}
ServerBundle=${ssrServerSource}
</SSR>`;
      fs.writeFileSync(targetPath, output);
    });
  }
};

function fixChar(str, char, len) {
  str = str.toString();
  while (str.length < len) str = char + str;
  return str;
}
