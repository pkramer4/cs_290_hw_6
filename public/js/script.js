// function updateWorkouts() {
//   let workoutsJSON = document.getElementById('workoutsJSON').innerHTML;
//   console.log(workoutsJSON);
// }

function getWorkouts() {

  var req = new XMLHttpRequest();
  req.open('GET', 'http://localhost:3000/data', true);

  req.addEventListener('load',function(){
      if(req.status >= 200 && req.status < 400){
        let getWorkouts = JSON.parse(JSON.parse(req.response).workoutsJSON);
        console.log(getWorkouts);

        workoutTable = document.getElementById('workoutTable2');

        //removes all rows but header row
        for(let i = 0; i<getWorkouts.length; i++) {
          try{
            workoutTable.firstElementChild.nextSibling.remove();
          } catch(err) {
            break;
          }
        }

        for(let i = 0; i<getWorkouts.length; i++) {
          newRow = document.createElement('tr');

          let nameCell = document.createElement('td');
          nameCell.innerHTML = getWorkouts[i].name;
          newRow.appendChild(nameCell);

          let repsCell = document.createElement('td');
          repsCell.innerHTML = getWorkouts[i].reps;
          newRow.appendChild(repsCell);

          let weightCell = document.createElement('td');
          weightCell.innerHTML = getWorkouts[i].weight;
          newRow.appendChild(weightCell);

          let unitCell = document.createElement('td');
          unitCell.innerHTML = getWorkouts[i].unit;
          newRow.appendChild(unitCell);

          let dateCell = document.createElement('td');
          dateCell.innerHTML = getWorkouts[i].date.slice(0,10);
          newRow.appendChild(dateCell);

          //adds delete button to row
          let deleteCell = document.createElement('td');
          let deleteButton = document.createElement('button')
          deleteButton.innerHTML = 'Delete';
          deleteButton.setAttribute('onclick', 'clearRow(this)');
          deleteCell.appendChild(deleteButton);
          newRow.appendChild(deleteCell);

          //adds update button row
          let updateCell = document.createElement('td');
          let updateButton = document.createElement('button')
          updateButton.innerHTML = 'Update';
          updateButton.setAttribute('onclick', 'updateRow(this)');
          updateCell.appendChild(updateButton);
          newRow.appendChild(updateCell);

          workoutTable.appendChild(newRow);

        }
      } else {
        console.log('oh no');
      }
    })
  req.send(null);
  console.log('info sent')
}

window.onload = getWorkouts();

//This adds the given information to the mysql DB
let subButton = document.getElementById('subButton');
subButton.addEventListener('click', function(event) {
    event.preventDefault();

    //saves values of inputs
    let nameVal = document.getElementById('nameVal').value;
    let repVal = document.getElementById('repVal').value;
    let weightVal = document.getElementById('weightVal').value;
    let unitVal = document.getElementById('unitVal').value;
    let dateVal = document.getElementById('dateVal').value;

    if(nameVal!='') {
    var req = new XMLHttpRequest();
    var payload = {"type": "insert", "name": nameVal, "reps": repVal, "weight": weightVal,
                    "unit": unitVal, "date": dateVal};

    req.open('POST', 'http://localhost:3000/', true);
    req.setRequestHeader('Content-type', 'application/json');

    req.addEventListener('load',function(){
        if(req.status >= 200 && req.status < 400){
          console.log('got something back');
          getWorkouts();
        }
        else {
          console.log('oh no');
        }
      })
    req.send(JSON.stringify(payload));
  } else {

    alert('name is required');
  }
})


//This deletes a selected row from DB and from window
function clearRow(rowButton) {

  //gets row to delete
  let row = rowButton.parentElement.parentElement;
  let rowName = row.firstElementChild.innerHTML;
  var req = new XMLHttpRequest();

  var payload = {"type": "delete", "name": rowName};

  req.open('POST', 'http://localhost:3000/', true);
  req.setRequestHeader('Content-type', 'application/json');

  req.addEventListener('load',function(){
      if(req.status >= 200 && req.status < 400){
        console.log('deleted')
      }

      else {
        console.log('oh no');
      }
    })
  req.send(JSON.stringify(payload));
  row.remove();
}

function updateRow(rowButton) {

  //gets row to update
  let row = rowButton.parentElement.parentElement;

  //gets values in each row to populate update form fields
  let rowValues = row.children;
  let rowInfo = {"name": rowValues[0].innerHTML, "reps": rowValues[1].innerHTML, "weight": rowValues[2].innerHTML,
              "unit": rowValues[3].innerHTML,"date": rowValues[4].innerHTML }


  //reveals hidden form and header
  let updateHeader = document.getElementById('updateHeader');
  updateHeader.classList.remove("hidden");

  let updateForm = document.getElementById('updateForm');
  updateForm.classList.remove("hidden");
  updateForm.reset();

  let originalName = rowInfo.name;

  //populates values into update form fields
  document.getElementById('nameUp').removeAttribute('value');
  document.getElementById('nameUp').setAttribute('value', rowInfo.name);

  document.getElementById('repUp').removeAttribute('value');
  document.getElementById('repUp').setAttribute('value', rowInfo.reps);

  document.getElementById('weightUp').removeAttribute('value');
  document.getElementById('weightUp').setAttribute('value', rowInfo.weight);

  document.getElementById('unitUp').removeAttribute('value');
  document.getElementById('unitUp').setAttribute('value', rowInfo.unit);

  document.getElementById('dateUp').removeAttribute('value');
  document.getElementById('dateUp').setAttribute('value', rowInfo.date);


  updateButton = document.getElementById('updateButton')
  updateButton.addEventListener('click', function(event) {
      event.preventDefault();
      let nameUp = document.getElementById('nameUp').value;
      let repUp = document.getElementById('repUp').value;
      let weightUp = document.getElementById('weightUp').value;
      let unitUp = document.getElementById('unitUp').value;
      let dateUp = document.getElementById('dateUp').value;

      var req = new XMLHttpRequest();
      var payload = {"type": "update", "originalName":originalName, "name": nameUp, "reps": repUp, "weight": weightUp,
                      "unit": unitUp, "date": dateUp};

      req.open('POST', 'http://localhost:3000/update', true);
      req.setRequestHeader('Content-type', 'application/json');

      req.addEventListener('load',function(){
          if(req.status >= 200 && req.status < 400){

            updateHeader.classList.add('hidden');
            updateForm.classList.add('hidden');

            console.log('updated row');
            getWorkouts();
          }

          else {
            console.log('oh no');
          }
        })
      req.send(JSON.stringify(payload));
    })
    getWorkouts();
}



// function addRow() {
//   let workoutTable = document.getElementById('workoutBody');
//   let newRow = document.createElement('tr');
//
//   let newCell = document.createElement('td');
//   newCell.innerHTML = 'Hello';
//
//   let newCell2 = document.createElement('td');
//   newCell2.innerHTML = 'Hi';
//
//   let buttonCell = document.createElement('td');
//
//   newButton = document.createElement('button');
//   newButton.innerHTML = 'Delete Row';
//   newButton.setAttribute('onclick', 'clearRow(this)')
//
//   buttonCell.appendChild(newButton);
//
//   newRow.appendChild(newCell);
//   newRow.appendChild(newCell2);
//   newRow.appendChild(newCell);
//   newRow.appendChild(buttonCell);
//
//
//
//   workoutTable.appendChild(newRow);
//
//
// }
