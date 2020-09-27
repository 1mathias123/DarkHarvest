let sunaddress = 'TTYjHyHmGV7d2nUwePjLuVWHT5A3oc1h8x'

let dmhaddress = 'TQvVEQiqersQn9BtAXQD6Xv1n7JHhNdHwb'

let tewkenaddress = 'TNt2fqwH7kC7WUTnSYTTpoe3obTXBnYdFr'


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
   dmhwithdraw()
   sunwithdraw()
}, 5000) //updates every 5000 miliseconds = 5 seconds, slow it down if your having node issues



async function dmhwithdraw() {
  dmhaddress = await tronWeb.contract().at(dmhaddress)
  const rewards0 = await dmhaddress.earned(tronWeb.defaultAddress.base58).call()
  document.getElementById('rewards0').innerHTML = roundToTwoOrFour(parseFloat(rewards0._hex, 16)/1e18)
}

async function sunwithdraw() {
  sunaddress = await tronWeb.contract().at(sunaddress)
  const rewards1 = await sunaddress.earned(tronWeb.defaultAddress.base58).call()
  document.getElementById('rewards1').innerHTML = roundToTwoOrFour(parseFloat(rewards1._hex, 16)/1e18)
}

async function tewkenwithdraw() {
  tewkenaddress = await tronWeb.contract().at(tewkenaddress)
  const rewards2 = await tewkenaddress.earned(tronWeb.defaultAddress.base58).call()
  document.getElementById('rewards2').innerHTML = roundToTwoOrFour(parseFloat(rewards2._hex, 16)/1e18)
}
