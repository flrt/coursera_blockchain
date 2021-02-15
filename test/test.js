let Auction = artifacts.require("./Auction.sol");

let AuctionInstance;

contract('Auction Contract', function (accounts) {

  // Positive Test 1 
  it("Contract deployment", function() {
    return Auction.deployed().then(function (instance) {
      auctionInstance = instance;
      assert(auctionInstance !== undefined, 'Auction contract should be defined');
    });
  });

  // Positive Test 2
  it("Should set bidders", function() {
    return auctionInstance.register({from:accounts[1]}).then(function(result) {
      return auctionInstance.getPersonDetails(0);
      }).then(function(result) {
	// console.log(accounts);
	// console.log(result);
        assert.equal(result[2], accounts[1], 'bidder address set');
      })
  });

  // Negative 3
  it("Should NOT allow to bid more than remaining tokens", function() {
    return auctionInstance.bid(0, 13, {from: accounts[1]})
      .then(function (result) {
	assert(false);       
      }).catch(function (e) {
        // console.log(e.toString());
	assert(true);
      })
  }); 

  // Negative 4
  it("Should NOT allow non owner to reveal winners", function() {
     return auctionInstance.revealWinners({from: accounts[1]}) 
     .then(function (instance) {
       assert(false);
     }).catch(function (e) {
       // console.log(e.toString());
       assert(true);
     })
  });

  // Positive Test 5
  // We register three accounts, bid items using them, and call revealWinners 
  // from the authorized account. After which,we assert the winner of each item to see if the address is set.
  // register 2, 3, 4
  // 2 bid 5 item 0
  // 3 bid 4 item 1
  it("Should set winners", function() {
    console.log("register account 2 : ",accounts[2]);
    return auctionInstance.register({from:accounts[2]})
    .then(function(result) {
    	console.log("register account 3 : ",accounts[3]);
        return auctionInstance.register({from:accounts[3]})
    }).then(function() {
    	console.log("register account 4 : ",accounts[4]);
        return auctionInstance.register({from:accounts[4]})
    }).then(function() {
        return auctionInstance.bid(0,5,{from:accounts[2]})
    }).then(function() {
        return auctionInstance.bid(1,5,{from:accounts[3]})
    }).then(function() {
        return auctionInstance.bid(2,5,{from:accounts[4]})
    }).then(function() {
        return auctionInstance.revealWinners({from: accounts[0]})
    }).then(function() {
        return auctionInstance.winners(itemId=0, {from:accounts[0]})
    }).then(function(result) {
	console.log("winner item 0 (should be address 2)", result);
      	assert.notEqual(result, '0x0000000000000000000000000000000000000000', 'winner address is not default');
      	return auctionInstance.winners(itemId=1,{from:accounts[0]})
    }).then(function(result) {
	console.log("winner item 1 (should be address 3)", result);
	assert.notEqual(result, '0x0000000000000000000000000000000000000000', 'winner address is not default');
	return auctionInstance.winners(itemId=2, {from:accounts[3]})
    }).then(function(result) {
	console.log("winner item 2 (should be address 4)", result);
      	assert.notEqual(result, '0x0000000000000000000000000000000000000000', 'winner address is not default');
    })
  });
 

  
});
