'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { generateMnemonic, mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import nacl from "tweetnacl";
import { Keypair } from "@solana/web3.js";
import { Wallet, HDNodeWallet } from "ethers";
import { CustomDropdownMenu } from "@/components/CustomDropDown";
import { BlockChainType } from "@/lib/types";

interface accountInterface {
  publicKey: string;
  privateKey: string;
}

export default function Home() {
  const [mnemonic, setMnemonic] = useState("");
  const [accounts, setAccounts] = useState<accountInterface[]>([]);

  const networks: BlockChainType[] = Object.values(BlockChainType);
  const [network, setNetwork] = useState<BlockChainType>(BlockChainType.SOLANA);

  const handleClick = () => {
    console.log('clicked');
    const new_mnemonic = generateMnemonic();
    setMnemonic(new_mnemonic);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setMnemonic(e.target.value);
  }

  const checkValidMnemonic = (value: string) => {
    return value.split(" ").length === 12;
  }

  const createSolanaAccount = async() => {
    const seed = await mnemonicToSeed(mnemonic);
    const index = accounts.length;
    const path = `m/44'/501'/${index}'/0'`; // Derivation path for Solana
    const derivedSeed = derivePath(path, seed.toString("hex")).key;
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;

    setAccounts([
      ...accounts,
      {
        privateKey: Keypair.fromSecretKey(secret).secretKey.toString(),
        publicKey: Keypair.fromSecretKey(secret).publicKey.toBase58(),
      },
    ]);
  }

  const createEtheriumAccount = async() => {
    const seed = await mnemonicToSeed(mnemonic);
    const index = accounts.length;
    const path = `m/44'/60'/${index}'/0'`; // Derivation path for Solana
    const hdNode = HDNodeWallet.fromSeed(seed);
    const child = hdNode.derivePath(path);
    const privateKey = child.privateKey;
    const wallet = new Wallet(privateKey);

    setAccounts([
      ...accounts,
      {
        privateKey: privateKey,
        publicKey: wallet.address,
      },
    ]);
  }

  

  const handleAddAccount = async () => {
    if (!checkValidMnemonic(mnemonic)) {
      alert("Invalid mnemonic");
      return;
    }
    
    if(network === BlockChainType.ETHEREUM){
        await createEtheriumAccount();
    }
    else if(network === BlockChainType.SOLANA){
       await createSolanaAccount();
    }
  }

  return (
    <div className="flex flex-col w-full items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="flex flex-row w-full pr-48 justify-start space-x-4 ">
        <Button onClick={handleClick}>Generate seed phrase</Button>
        <Button onClick={handleAddAccount}>Add Account</Button>
        <Button onClick={() => setAccounts([])}>Reset All</Button>
        {/* Fixed: changed setNetork to setNetwork */}
        <CustomDropdownMenu network={network} setNetwork={setNetwork} blockchains={networks} />
      </div>
      <div className="w-full">
        <Input onChange={handleChange} className="w-3/5 h-12" type="text" placeholder="Enter seed phrase" value={mnemonic} />
      </div>

      <div className="w-full">
        <ol>
          {accounts.map((account, _ind) => (
            <li key={_ind}>
              <span>{_ind + 1}. {account.publicKey}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
