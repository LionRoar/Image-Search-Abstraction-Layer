

document.addEventListener("DOMContentLoaded", function(event) { 
  
  var url = window.location.href;

 var els =  document.getElementsByClassName('location');
 for(var i = 0 ; i < els.length ; i++){
  els[i].innerHTML= url;
 }
 
});