const { 
    Connection, 
    Keypair, 
    LAMPORTS_PER_SOL, 
    clusterApiUrl 
} = require('@solana/web3.js');
const { 
    createMint, 
    getOrCreateAssociatedTokenAccount, 
    mintTo 
} = require('@solana/spl-token');
const fs = require('fs');

async function launchToken() {
    // 1. Setup Connection and Wallet
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    
    // Load wallet from local file
    const secretKey = Uint8Array.from(JSON.parse(fs.readFileSync('./wallet.json')));
    const payer = Keypair.fromSecretKey(secretKey);

    console.log(`Payer Address: ${payer.publicKey.toBase58()}`);

    // 2. Create New Token
    console.log("Creating token mint...");
    const mint = await createMint(
        connection,
        payer,            // Payer
        payer.publicKey,  // Mint Authority
        payer.publicKey,  // Freeze Authority
        9                 // Decimals
    );

    console.log(`Token Created! Mint Address: ${mint.toBase58()}`);

    // 3. Create Associated Token Account (ATA)
    console.log("Creating token account...");
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        payer,
        mint,
        payer.publicKey
    );

    // 4. Minting Tokens
    console.log("Minting 1000 tokens...");
    await mintTo(
        connection,
        payer,
        mint,
        tokenAccount.address,
        payer,
        1000 * Math.pow(10, 9)
    );

    console.log("Success! Tokens minted to your wallet.");
}

launchToken().catch(console.error);
