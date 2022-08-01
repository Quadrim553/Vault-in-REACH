import {loadStdlib} from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';
const stdlib = loadStdlib(process.env);


const startingBalance = stdlib.parseCurrency(100);

const  accBob  =
  await stdlib.newTestAccount( startingBalance);
console.log('Hello, Alice and Bob!');
const accAlice= await stdlib.newTestAccount(stdlib.parseCurrency(8000))
console.log('Launching ...');
const ctcAlice = accAlice.contract(backend);
const ctcBob = accBob.contract(backend, ctcAlice.getInfo());
const getBalance = async (x)=> await stdlib.formatCurrency(await stdlib.balanceOf(x))

const choiceArray= ["not here", "still here"]
const AliceBalanceB4= await getBalance(accAlice)
const BobBalanceB4= await getBalance(accBob)

console.log(`Alice balance is ${AliceBalanceB4}Algos`)
console.log(`Bob balance is ${BobBalanceB4}Algos`)
const sharedTimer= ()=>({
  Timer:(time)=>{
    console.log(parseInt(time),"secs")
  }
})

console.log('Starting backends...');
await Promise.all([
  backend.Alice(ctcAlice, {
    
     vaultFund: stdlib.parseCurrency(4000),
    
     getChoice: ()=>{
      const choice=Math.floor(Math.random()*2)
      console.log(`Alice's choice : ${choiceArray[choice]}`)
      return (choice==0? false: true)
    
     },
     ...sharedTimer(),
    
  }),
 

  
  backend.Bob(ctcBob, {
    ...sharedTimer(),
    acceptTerm: (amt)=>{
      console.log(`Bob accepted ${stdlib.formatCurrency(amt)}`)
      return true
    },
  
 
  
  }),
]);
const after= await getBalance(accAlice)
console.log(`Alice's balance, : ${after}Algos`)
const afters=  await getBalance(accBob)
console.log(`Bob's balance, : ${afters}Algos`)


console.log('Goodbye, Alice and Bob!');
