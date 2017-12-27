const SHA256 = require('crypto-js/sha256');

// Author: Dilip K

// Below "class Block" describes how a block looks on a blockchain 
class Block{
          constructor(index, timestamp, data, previousHash = '')
		  {  
            /* constructor is responsible for initializing the block.
		        i) index tells where the block is present on blockchain, which is optional.
		        ii) timestamp tells when the block wass created.
			      iii) data means the transaction details(for cureency) or any data which will sotred on block.
			    	iv) previousHash is a string that contains hash of the previous block 
            v) nonce is a random number which is used in computing Proof-of-Work, refer to the below mineBlock() for clarification.*/
			
        this.index = index;
				this.timestamp = timestamp;
				this.data = data;
				this.previousHash = previousHash;
				this.hash = this.calculateHash();
				this.nonce = 0;
				
		  }
		  
		  // the below calculateHash() calculates the hash of the whole block.
		  calculateHash()
      {  
      /* we will use SHA-256 as the hash function which is not available in default. Actually we need to import it. 
         go to the terminal/command prompt and then type "npm install --save crypto-js" and execute.
	       it will download the library and automatically puts them in the node module directory which contains the hash functions.
         then we will import SHA-256 in to the code which was done as written in the first line. */
				 
				 return SHA256(this.index + this.timestamp + this.previousHash + JSON.stringify(this.data) + this.nonce).toString();
		  }	
 
		  mineBlock(difficulty)
      {
	 	        while(this.hash.substring(0,difficulty) !== Array(difficulty + 1).join("0"))
            {   
             /*  let's say difficulty = 2. The condition in while loop checks if the hash has "difficulty" number of zeros infront of it.
                 If not, we shall increment nonce and compute its hash and recheck again till the condition gets satisfied.                 As the difficulty increases, time to mine the block increases  */
  
			       this.nonce++;
			       this.hash = this.calculateHash();	  
		        }

		         console.log("Block mined: " + this.hash);
		  }
}

class Blockchain{
	constructor()
  {
		// Constructor here is reponsible for initializing the blockchain
		this.chain = [this.createGenesisBlock()]; // chain is an array of blocks.
 		this.difficulty = 2;
	}
	
	// First block on Blockchain is called Genesis block which needs to be created manually. Below function does that!
	createGenesisBlock(){
		return new Block(0, "26/12/2017", "GenesisBlock", "0");
	}		
		
	getLatestBlock(){         // This function returns the lastest block created on blockchain
		return this.chain[this.chain.length - 1];
	}		
	
	addBlock(newBlock){       // This function adds a new block on to the blockchain
		newBlock.previousHash = this.getLatestBlock().hash;
		newBlock.mineBlock(this.difficulty);
		
    this.chain.push(newBlock); /* In reality, we cannot add the block to the blockchain so easily beacause there are 
                                  various checks inplace. For our little Blockchain, its more than enough as this is 
                                  a demostration of how the blockchain actually works. */
	}
  
	/* Blockchains are great because once a block is added, it cannot be changed without validiting the rest of the chain. 
	Let's add a method which returns true if the chain is valid. False if invalid. */

	isChainValid(){
		for(let i = 1; i < this.chain.length; i++) /* inorder to verify integrity of blockchain, we will loop over the entire chain.
							                                     we are not going to start with '0' as it is a genesis block.  */
		{
		const currentBlock = this.chain[i];
		const previousBlock = this.chain[i - 1];
		
	        // condition1 to check if the hash of the block is still valid to make sure block is not tampered.
		if(currentBlock.hash !== currentBlock.calculateHash()){
			return false; }

		// condition2 to check if the block points to the previous block

if(currentBlock.previousHash != previousBlock.hash){
			return false;
			}
		}

		return true;
	}
}


// Now its time to test our Blockchain. Let's create an instance of our blockchain.
let dilCoin = new Blockchain();
console.log("Mining Block 1....");
dilCoin.addBlock(new Block(1,"27/12/2017", {amount : 40}));

console.log("Mining Block 2....");
dilCoin.addBlock(new Block(1,"28/12/2017", {amount : 60}));
 
// console.log('Is Blockchain is valid? ' +  dilCoin.isChainValid()); Displays the validity of our Blockchain
 
//uncomment the below line to view he blocks on blockchain 
// console.log(JSON.stringify(dilCoin, null, 5)); // Displays how our blocks look on Blockchain.

// uncomment the below code to check the validity of the blockchain after the data in second block is tampered.
/*
dilCoin.chain[1].data = { amount : 100 };
console.log('Is Blockchain valid? ' +  dilCoin.isChainValid()); // This displays false as condition1 in isChainValid() becomes true.
*/ 

/* uncomment the below code to check the validity of the blockchain after the data as well as hash in second block is changed.
That means data is tampered as well as hash was recalculated. */
/* 
dilCoin.chain[1].data = { amount : 100 };
dilCoin.chain[1].hash = dilCoin.chain[1].calculateHash();
console.log('Is Blockchain valid? ' +  dilCoin.isChainValid()); // This displays false as condition2 in isChainValid() becomes true.
// Blockchain is meant to add blocks to it. But to never delete/change a block.
*/ 
 
/* This blockchain lacks many features including peer to peer network to communicate with other miners, 
check whether sufficient funds are available or not to make a transaction,etc.
But perfectly demostrates how blockchain works behind the scenes. */

/* what have we done? Right now we can create new blocks really quickly. All we have to do is create a transaction then 
compute it's hash and add to the array. Now, modern supercomputers can create blocks incredibily quickly,
but we don't want people to create hundreds of thousands of blocks per sec and spam our blockchain. There is also a security issue.
You can change the contents of a block and then simply recalculate hash of all the blocks after that and you will end up with a valid
chain even though you tampered with it. But this is not what we want. So, to solve this issue, blockchain have something called
Proof-of-work. With this mechanism you have to prove that you put a lot of computational work inorder to create a block.
This process is also called mining. So, how could we implement this? Bitcoin, for example, requires the hash of a block to begin 
with certain numbers of zeros. And because you can't influence the output of a hash function, you simply have to try a lot of
combinations and hope you get lucky with the hash that has sufficient number of zeros infront of it. 
This requires a lot of computating power. This is also called difficulty and it is set so that there is a steady amount of new blocks.
In case of bitcoins, the aim is to create one new block every ten minutes. Now, as computers get fast over time,
they require less time to mine a new block. To compensate with that, difficulty will simply be increase.
Have a look at the mineBlock(difficulty) function in class Block. This is also called mining/Proof-of-Work. 
*/ 















