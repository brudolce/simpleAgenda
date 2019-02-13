function edit(id) {
  let name = document.getElementsByClassName(id)[0].children[0].innerText;
  let email = document.getElementsByClassName(id)[0].children[2].innerText.split(':')[1].trim();
  let day = document.getElementsByClassName(id)[0].children[3].innerText.split(':')[1].trim();
  let hour = document.getElementsByClassName(id)[0].children[4].innerText.split(':');

  
  document.getElementById('nameEdit').value = name;
  document.getElementById('emailEdit').value = email;
  document.getElementById('dayEdit').value = day;
  document.getElementById('hourEdit').value = (hour[1]+':'+hour[2]).trim();

  document.getElementById('id').value = id;

  //let service = document.getElementsByClassName(id)[0].children[1].innerText.split(':')[1].trim();
}

function editService(id) {
  // let name = document.getElementsByClassName(id)[0].children[0].innerText;
  // let value = document.getElementsByClassName(id)[0].children[1].innerText;

  let name = document.getElementsByClassName(id)[0].innerText.replace('delete','').replace('edit','').split(':')[0].trim()
  document.getElementById('nameEdit').value = name;
  let value = document.getElementsByClassName(id)[0].innerText.replace('delete','').replace('edit','').replace('$','').split(':')[1].trim()
  document.getElementById('valueEdit').value = value;

  document.getElementById('id').value = id;
}