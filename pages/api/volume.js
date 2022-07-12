import Redis from "ioredis"
import Axios from "axios"

let redis = new Redis("rediss://:db87a864a6184761bf33de66a76bccc8@us1-rational-jaybird-37621.upstash.io:37621")

const COINGECKO_API_URL = "https://api.coingecko.com/api/v3";
const DERIBIT_API_URL = "https://www.deribit.com/api/v2"
const DERIBIT_HISTORICAL_DATA_URL = "http://18.193.105.218"

export default async function handler(req, res) {
    let start = new Date().getTime();
    let cache = await redis.get("responseObject");
    cache =JSON.parse(cache);
    let result = {};
    if (cache) {
        console.log("loading from cache");
        result.data = cache;
        result.type = "redis";
        result.latency = Date.now() - start;
        return res.status(200).json(cache);
    } else {
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
            res.latency = Date.now() - start;
            res.type = "api";
            res.json(responseObject)
            redis.set("responseObject", JSON.stringify(responseObject), "EX", 43200);
            res.status(200).json(res)
        } catch (error) {
            res.status(400)
            res.json(JSON.stringify({ error: error.message }))
        }
    }

    
}
