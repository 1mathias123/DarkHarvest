//contracts addresses
const tokenAddress = 'TYiMBvrbmvPuxsBUsw8R1jH2U8cviCqit2'

const dhmAddress = 'THpF8H3QQBnNVhBXHTPaYvuwSGARYuBs34'

const stakingAddress = 'TEy7WGNM73zU2cpXA2GCku8h2vmpBWhSvx'

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
  tokenInstance = await tronWeb.contract().at(tokenAddress)
  const tokenBalance = await tokenInstance.balanceOf(tronWeb.defaultAddress.base58).call()
  document.getElementById('tokenBalance').innerHTML = roundToTwoOrFour(parseFloat(tokenBalance._hex, 16))
}

async function updateStakedBalance() {
  stakingInstance = await tronWeb.contract().at(stakingAddress)
  const stakedBalance = await stakingInstance.balanceOf(tronWeb.defaultAddress.base58).call()
  document.getElementById('stakedBalance').innerHTML = roundToTwoOrFour(parseFloat(stakedBalance._hex, 16))
}

async function updateRewards() {
  stakingInstance = await tronWeb.contract().at(stakingAddress)
  const rewards = await stakingInstance.rewards(tronWeb.defaultAddress.base58).call()
  document.getElementById('rewards').innerHTML = roundToTwoOrFour(parseFloat(rewards._hex, 16))
}

async function stake() {
  tokenInstance = await tronWeb.contract().at(tokenAddress)
  stakingInstance = await tronWeb.contract().at(stakingAddress)
  const amount = document.getElementById('tokenAmount').value
  await tokenInstance.approve(stakingAddress, amount+1).send()
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
