document.addEventListener('DOMContentLoaded', () => {

  console.log('IronGenerator JS imported successfully!');

}, false);

$(".button-collapse").sideNav();

$('.datepicker.finddate').pickadate({
  selectMonths: true, // Creates a dropdown to control month
  selectYears: 15, // Creates a dropdown of 15 years to control year
  // min: true
  max: +60
});


$('.datepicker.newdate').pickadate({
  selectMonths: true, // Creates a dropdown to control month
  selectYears: 15, // Creates a dropdown of 15 years to control year
  min: true,
  max: +60
});

$('.timepicker').pickatime();

$('.modal').modal();

$('select').material_select();
