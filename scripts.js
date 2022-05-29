// create our namespace obj which will represent our app
const topCrypto = {};

// define a method which will take the gif data and add gifs to front end of page
topCrypto.displayCrypto = function(apiDataArray,userSearchTerm) {
    
    if(userSearchTerm === "") {
        
        console.log(apiDataArray.Data)

        $(document).ready(function(){
            let url = window.location.href;
            if(url.includes('?')){ // if there is a coin id in the url
                $("section.results").empty();
                console.log(url.substring(url.length,url.indexOf('=')+1))
                url = url.substring(url.length,url.indexOf('=')+1);

                // Fetch currency data (usd,cad,eur,gbp,aud)
                let currencyData = topCrypto.getCurrency(apiDataArray.Data[url].CoinInfo.Name,'CAD,USD,EUR,GBP,AUD');
                console.log(currencyData);//returns obj
                
                //find percentage of 24 hour low, current price, and 24 hour high (current-min)/(max-min)*100
                let dayRangePercentage = ((apiDataArray.Data[url].RAW.USD.PRICE-apiDataArray.Data[url].RAW.USD.LOWDAY)/(apiDataArray.Data[url].RAW.USD.HIGHDAY-apiDataArray.Data[url].RAW.USD.LOWDAY))*100
                
                //display results of ?id=
                console.log(apiDataArray.Data[url])
                let coinDayChange = ((apiDataArray.Data[url].RAW.USD.CHANGE24HOUR/apiDataArray.Data[url].RAW.USD.PRICE)*100);
                $("div.pageIndex").append(`<a href="index.html">Back</a> > ${apiDataArray.Data[url].CoinInfo.FullName}`)
                $("section.results").append(`
                <div class="coinInfo">
                    <h1><img style="width:40px;height:40px" src="https://www.cryptocompare.com/${apiDataArray.Data[url].CoinInfo.ImageUrl}">
                        ${apiDataArray.Data[url].CoinInfo.FullName} (${apiDataArray.Data[url].CoinInfo.Name})</h1>
                    <h3>${apiDataArray.Data[url].DISPLAY.USD.PRICE} <span style="${coinDayChange >= 0 ? `color:green` 
                    : 'color:red'}">${coinDayChange.toFixed(2)}%</span></h3>
                    
                    <div class="progressBar"><div class="progress" style="width:${dayRangePercentage}%">&nbsp</div></div>
                    <div class="progressText">
                        <div>${apiDataArray.Data[url].DISPLAY.USD.LOWDAY}</div>
                        <div>24hr Range</div>
                        <div>${apiDataArray.Data[url].DISPLAY.USD.HIGHDAY}</div>
                    </div>

                    <table class="table">
                        <tbody>
                            <tr class="tr">
                                <td class="td">Market Cap</td>
                                <td class="td" style="justify-content:right;">$ ${apiDataArray.Data[url].RAW.USD.MKTCAP.toLocaleString('en')}</td>
                            </tr>
                            <tr class="tr">
                                <td class="td">Circulating Supply</td>
                                <td class="td" style="justify-content:right;">${apiDataArray.Data[url].RAW.USD.SUPPLY.toLocaleString('en')}</td>
                            </tr>
                            <tr class="tr">
                                <td class="td">24 Hour Total Volume</td>
                                <td class="td" style="justify-content:right;">${apiDataArray.Data[url].RAW.USD.TOTALVOLUME24H.toLocaleString('en')}</td>
                            </tr>
                            <tr class="tr">
                                <td class="td">24 Hour Total Volume In Value</td>
                                <td class="td" style="justify-content:right;">$ ${apiDataArray.Data[url].RAW.USD.TOTALVOLUME24HTO.toLocaleString('en')}</td>
                            </tr>
                            <tr class="tr">
                                <td class="td">Max Supply</td>
                                <td class="td" style="justify-content:right;">${Math.round(apiDataArray.Data[url].CoinInfo.MaxSupply).toLocaleString('en')}</td>
                            </tr>
                            <tr class="tr">
                                <td class="td">Coin Launch Date</td>
                                <td class="td" style="justify-content:right;">${apiDataArray.Data[url].CoinInfo.AssetLaunchDate}</td>
                            </tr>
                        </tbody>
                    </table>

                    <div class="convert">
                        <form>
                            <div class="convertContainer">
                                <span class="convertLabel">${apiDataArray.Data[url].CoinInfo.Name}</span>
                                <input class="convertInput" type="text" id="numToConvert"> 
                            </div>
                            <div class="convertContainer">
                                <span class="convertIcon"><i class="fa fa-long-arrow-right"></i></span>
                                <span class="convertIconMobile"><i class="fa fa-long-arrow-down"></i></span>
                            </div>
                            <div class="convertContainer">
                                <span class="convertLabel">
                                    <select class="select">
                                        <option id="USD" value="${currencyData.USD/apiDataArray.Data[url].RAW.USD.PRICE}">USD</option>
                                        <option id="CAD" value="${currencyData.CAD/apiDataArray.Data[url].RAW.USD.PRICE}">CAD</option>
                                        <option id="EUR" value="${currencyData.EUR/apiDataArray.Data[url].RAW.USD.PRICE}">EUR</option>
                                        <option id="GBP" value="${currencyData.GBP/apiDataArray.Data[url].RAW.USD.PRICE}">GBP</option>
                                        <option id="AUD" value="${currencyData.AUD/apiDataArray.Data[url].RAW.USD.PRICE}">AUD</option>
                                    </select>
                                </span>
                                <input class="convertInput" type="text" id="coinConversion">
                            </div>
                            
                        </form>
                    </div>
                </div>`);


                $("select,input").on('keyup change', function () {
                    let initialCoinPrice = apiDataArray.Data[url].RAW.USD.PRICE;
                    newPrice = $('select').children(':selected').val();
                    let deposit = $('#numToConvert').val();
                    let realCurrency = $('select').children("option:selected").attr('id');
                    if(realCurrency=='CAD'||realCurrency=='EUR'||realCurrency=='GBP'||realCurrency=='AUD') {
                        $('#coinConversion').val((initialCoinPrice*deposit)*newPrice);  
                    } else {
                        $('#coinConversion').val((initialCoinPrice*deposit)/newPrice);  
                    }
                     
                });

                $.each(apiDataArray.Data, function(index, value){
                    $(".select").append(`<option id="${value.CoinInfo.Name}" value="${value.RAW.USD.PRICE}">${value.CoinInfo.Name}</option>`);   
                });      

            } else { // if there is no coin id in the url
                $('p').append(`<h3>Top Crypto Currencies</h3>
                Below is a list of the top crypto currency coins currently in the market.</br>
                Click on a coin to display its data and coin conversion.`);
                $.each(apiDataArray.Data, function(index, value){
                    let oneHourChange = (value.RAW.USD.CHANGEHOUR/value.RAW.USD.PRICE)*100;
                    let oneDayChange = (value.RAW.USD.CHANGE24HOUR/value.RAW.USD.PRICE)*100;
                    $("section.results table tbody").append(`
                    <tr class="tr">
                        <td class="td">
                            <img style="width:18px;height:18px" src="https://www.cryptocompare.com/${value.CoinInfo.ImageUrl}">
                        </td>
                        <td class="td">
                            <a href="index.html?id=${index}">${value.CoinInfo.Name}</a>
                        </td>
                        <td class="td">
                            ${value.DISPLAY.USD.PRICE}
                        </td>
                        <td class="td" style="${oneHourChange >= 0 ? `color:green` 
                        : 'color:red'}">
                            ${oneHourChange.toFixed(2)}%
                        </td>
                        <td class="td" style="${oneDayChange >= 0 ? `color:green` 
                        : 'color:red'}">
                            ${oneDayChange.toFixed(2)}%
                        </td>
                        <td class="td">
                            ${value.DISPLAY.USD.MKTCAP}
                        </td>
                    </tr>`);
                });
            }
        });

        
    } else {
        console.log(apiDataArray.Data.length)
        $(document).ready(function(){ // display coin based on user input
            for(let i = 0 ; i < apiDataArray.Data.length ; i++) {
                if(apiDataArray.Data[i].CoinInfo.Name === userSearchTerm) {
                
                // Fetch currency data (usd,cad,eur,gbp,aud)
                let currencyData = topCrypto.getCurrency(apiDataArray.Data[i].CoinInfo.Name,'CAD,USD,EUR,GBP,AUD');
                console.log(currencyData);//returns obj

                let dayRangePercentage = ((apiDataArray.Data[i].RAW.USD.PRICE-apiDataArray.Data[i].RAW.USD.LOWDAY)/(apiDataArray.Data[i].RAW.USD.HIGHDAY-apiDataArray.Data[i].RAW.USD.LOWDAY))*100
            
                //display results of ?id=
                console.log(apiDataArray.Data[i])
                let coinDayChange = ((apiDataArray.Data[i].RAW.USD.CHANGE24HOUR/apiDataArray.Data[i].RAW.USD.PRICE)*100);
                    
                $("div.pageIndex").append(`<a href="index.html">Back</a> > ${apiDataArray.Data[i].CoinInfo.FullName}`)
                $("section.results").append(`
                <div class="coinInfo">
                    <h1><img style="width:40px;height:40px" src="https://www.cryptocompare.com/${apiDataArray.Data[i].CoinInfo.ImageUrl}">
                        ${apiDataArray.Data[i].CoinInfo.FullName} (${apiDataArray.Data[i].CoinInfo.Name})</h1>
                    <h3>${apiDataArray.Data[i].DISPLAY.USD.PRICE} <span style="${coinDayChange >= 0 ? `color:green` 
                    : 'color:red'}">${coinDayChange.toFixed(2)}%</span></h3>
                    
                    <div class="progressBar"><div class="progress" style="width:${dayRangePercentage}%">&nbsp</div></div>
                    <div class="progressText">
                        <div>${apiDataArray.Data[i].DISPLAY.USD.LOWDAY}</div>
                        <div>24hr Range</div>
                        <div>${apiDataArray.Data[i].DISPLAY.USD.HIGHDAY}</div>
                    </div>

                    <table class="table">
                        <tbody>
                            <tr class="tr">
                                <td class="td">Market Cap</td>
                                <td class="td" style="justify-content:right;">$ ${apiDataArray.Data[i].RAW.USD.MKTCAP.toLocaleString('en')}</td>
                            </tr>
                            <tr class="tr">
                                <td class="td">Circulating Supply</td>
                                <td class="td" style="justify-content:right;">${apiDataArray.Data[i].RAW.USD.SUPPLY.toLocaleString('en')}</td>
                            </tr>
                            <tr class="tr">
                                <td class="td">24 Hour Total Volume</td>
                                <td class="td" style="justify-content:right;">${apiDataArray.Data[i].RAW.USD.TOTALVOLUME24H.toLocaleString('en')}</td>
                            </tr>
                            <tr class="tr">
                                <td class="td">24 Hour Total Volume In Value</td>
                                <td class="td" style="justify-content:right;">$ ${apiDataArray.Data[i].RAW.USD.TOTALVOLUME24HTO.toLocaleString('en')}</td>
                            </tr>
                            <tr class="tr">
                                <td class="td">Max Supply</td>
                                <td class="td" style="justify-content:right;">${Math.round(apiDataArray.Data[i].CoinInfo.MaxSupply).toLocaleString('en')}</td>
                            </tr>
                            <tr class="tr">
                                <td class="td">Coin Launch Date</td>
                                <td class="td" style="justify-content:right;">${apiDataArray.Data[i].CoinInfo.AssetLaunchDate}</td>
                            </tr>
                        </tbody>
                    </table>

                    <div class="convert">
                        <form>
                            <div class="convertContainer">
                                <span class="convertLabel">${apiDataArray.Data[i].CoinInfo.Name}</span>
                                <input class="convertInput" type="text" id="numToConvert"> 
                            </div>
                            <div class="convertContainer">
                                <span class="convertIcon"><i class="fa fa-long-arrow-right"></i></span>
                                <span class="convertIconMobile"><i class="fa fa-long-arrow-down"></i></span>
                            </div>
                            <div class="convertContainer">
                                <span class="convertLabel">
                                    <select class="select">
                                        <option id="USD" value="${currencyData.USD/apiDataArray.Data[i].RAW.USD.PRICE}">USD</option>
                                        <option id="CAD" value="${currencyData.CAD/apiDataArray.Data[i].RAW.USD.PRICE}">CAD</option>
                                        <option id="EUR" value="${currencyData.EUR/apiDataArray.Data[i].RAW.USD.PRICE}">EUR</option>
                                        <option id="GBP" value="${currencyData.GBP/apiDataArray.Data[i].RAW.USD.PRICE}">GBP</option>
                                        <option id="AUD" value="${currencyData.AUD/apiDataArray.Data[i].RAW.USD.PRICE}">AUD</option>
                                    </select>
                                </span>
                                <input class="convertInput" type="text" id="coinConversion">
                            </div>
                        </form>
                    </div>
                </div>`);
                

                $("select,input").on('keyup change', function () {
                    let initialCoinPrice = apiDataArray.Data[i].RAW.USD.PRICE;
                    newPrice = $('select').children(':selected').val();
                    let deposit = $('#numToConvert').val();
                    let realCurrency = $('select').children("option:selected").attr('id');
                    if(realCurrency=='CAD'||realCurrency=='EUR'||realCurrency=='GBP'||realCurrency=='AUD') {
                        $('#coinConversion').val((initialCoinPrice*deposit)*newPrice);  
                    } else {
                        $('#coinConversion').val((initialCoinPrice*deposit)/newPrice);  
                    }
                     
                });

                $.each(apiDataArray.Data, function(index, value){
                    $(".select").append(`<option id="${value.CoinInfo.Name}" value="${value.RAW.USD.PRICE}">${value.CoinInfo.Name}</option>`);   
                });
                }
                
            }

        });
    }

}



