
// client-side js
// run by the browser each time your view template is loaded
 

// define variables that reference elements on our page
const santaForm = document.forms[0];

// listen for the form to be submitted and add a new dream when it is
santaForm.onsubmit = function (event) {
  console.log(document.getElementById('name').value);
  console.log(document.getElementById('wish').value);
};
