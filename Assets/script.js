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

    // Get query response
    $.ajax({
        url: queryURL,
        method: "GET",
      }).then(function (response) {
        console.log(response);
        // Render dashboard
      }).catch(function (e) {
        console.log(e);
        alert(e.responseJSON.cod + ": " + e.responseJSON.message); 
      });
  });
 

  
});
