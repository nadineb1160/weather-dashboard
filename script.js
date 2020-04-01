// Once document is loaded
$(document).ready(function () {

    // Current date formatted 
    let currentDay = moment().format("(MM/DD/YYYY)");

    // Saved cities
    var savedcitiesArr = [];

    // Get Previous data
    getPrevCities();

    // City value entered
    var city = "";

    // Variables for data
    var name, temperature, wind, humidity, UVIndex, iconImg;

    // Latitude and longitude
    var lat, long;

    // Array of five day objs at 3pm
    var fiveDayData15 = [];

    // Submit button
    $(".submit").on("click", function (event) {

        event.preventDefault();

        // Possibly auto fill api?

        // City input
        city = $("#city").val();

        // Push new city to saved array
        savedcitiesArr.push(city);
        console.log(savedcitiesArr);

        // Get current data
        getCurrentData();

        // Save data
        saveData();

        // Display previous cities
        displayPrevCities();


    });

    // Set data in local storage
    function saveData() {
        localStorage.setItem("savedCities", JSON.stringify(savedcitiesArr));
    }

    // Get previous cities
    function getPrevCities() {
        var storedCities = localStorage.getItem("savedCities");

        // If not not null
        if (storedCities) {
            // Set savedCitiesARr to stored
            savedcitiesArr = JSON.parse(storedCities);
            // console.log("saved " + savedcitiesArr);
        }

        displayPrevCities();
    }

    // Display previous cities
    function displayPrevCities() {

        // City list
        var cities = $(".list-group");

        // Clear old list before appending
        cities.text("");

        // Loop through saved cities to display
        for (var i = 0; i < savedcitiesArr.length; i++) {

            // console.log("display cities");

            // New text used for setting city
            var newCity = savedcitiesArr[i];

            // Create a new button
            var cityBtn = $("<button>");
            cityBtn.addClass("list-group-item list-group-item-action");
            cityBtn.text(newCity);
            // Prepend to cities list 
            cities.prepend(cityBtn);
        }
    }

    // City button
    $(document).on("click", ".list-group-item", function (event) {

        // City input
        city = $(this).text();
        // console.log(city);

        // Get current data
        getCurrentData();

    });


    function getCurrentData() {

        // console.log("Get Data");
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=d953636a06fd6af8b2c881b86b574429";

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {

            name = response.name;
            temperature = response.main.temp;
            iconImg = response.weather[0].icon;
            humidity = response.main.humidity;
            wind = response.wind.speed;
            lat = response.coord.lat;
            long = response.coord.lon;

            // Get UV index
            getUVIndex();

            // // Display new city
            // displayCity();

            // Display 5-day forcast
            // displayFiveDay();

        })
    }


    // Display the current day dashboard of city
    function displayCurrentDay() {
        // console.log("Display Current Day");
        // console.log(city);
        // Display today's forcast

        // Name
        $(".city-name").text(name);

        // Date
        $(".current-date").text(currentDay);

        // Icon
        var iconURL = "http://openweathermap.org/img/wn/" + iconImg + "@2x.png";
        $(".current-icon").attr("src", iconURL);

        // Temperature
        temperature = kelvinToFarenheit(temperature)
        $(".temperature").text(temperature);

        // Wind speed
        $(".wind").text(wind);

        // Humidity 
        $(".humidity").text(humidity);

        // UV index
        $(".uv").text(UVIndex);

        // UV color
        displayUV();
    }

    // Get UV data
    function getUVIndex() {
        // console.log("Get UV Data");
        var queryUVURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + long + "&APPID=d953636a06fd6af8b2c881b86b574429";
        // console.log(queryUVURL);
        $.ajax({
            url: queryUVURL,
            method: "GET"
        }).then(function (response) {
            // console.log(response);
            UVIndex = response.value;
            // console.log("index " + UVIndex);

            // Display new city
            displayCurrentDay();

        });
    }


    // Display UV color 
    function displayUV() {
        // console.log("UV");

        // Get five day data
        getFiveData();
    }


    // Display 5-day forcast
    function displayFiveDay() {

        //For each of the five days at 3pm
        for (var i = 0; i < fiveDayData15.length; i++) {

            var index = "#" + i;
            var card = $(index)
            card.empty();

            var cardBody = $("<div>");
            cardBody.addClass("card-body");

            var cardDate = $("<h6>").addClass("card-title date").text(fiveDayData15[i].date);


            var iconURL = "http://openweathermap.org/img/wn/" + fiveDayData15[i].icon + ".png";
            var cardIcon = $("<img>").addClass("temp-icon").attr("src", iconURL);

            var cardTemp = $("<p>").addClass("card-text temp").text("Temp: " + fiveDayData15[i].temperature);

            var cardHumidity = $("<p>").addClass("card-text hum").text("Humidity: " + fiveDayData15[i].humidity);
            
            cardBody.append(cardDate, cardIcon, cardTemp, cardHumidity)

            card.append(cardBody);
            
        }

    }

    // Click on city buttons
    // $(document).on("click", ".city-btn", function() {

    // })


    // Save city list to localStorage

    // Get 5-day forcast
    function getFiveData() {
        // console.log("Get Five Data");
        var forcastFiveURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&APPID=d953636a06fd6af8b2c881b86b574429";
        // console.log(forcastFiveURL);
        // URL open weather + city query
        // Add city name to list
        $.ajax({
            url: forcastFiveURL,
            method: "GET",
            dataType: "json"
        }).then(function (response) {
            // console.log(response);
            var fiveDayData = response.list;
            // console.log(fiveDayData);
            fiveDayData15 = [];

            // Get 5-day forcast at 15:00:00
            for (var i = 0; i < fiveDayData.length; i++) {
                var dateAndHour = fiveDayData[i].dt_txt.split(" ")
                var date = formatDate(dateAndHour[0]);
                var hour = dateAndHour[1];
                var dayCurrent = fiveDayData[i];
                if (hour === "15:00:00") {
                    var dayData = {};
                    dayData["date"] = date;
                    dayData["time"] = hour;
                    dayData["icon"] = dayCurrent.weather[0].icon;
                    dayData["temperature"] = kelvinToFarenheit(dayCurrent.main.temp);
                    dayData["humidity"] = dayCurrent.main.humidity;
                    fiveDayData15.push(dayData);
                    // console.log(fiveDayData[i]);
                }
            }

            console.log(fiveDayData15);
            displayFiveDay();
        });
    }

    // function converts kelvin to farenheit
    function kelvinToFarenheit(degreeK) {
        var degreeF = (degreeK * (9/5)) - 459.67;
        return Math.trunc(degreeF);
    }

    // Format date (dateUnformatted - 2020-04-01)
    function formatDate(dateUnformatted) {

        // Format ["2020", "04", "01"]
        dateSplit = dateUnformatted.split("-");

        var year = dateSplit[0];
        var month = dateSplit[1];
        var day = dateSplit[2];

        // Format (04/01/2020)
        var dateFormatted = "(" + month + "/" + day + "/" + year + ")";

        return dateFormatted;
    }


});



