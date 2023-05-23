const WebSocket = require('ws');
const path = require('path');
const fileUtils = require('../utils/file_utils')
const wss = new WebSocket.Server({
    port: 9998
});
module.exports.listen = () => {
    //监听客户端连接
    wss.on('connection', client => {
        console.log('有客户端连接');
        console.log(client);
        //监听客户端发送的消息
        client.on('message', async msg => {
            let payLoad = JSON.parse(msg);
            console.log(payLoad);
            let action = payLoad.action;
            //需要返回图表JSON数据
            if (action === 'getData') {
                let filePath = '../data/' + payLoad.chartName + '.json';
                filePath = path.join(__dirname, filePath);
                //获取文件数据
                let res = await fileUtils.getFileJsonData(filePath);
                payLoad.data = res;
                client.send(JSON.stringify(payLoad));
            }
            //将图表配置发送给每个连接的客户端
            else {
                wss.clients.forEach(client => {
                    client.send(JSON.stringify(msg));
                })
            }
        });

    })
};
