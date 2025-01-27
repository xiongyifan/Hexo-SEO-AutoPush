module.exports = function () {
  const config = this.config.hexo_seo_autopush // 获取配置信息

  const ymlPath = ".github/workflows/HexoSeoAutoPush.yml";
  const cron = config.cron || "0 4 * * *" // 执行周期
  const config_url = this.config.url; // 获取博客地址||注：我并没有使用for_url()方法(Hexo5.0后没有root了)

  // baidu
  const baidu = config.baidu.enable ? "curl -H 'Content-Type:text/plain' --data-binary @baidu.txt 'http://data.zz.baidu.com/urls?site=" + config_url + "&token=\${{secrets.baidu_token}}'":'';

  // bing
  const bing = config.bing.enable ? "curl -X POST 'https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlBatch?apikey=\${{secrets.bing_apikey}}' -H 'Content-Type: application/json' -H 'charset: utf-8' -d @bing.json":'';

  // google
  const google = config.google.enable ? "npx hexoautopush ${{secrets.google_client_email}} ${{secrets.google_private_key}}" : ''

  return {
    path: ymlPath,
    data: `
name: Hexo SEO Auto Push

on:
  schedule:
    - cron: ${cron}
  watch:
    types: [started]
jobs:
  build:
    runs-on: ubuntu-latest
    if: github.event.repository.owner.id == github.event.sender.id
    steps:

      - name: 1. 检查url文件
        uses: actions/checkout@master

      - name: 2. 安装 Node
        uses: actions/setup-node@v1
        with:
          node-version: "14.x"

      - name: 3. 安装插件
        run: |
          npm init -y
          npm install hexo-seo-autopush

      - name: 4. 自动提交
        run: |
          ${baidu}
          ${bing}
          ${google}
  `,
  };
};
