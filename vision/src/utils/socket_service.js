
export default class SocketService {
    static instance = null
    static get Instance() {
        if (!this.instance) {
            this.instance = new SocketService();
        }
        return this.instance;
    }

    ws = null;
    // 存储回调函数
    callBackMapping = {}
    //定义连接服务器方法
    connect() {
        //连接服务器
        if (!window.WebSocket) {
            return console.log("您的浏览器不支持WebSocket")
        }
        this.wx = new WebSocket("ws://127.0.0.1:9998");

        this.ws.onopen(() => {
            console.log("连接成功");
        })
        this.ws.onclose(() => {
            console.log("连接关闭");
        })
        this.ws.onmessage(msg => {
            const recvData = JSON.parse(msg.data)
            const socketType = recvData.socketType;
            //判断是否有该回调函数
            if (this.callBackMapping[socketType]) {
                const action = recvData.action;
                if (action === 'getData') {
                    const realData = JSON.parse(recvData.data);
                    //调用存储的回调函数
                    this.callBackMapping[socketType].call(this, realData);
                }
                else if (action === 'fullScreen') {

                }
                else if (action === 'themeChange') {
                    // this.callBackMapping[socketType].call(this, recvData)
                }
            }
            console.log(msg.data)
        })
    }

    // 回调函数的注册
    registerCallBack(socketType, callBack) {
        this.callBackMapping[socketType] = callBack;
    }

    // 取消某一个回调函数
    unRegisterCallBack(socketType) {
        this.callBackMapping[socketType] = null;
    }
    //发送给服务器数据
    send(data) {
        this.ws.send(JSON.stringify(data));
    }
}