class Order {
  constructor(id, side, price, quantity, user) {
      this.id = id;
      this.side = side;
      this.price = price;
      this.quantity = quantity;
      this.user = user;
  }

  serialize() {
      return {
          id: this.id,
          side: this.side,
          price: this.price,
          quantity: this.quantity,
          user: this.user,
      };
  }

  static deserialize(orderData) {
      return new Order(
          orderData.id,
          orderData.side,
          orderData.price,
          orderData.quantity,
          orderData.user
      );
  }
}

class Trade {
  constructor(matchedQuantity, price) {
      this.matchedQuantity = matchedQuantity;
      this.price = price;
  }

  serialize() {
      return {
          matchedQuantity: this.matchedQuantity,
          price: this.price
      };
  }

  static deserialize(tradeData) {
      return new Trade(tradeData.matchedQuantity, tradeData.price);
  }
}

class Orderbook {
  constructor() {
      this.buyOrders = [];
      this.sellOrders = [];
      this.trades = [];
  }

  addOrder(order) {
      if (order.side === 'buy') {
          this.buyOrders.push(order);
          this.buyOrders = this.buyOrders.sort((a, b) => b.price - a.price);
      } else if (order.side === 'sell') {
          this.sellOrders.push(order);
          this.sellOrders = this.sellOrders.sort((a, b) => a.price - b.price);
      } else {
          throw new Error('Invalid order side. Use "buy" or "sell".');
      }
  }

  matchOrders() {
      while (this.buyOrders.length > 0 && this.sellOrders.length > 0) {
          const bestBuyOrder = this.buyOrders[0];
          const bestSellOrder = this.sellOrders[0];

          if (bestBuyOrder.price >= bestSellOrder.price) {
              const matchedQuantity = Math.min(bestBuyOrder.quantity, bestSellOrder.quantity);

              this.trades.push(new Trade(matchedQuantity, bestBuyOrder.price));
              console.log(`[TRADE] Price: ${bestBuyOrder.price} Quantity: ${matchedQuantity}`);

              bestBuyOrder.quantity -= matchedQuantity;
              bestSellOrder.quantity -= matchedQuantity;

              if (bestBuyOrder.quantity === 0) {
                  this.buyOrders.shift();
              }
              if (bestSellOrder.quantity === 0) {
                  this.sellOrders.shift();
              }

          } else {
              break;
          }
      }
  }

  serialize() {
      return {
          buyOrders: this.buyOrders.map(order => order.serialize()),
          sellOrders: this.sellOrders.map(order => order.serialize()),
          trades: this.trades.map(trade => trade.serialize())
      };
  }

  static deserialize(orderBookData) {
      const orderBook = new Orderbook();
      orderBook.buyOrders = orderBookData.buyOrders.map(Order.deserialize);
      orderBook.sellOrders = orderBookData.sellOrders.map(Order.deserialize);
      orderBook.trades = orderBookData.trades.map(Trade.deserialize);
      return orderBook;
  }
}


module.exports = {
  Orderbook,
  Order
};