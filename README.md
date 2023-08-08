## HopeOracle

The HopeOracle is a standard and SDK allowing reporters to sign key-value pairs (e.g. a price feed) that interested users can post to the blockchain. Among them, HOPEPriceFeed is a [price discovery mechanism](https://docs.hope.money/hope-token/hope-pricing-mechanism) specially implemented for HOPE, but it is temporary and will be replaced at any time, so please use it with caution.

## Contents

- [Audits](#audits)
- [Install](#install)
- [Deploy](#deploy)
- [Verify](#verify)
- [Transfer Ownership](#transfer-ownership)
- [Contact Us](#connect-with-the-community)

## Audits

You can find all audit reports under the audits folder

July 2023

- [PeckShield](./audits/30-07-2023_PeckShield_HopeLendV1.pdf)
- [MetaTrust](./audits/29-07-2023_MetaTrust_Hope-oracle.pdf)
- [Beosin](./audits/19-07-2023_Beosin_Hope-oracle.pdf)

## Install

1. Clone the repo
2. Install dependencies

```sh
npm install
```

3. Copy the contents of `.env.example` to `.env`

```sh
cp .env.example .env
```

4. Edit `.env` with your values

## Compiling & Testing

1. To compile:

```sh
npx hardhat compile
```

2. To run tests:

```sh
npx hardhat test
```

3. To run test coverage:

```sh
npx hardhat coverage
```

## Deploy

The HOPEPriceFeed is deployed using constructor parameters defined in `./helpers/configs.ts`. If new markets need to be added, they should be added to this file first. Read more about how to add new markets in the [configuration README](./helpers/).

1. Configure constructor params in `./helpers/configs.ts`

2. Deploy the HOPEPriceFeed to mainnet:

```sh
npx hardhat deploy --network main
```

3. With a task, deploy the HopeOracle to mainnet:

```sh
npx hardhat deploy-HopeOracle --network main
```

This will output the address where the contract was deployed.

## Verify

Use the following command:

```sh
npx hardhat etherscan-verify --network main
```

## Transfer Ownership

If you want to re-transfer the owner of the contract, you can run the following command:

```sh
npx hardhat transfer-ownership --network main
```

## Connect with the community

You can join the [Discord](https://discord.com/invite/hopemoneyofficial) channel or the [Governance Forum](https://docs.hope.money/lightdao-governance/governance-guide) to ask questions about the protocol or talk about Hope Ecosystem with other peers.
