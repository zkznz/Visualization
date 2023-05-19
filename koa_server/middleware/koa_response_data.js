//处理业务逻辑中间件
const path = require('path');
const fileUtils = require('../utils/file_utils');
module.exports = async (ctx, next) => {
    //获取文件路径
    const url = ctx.request.url;
    let filePath = url.replace('/api', '');
    filePath = '../data' + filePath + '.json';
    filePath = path.join(__dirname, filePath);
    //读取文件数据返回给客户端
    let res = await fileUtils.getFileJsonData(filePath);
    ctx.response.body = res
    await next();
}