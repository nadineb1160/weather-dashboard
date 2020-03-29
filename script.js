// Once document is loaded
$(document).ready(function () {

    // Current date formatted 
    let currentDay = moment().format("MMMM Do YYYY");

    console.log(currentDay);

    // Set current date 
    // $("#currentDay").text(currentDay);

    // Saved cities
    var savedcitiesArr = [];

    var city = "";
    var name, temperature, wind, humdity, uvIndex, icon;

    // Submit button
    $(".submit").on("click", function (event) {
        event.preventDefault();

        // Possibly auto fill api?

        // City input
        city = $("#city").val();
        // console.log(city);

        // Push new city to saved array
        savedcitiesArr.push(city);

        // Get data
        getData();

        // Display new city
        displayCity();

        // Display 5-day forcast
        displayFiveDay();

    });

    function getData() {
        // var city = London, uk
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=d953636a06fd6af8b2c881b86b574429";
        console.log(queryURL);
        // URL open weather + city query
        // Add city name to list
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            // console.log(response);
            name = response.name;
            temperature = response.main.temp;
            icon = response.weather.icon;
            humdity = response.main.humidity;
            wind = response.wind.speed;

        })
    }


    // Display the current day dashboard of city
    function displayCity() {
        console.log(city);
        // Display today's forcast
        // Name
        $(".city-name").text(name);
        // Date
        $(".current-date").text(currentDay);
        // Icon
        $(".current-icon").text(icon);
        // Temperature
        $(".temperature").text(temperature);
        // Wind speed
        $(".wind").text(wind);
        // UV index
        $(".uv").text("UV");

        // Display UV color
        displayUV();
    }

    // Display UV color 
    function displayUV() {
        console.log("UV");
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
});



