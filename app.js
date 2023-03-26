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

var account ='0x41323edE64486B9aFdc542a26FaB232F5815c595'

var pkey = "eff56bd3f30b02855af1d3365b36a98b2642634de5eb9ef1c652e81d3e508751"
 
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

var contractAdress = '0x9aFd5E4402265e289aE7480DE2A83C8E31e3A80e'

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
    var encodeddata = myContract.methods.set(newWord).encodeABI();
    console.log ( encodeddata)

    var transactionObject ={

        gas: '47000',
        data: 'myContract',
        from: account,
        to  : contractAdress
    }

    web3.eth.accounts.signTransaction(transactionObject,pkey,function(err , trans){
        console.log(trans)
        web3.sendSignedTransaction(trans.rawTransaction).on("receipt",function(result){
            res.send(result);
        })
    })
})

app.listen(3000,()=> { 
   
    console.log("app is running on 3000 !")

})