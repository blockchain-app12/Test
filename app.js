var express = require("express")
var cors = require("cors")
var request = require("request-promise")
var hash = require("sha256")
const dotenv = require('dotenv');
var app = express()
app.use(cors())
app.use(express.urlencoded({extended: true}));
app.use(express.json())
dotenv.config();
const addr = "1DEP8i3QJCsomS4BSMY2RpU1upv62aGvhD"

app.get("/transactions", (req,res)=>
{
    request('https://api.blockcypher.com/v1/btc/main/addrs/'+addr)
    .then(function (response) {
        var arr = []
        var obj = JSON.parse(response)
        var generalinfo = {
            Type:"Address_info",
            Fabricuserhash:hash(addr),
            Address:obj["address"],
            Total_received:(obj["total_received"]/100000000).toFixed(8) + " BTC",
            Total_sent:(obj["total_sent"]/100000000).toFixed(8) + " BTC",
            Final_balance:(obj["final_balance"]/100000000).toFixed(8) + " BTC",
            Totaltransactionscount:obj["final_n_tx"]
        }
        arr.push(generalinfo)
        for(i=0;i<obj["txrefs"].length;i++){
            if(obj["txrefs"][i]["tx_input_n"] == -1) {
        var responseobj = {
            Transactionhash:obj["txrefs"][i]["tx_hash"],
            Block_height:obj["txrefs"][i]["block_height"],
            Transactiontype:"Received",
            Value:(obj["txrefs"][i]["value"]/100000000).toFixed(8) + " BTC",
            Created_At:obj["txrefs"][i]["confirmed"]

        }                
      } else {
        var responseobj = {
            Transactionhash:obj["txrefs"][i]["tx_hash"],
            Block_height:obj["txrefs"][i]["block_height"],
            Transactiontype:"Sent",
            Value:(obj["txrefs"][i]["value"]/100000000).toFixed(8) + " BTC",
            Created_At:obj["txrefs"][i]["confirmed"]

        }  
      }
      arr.push(responseobj)
    }        
        res.send(arr)

    })
    .catch(function (err) {
        res.json({"err":"data reading err"})
    });
   
})

app.set('port', process.env.PORT);

app.set('host', process.env.HOST || 'localhost');

app.listen(app.get('port'), function(){

  console.log('Express server listening on port ' + app.get('host') + ':' + app.get('port'));
  
})

module.exports =  app;