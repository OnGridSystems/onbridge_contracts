# Onbridge NFT Gateway Ethereum Contracts

[![](https://img.shields.io/badge/build%20with-openzeppelin-blue.svg?style=flat-square)](https://nftlegends.io/)
![Solidity](https://img.shields.io/badge/solidity-v0.8.9-green)
[![Test](https://github.com/Onbridge-io/onbridge_contracts/actions/workflows/test.yml/badge.svg)](https://github.com/Onbridge-io/onbridge_contracts/actions/workflows/test.yml)

Gateway contracts are responsible on locking NFT token on one side (origin or host or L1 network) then creating its twin on another chain (guest or L2 net). 
Upon withdrawal the system works in opposite direction - guest token gets burnt and gets released on L1 side.

## LICENSE

```
OnBridge - NFT bridge for advanced GameFi mechanics
Copyright (C) 2021 OnBridge.IO

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
```

## Deploy contracts

set DeBridgeGate L1ChainId L2ChainId to constants.js

```bash
yarn hardhat deploy --tags L1Token --network <network>
yarn hardhat deploy --tags L2Token --network <network> 
```
set l1 and l2 tokens addresses to constants.js

```bash
yarn hardhat deploy --tags L1Bridge --network <network>
yarn hardhat deploy --tags L2Bridge --network <network> 
```
set l1 and l2 tokens addresses to constants.js

```bash
yarn setContractAddressOnChainIdBsc:bsc_testnet
yarn setContractAddressOnChainIdEth:kovan
yarn setContractAddressOnChainIdPolygon:mumbai

yarn addControllingAddressBsc:bsc_testnet
yarn addControllingAddressEth:kovan
yarn addControllingAddressPolygon:mumbai

yarn grantMinterRoleToEthBridge:kovan
yarn grantMinterRoleToPolygonBridge:mumbai
```

## Bridge token

set tokenId to constants.js
```bash
yarn bridgeToL2:mumbai
yarn bridgeToL2:kovan

yarn bridgeToL1:bsc_testnet
```