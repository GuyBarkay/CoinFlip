var web3 = new Web3(Web3.givenProvider);
var contractInstance;
$(document).ready(function() {
    window.ethereum.enable().then(function(accounts){
      contractInstance = new web3.eth.Contract(window.abi,"0x148d5fD8d49f96fABc2F807FF390bE292937BAc4", {from: accounts[0]});
      //console.log(contractInstance);
          });

          $("#flip_button").click(coinFlip);
          $("#deposit_button").click(deposit);
          $("#withdrawAll_button").click(withdrawAll);
        });

function deposit(){
  var amount = $("#amount_deposit").val() ;
  var config = {
    value:web3.utils.toWei( amount, "ether")
  }
 contractInstance.methods.deposit().send(config)
 .on ("transactionHash", function( hash) {
  console.log (hash);
 })
.on("confirmation", function (confirmationNr){
  console.log(confirmationNr);
})
.on("receipt" ,function(receipt){
  console.log(receipt);
  getBalanceBegin();
  alert("success deposit");
})
}


//parseFloat(await web3.eth.getBalance(accounts[0]))


function coinFlip(){

  getBalanceBegin();

  var gambleAmount = $("#amount_input").val() ;
  var config2 = {
    value:web3.utils.toWei(gambleAmount, "ether")
  }
 contractInstance.methods.flip().send(config2).
 on ("transactionHash", function(x) {
  console.log (x);
 })
.on("confirmation", function (confirmationNr){
  console.log(confirmationNr);
})
.on("receipt" ,function(receipt){
  console.log(receipt);
  alert("received receipt")})
  .then(function(){
  getBalance();
  fetchAndDisplay();
  playerBalance();
});


}
function getBalance () {
  contractInstance.methods.getBalance().call().then(function(res){
    var balance =   web3.utils.fromWei(res, 'ether'); //  parseFloat(res/1000000000000000000);
    console.log("balance: " +balance);
    $("#balance_output").text( +balance);
  })
}
function getBalanceBegin () {
  contractInstance.methods.getBalance().call().then(function(res){
    var balanceBegin=    web3.utils.fromWei(res, 'ether');   //parseFloat(res/1000000000000000000);
    console.log("begining Balance " +balanceBegin);
   $("#Bbalance").text(+balanceBegin);
  })
}

function fetchAndDisplay() {
  contractInstance.methods.getLastFlip().call().then(function(res){
    console.log(res);
    var j;
    if (res==0){j= "You lost"} else {j = "You Won"};
    $("#result_output").text(j)
  })
}

function playerBalance() {
  contractInstance.methods.getPlayerBalance().call().then(function(res){
       balanceOfPlayer = web3.utils.fromWei(res, 'ether');
      console.log( "player balance " +balanceOfPlayer );   //+res/1000000000000000000);
      $("#player_balance_output").text(+balanceOfPlayer);  //res/1000000000000000000);
  })
}

function withdrawAll() {
  contractInstance.methods.withdrawAll().send()
  .then(function() {
    getBalance();
    getBalanceBegin ()
    playerBalance();
  })
}
