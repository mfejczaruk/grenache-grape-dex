'use strict'


const {
    PeerRPCClient
} = require('grenache-nodejs-http')
const Link = require('grenache-nodejs-link');
const {
    Orderbook,
    Order
} = require('./orderbook');
const link = new Link({
    grape: 'http://127.0.0.1:30001'
})
link.start()
const peer = new PeerRPCClient(link, {})
peer.init()

function displayOrders(orders, orderType) {
    orders.forEach(order => {
        console.log(`[${orderType}]Price: $${order.price}, Quantity: ${order.quantity}, User: ${order.user}`);
    });
}

function displayTrades(trades) {
    trades.slice(-5).forEach(trade => {
        console.log(`[TRADE] Price: $${trade.price}, Quantity: ${trade.matchedQuantity}`);
    });
}

setInterval(() => {
    peer.request('orderbook:sync', {}, {
        timeout: 1000
    }, (err, data) => {
        if (err) {
            console.error(err)
        }
        console.clear();
        console.log('Orderbook:')
        const retrievedOrderbook = Orderbook.deserialize(data);
        displayOrders(retrievedOrderbook.sellOrders.reverse(), 'Sell');
        if (retrievedOrderbook.buyOrders.length > 0 && retrievedOrderbook.sellOrders.length > 0) {
            console.log(`SPREAD: $${retrievedOrderbook.sellOrders.reverse()[0].price - retrievedOrderbook.buyOrders[0].price}`);
        }
        displayOrders(retrievedOrderbook.buyOrders, 'Buy');
        console.log('=====')
        console.log('Latest trades:');
        displayTrades(retrievedOrderbook.trades);
    })
}, 1000);