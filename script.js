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

        // City input
        city = $("#city").val();

        // Use UpperCase to store so it's all equal
        city = city.toUpperCase();

        // If not empty
        if (city !== "" && savedcitiesArr.indexOf(city) === -1) {
            // Push new city to saved array
            savedcitiesArr.push(city);
        }

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

        // Get current data
        getCurrentData();

    });


    function getCurrentData() {

        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=d953636a06fd6af8b2c881b86b574429";

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {

            // Get data for today's weather
            name = response.name;
            temperature = response.main.temp;
            iconImg = response.weather[0].icon;
            humidity = response.main.humidity;
            wind = response.wind.speed;
            lat = response.coord.lat;
            long = response.coord.lon;

            // Get UV index
            getUVIndex();

        })
    }


    // Display the current day dashboard of city
    function displayCurrentDay() {

        // Name
        $(".city-name").text(name);

        // Date
        $(".current-date").text(currentDay);

        // Icon
        var iconURL = "http://openweathermap.org/img/wn/" + iconImg + "@2x.png";
        $(".current-icon").attr("style", "display: block");
        $(".current-icon").attr("src", iconURL);

        // Temperature
        temperature = kelvinToFarenheit(temperature)
        $(".temperature").text(temperature);

        // Wind speed
        $(".wind").text(wind);

        // Humidity 
        $(".humidity").text(humidity);

        // UV index
        $(".uv-index").text(UVIndex);

        // UV color
        displayUV(UVIndex);
    }

    // Get UV data
    function getUVIndex() {

        var queryUVURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + long + "&APPID=d953636a06fd6af8b2c881b86b574429";

        $.ajax({
            url: queryUVURL,
            method: "GET"
        }).then(function (response) {
            // Retrieve UV index
            UVIndex = response.value;

            // Display city
            displayCurrentDay();

        });
    }


    // Display UV color 
    function displayUV(UVIndex) {

        var uv = $(".uv-index")

        var color = "";

        if (UVIndex < 11) {

            if (UVIndex < 8) {

                if (UVIndex < 6) {
                    if (UVIndex < 3) {
                        // 0 to 2 -> Green
                        color = "green";
                    }
                    else {
                        // 3 to 5 -> Yellow
                        color = "yellow";
                    }
                }
                else {
                    // 6 to 7 -> Orange
                    color = "orange";
                }
            }
            else {
                // 8 to 10 -> Red
                color = "red";
            }

        }
        else {
            // 11+ -> Violet
            color = "purple";
        }

        // Set background color 
        var colorStr = "background-color: " + color
        uv.attr("style", colorStr);
        console.log(color);

        // Get five day data
        getFiveData();
    }


    // Display 5-day forcast
    function displayFiveDay() {

        //For each of the five days at 3pm
        for (var i = 0; i < fiveDayData15.length; i++) {

            // Index string #i
            var index = "#" + i;
            var card = $(index)

            // Empty card
            card.empty();

            // Create dard body div
            var cardBody = $("<div>");
            cardBody.addClass("card-body");

            // Card date
            var cardDate = $("<h6>").addClass("card-title date").text(fiveDayData15[i].date);

            // Card icon
            var iconURL = "http://openweathermap.org/img/wn/" + fiveDayData15[i].icon + ".png";
            var cardIcon = $("<img>").addClass("temp-icon").attr("src", iconURL);

            // Card temperature
            var cardTemp = $("<p>").addClass("card-text temp").text("Temp: " + fiveDayData15[i].temperature);

            // card humidity
            var cardHumidity = $("<p>").addClass("card-text hum").text("Humidity: " + fiveDayData15[i].humidity);

            // Append new elements to card body
            cardBody.append(cardDate, cardIcon, cardTemp, cardHumidity)

            // Append card body to card
            card.append(cardBody);

        }

    }

    // Get 5-day forcast
    function getFiveData() {

        var forcastFiveURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&APPID=d953636a06fd6af8b2c881b86b574429";

        $.ajax({
            url: forcastFiveURL,
            method: "GET",
            dataType: "json"
        }).then(function (response) {

            // Five Day data - all hours
            var fiveDayData = response.list;

            // Five Day data - 15:00:00
            fiveDayData15 = [];

            // Get 5-day forcast at 15:00:00
            for (var i = 0; i < fiveDayData.length; i++) {
                // Date and Hour
                var dateAndHour = fiveDayData[i].dt_txt.split(" ")
                var date = formatDate(dateAndHour[0]);
                var hour = dateAndHour[1];
                // Current day within loop
                var dayCurrent = fiveDayData[i];

                // If hour is 15:00 or 3pm
                if (hour === "15:00:00") {
                    // Create new object
                    var dayData = {};
                    // Add forcast data
                    dayData["date"] = date;
                    dayData["time"] = hour;
                    dayData["icon"] = dayCurrent.weather[0].icon;
                    dayData["temperature"] = kelvinToFarenheit(dayCurrent.main.temp);
                    dayData["humidity"] = dayCurrent.main.humidity;

                    // Push day data to the array of 15:00 data
                    fiveDayData15.push(dayData);
                }
            }

            displayFiveDay();
        });
    }

    // function converts kelvin to farenheit
    function kelvinToFarenheit(degreeK) {

        // Degree in farenheit
        var degreeF = (degreeK * (9 / 5)) - 459.67;
        // Truncate to integer
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
        var dateFormatted = month + "/" + day + "/" + year;

        return dateFormatted;
    }


});



