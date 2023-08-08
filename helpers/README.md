# HOPEPriceFeed Configuration

The design principles of HOPEPriceFeed are described in: [HOPE price peed](./HOPEPriceFeed.pdf)

`configs.js` details the constructor parameters that are passed in when deploying the HOPEPriceFeed.

These fields must be known prior to deployment.

# configs

- [PriceFeed_decimals](#pricefeed_decimals)
- [PriceFeed_heartbeat](#pricefeed_heartbeat)
- [PriceFeed_threshold](#pricefeed_threshold)
- [HOPE_address](#hope_address)
- [chainlinkEthUsdAggregatorProxy](#chainlinkethusdaggregatorproxy)
- [chainlinkBtcUsdAggregatorProxy](#chainlinkbtcusdaggregatorproxy)

## PriceFeed_decimals

TYPE: `uint256`

The decimal of HOPE price.

## PriceFeed_heartbeat

TYPE: `uint256`

Frequency of HOPE price updates.

For 30 minutes, this equals: `1800`

## PriceFeed_threshold

TYPE: `uint256`

HOPE price updates are up and down

For 1%, this equals: `100`

## HOPE_address

TYPE: `address`

The HOPE address.

## chainlinkEthUsdAggregatorProxy

TYPE: `address`

Chainlink's ETH/USD oracle address.

## chainlinkBtcUsdAggregatorProxy

TYPE: `address`

Chainlink's BTC/USD oracle address.
