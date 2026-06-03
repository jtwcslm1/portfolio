==========================================================
李毓桐 Yutong "Leila" Li — 个人作品集
文件说明 · 自动图片系统 · 部署指南
==========================================================

【文件结构】解压后保持这个结构，整个文件夹一起用：

portfolio/
├─ index.html          主页
├─ gallery.html        作品集子页面（展示全部图片）
├─ style.css           样式（配色 / 动效都在这）
├─ main.js             脚本（中英切换、动效、自动加载图片、灯箱）
├─ profile.jpg         头像
├─ gallery/            ← 你的图片文件夹（往这里丢图）
│   ├─ manifest.json   （图片清单，自动生成，别手动改）
│   └─ PUT_IMAGES_HERE.txt
└─ .github/workflows/
    └─ build-gallery.yml   （GitHub 自动扫描图片的脚本）

本地预览：用 VSCode 的 "Live Server" 插件打开 index.html（点右下角 Go Live）。
注意：图片是用 fetch 读取的，必须用 Live Server（http://）预览，
直接双击 html 用 file:// 打开图片不会加载。


----------------------------------------------------------
一、自动图片系统怎么用（你最关心的）
----------------------------------------------------------
1. 把任意图片（jpg / jpeg / png / webp / gif / avif 都行）丢进 gallery/ 文件夹。
   文件名随意，建议用英文或数字，避免空格和特殊符号。

2. 提交并推送到 GitHub（VSCode 里 commit + push，或网页上传）。

3. 推送后，GitHub 会自动运行 .github/workflows/build-gallery.yml：
   它会扫描 gallery/ 里所有图片，按"最近上传"排序，生成 gallery/manifest.json，
   并自动提交。你什么代码都不用改。

4. 网站随后自动更新：
   · 主页「Art & gallery」区只显示最近上传的 6 张（带不规则形状）
   · 点主页的「查看全部作品 →」进入 gallery.html，那里显示全部图片
   · 点任意图片可放大查看（灯箱）

想改主页显示几张：在 index.html 搜 id="home-gallery"，
把 data-count="6" 改成你想要的数量即可。

⚠ 第一次部署后，去 GitHub 仓库的 Actions 标签看一眼，
   确认 "Build gallery manifest" 这个工作流跑成功了（绿色对勾）。
   公开仓库默认就开启 Actions，一般无需额外设置。

（本地预览时不会自动跑 Action，主页/子页会显示当前 manifest.json 里的图片；
  推到 GitHub 后才会自动刷新清单。）


----------------------------------------------------------
二、部署到 GitHub Pages + 绑定 Namecheap 域名
----------------------------------------------------------
1. 新建一个 Public 仓库，把整个文件夹的内容传上去（保持上面的结构）。
   - VSCode：在项目里 git init → add → commit → 关联远程仓库 → push
   - 或 GitHub 网页 "Add file → Upload files" 拖整个文件夹上传

2. 仓库 Settings → Pages → Source 选 "Deploy from a branch"
   → 选 main 分支 / 根目录 (root) → Save。
   等 1~2 分钟出现网址：https://你的用户名.github.io/仓库名/

3. 绑定 Namecheap 域名：
   - GitHub Pages 设置里 Custom domain 填你的域名 → Save
   - Namecheap → Domain List → Manage → Advanced DNS 添加：
        A      @     185.199.108.153
        A      @     185.199.109.153
        A      @     185.199.110.153
        A      @     185.199.111.153
        CNAME  www   你的用户名.github.io.
   - DNS 生效后回 GitHub 勾选 "Enforce HTTPS"


----------------------------------------------------------
三、其它可自己微调的地方
----------------------------------------------------------
- 换头像：用新图覆盖 profile.jpg（同名即可）。
- 配色：style.css 顶部 :root，主色 --brand:#8c4a39（复古红棕），
  背景灰渐变 --bg1/--bg2，改这几个变量全站统一变。
- 字体：:root 的 --display（Playfair）/ --sans（DM Sans）/ --script（Caveat）。
- 游戏封面（Work 区）目前引用 itch.io / Steam 链接，浏览器能正常显示；
  想自带就把图放进文件夹再改对应 <img src>。
- 联系方式只放了邮箱，未放电话（隐私）。
