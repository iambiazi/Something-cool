// To enable cross-browser use you need to see if this is Chrome or not
$(document).ready(function () {

  let users = JSON.parse(localStorage.getItem('users')) || [];
  let selectedUser = localStorage.getItem('user-name') || undefined;
  let selectedTheme = localStorage.getItem('current-theme') || localStorage.setItem('current-theme', 'christmas');
  let customThemeList = JSON.parse(localStorage.getItem('custom-themes')) || [];

  $('#custom-wrapper').hide();

  const getCustomThemes = (() => {
    for (let i = 0; i < customThemeList.length; i++) {
      console.log(customThemeList);
      $('#select-theme').append(`<option value="${customThemeList[i][0]}">${customThemeList[i][0]}</option>`);
      $('#delete-custom').append(`<option value="${customThemeList[i][0]}">${customThemeList[i][0]}</option>`);
    }
  })();

  $(document).on('submit', '#user-form', (e) => {
    e.preventDefault();
    let userName = $('#new-user').val();
    if (users.filter(el => el.val === userName).length === 0) {
      users.push({val: userName});
      localStorage.setItem('users', JSON.stringify(users));
      $('#select').append($('<option>').text(userName));
      $('#new-user').val('');
      $('#select-delete').append($('<option>').text(userName));
      localStorage.setItem('user-name', userName);
      $('#current-user').html(`<b>Current User's Wishlist: ${localStorage.getItem('user-name')}</b>`);
    } else {
      $('#new-user').val('User already exists.');
    }
  });

  $(users).each(function () {
    $('#select').append($('<option>').text(this.val));
    $('#select-delete').append($('<option>').text(this.val));

  });

  $(document).on('change', '#select', () => {
    selectedUser = $('#select option:selected').val();
    localStorage.setItem('user-name', selectedUser);
    $('#current-user').html(`<b>Current User's Wishlist: ${localStorage.getItem('user-name')}</b>`);
  });

  $('#current-user').text(`Current User's Wishlist: ${localStorage.getItem('user-name')}`);

  $('#select-theme').change(() => {
    selectedTheme = $('#select-theme option:selected').val();
    localStorage.setItem('current-theme', selectedTheme);
    $('#current-theme').html(`<b>Current Theme: ${selectedTheme}</b>`);
  });

  if (localStorage.getItem('user-name')) {
    $('#current-theme').text(`Current Theme: ${localStorage.getItem('current-theme')}`);
  } else {
    $('#current-theme').text(`No Current Theme Chosen`);
  }

  $(document).on('change', '#select-delete', () => {
    let deletedTheme = $('#select-delete option:selected').val();
    users.splice(users.indexOf(deletedTheme), 1);
    localStorage.removeItem(deletedTheme + '-wishList');
    localStorage.setItem('users', JSON.stringify(users));
    $(`option:contains(${deletedTheme})`).remove();


    if (selectedUser === deletedTheme) {
      selectedUser = undefined;
      users.length > 0 ? localStorage.setItem('user-name', users[0].val) : localStorage.removeItem('user-name');
      $('#current-user').html(`<b>Current User's Wishlist: ${localStorage.getItem('user-name')}</b>`);
    }

    $('#delete-confirm').html(`<b>Deleted user: ${deletedTheme}.</b>`);
  });

  let pickedColor = `rgb(${$('#red').val()}, ${$('#green').val()}, ${$('#blue').val()})`;
  $(document).on('input', '.slider', (e) => {
    if (e.currentTarget.id === 'red-slider') {
      let value = $('#red-slider').val();
      $('#red').val(value);
    } else if (e.currentTarget.id === 'green-slider') {
      let value = $('#green-slider').val();
      $('#green').val(value);
    } else if (e.currentTarget.id === 'blue-slider') {
      let value = $('#blue-slider').val();
      $('#blue').val(value);
    }
    pickedColor = `rgb(${$('#red').val()}, ${$('#green').val()}, ${$('#blue').val()})`;
    $('.square').css('background', pickedColor);
  });

  $('.checkbox').on('change', function () {
    $('.checkbox').not(this).prop('checked', false);
  });

  let backgroundColor = 'white',
    titleColor = 'white',
    listColor = 'white',
    buttonColor = 'white';

  $(document).on('click', '#submit-button', function (e) {
    e.preventDefault();
    if ($('#background-color').prop('checked')) {
      $('#background-square').css('background', pickedColor);
      backgroundColor = pickedColor;
    } else if ($('#title-color').prop('checked')) {
      $('#title-square').css('background', pickedColor);
      titleColor = pickedColor;
    } else if ($('#list-color').prop('checked')) {
      $('#list-square').css('background', pickedColor);
      listColor = pickedColor;
    } else if ($('#button-color').prop('checked')) {
      $('#button-square').css('background', pickedColor);
      buttonColor = pickedColor;
    } else {
      $('.slider-container').prepend('<div><b>You must first choose an element using the checkboxes</b></div>')
    }
  });

  $(document).on('click', '#submit-custom', () => {
    let customThemeName = $('#custom-name').val();
    if (customThemeList.filter(el => el[0] === customThemeName).length === 0) {
      let customThemeInfo = [customThemeName, backgroundColor, titleColor, listColor, buttonColor];

      customThemeList.push(customThemeInfo);
      $('#select-theme').append(`<option value="${customThemeName}">${customThemeName}</option>`);
      localStorage.setItem('custom-themes', JSON.stringify(customThemeList));
      localStorage.setItem('current-theme', customThemeName);
      $('#current-theme').html(`<b>Current Theme: ${customThemeName}</b>`);
      selectedTheme = customThemeName;
      $('#custom-name').val('Enter theme name.');
      $('#delete-custom').append(`<option value="${customThemeName}">${customThemeName}</option>`);
    } else {
      $('#custom-theme-error').html(`<b>A theme with that name already exists!</b>`);
    }
  });

  $('#start-custom').on('click', () => {
    $('#start-custom').hide();
    $('#custom-wrapper').show();
  });

  $(document).on('change', '#delete-custom', () => {
    let deletedTheme = $('#delete-custom option:selected').val();
    customThemeList = customThemeList.filter(el => el[0] !== deletedTheme);
    console.log(customThemeList);
    localStorage.setItem('custom-themes', JSON.stringify(customThemeList));
    $(`option:contains(${deletedTheme})`).remove();

    if (selectedTheme === deletedTheme) {
      $('#current-theme').html(`<b>Current Theme: Christmas</b>`)
      localStorage.setItem('current-theme', 'Christmas');
    }

    $('#custom-delete-confirm').html(`<b>Deleted theme: ${deletedTheme}.</b>`);
  });

});
