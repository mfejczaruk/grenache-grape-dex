const {
    PeerRPCServer
} = require('grenache-nodejs-http')
const Link = require('grenache-nodejs-link')
const {
    Orderbook,
    Order
} = require('./orderbook')
const dexOrderbook = new Orderbook();

const link = new Link({
    grape: 'http://127.0.0.1:30001'
})
link.start()

const peer = new PeerRPCServer(link, {
    timeout: 300000
})
peer.init()

const port = 1024 + Math.floor(Math.random() * 1000)
const service = peer.transport('server')
service.listen(port)

console.log('Worker started')

setInterval(function() {
    link.announce('orderbook:sync', service.port, {})
    link.announce('orderbook:send-order', service.port, {})
}, 1000)

service.on('request', (rid, key, payload, handler) => {
    if (key === 'orderbook:send-order') {
        const order = Order.deserialize(payload);
        dexOrderbook.addOrder(order);
        dexOrderbook.matchOrders();
        console.log(`Order with id ${order.id} received.`);
        handler.reply(null, 'success');
    } else if (key === 'orderbook:sync') {
        handler.reply(null, dexOrderbook.serialize());
    }
});