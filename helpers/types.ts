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
