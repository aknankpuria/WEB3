const express = require('express')
const app = express()

const bodyparser = require('body-parser')
const Web3 = require ( 'web3') 

app.get( '/ak' ,function(req,res ){
   
    res.sendFile(__dirname+ '/public/index.html')

 
})

app.use(bodyparser.urlencoded({ extended:false}))
//parser
app.use(bodyparser.json())

const web3 =new Web3('HTTP://127.0.0.1:7545')

web3.eth.getAccounts(function(err,accounts){
    console.log(accounts)
})

var account ='0xd429036Aeb71814a44373532e5538A9A38981122'

var pkey = "a9a53d332ba3a4847d2ab8d5fa5cd8e0630b54b53885d6c059efb98940c9f601"
 
var abi = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_word",
				"type": "string"
			}
		],
		"name": "set",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getword",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

var contractAdress = '0xA9a03874FCE34E3a7814fF10801FFF99a1fb5DCC'

var myContract = new web3.eth.Contract(abi,contractAdress)

console.log(myContract.methods);

app.get('/getString',function (req,res){
    myContract.methods.getWord().call({from:account})
.then(function(result){
    console.log(result);
    res.send(result);
})
})
app.post( '/newword' , function(req,res){
    var newWord = req.body.word ;
    var encodedData = myContract.methods.set(newWord).encodeABI();
    console.log(encodedData)

    var transactionObject ={

        gas: '470000',
        data: encodedData,
        from: account,
        to  : contractAdress
    }

    web3.eth.accounts.signTransaction(transactionObject,pkey,function(error, trans){
        console.log(trans);
        web3.eth.sendSignedTransaction(trans.rawTransaction).on("receipt",function(result){
            console.log(result);
            res.send(result);
        })
    })
})

app.listen(3000,()=> { 
   
    console.log("app is running on 3000 !")

})