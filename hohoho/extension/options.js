// To enable cross-browser use you need to see if this is Chrome or not
$(document).ready(function() {

  let users = JSON.parse(localStorage.getItem('users')) || [];

  $('#user-form').on('submit', (e) => {
    e.preventDefault();
    let userName = $('#new-user').val();
    console.log(userName);
    users.push({val: userName});
    users = users.sort((a,b) => a - b);
    localStorage.setItem('users', JSON.stringify(users));
    location.reload();
  });


  $(users).each(function() {
    $('#select').append($('<option>').text(this.val));
    $('#select-delete').append($('<option>').text(this.val));
  });

  $('#select').change(()=> {
    let selectedUser = $('#select option:selected').val();
    localStorage.setItem('username', selectedUser);
    location.reload();

  });

  $('#current-user').text(`Current Wishlist: ${localStorage.getItem('username')}`);



  $('#select-delete').change(()=>{
    let deletedUser = $('#select-delete option:selected').val();
    users.splice(users.indexOf(deletedUser), 1);
    localStorage.removeItem(deletedUser + '-wishList');
    localStorage.setItem('users', JSON.stringify(users));
    //remove from both menus
    //delete from array
    //remove from html
    //delete from local storage
    //some kind of confirmation message?
    location.reload();
  });


});
