import {
  ETHERSCAN_KEY,
  getCommonNetworkConfig,
  hardhatNetworkSettings,
  loadTasks,

} from './helpers/hardhat-config-helpers';
import { eEthereumNetwork } from './helpers/types';
import {DEFAULT_NAMED_ACCOUNTS} from "./helpers/constants";

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-contract-sizer";
import 'hardhat-abi-exporter';
import 'hardhat-deploy';
import '@nomiclabs/hardhat-ethers';

const TASK_FOLDERS = ['misc'];
// Prevent to load tasks before compilation and typechain
loadTasks(TASK_FOLDERS);

const config: HardhatUserConfig = {
  abiExporter: {
    path: './abi', // path to ABI export directory (relative to Hardhat root)
    runOnCompile: true, // whether to automatically export ABIs during compilation
    clear: true, // whether to delete old ABI files in path on compilation
    flat: true, // whether to flatten output directory (may cause name collisions)
    pretty: false, // whether to use interface-style formatting of output for better readability
  },
  gasReporter: {
    enabled: true,
  },
  contractSizer: {
    alphaSort: true,
    runOnCompile: false,
    disambiguatePaths: false,
  },
  solidity: {
    // Docs for the compiler https://docs.soliditylang.org/en/v0.8.10/using-the-compiler.html
    version: '0.8.17',
    settings: {
      optimizer: {
        enabled: true,
        runs: 100000,
      },
      evmVersion: 'london',
    },
  },
  typechain: {
    outDir: 'typechain',
    target: 'ethers-v5',
  },
  networks: {
    hardhat: hardhatNetworkSettings,
    localhost: {
      url: 'http://127.0.0.1:8545',
      ...hardhatNetworkSettings,
    },
    main: getCommonNetworkConfig(eEthereumNetwork.main, 1),
    [eEthereumNetwork.goerli]: getCommonNetworkConfig(eEthereumNetwork.goerli, 5),
    [eEthereumNetwork.sepolia]: getCommonNetworkConfig(eEthereumNetwork.sepolia, 11155111),
  },
  namedAccounts: {
    ...DEFAULT_NAMED_ACCOUNTS,
  },
  verify: {
    etherscan: {
      apiKey: ETHERSCAN_KEY,
    },
  },
};

export default config;
