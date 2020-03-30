// Saved cities
var savedcitiesArr = [];

// Once document is loaded
$(document).ready(function () {

    // Current date formatted 
    let currentDay = moment().format("MMMM Do YYYY");

    // console.log(currentDay);

    // Get Previous data
    getPrevCities();

    // City value entered
    var city = "";
    // Variables for data
    var name, temperature, wind, humidity, UVIndex, iconImg;
    // Latitude and longitude
    var lat, long;

    // Submit button
    $(".submit").on("click", function (event) {
        // Prevent default form behavior
        event.preventDefault();

        // Possibly auto fill api?

        // City input
        city = $("#city").val();
        // console.log(city);

        // Push new city to saved array
        savedcitiesArr.push(city);
        console.log(savedcitiesArr);

        // Get current data
        getCurrentData();

        // Save data
        saveData();

        // Display previous cities
        displayHistory();


    });

    function saveData() {
        localStorage.setItem("savedCities", JSON.stringify(savedcitiesArr));
    }

    function getPrevCities() {
        var storedCities = localStorage.getItem("savedCities");

        // If not not null
        if (storedCities) {
            // Set savedCitiesARr to stored
            savedcitiesArr = JSON.parse(storedCities);
            console.log("saved " + savedcitiesArr);
        }

        displayHistory();
    }

    function displayHistory() {

        // City list
        var cities = $(".list-group");

        // Clear old list before appending
        cities.text("");

        // Loop through saved cities to display
        for (var i = 0; i < savedcitiesArr.length; i++) {

            console.log("display cities");

            // New text used for setting city
            var newCity = savedcitiesArr[i];

            // Create a new button
            var cityBtn = $("<button>");
            cityBtn.addClass("list-group-item list-group-item-action");
            cityBtn.text(newCity);
            cities.prepend(cityBtn);
        }
    }

    // City button
    $(".list-group-item").on("click", function (event) {
        
        // City input
        city = $(this).text();
        console.log(city);

        // Get current data
        getCurrentData();

    });
    

    function getCurrentData() {

        console.log("Get Data");
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
        console.log("Display Current Day");
        console.log(city);
        // Display today's forcast
        // Name
        $(".city-name").text(name);
        // Date
        $(".current-date").text(currentDay);
        // Icon
        var iconURL = "http://openweathermap.org/img/wn/" + iconImg + "@2x.png";
        // console.log(iconImg);
        // console.log(iconURL);
        $(".current-icon").attr("src", iconURL);
        // Temperature
        $(".temperature").text(temperature);
        // Wind speed
        $(".wind").text(wind);
        // Humidity 
        $(".humidity").text(humidity);
        console.log(humidity);
        // UV index
        console.log("UV" + UVIndex);
        $(".uv").text(UVIndex);

        // Display UV color
        displayUV();
    }

    // Get UV data
    function getUVIndex() {
        console.log("Get UV Data");
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
        console.log("UV");

        // Get five day data
        getFiveData();
    }


    // Display 5-day forcast
    function displayFiveDay() {

        // Date
        // Icon
        // Temperature
        // Humidity
    }

    // Click on city buttons
    // $(document).on("click", ".city-btn", function() {

    // })


    // Save city list to localStorage

    var dayOneTemp, dayOneHum, dayOneIcon;

    // Get 5-day forcast
    function getFiveData() {
        console.log("Get Five Data");
        var forcastFiveURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&mode=xml&APPID=d953636a06fd6af8b2c881b86b574429";
        console.log(forcastFiveURL);
        // URL open weather + city query
        // Add city name to list
        $.ajax({
            url: forcastFiveURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            // var fiveDayData = response.childNodes[0].childNodes[4].childNodes;
            // Day 1 - 12PM
            // var dayOne = fiveDayData[4];
            // console.log(dayOne);
            // dayOneIcon = dayOne.childNodes;
            // console.log(dayOneIcon);
            // dayOneTemp = 


            // Day 2 - 12PM
            // console.log(fiveDayData[12]);
            // Day 3 - 12PM
            // console.log(fiveDayData[20]);
            // Day 4 - 12PM
            // console.log(fiveDayData[28]);
            // Day 5 - 12PM
            // console.log(fiveDayData[36]);
        });
    }



});



