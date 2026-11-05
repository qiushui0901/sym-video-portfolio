# 视频剪辑作品集

作品页：https://qiushui0901.github.io/sym-video-portfolio/

适用于 GitHub Pages 的静态作品展示页，包含页面、封面及两段 MP4 视频。

## 发布

1. 在 GitHub 创建公开仓库，例如 `sym-video-portfolio`。
2. 将本目录中的文件放入仓库根目录，保持 `assets/` 文件夹结构。
3. 在仓库 **Settings → Pages → Build and deployment** 中选择 **Deploy from a branch**。
4. 选择 `main` 分支和 `/(root)` 目录，点击 **Save**。
5. 等待发布完成，以 Pages 设置中显示的 **Visit site** 地址为准。

## 文件

- `index.html`：网页。
- `styles.css`：电脑和手机排版。
- `app.js`：播放切换及错误提示。
- `assets/k-on-edit.mp4`：轻音少女创意混剪。
- `assets/zootopia-edit.mp4`：疯狂动物城角色混剪。
- `assets/*-poster.jpg`：视频封面。
- `.nojekyll`：直接发布静态文件。

## 验证

发布后，应在未登录的浏览器中打开网页，确认封面加载、两段视频可播放、手机布局正常，再用实际网址生成二维码。

GitHub Pages 页面及公开仓库中的文件可被任何人访问。网页带有 `noindex` 搜索引擎指令，但该指令不构成访问权限控制。
