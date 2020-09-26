let sunaddress = 'TUzSPnHR66yPj4Qc4KzKnaDqDp67jqDfJn'

let dmhaddress = 'TKV1ZampzDNaWtLwH31BkcKB4GyCwK8Pjc'


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
