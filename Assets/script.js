$(document).ready(function () {
  // VARIABLES
  var now = moment().format("(M/D/YYYY)");
  var apiKey = "a33bca960d808238c931cd8829f838b1";
  
  // FUNCTION DEFINITIONS

  // FUNCTION CALLS

  // EVENT LISTENERS
  $("#search-form").on("submit", function (event) {
    event.preventDefault();
    var cityInput = $("#search-input").val();
    // console.log(cityInput);
    var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${apiKey}`;
    var forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityInput}&appid=${apiKey}`;


    // Get query response
    $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function (response) {
        console.log(response);
        // Render dashboard
        // Set City/Current Date
        $("#dashboard-title").html(`${response.name} ${now} <img src="http://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png">`);

        // Set temperature
        var tempF =((response.main.temp - 273.15) * 1.8 + 32).toFixed(1);
        $("#temperature").text(tempF + " \u2109");

        // Set humidity
        var humidity = response.main.humidity;
        $("#humidity").text(humidity + "%");

        // Set wind speed
        var windSpeed = response.wind.speed;
        $("#wind-speed").text(windSpeed + " MPH")

        // Set UV index
        var lon = response.coord.lon;
        var lat = response.coord.lat;
        $.ajax({
          url: `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`,
          method: "GET"
        }).then(function (response) {
          var uvIndex = response.value;
          var condition = "btn-danger";
          if (uvIndex < 3) {
            condition = "btn-success";
          } else if (uvIndex < 7) {
            condition = "btn-warning";
          }
          $("#uv-index").text(uvIndex);
          $("#uv-index").attr("class", `btn ${condition}`);
        });
        



      }).catch(function (e) {
        console.log(e);
        alert(e.responseJSON.cod + ": " + e.responseJSON.message); 
      });
  });
 

  
});
