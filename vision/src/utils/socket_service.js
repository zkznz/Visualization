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
    callBackMapping = {};
    // 标识是否连接成功
    connected = false;
    //重新发送次数
    sendRetryCount = 0;
    //断线重连次数
    connectRetryCount = 0;
    //定义连接服务器方法
    connect() {
        //连接服务器
        if (!window.WebSocket) {
            return console.log("您的浏览器不支持WebSocket")
        }
        this.ws = new WebSocket("ws://localhost:9998");
        this.ws.onopen = () => {
            this.connected = true;
            this.connectRetryCount = 0;
            console.log("连接成功");
        }
        this.ws.onclose = () => {
            this.connected = false;
            //断线重连
            setTimeout(() => {
                this.connect()
            }, 500 * this.connectRetryCount)
            console.log("连接关闭");
        }
        this.ws.onmessage = msg => {
            const recvData = JSON.parse(msg.data)
            const socketType = recvData.socketType;
            //判断是否有该回调函数
            if (this.callBackMapping[socketType]) {
                const action = recvData.action;
                if (action === 'getData') {
                    //获取服务端数据
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
        }
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
        if (this.connected)
            this.ws.send(JSON.stringify(data));
        else {
            setTimeout(() => this.send(data), 500 * this.sendRetryCount);
        }
    }

}