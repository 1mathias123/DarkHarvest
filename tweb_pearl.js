//contracts addresses
const tokenAddress = 'TJCX1n9xGZAh4tJWUapshqWTQvaiq9yC3z' // this is the lp token

const dhmAddress = 'TGAuyPkfBYfA8ZVEQqboaNK1iStJokgnnW' //dmh

const stakingAddress = 'TGAuyPkfBYfA8ZVEQqboaNK1iStJokgnnW'// staking

let tokenInstance = undefined
let dhmInstance = undefined
let stakingInstance = undefined

//rounding functions
function parseFloat(str, radix) {
  let parts = str.split(".");
  if ( parts.length > 1 ) {
    return parseInt(parts[0], radix) + parseInt(parts[1], radix) / Math.pow(radix, parts[1].length);
  }
  return parseInt(parts[0], radix);
}


function roundToFour(num) {
  return +(Math.floor(num + 'e+4') + 'e-4')
}

function roundToTwo(num) {
  return +(Math.floor(num + 'e+2') + 'e-2')
}

function round(num) {
  return +(Math.floor(num + 'e+0') + 'e-0')
}

function roundToTwoOrFour(num){
  if(num<1) return roundToFour(num)
  return roundToTwo(num)
}

//updateHTML
setInterval(()=>{
   updateTokenBalance()
   updateStakedBalance()
   updateRewards()
}, 5000) //updates every 5000 miliseconds = 5 seconds, slow it down if your having node issues

//functions
async function updateTokenBalance() {
const tokenBalance = await tronWeb.transactionBuilder.triggerConstantContract(tronWeb.address.toHex(tokenAddress), "balanceOf(address)", {},
                           [{type:'address',value:tronWeb.defaultAddress.hex}], tronWeb.defaultAddress.hex)
  document.getElementById('tokenBalance').innerHTML = roundToTwoOrFour(parseFloat(tokenBalance.constant_result[0],16)/1000000)
}

async function updateStakedBalance() {
  stakingInstance = await tronWeb.contract().at(stakingAddress)
  const stakedBalance = await stakingInstance.balanceOf(tronWeb.defaultAddress.base58).call()
  document.getElementById('stakedBalance').innerHTML = roundToTwoOrFour(parseFloat(stakedBalance._hex, 16))
}

async function updateRewards() {
  stakingInstance = await tronWeb.contract().at(stakingAddress)
  const rewards = await stakingInstance.earned(tronWeb.defaultAddress.base58).call()
  document.getElementById('rewards').innerHTML = roundToTwoOrFour(parseFloat(rewards._hex, 16))
}

async function stake() {
  stakingInstance = await tronWeb.contract().at(stakingAddress)
  const amount = document.getElementById('tokenAmount').value
  const options = {
        feeLimit:100000000,
        callValue:0,
  }
  const transaction = await tronWeb.transactionBuilder.triggerSmartContract(tronWeb.address.toHex(tokenAddress), "approve(address,uint256)", options,
                      [{type:'address',value:tronWeb.address.toHex(stakingAddress)},{type:'uint256',value:amount}],tronWeb.defaultAddress.hex)
  const rawTransaction = await tronWeb.trx.sign(transaction.transaction)
  await tronWeb.trx.sendRawTransaction(rawTransaction);
  await stakingInstance.stake(amount).send()
}

async function unstake() {
  stakingInstance = await tronWeb.contract().at(stakingAddress)
  const amount = document.getElementById('tokenAmount').value
  await stakingInstance.withdraw(amount).send()
}

async function harvest() {
  stakingInstance = await tronWeb.contract().at(stakingAddress)
  await stakingInstance.getReward().send()
}

$( "#stake" ).click(function() {
  stake()
})

$( "#unstake" ).click(function() {
  unstake()
})

$( "#harvest" ).click(function() {
  harvest()
})
