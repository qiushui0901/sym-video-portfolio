const asset = new URLSearchParams(location.search).get('asset') || '';
const errorMessage = document.getElementById('error');
if (!/^assets\/[a-z0-9-]+\.(mp4|jpg|webp)(\?v=[a-f0-9]{10})?$/.test(asset)) {
  errorMessage.hidden = false;
} else {
  const url = 'https://sym-qiushui.oss-cn-beijing.aliyuncs.com/portfolio/' + asset;
  const isVideo = asset.split('?')[0].endsWith('.mp4');
  const media = document.createElement(isVideo ? 'video' : 'img');
  if (isVideo) {
    media.controls = true;
    media.playsInline = true;
    media.preload = 'metadata';
    media.setAttribute('aria-label', '视频作品高清预览');
  } else {
    media.alt = '设计作品高清预览';
  }
  media.addEventListener('error', () => { errorMessage.hidden = false; });
  media.src = url;
  document.getElementById('stage').append(media);
  const download = document.getElementById('download');
  download.href = url;
  download.hidden = false;
}
