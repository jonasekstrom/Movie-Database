var config = {
    apiKey: "AIzaSyBMJ4NdrP12_BDa-IBrZwPWuDU45SY_ono",
    authDomain: "moviedb-29c4b.firebaseapp.com",
    databaseURL: "https://moviedb-29c4b.firebaseio.com",
    projectId: "moviedb-29c4b",
    storageBucket: "",
    messagingSenderId: "538039314713"
  };
  firebase.initializeApp(config);


document.addEventListener("DOMContentLoaded", function(event) {
    const db = firebase.database();
    db.ref('/')
    .once('value', function(snapshot) {
        console.log('On value: hämtar hela databasen.');
        let data = snapshot.val();
        //console.log(data);
        const list = document.getElementById('movie-list');
        list.innerHTML = "";
        for( let movie in data ) {
            let r = data[movie];
            //console.log(`Movie ${r.name} egenskaper är: `, data[movie]);
            const row = document.createElement('tr');
            row.id = r.id;
            //let str = JSON.stringify(r);
            row.innerHTML = `
    <td>${r.title}</td>
    <td>${r.director}</td>
    <td>${r.date}</td>
    <td><a href="#" class="delete text-dark">X</a></td>
    `;
    list.appendChild(row);
        }
        })
     // once/value
    firebase.database().ref('/').on('child_added', function(snapshot) {
        let obj = snapshot.val();
        console.log('child_added', obj);
        const list = document.getElementById('movie-list');
        
            let r = obj;
            console.log(`Movie ${r.title} egenskaper är: `, r);
            const row = document.createElement('tr');
            row.id = r.id;
            //let str = JSON.stringify(r);
            row.innerHTML = `
    <td>${r.title}</td>
    <td>${r.director}</td>
    <td>${r.date}</td>
    <td><a href="#" class="delete text-dark">X</a></td>
    `;
    list.appendChild(row);
        
    })
    firebase.database().ref('/').on('child_changed', function(snapshot) {
        let obj = snapshot.val();
        console.log('child_changed', obj);
    })
    firebase.database().ref('/').on('child_removed', function(snapshot) {
        let obj = snapshot.val();
        console.log('child_removed', obj);
    })
  });
  let viewList = document.getElementById('displayState');
  viewList.addEventListener('change', limitList);

  function limitList(event){
    let output = document.getElementById('displayState').value;
    
  }
  // Remove Task
  function removeTask(e) {
    if(e.target.parentElement.classList.contains('delete')) {
      if(confirm('Are You Sure?')) {
        e.target.parentElement.parentElement.remove();
  
        // Remove from LS
        removeTaskFromLocalStorage(e.target.parentElement.parentElement);
      }
    }
  }
  // Remove from LS
function removeTaskFromLocalStorage(taskItem) {
    let tasks;
    if(localStorage.getItem('tasks') === null){
      tasks = [];
    } else {
      tasks = JSON.parse(localStorage.getItem('tasks'));
    }
  
    tasks.forEach(function(task, index){
      if(taskItem.textContent === task){
        tasks.splice(index, 1);
      }
    });
  
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

class Movie {
    constructor(title,director,date){
        this.title = title;
        this.director = director;
        this.date = date;
    }
}
class Ui {
    addMovieToList(movie){
   
        console.log(movie);
        movie.id = "id";
        console.log('Adding to database...');
        //firebase.database().ref('/').push(movie);
        const key = firebase.database().ref().push().key;
        
        movie.id = key;
        firebase.database().ref('/'+key).update(movie);
        console.log(movie);
        console.log('Finished adding to database.');
 

    }

    showAlert(message, className){
        // create div
    const div = document.createElement('div');
    // add classes
    div.className = `alert ${className}`;
    // add text
    div.appendChild(document.createTextNode(message));
    // get parent
    const container = document.querySelector('.modal-body');
    const form = document.querySelector('#movie-form');
    // insert alert
    container.insertBefore(div, form);
    // timeout after 3s
    setTimeout(function(){
        document.querySelector('.alert').remove();
    }, 3000);
    }
/*
    showAlertRemove(message, className){
        // create div
    const div = document.getElementById('remove');
    // add classes
    div.className = `alert ${className}`;
    // add text
    div.appendChild(document.createTextNode(message));
    
    // timeout after 3s
    setTimeout(function(){
        document.querySelector('.alert').remove();
    }, 3000);
    }
*/
    deleteMovie(target){
        const keyId = target.parentElement.parentElement.id;
        console.log(keyId);
        if(target.parentElement.parentElement.id === keyId){
            target.parentElement.parentElement.remove();
              const db = firebase.database();
               db.ref(`/${keyId}`).remove();
               
            
        }
    }

    clearFields(){
        document.getElementById('movieTitle').value = '';
        document.getElementById('movieDirector').value = '';
        document.getElementById('movieDate').value = '';
    }
};

// event listeners
document.getElementById('movie-form').addEventListener('submit', function(event){
    const title = document.getElementById('movieTitle').value,
        director = document.getElementById('movieDirector').value,
        date = document.getElementById('movieDate').value;
    // instantiate movie
    const movie = new Movie(title, director, date);
    //console.log(movie);
    // instantiate ui
    const ui = new Ui();
    
    //validate
    if(title === '' || director === '' || date === ''){
        // error alert
        ui.showAlert('Fill every field', 'alert-danger')
    } else {
        // add movie to list
        ui.addMovieToList(movie);
        
        // show success
        ui.showAlert('Movie added', 'alert-success');
        // clear fields
        ui.clearFields();
    }

    event.preventDefault();
});
// event listener for delete
document.getElementById('movie-list').addEventListener('click', function(event){
   
    // instantiate ui
    const ui = new Ui();
    
    // delete movie
    ui.deleteMovie(event.target);

    // show message 
    //ui.showAlertRemove('Movie removed', 'alert-success');


    event.preventDefault();
})


