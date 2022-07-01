import { chartDays } from "../../data/days";
import Axios from "axios"

const COINGECKO_API_URL = "https://api.coingecko.com/api/v3";
const DERIBIT_API_URL = "https://www.deribit.com/api/v2"
const DERIBIT_HISTORICAL_DATA_URL = "http://18.193.105.218"

export default async function handler(req, res) {
    let {days, count} = req.query
    let exchanges = ['huobi', 'binance', 'ftx', 'bitmex', 'bybit', 'okex', 'deribit']
    let currencies = ['eth', 'btc']
    let prices = ['eth_usd', 'btc_usd']

    try {
        // Fetch volume charts
        // Coingecko throttles API calls resulting in 429 errors...
        let exchangeVolumes = {}
        await Promise.all(exchanges.map(async (exchangeName) => {
            const res = await Axios.get(`${COINGECKO_API_URL}/exchanges/${exchangeName}/volume_chart?days=${days}`)
            exchangeVolumes[exchangeName] = res.data
            console.log(exchangeVolumes.binance)


        }));

        // Fetch historical volumes
        let deribitVolumes = {}
        await Promise.all(currencies.map(async (currency) => {
            const res = await Axios.get(`${DERIBIT_HISTORICAL_DATA_URL}/volumes/${currency}`)
            deribitVolumes[currency] = res.data
        }));

        // Fetch delivery prices
        //const deribitDeliveryPriceResponse = await Axios.get(`${DERIBIT_API_URL}/public/get_delivery_prices?count=${count}&index_name=eth_usd`)
        let historicalPrice={}
        await Promise.all(prices.map(async (price) => {
            const res = await Axios.get(`${DERIBIT_API_URL}/public/get_delivery_prices?count=${count}&index_name=${price}`)
            historicalPrice[price] = res.data
        }));

        // Create a single object for the api responses
        const responseObject = {
            exchange_volumes: exchangeVolumes,
            deribit_volumes: deribitVolumes,
            //deribit_historical_delivery_price: deribitDeliveryPriceResponse.data.result.data
            historical_price: historicalPrice
        }

        res.status(200)
        res.json(responseObject)
    } catch (error) {
        res.status(400)
        res.json(JSON.stringify({ error: error.message }))
    }



    
}

/*

  var test = [];
  var trying = [];
  var r = []; //result
  var i, l = okex?.length
  r.length = l;
  test.length =l;
  
  console.log(ethprice);
  for (var u=0; u<ethprice?.records_total; u+100){
    setCount(u+100);
    trying = trying + ethprice;
    console.log(ethprice);
  }
  console.log(trying);


 for(i = 0; i < l; i = i +1) {
    var x=[];
    var testing = historicData?.[i]?.[0];
    var a = new Date(testing);
    var year = a.getFullYear();
    var month = ('0' + (a.getMonth()+1)).slice(-2);
    var dias = ('0' + a.getDate()).slice(-2);
    var time = year + '-' + month + '-' + dias;
      
    var d,e,f, t=[];

    for(var y = 0; y < btc.data?.length; y = y +1){
      d=btc.data?.[y];
      t[d.volume_date] = d
      }
   
      x=parseFloat(t?.[time]?.options_daily) + parseFloat(t?.[time]?.futures) + parseFloat(t?.[time]?.perpetual)

  
  r[i] = [okex?.[i][0], parseFloat(ftx?.[i]?.[1])
    +parseFloat(historicData?.[i]?.[1]) 
    +parseFloat(huobi?.[i]?.[1])
    +parseFloat(binance?.[i]?.[1])
    +parseFloat(okex?.[i]?.[1])
    +parseFloat(bybit?.[i]?.[1])
    +parseFloat(bitmex?.[i]?.[1])
    +x];
    test[i] = [okex?.[i][0], (parseFloat(historicData?.[i]?.[1])+x)/r?.[i]?.[1]*100];
  }
*/