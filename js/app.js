var config = {
    apiKey: "AIzaSyBMJ4NdrP12_BDa-IBrZwPWuDU45SY_ono",
    authDomain: "moviedb-29c4b.firebaseapp.com",
    databaseURL: "https://moviedb-29c4b.firebaseio.com",
    projectId: "moviedb-29c4b",
    storageBucket: "",
    messagingSenderId: "538039314713"
  };
  firebase.initializeApp(config);

  var pages = [];
  
  var changeOrderByKey = document.getElementById('inputState').value
  var pageList = new Array();
  var currentPage = 1;
  
  var numberOfPages = 1; 

document.addEventListener("DOMContentLoaded", function(event) {
    const db = firebase.database();
    db.ref('/')
    .once('value').then(function(snapshot) {
        //console.log('On value: hämtar hela databasen.');
        
        let data = snapshot.val();
        //console.log(data);
        
        const list = document.querySelector('.movie-list');
        list.innerHTML = "";
        for( let movie in data ) {
            
            let r = data[movie];
            //console.log(`Movie ${r.name} egenskaper är: `, data[movie]);
            const row = document.createElement('tr');
            row.id = r.id;
            
            var obj = {};
            obj["title"] = r.title;
            obj["id"] = r.id;
            obj["director"] = r.director;
            obj["date"] = r.date;
            pages.push(obj);
            //console.log("Adding to array");
        }
//newList(pages);
load(pages)
        
                   
        }).then(function(){
            

            
        })
        .then(function(){
            const changeOrderByList = document.getElementById('inputState');
            changeOrderByList.addEventListener('change', function(event){
                
                const newSort = changeOrderByList.value;
                
                const newOrder = pages;
                if(newSort === "latest"){
                    console.log(newSort)
                    console.log(pages);
                    newOrder.sort(function(){
                        return 0;
                    })
                //newList(pages);
                load(pages)
                // not working yet
                } else if(newSort === "title"){
                    
                    newOrder.sort(function(a,b){
                        if(a.title.toLowerCase()< b.title.toLowerCase()) return -1;
                        if(a.title.toLowerCase() >b.title.toLowerCase()) return 1;
                        
                        return 0;
                      });
                   // newList(newOrder)
                   load(pages)
                }else if(newSort === "Director"){
                    
                    newOrder.sort(function(a,b){
                        if(a.director.toLowerCase()< b.director.toLowerCase()) return -1;
                        if(a.director.toLowerCase() >b.director.toLowerCase()) return 1;
                       
                        return 0;
                      });
                    //newList(newOrder)
                    load(pages)
                } else if(newSort === "Date of Premiere"){
                    newOrder.sort(function(a,b){
                       return a.date - b.date;
                      });
                    //newList(newOrder)
                    load(pages)
                }

            });
        })
        .then(function(){
            const changeOrder = document.getElementById('changeOrder');
            changeOrder.addEventListener('click', function(event){
                
                let ascend = changeOrder.innerText;
               
                if(ascend === "Ascend "){
                    
                pages.reverse();
                document.getElementById('changeOrder').innerHTML = `Descend <i class="fa fa-arrow-circle-o-down fa-lg"></i>`;
                //newList(pages);
                load(pages)
                }else if(ascend === "Descend "){
                    
                    pages.reverse();
                    document.getElementById('changeOrder').innerHTML = `Ascend <i class="fa fa-arrow-circle-o-up fa-lg"></i>`;
                    //newList(pages);
                    load(pages)
                }

                
                

            })
            
        })
        .then(function(){
            // event listener for delete
const del = document.querySelector('.movie-list');
del.addEventListener('click', function(event){
   
    // instantiate ui
    const ui = new Ui();
    
    // delete movie
    ui.deleteMovie(event.target);
    // update movie
    ui.updateMovie(event.target);



    event.preventDefault();
})

        })
     
     // once/value
     
    firebase.database().ref('/').on('child_added', function(snapshot) {
                             
        let obj = snapshot.val();
        //console.log('child_added', obj);
        outputList(obj);
 
    })
    firebase.database().ref('/').on('child_changed', function(snapshot) {
        let obj = snapshot.val();
        //console.log('child_changed', obj);
   
    })
    firebase.database().ref('/').on('child_removed', function(snapshot) {
        let obj = snapshot.val();
        //console.log('child_removed', obj);
        location.reload();
    })
    // end of domloadcontent    
  });
  var numberPerPages  = document.getElementById('displayState').value;
  const viewList = document.getElementById('displayState');
  viewList.addEventListener('change', function(e){
    numberPerPages  = document.getElementById('displayState').value;
 
      console.log(numberPerPages)
      load(pages)
  });
  function makeList(event){
    pages = event;
    numberOfPages = getNumberOfPages();
}
function load(event){
  makeList(event);
  loadList();

}



