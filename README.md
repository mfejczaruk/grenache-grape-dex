# DEX Assignment

## Requirements
tested on node v18.17.1

## Installation 
```
git clone
npm i -g grenache-grape
npm i
```

## Tests 
```
node orderbook.test.js
```
## Components
### send-order.js
Is used to send orders to DEX
### show-orderbook.js
shows orderbook and most recent trades
### start-worker.js
Starts DEX worker

## Usage
### start grenache network
```
grape -b 127.0.0.1 --dp 20001 --dc 32 --aph 30001 --bn '127.0.0.1:20002,127.0.0.1:20003'
grape -b 127.0.0.1 --dp 20002 --aph 40001 --dc 32 --bn '127.0.0.1:20001,127.0.0.1:20003'
grape -b 127.0.0.1 --dp 20003 --aph 50001 --dc 32 --bn '127.0.0.1:20001,127.0.0.1:20002'
```
### start dex worker, populate orderbook and show orderbook
```
node start-worker.js
node show-orderbook.js
./populate-orderbook.sh
```

### add orders:
```
node send-order.js side price quantity user
```
eg:
```
node send-order.js buy 26005 10 Marc
node send-order.js buy 25030 5 Matt
```

### known issues
sometimes such errors occurs:
```
Error: ERR_REQUEST_GENERIC: connect ECONNREFUSED 127.0.0.1:1237
```

Didn't have enough time to debug it