const { ethers } = require("ethers");

async function checkOwnerHaveToken(token, wallet, provider) {
  need_mint = false;
  try {
    tokenId = await token.functions.tokenOfOwnerByIndex(wallet.address, 0);
  } catch (e) {
    need_mint = true;
  }

  if (need_mint == true) {
    tokenId = 0;
    while (true) {
      console.log("check tokenId: ", tokenId);
      try {
        await token.functions.ownerOf(tokenId);
        tokenId += 1;
      } catch (e) {
        break;
      }
    }

    tx = await l1Token.populateTransaction.mint(wallet.address, tokenId, {
      from: wallet.address,
      nonce: await provider.getTransactionCount(wallet.address),
      gasPrice: ethers.utils.parseUnits("10", "gwei"),
      gasLimit: 500000,
    });

    signedTx = await wallet.signTransaction(tx);
    signedTxHash = await provider.sendTransaction(signedTx);
    console.log("\nsignedTxHash.wait()\n", await signedTxHash.wait());
  }
  return tokenId
}

async function checkTokensApproved(token, wallet, provider, bridge) {
  isApprovedForAll = await token.functions.isApprovedForAll(
    wallet.address,
    bridge.address
  );

  if (!isApprovedForAll[0]) {
    console.log("not approved yet. Approving");
    tx = await l1Token.populateTransaction.setApprovalForAll(
      bridge.address,
      true,
      {
        from: wallet.address,
        nonce: await provider.getTransactionCount(wallet.address),
        gasPrice: ethers.utils.parseUnits("10", "gwei"),
        gasLimit: 50000,
      }
    );
    signedTx = await wallet.signTransaction(tx);
    signedTxHash = await provider.sendTransaction(signedTx);
    console.log("\nsignedTxHash.wait()\n", await signedTxHash.wait());
  } else {
    console.log("already approved");
  }
}

async function main() {
  const DeBridgeGateAbi = require("./abis/DeDridgeGate.json");
  const L1Bridge = require("./abis/L1Bridge.json");
  const L1Token = require("./abis/L1Token.json");

  mnemonic = `${process.env.MNEMONIC}`;
  walletMnemonic = ethers.Wallet.fromMnemonic(mnemonic);

  const kovanProvider = new ethers.providers.JsonRpcProvider(
    `${process.env.KOVAN_PROVIDER}`
  );

  kovanWallet = walletMnemonic.connect(kovanProvider);

  gate = new ethers.Contract(
    "0xb1eb9869c8f3b50a98d960a5512d2bf0faa56c32",
    DeBridgeGateAbi["abi"],
    kovanProvider
  );

  l1bridge = new ethers.Contract(
    L1Bridge["address"],
    L1Bridge["abi"],
    kovanProvider
  );

  l1TokenAddress = await l1bridge.l1Token();

  l1Token = new ethers.Contract(l1TokenAddress, L1Token["abi"], kovanProvider);

  tokenId = await checkOwnerHaveToken(l1Token, kovanWallet, kovanProvider);

  checkTokensApproved(l1Token, kovanWallet, kovanProvider, l1bridge);
  tokenId = parseInt(tokenId[0]['_hex'], 16)

  tx = await l1bridge.populateTransaction.outboundTransfer(
    kovanWallet.address,
    tokenId,
    {
      from: kovanWallet.address,
      nonce: await kovanProvider.getTransactionCount(kovanWallet.address),
      gasPrice: ethers.utils.parseUnits("10", "gwei"),
      gasLimit: ethers.utils.parseUnits("3000000", "wei"),
      value: ethers.utils.parseUnits("0.2", "ether"),
    }
  );
  signedTx = await kovanWallet.signTransaction(tx);
  signedTxHash = await kovanProvider.sendTransaction(signedTx);
  tx = await signedTxHash.wait();
  console.log(tx)
}

main();
