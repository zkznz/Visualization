const Koa = require('koa')

const app = new Koa();
const durationMiddle = require('./middleware/koa_response_duration')
const headerMiddle = require('./middleware/koa_response_header');
app.use(durationMiddle);
app.use(headerMiddle);

app.listen(3007, () => {
    console.log('service running at 127.0.0.1:3007');
})