window.onload = function() {
    document.getElementById("submit").addEventListener('click', function(event) {
        event.preventDefault();
        calculateNumShares();
        calculatePerquisiteTax();
        calculateProfitAndTax();
    });
};

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
    var shareOffer = getNumber("share-offer");
    var sharePurchase = getNumber("share-purchase");

    var minimumSharePrice = Math.min(sharePurchase, shareOffer);
    insertIntoId("minimum-share-price", minimumSharePrice);

    var effectiveSharePrice = minimumSharePrice*0.85;
    insertIntoId("effective-share-price", effectiveSharePrice);

    var numShares = Math.floor((monthlyBase*6*contribution/100)/(rupeeValue*effectiveSharePrice));
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
    var sharePurchase = getNumber("share-purchase");
    var numShares = getNumber("num-shares");
    var effectiveContribution = getNumber("effective-contribution");
    var rupeeValue = getNumber("rupee-value");

    var effectiveRevenue = numShares*sharePurchase*rupeeValue;
    insertIntoId("share-sell", effectiveRevenue);

    var profit = effectiveRevenue - effectiveContribution;
    insertIntoId("profit", profit);

    var tax = 0;
    /*if (sharePurchase != minimumSharePrice) {
        tax = 30*profit/100;
    }
    insertIntoId("tax-profit", tax);*/

    var transactionFee = 20*rupeeValue;
    insertIntoId("transaction-fee", transactionFee);

    var perquisiteTax = getNumber("perquisite-tax");

    var finalProfit = profit-tax-perquisiteTax-transactionFee;
    insertIntoId("final-profit", finalProfit);
}