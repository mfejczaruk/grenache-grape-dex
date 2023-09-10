const assert = require("assert");
const {
    Orderbook,
    Order
} = require("./orderbook");

let orderbook = new Orderbook();

orderbook.addOrder(new Order('uuid', 'buy', 1000, 10, 'user-1'));
orderbook.addOrder(new Order('uuid', 'buy', 1010, 10, 'user-1'));
orderbook.addOrder(new Order('uuid', 'buy', 1050, 10, 'user-1'));
orderbook.addOrder(new Order('uuid', 'sell', 1010, 20, 'user-1'));
orderbook.matchOrders();

assert(orderbook.sellOrders.length === 0);
assert(orderbook.buyOrders.length === 1);
assert(orderbook.trades.length === 2);
assert(orderbook.trades[0].price === 1050);
assert(orderbook.trades[0].matchedQuantity === 10);
assert(orderbook.trades[1].price === 1010);
assert(orderbook.trades[1].matchedQuantity === 10);


orderbook = new Orderbook();

orderbook.addOrder(new Order('uuid', 'sell', 1000, 10, 'user-1'));
orderbook.addOrder(new Order('uuid', 'sell', 1010, 10, 'user-1'));
orderbook.addOrder(new Order('uuid', 'sell', 1050, 10, 'user-1'));
orderbook.addOrder(new Order('uuid', 'buy', 1000, 15, 'user-1'));
orderbook.matchOrders();

assert(orderbook.sellOrders.length === 2);
assert(orderbook.buyOrders.length === 1);
assert(orderbook.buyOrders[0].quantity === 5);
assert(orderbook.trades[0].price === 1000);
assert(orderbook.trades[0].matchedQuantity === 10);

console.log('TESTS PASSED')