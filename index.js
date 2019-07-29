const fs = require('fs');
const config = require('./snippet/config.json');
const exec = require('child_process').exec;

const build = 'build';
const template = 'template';
const snippet = 'snippet';
const suffix = '.sublime-snippet';

exec(`rm -rf ${build}`, err => {
  if (err) {
    console.log(err);
    return;
  }

  // 创建文件夹
  if (!fs.existsSync(build)) {
    fs.mkdirSync(build);
  }

  // 读取模版文件循环执行
  fs.readdirSync(template).forEach(file => {
    const fileData = fs.readFileSync(template + '/' + file, { encoding: 'utf8' });
    createSnippet(file, fileData);
  });
});

/**
 * 创建代码片段
 */
const createSnippet = (file, fileData) => {
  const dir = build + '/' + file;

  // 创建文件夹
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  config.forEach((item, index) => {
    let text = fileData;
    if (item.file) item.content = fs.readFileSync(snippet + '/' + item.file, { encoding: 'utf8' });
    text = text.replace('{{content}}', item.content);
    text = text.replace('{{trigger}}', item.trigger);
    text = text.replace('{{description}}', item.description);
    const file = dir + '/' + index + '_' + item.trigger + suffix;
    fs.writeFileSync(file, text);
  });
};
