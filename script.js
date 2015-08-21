window.onload = function() {
    document.getElementById("submit").addEventListener('click', function(event) {
        event.preventDefault();
        calculateNumShares();
        calculatePerquisiteTax();
        calculateProfitAndTax();
        calculatePercentageProfit();
        jumpTo("final-profit");
    });
};

function jumpTo(id) {
    var url = location.href;
    location.href = '#'+id;
}

function check() {
    var lst = document.body.childNodes;
    alert(lst.__proto__);
    alert(lst[0]);
    alert(lst[0].__proto__);
}

function getTaxBracket() {
    if (document.getElementById("tax-10").checked) {
        return 10;
    } else if(document.getElementById("tax-20").checked) {
        return 20;
    } else if(document.getElementById("tax-30").checked) {
        return 30;
    } else {
        return 0;
    }
}

function getNumber (id) {
    var elem = document.getElementById(id);
    if(isNaN(elem.value)) {
        alert(elem.getAttribute("error")+" not a number")
        return -1;
    }

    return parseInt(elem.value);
}

function deleteTemporaryElements() {
    Array.prototype.forEach.call(document.getElementsByClassName("temp"), function (elem) {
        elem.remove();
    });
}

function insertIntoId(id, text) {
    var elem = document.getElementById(id);
    elem.disabled = false;
    elem.value = text;
    elem.disabled = true;
}

function calculateNumShares (argument) {
    var rupeeValue = getNumber("rupee-value");
    var monthlyBase = getNumber("monthly-base");
    var contribution = getNumber("contribution");
    var shareOfferPrice = getNumber("share-offer");
    var sharePurchasePrice = getNumber("share-purchase");
    var duration = getNumber("duration");

    var minimumSharePrice = Math.min(sharePurchasePrice, shareOfferPrice);
    insertIntoId("minimum-share-price", minimumSharePrice);

    var effectiveSharePrice = (minimumSharePrice*0.85).toFixed(2);
    insertIntoId("effective-share-price", effectiveSharePrice);

    var numShares = Math.floor((monthlyBase*duration*contribution/100)/(rupeeValue*effectiveSharePrice));
    insertIntoId("num-shares", numShares);
}

function calculatePerquisiteTax () {
    var effectiveSharePrice = getNumber("effective-share-price");
    var numShares = getNumber("num-shares");
    var rupeeValue = getNumber("rupee-value");
    var taxBracket = getTaxBracket();
    var minimumSharePrice = getNumber("minimum-share-price");
    var sharePurchaseDatePrice = getNumber("share-purchase");

    var effectiveContribution = effectiveSharePrice*numShares*rupeeValue;
    insertIntoId("effective-contribution", effectiveContribution);

    var perquisiteTax = numShares*(sharePurchaseDatePrice-effectiveSharePrice)*rupeeValue*taxBracket/100;
    insertIntoId("perquisite-tax", perquisiteTax);
}

function calculateProfitAndTax (argument) {
    var minimumSharePrice = getNumber("minimum-share-price");
    var sharePurchasePrice = getNumber("share-purchase");
    var numShares = getNumber("num-shares");
    var effectiveContribution = getNumber("effective-contribution");
    var rupeeValue = getNumber("rupee-value");

    var effectiveRevenue = numShares*sharePurchasePrice*rupeeValue;
    insertIntoId("share-sell", effectiveRevenue);

    var profit = effectiveRevenue - effectiveContribution;
    insertIntoId("profit", profit);

    var transactionFee = 45*rupeeValue;
    insertIntoId("transaction-fee", transactionFee);

    var perquisiteTax = getNumber("perquisite-tax");

    var finalProfit = profit-perquisiteTax-transactionFee;
    insertIntoId("final-profit", finalProfit);
}

function calculatePercentageProfit() {
    var cp = getNumber("effective-contribution");
    var netProfit = getNumber("final-profit");

    var percentageProfit = ((netProfit/cp)*100).toFixed(2);
    insertIntoId("percentage-profit", percentageProfit);
}