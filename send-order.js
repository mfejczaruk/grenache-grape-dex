const {
    PeerRPCClient
} = require('grenache-nodejs-http')
const Link = require('grenache-nodejs-link');
const {
    Order
} = require('./orderbook');
const crypto = require('crypto');

const link = new Link({
    grape: 'http://127.0.0.1:30001'
})
link.start()
const peer = new PeerRPCClient(link, {})
peer.init()

const [side, price, quantity, user] = process.argv.slice(2);
const order = new Order(crypto.randomUUID(), side, price, quantity, user);
peer.request('orderbook:send-order', order.serialize(), {
    timeout: 10000
}, (err, data) => {
    if (err) {
        console.error(err)
    }
    console.log(`Order with id '${order.id}' sent to Orderbook.`)
    process.exit(-1)
})