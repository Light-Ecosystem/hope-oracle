export enum eEthereumNetwork {
  buidlerevm = 'buidlerevm',
  kovan = 'kovan',
  ropsten = 'ropsten',
  main = 'main',
  coverage = 'coverage',
  hardhat = 'hardhat',
  tenderly = 'tenderly',
  rinkeby = 'rinkeby',
  goerli = 'goerli',
  sepolia = 'sepolia',
}
export type iParamsPerNetwork<T> = {
  [k in eEthereumNetwork]?: T;
};

export interface SymbolMap<T> {
  [symbol: string]: T;
}

export type tEthereumAddress = string;

export interface ITokenAddress {
  [token: string]: tEthereumAddress;
}

export interface IBaseConfiguration {
  PriceFeed_decimals: Number;
  PriceFeed_heartbeat: Number;
  PriceFeed_threshold: Number;
  PriceFeed_operator: string;
  PriceFeed_owner: string;
  HOPE_address: string;
  chainlinkEthUsdAggregatorProxy: string;
  chainlinkBtcUsdAggregatorProxy: string;
  Automation_operator: string;
  Automation_owner: string;
  Aggregator_owner: string;
  FallbackOracle_operator: string;
  FallbackOracle_owner: string;
}