function getNumberOfPages() {
  //console.log(numberPerPages)
return Math.ceil(pages.length / numberPerPages);
}
function nextPage() {
currentPage += 1;
loadList();
}
function previousPage() {
currentPage -= 1;
loadList();
}
function firstPage() {
currentPage = 1;
loadList();
}
function lastPage() {
currentPage = numberOfPages;
loadList();
}

function loadList() {
var begin = ((currentPage - 1) * numberPerPages);
var end = begin + numberPerPages;

pageList = pages.slice(begin, end);
drawList();    // draws out our data
check();         // determines the states of the pagination buttons
}
function drawList() {
  const displayList = document.querySelector('.movie-list');
      displayList.innerHTML = ""
for (r = 0; r < pageList.length; r++) {
  const displayRow = document.createElement('tr');
      displayRow.id = pageList[r].id;
displayRow.innerHTML += `
<td>${pageList[r].title}</td>
<td>${pageList[r].director}</td>
<td>${pageList[r].date}</td>
<td><a href="#" class="edit" data-toggle="modal" data-target="#updateMovieModal"><i class="fa fa-pencil-square-o fa-lg text-white" title="Edit"></i></a></td>
      <td><a href="#" class="delete"><i class="fa fa-trash fa-lg text-white" title="Delete"></i></a></td>

`;
displayList.appendChild(displayRow);

}
}
function check() {
document.getElementById("next").disabled = currentPage == numberOfPages ? true : false;
document.getElementById("previous").disabled = currentPage == 1 ? true : false;
document.getElementById("first").disabled = currentPage == 1 ? true : false;
document.getElementById("last").disabled = currentPage == numberOfPages ? true : false;
}
    
