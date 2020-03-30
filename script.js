

// Once document is loaded
$(document).ready(function () {

    // Current date formatted 
    let currentDay = moment().format("MMMM Do YYYY");

    // console.log(currentDay);

    // Saved cities
    var savedcitiesArr = [];

    var city = "";
    var name, temperature, wind, humdity, uvIndex, iconImg;

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

        // Get data
        getData();

        // Save data

    });

    function getData() {
        console.log("Get Data");
        // var city = London, uk
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=d953636a06fd6af8b2c881b86b574429";
        // console.log(queryURL);
        // URL open weather + city query
        // Add city name to list
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            name = response.name;
            temperature = response.main.temp;
            iconImg = response.weather[0].icon;
            // console.log("Icon " + iconImg);
            humdity = response.main.humidity;
            wind = response.wind.speed;

            // Display new city
            displayCity();

            // Display 5-day forcast
            displayFiveDay();

        })
    }


    // Display the current day dashboard of city
    function displayCity() {
        console.log("Display city");
        console.log(city);
        // Display today's forcast
        // Name
        $(".city-name").text(name);
        // Date
        $(".current-date").text(currentDay);
        // Icon
        var iconURL = "http://openweathermap.org/img/wn/" + iconImg + "@2x.png";
        console.log(iconImg);
        console.log(iconURL);
        $(".current-icon").attr("src", iconURL);
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



