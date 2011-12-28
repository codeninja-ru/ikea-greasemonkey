// ==UserScript==
// @name           Ikea vladivostok
// @namespace      http://hqmedia.ru/
// @description    подмена цен на сайте икея
// @include        http://www.ikea.com/*
// @include        http://*.ikea.com/*
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js
// ==/UserScript==

var PRICE_COEFF = 1.8; // число на которео умножаем цену

function trim(str)
{
    if (str == null) return "";
    var string = new String(str);
    return string.replace(/(^\s+)|(\s+$)/g, "");
}

// преобразуем цену в строковом виде в float
function price2Float(str)
{
    str = trim(str);
    if (str == null || str == "") return 0;
    var string = new String(str);
    //удаляем пробелы в середине
    string = string.replace(/[\s]/g, "");
    
    return parseFloat(string);
}

//извлекаем цену из строки
function extractPrice(str)
{
    var str = trim(str); 
    if (str == null) return "";

    //удаляем все лишнее. оставляем только цифры и пробелы
    var expr = /[\d\s\.\,\–]+/; 
    var priceStr = expr.exec(str);

    if (priceStr == null) return ""; else return priceStr;
}

function float2Price(val)
{
    return Math.ceil(val)+" руб. вл";
}


$(window).ready(function() {

//    var propForScan = ["price1", "price2", "price3", "price4", "price5", "price6", "price7", "price8", "priceProdInfo"];

    // меняем параметры прямо в массиве
    if (unsafeWindow.jProductData != undefined) $(unsafeWindow.jProductData.product.items).each(function(idx, e) {
        var price = e.prices.normal.priceNormal.rawPrice;
        var newPrice = price * PRICE_COEFF;
        var priceStr = float2Price(newPrice);
        e.prices.normal.priceNormal.rawPrice = newPrice;
        e.prices.normal.priceNormal.value = priceStr;

        /*for (var key in propForScan) {
            var prop = propForScan[key];
            var priceStr = e.normalPrices[prop]; //extractPrice(e["price1"]);
            if (priceStr == "" || priceStr == undefined) continue;
            var val = price2Float(priceStr);
        
            var newVal = val * PRICE_COEFF; // новая цена
            e.normalPrices[prop] = float2Price(newVal); 
        }*/
    });

    // поехали
    $('span[class^=priceField], .prodPrice, .packagePrice').each(function(idx, e) {
        var text = new String($(e).text());
        
        var priceStr = extractPrice(text); 
        var val = price2Float(priceStr);
        if (val != 0) {
            
            var newVal = val * PRICE_COEFF; // новая цена
            
            // запоминаем цену икея
            $(e).attr('data-old-price', val);
            
            // меняем цену
            var newText = text.replace(priceStr, float2Price(newVal));
            $(e).text(newText);
            
            //alert(priceStr+' '+val);        
        }

    });
    //totalPrice
});



