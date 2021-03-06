
import { Line } from "react-chartjs-2";

//import { makeStyles } from "@material-ui/styles";
//import { ThemeProvider, createTheme,CircularProgress } from "@mui/material/styles";
//import { makeStyles } from "@mui/styles";
import { Charts as ChartJS } from 'chart.js/auto'
import { Chart }            from 'react-chartjs-2'
import {useState , useEffect} from "react"
import axios from 'axios'
import useSWR, {mutate} from 'swr';
import Header from '../components/header'
import SelectButton from '../components/SelectButton'
import {
  CircularProgress,
  createTheme,
  makeStyles,
  ThemeProvider,
}from "@material-ui/core";

const fetcher = async url => {
  let res = await axios.get(url)
  return res.data
}

const App = () => {
  const useStyles = makeStyles((theme) => ({
    container: {
      width: "80%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 25,
      padding: 40,
      [theme.breakpoints.down("md")]: {
        width: "100%",
        marginTop: 0,
        padding: 30,
        paddingTop: 0,
      },
    },
  }));
  
  //const classes = useStyles();

  const [days, setDays] = useState(30)
  const [count, setCount] = useState(30)

  const handleDaysChanged = (event) => {
      const { value } = event.target
      setDays(value)
  }

  const handleCountChanged = (event) => {
      const { value } = event.target
      setCount(value)
  }

  return (
    
      <>
          <Charts days={days} count={count} />
      </>
  )
}

const Charts = ({ days, count }) => {
 // const classes = useStyles();
  const { data, error } = useSWR(
      `/api/volume?days=${days}&count=${count}`,
      fetcher,
      {
          revalidateIfStale: false,
          revalidateOnFocus: false,
          revalidateOnReconnect: false
      }

      
  )


  var test = [];
  var trying = [];
  var r = []; //result
  var i, l = data?.exchange_volumes?.binance?.length;


  for(i = 0; i < data?.exchange_volumes?.binance?.length; i = i +1) {
    var testing = data?.exchange_volumes?.deribit?.[i]?.[0];
    var a = new Date(testing);
    var year = a.getFullYear();
    var month = ('0' + (a.getMonth()+1)).slice(-2);
    var dias = ('0' + a.getDate()).slice(-2);
    var time = year + '-' + month + '-' + dias;

    var d,e,price_eth=[], price_btc=[], x, m;

    for(var y = 0; y < data.deribit_volumes?.btc.data?.length; y = y +1){
      d=data.deribit_volumes?.btc.data?.[y];
      price_btc[d.volume_date] = d
      }
   
      x=parseFloat(price_btc?.[time]?.total_volume);

      var pricediff=[];
      for(var z = 0; z < data.deribit_volumes?.eth.data?.length; z = z +1){
        if(data.deribit_volumes?.eth?.[z]?.date === data.deribit_volumes?.btc.data?.[z]?.date){
          pricediff[z] = data.historical_price.btc_usd?.result?.data[z]?.delivery_price /data.historical_price.eth_usd?.result?.data[z]?.delivery_price
        }
      }

      for(var o = 0; o < data.deribit_volumes?.eth.data?.length; o = o +1){
        e=data.deribit_volumes?.eth.data?.[o];
        price_eth[e.volume_date] = e
        }
        m=((parseFloat(price_eth?.[time]?.total_volume))/pricediff[i])
        m = m?m:0;
  
  r[i] = [data.exchange_volumes?.deribit?.[i][0], parseFloat(data.exchange_volumes?.ftx?.[i]?.[1])
    +parseFloat(data.exchange_volumes?.deribit?.[i]?.[1]) 
    +parseFloat(data.exchange_volumes?.huobi?.[i]?.[1])
    +parseFloat(data.exchange_volumes?.binance?.[i]?.[1])
    +parseFloat(data.exchange_volumes?.okex?.[i]?.[1])
    +parseFloat(data.exchange_volumes?.bybit?.[i]?.[1])
    +parseFloat(data.exchange_volumes?.bitmex?.[i]?.[1])
    +x+m];
    test[i] = [data.exchange_volumes?.deribit?.[i][0], (parseFloat(data.exchange_volumes?.deribit?.[i]?.[1])+x+m)/r?.[i]?.[1]*100];
    
  }
  

  // Loading State
  if (!data) {
      return (<CircularProgress
        style={{ color: "#2DAE9A" }}
        size={250}
        thickness={1}
      />)
  }

  // Error State
  if (error) {
      return (<>Error fetching data</>)
  }

  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
      type: "dark",
    },
  });

  return (
    
    <ThemeProvider theme={darkTheme}>
      <div style={{
                display: "flex",
                marginTop: 20,
                marginRight: 0,
                marginLeft:150,
                justifyContent: "center",
                width: "80%",
              }}>
          <>
            <Line
              data={{
                labels: data.exchange_volumes?.deribit?.map((exchange) => {
                  let date = new Date(exchange[0]);
                  let time =
                    date.getHours() > 12
                      ? `${date.getHours() - 12}:${date.getMinutes()} PM`
                      : `${date.getHours()}:${date.getMinutes()} AM`;
                  return days === 1 ? time : date.toLocaleDateString();
                }),

                datasets: [
                  {
                    data: test.map((exchange) => exchange[1]),
                    label: `Market Share ( Past ${days} Days ) in %`,
                    borderColor: "#2DAE9A",
                    lineTension:0.6
                  },
                ],
              }}
              options={{
                elements: {
                  point: {
                    radius: 1,
                  },
                },
              }}
            />

          </>
        
      </div>
      <div style={{
                display: "flex",
                marginTop: 20,
                marginRight: 0,
                marginLeft:150,
                justifyContent: "center",
                width: "80%",
                textJustify:"inter-word"
              }}>
        <h3>
          We query the data from multiple exchanges via coingecko API, exchanges currently used: FTX, Binance, Bitmex, OKEX, Bybit, Huobi.
        </h3>
        <h3>
          We then add the volume for each day and we utilize our internal data in order to get our volume percentage. basically volume% = DeribitVolume/TotalVolume*100
        </h3>
        <h3>
          Where DeribitVolume is the volume of the day in Deribit and TotalVolume is the total volume of the day in all exchanges.
        </h3>
        
      </div>
      
    </ThemeProvider>
  );


  
}

export default App;