function newList(event){
      console.log(event)
      
      const displayList = document.querySelector('.movie-list')
      displayList.innerHTML = "";
      //console.log(event[1]);
      changeOrderByKey = document.getElementById('inputState').value;
      numberPerPages = document.getElementById('displayState').value;
      console.log(numberPerPage)
      for (let i = 0; i < numberPerPage; i++){
          if(event[i] === undefined){
              break;
          } else {
        const displayRow = document.createElement('tr');
        displayRow.id = event[i].id;
        //console.log(event[1]);
        displayRow.innerHTML = `
        <td>${event[i].title}</td>
        <td>${event[i].director}</td>
        <td>${event[i].date}</td>
        <td><a href="#" class="edit" data-toggle="modal" data-target="#updateMovieModal"><i class="fa fa-pencil-square-o fa-lg text-white" title="Edit"></i></a></td>
        <td><a href="#" class="delete"><i class="fa fa-trash fa-lg text-white" title="Delete"></i></a></td>
        
        `;
        displayList.appendChild(displayRow);
          //console.log(event[i]);
          }  
    }
        
             return displayList;
}

  function outputList(event){
    const list = document.querySelector('.movie-list');
        
    let r = event;
    //console.log(`Movie ${r.title} egenskaper är: `, r);
    const row = document.createElement('tr');
    row.id = r.id;
    row.innerHTML = `
<td>${r.title}</td>
<td>${r.director}</td>
<td>${r.date}</td>
<td><a class="edit"><i class="fa fa-pencil-square-o fa-lg text-white" title="Edit"></i></a></td>
        <td><a class="delete"><i class="fa fa-trash fa-lg text-white" title="Delete"></i></a></td>
`;
list.appendChild(row);
return list;

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
   
       // console.log(movie);
        movie.id = "id";
        //console.log('Adding to database...');
        //firebase.database().ref('/').push(movie);
        const key = firebase.database().ref().push().key;
        
        movie.id = key;
        firebase.database().ref('/'+key).update(movie);
       // console.log(movie);
        //console.log('Finished adding to database.');
        // add to array
        //pages.push(movie);
        //console.log(pages.length)

    }

    showAlert(message, className){
        // create div
    const div = document.createElement('div');
    // add classes
    div.className = `alert ${className}`;
    // add text
    div.appendChild(document.createTextNode(message));
    // get parent
    const container = document.querySelector('#modal-body-add');
    const form = document.querySelector('#movie-form');
    // insert alert
    container.insertBefore(div, form);
    // timeout after 3s
    setTimeout(function(){
        document.querySelector('.alert').remove();
    }, 3000);
    }
    showUpdateAlert(message, className){
        // create div
    const div = document.createElement('div');
    // add classes
    div.className = `alert ${className}`;
    // add text
    div.appendChild(document.createTextNode(message));
    // get parent
    const container = document.querySelector('#modal-body-update');
    const form = document.querySelector('#update-movie-form');
    // insert alert
    container.insertBefore(div, form);
    // timeout after 3s
    setTimeout(function(){
        document.querySelector('.alert').remove();
    }, 3000);
    }

    deleteMovie(target){
        if(target.parentElement.classList.contains('delete')){  
        const keyId = target.parentElement.parentElement.parentElement.id;
        //console.log(target.parentElement.parentElement);
        //console.log(keyId)   
        target.parentElement.parentElement.parentElement.remove();
            
            const db = firebase.database();
               db.ref(`/${keyId}`).remove();
        }
    }
    updateMovie(target){
        //console.log(target)
        if(target.parentElement.classList.contains('edit')){  
        const keyId = target.parentElement.parentElement.parentElement.id;
        const keyTitle = target.parentElement.parentElement.parentElement.firstElementChild.innerText;
        const keyDirector = target.parentElement.parentElement.parentElement.children[1].innerText;
        const keyDate = target.parentElement.parentElement.parentElement.children[2].innerText
        console.log(target.parentElement.parentElement.parentElement)

        document.getElementById('updateMovieTitle').value = keyTitle;
        document.getElementById('updateMovieDirector').value = keyDirector;
        document.getElementById('updateMovieDate').value = keyDate;
        
        document.getElementById('update-movie-form').addEventListener('submit', function(event){



            const updatetitle = document.getElementById('updateMovieTitle').value,
                updatedirector = document.getElementById('updateMovieDirector').value,
                updatedate = document.getElementById('updateMovieDate').value;

                let updateMovie = {};
                
                updateMovie["title"] = updatetitle;
                updateMovie["id"] = keyId;
                updateMovie["director"] = updatedirector;
                updateMovie["date"] = updatedate;

                
                const ui = new Ui();
            //validate
            if(updatetitle === '' || updatedirector === '' || updatedate === ''){
                // error alert
                ui.showUpdateAlert('Cannot be blank ', 'alert-danger')
            } else {

            
                firebase.database().ref('/'+keyId).update(updateMovie);
                // show success
                ui.showUpdateAlert('Movie updated', 'alert-success');
                // clear fields
                pages.forEach(function(obj) {
                                        
                    if (obj.id === keyId) {
                        
                        obj["title"] = updatetitle;
                        obj["id"] = keyId;
                        obj["director"] = updatedirector;
                        obj["date"] = updatedate;
                    }
                    
                });
                load(pages)
            }
        
            event.preventDefault();
        })
        
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

