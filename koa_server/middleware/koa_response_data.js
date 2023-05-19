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
    try {
        let res = await fileUtils.getFileJsonData(filePath);
        ctx.response.body = res

    } catch (error) {
        const errMsg = {
            status: 404,
            msg: "读取文件内容失败，文件资源不存在"
        }
        ctx.response.body = JSON.stringify(errMsg);
    }
    await next();
}