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
    "0x68D936Cb4723BdD38C488FD50514803f96789d2D",
    DeBridgeGateAbi["abi"],
    kovanProvider
  );

  bridge = new ethers.Contract(
    "0x279e0cF58d6B3913C917222A61ba9ef5E9fF8057",
    L1Bridge["abi"],
    kovanProvider
  );
  l1TokenAddress = await bridge.l1Token();

  l1Token = new ethers.Contract(l1TokenAddress, L1Token["abi"], kovanProvider);

  result = await checkOwnerHaveToken(l1Token, kovanWallet, kovanProvider);

  checkTokensApproved(l1Token, kovanWallet, kovanProvider, bridge);

  tx = await bridge.populateTransaction.outboundTransfer(
    kovanWallet.address,
    ethers.utils.parseUnits(tokenId.toString(), "wei"),
    {
      from: kovanWallet.address,
      nonce: await kovanProvider.getTransactionCount(kovanWallet.address),
      gasPrice: ethers.utils.parseUnits("10", "gwei"),
      gasLimit: ethers.utils.parseUnits("3000000", "wei"),
      value: ethers.utils.parseUnits("0.05", "ether"),
    }
  );
  signedTx = await kovanWallet.signTransaction(tx);
  signedTxHash = await kovanProvider.sendTransaction(signedTx);
  tx = await signedTxHash.wait();
}

main();
