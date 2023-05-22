export default class SocketService {
    static instance = null
    static get Instance() {
        if (!this.instance) {
            this.instance = new SocketService();
        }
        return this.instance;
    }

    ws = null;

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

        })
    }

}