// define a method which will store our ajax call to the api
topCrypto.getCrypto = function(userSearchTerm) {
    $.ajax({
        url: `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=40&tsym=USD`,
        method: "GET",
        dataType: "json",
    }).then(function(cryptoData) {
        // cryptoData is only accessible through this scope
        if(userSearchTerm) {
            topCrypto.displayCrypto(cryptoData,userSearchTerm);
        } else {
            topCrypto.displayCrypto(cryptoData,"");
        }       
    })
}

topCrypto.getCurrency = function(cryptoName,currencyName) {
    const currencyValue = $.ajax({
        url: `https://min-api.cryptocompare.com/data/price?fsym=${cryptoName}&tsyms=${currencyName}`,
        method: "GET",
        dataType: "json",
        async: false,
        success: function(data) {
            result = data
        }
    });
    return result;      
}


// define an init method
topCrypto.init = function() {

    $(document).ready(function(){
        topCrypto.getCrypto("");
    })
    //set up a submit event listener on search form
    //once the form is submitted were going to grab the search term from input
    // pass the search term to the getCrypto method which will make a call to api

    $('form').on('submit',function(event) {
        //prevent the default behaviour
        event.preventDefault();
        let searchTerm = $('#search-input').val();
        $('.coinInfo').remove();
        $('.table').remove();
        $("div.pageIndex").empty();
        $('p').remove();
        
        topCrypto.getCrypto(searchTerm);
        
        
    })
    
}

// set up our document ready
// call our init method
$(function(){
    topCrypto.init()
})