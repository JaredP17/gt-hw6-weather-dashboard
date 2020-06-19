$(document).ready(function () {
  // VARIABLES
  var now = moment().format("(M/D/YYYY)");
  var apiKey = "a33bca960d808238c931cd8829f838b1";
  var citiesSearched = [];
  var currentCity;

  // FUNCTION DEFINITIONS

  // Loads the main dashboard of current city weather
  function populateDashboard(response) {
    // Set City/Current Date
    $("#dashboard-title").html(
      `${response.name} ${now} <img src="http://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png" alt="${response.weather[0].description}">`
    );

    // Set temperature
    var tempF = response.main.temp.toFixed(1); // Fixed 1 decimal place
    $("#temperature").text(tempF + " \u2109");

    // Set humidity
    var humidity = response.main.humidity;
    $("#humidity").text(humidity + "%");

    // Set wind speed
    var windSpeed = response.wind.speed;
    $("#wind-speed").text(windSpeed + " MPH");

    // Coordinates
    var lon = response.coord.lon;
    var lat = response.coord.lat;

    // Set UV index
    setUVIndex(apiKey, lat, lon);

    // Populate 5-Day Forecast
    populateForecast(apiKey, lat, lon);
  }

  function setUVIndex(apiKey, lat, lon) {
    $.ajax({
      url: `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`,
      method: "GET",
    }).then(function (response) {
      console.log(response);
      var uvIndex = response.value;
      var condition = "btn-danger"; // Severe
      if (uvIndex < 3) {
        condition = "btn-success"; // Preferable
      } else if (uvIndex < 7) {
        condition = "btn-warning"; // Moderate
      }
      $("#uv-index").text(uvIndex);
      $("#uv-index").attr("class", `btn ${condition}`);
    });
  }

  function populateForecast(apiKey, lat, lon) {
    $.ajax({
      url: `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly&appid=${apiKey}&units=imperial`,
      method: "GET",
    }).then(function (response) {
      console.log(response);
      var dailyForecasts = $("#5-days");
      dailyForecasts.empty();

      for (var i = 1; i <= 5; i++) {
        var nextDay = moment().add(i, "days").format("M/D/YYYY");
        dailyForecasts.append(
          `<div class="card bg-primary col-md-2 mb-2 pt-2 text-white">
            <h4>${nextDay}</h4>
            <p>
              <img src="http://openweathermap.org/img/wn/${response.daily[i].weather[0].icon}.png" alt="${response.daily[i].weather[0].description}">
            </p>
            <p>Temp: ${response.daily[i].temp.day} \u2109</p>
            <p>Humidity: ${response.daily[i].humidity}%</p>`
        );
      }
    });
  }

  // FUNCTION CALLS

  // EVENT LISTENERS
  $("#search-form").on("submit", function (event) {
    event.preventDefault();
    var cityInput = $("#search-input").val().trim();
    // console.log(cityInput);
    var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${apiKey}&units=imperial`;

    // Get current response
    $.ajax({
      url: queryURL,
      method: "GET",
    })
      .then(function (response) {
        console.log(response);

        // Populate dashboard
        populateDashboard(response);
      })
      .catch(function (e) {
        console.log(e);
        alert(e.responseJSON.cod + ": " + e.responseJSON.message);
      });
  });
});
