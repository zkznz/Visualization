const WebSocket = require('ws');

const wss = new WebSocket.Server({
    port: 9998
});
module.exports.listen = () => {
    //监听客户端连接
    wss.on('connection', client => {
        console.log('有客户端连接');
        //监听客户端发送的消息
        client.on('message', msg => {

        });

    })
};
