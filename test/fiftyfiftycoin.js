contract('FiftyFiftyCoin', function(accounts) {
  it("should put 100000 Coin in the first account", function() {
    var meta = FiftyFiftyCoin.deployed();

    return meta.getBalance.call(accounts[0]).then(function(balance) {
      assert.equal(balance.valueOf(), 100000, "100000 wasn't in the first account");
    });
  });
  it("should call a function that depends on a linked library", function() {
    var meta = FiftyFiftyCoin.deployed();
    var metaCoinBalance;
    var metaCoinEthBalance;

    return meta.getBalance.call(accounts[0]).then(function(outCoinBalance) {
      metaCoinBalance = outCoinBalance.toNumber();
      return meta.getBalanceInEth.call(accounts[0]);
    }).then(function(outCoinBalanceEth) {
      metaCoinEthBalance = outCoinBalanceEth.toNumber();
    }).then(function() {
      assert.equal(metaCoinEthBalance, 2 * metaCoinBalance, "Library function returned unexpeced function, linkage may be broken");
    });
  });
  it("should send coin correctly", function() {
    var meta = FiftyFiftyCoin.deployed();

    // Get initial balances of first, second and third account.
    var account_one = accounts[0];
    var account_two = accounts[1];
    var account_three = accounts[2];

    var account_one_starting_balance;
    var account_two_starting_balance;
    var account_three_starting_balance;
    var account_one_ending_balance;
    var account_two_ending_balance;
    var account_three_ending_balance;

    var amount = 10;

    return meta.getBalance.call(account_one).then(function(balance) {
      account_one_starting_balance = balance.toNumber();
      return meta.getBalance.call(account_two);
    }).then(function(balance) {
      account_two_starting_balance = balance.toNumber();
      return meta.getBalance.call(account_three);
    }).then(function(balance) {
      account_three_starting_balance = balance.toNumber();
      return meta.sendCoin(account_two, account_three, amount, {from: account_one});
    }).then(function() {
      return meta.getBalance.call(account_one);
    }).then(function(balance) {
      account_one_ending_balance = balance.toNumber();
      return meta.getBalance.call(account_two);
    }).then(function(balance) {
      account_two_ending_balance = balance.toNumber();
      return meta.getBalance.call(account_three);
    }).then(function(balance) {
      account_three_ending_balance = balance.toNumber();

      assert.equal(account_one_ending_balance, account_one_starting_balance - amount, "Amount wasn't correctly taken from the sender");
      assert.equal(account_two_ending_balance, account_two_starting_balance + amount/2, "Amount wasn't correctly sent to the receiver1");
      assert.equal(account_three_ending_balance, account_three_starting_balance + amount/2, "Amount wasn't correctly sent to the receiver2");
    });
  });
});
