const Koa = require('koa')
const app = new Koa();
const durationMiddle = require('./middleware/koa_response_duration')
const headerMiddle = require('./middleware/koa_response_header');
const dataMiddle = require('./middleware/koa_response_data');
const cors = require('koa2-cors');
app.use(cors());
app.use(durationMiddle);
//响应请求头中间件
app.use(headerMiddle);
//业务处理中间件
app.use(dataMiddle);
app.listen(3007, () => {
    console.log('service running at 127.0.0.1:3007');
})
//引入WebSocket
const webSocketService = require('./service/websocket_service');
webSocketService.listen();