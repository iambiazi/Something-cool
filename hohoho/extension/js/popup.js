// Link Formatter js

// // hide the alert that will be triggered if there is a failure to copy text
// $('#alert').hide();
//
// // to close the alert
// $('#alert').click(() => { $('#alert').hide(); });
$(document).ready(function() {


  let wishList = []; //JSON.parse(localStorage.getItem('wishList')) ||
  wishList = JSON.parse(localStorage.getItem('wishList')) || [];



  const populateList = () => {

    for (let i = 0; i < wishList.length; i++) {
      let $listItem = $('<div></div>');
      $listItem.html(`<a href=${wishList[i].url} class="listAnchor">${wishList[i].title}`);
      $('.listContainer').append($listItem);
      $($listItem).append('<button class="delete-item">delete</button>');
    }
  };

  populateList();

  const addItem = (item) => {
    let $listItem = $('<div></div>');
    $listItem.html(`<a href=${item.url} class="listAnchor">${item.title}`);
    $('.listContainer').append($listItem);
    $($listItem).append('<button class="delete-item">delete</button>');
  };

  const confirmAdded = (id) => {
    $('[data-toggle="popover"]').popover('disable').popover('hide');
    $(id).popover('enable').popover('show');
    setTimeout(() => { $(id).popover('disable').popover('hide'); }, 2000);
    $(id).select();
  };

  const deleteItem = (e) => {
    let $toDelete = $(e.target).parent();
    $($toDelete).fadeOut('slow', ()=> {
      ($toDelete).hide();
    });
    //     localStorage.removeItem( $('.user-input-title').val() ); // grab the title and plop here
    localStorage.setItem('wishList', JSON.stringify(wishList));
  };

  // Copy button events, obtains the input id from amending the button id


  $('#urlCopyButton').click((event) => {
    let inputId = '#' + event.target.id.replace('CopyButton', 'Input');
    let $capturedURL = $(inputId).val();
    let $capturedTitle = $('#tabTitle').text();
    console.log($capturedURL);
    confirmAdded(inputId);

    let itemObj = {
      url: $capturedURL,
      title: $capturedTitle
    };
    wishList.push(itemObj);
    console.log(wishList);

    localStorage.setItem('wishList', JSON.stringify(wishList));
    addItem(itemObj);

  });


  $('.listContainer').on('click', '.delete-item', e => {
    deleteItem(e);
  })


  // const copyInputToClipboard = (elementId) => {
  //   let data = $(elementId).val();
  //
  //   let dt = new clipboard.DT();
  //   dt.setData('text/plain', data);
  //
  //   clipboard.write(dt)
  //     .then(() => {
  //     // confirm successful copy
  //       $('[data-toggle="popover"]').popover('disable').popover('hide');
  //       $(elementId).popover('enable').popover('show');
  //       setTimeout(() => { $(elementId).popover('disable').popover('hide'); }, 2000);
  //       $(elementId).select();
  //     })
  //     .catch((error) => {
  //       alertError(error, 'Error occurred when trying to copy to clipboard');
  //     });
  // };
  //
  // const alertError = (error, message) => {
  //   console.log(message);
  //   console.log(error);
  //   $('#alertText').text(message);
  //   $('#alert').show();
  // };

  const addLinkDataFromTab = (tabs) => {
    currentTab = tabs[0];
    $('#tabTitle').text(currentTab.title);
    $('#urlInput').val(currentTab.url);
  };

  // To enable cross-browser use you need to see if this is Chrome or not
  if (chrome) {
    chrome.tabs.query(
      {active: true, currentWindow: true},
      (arrayOfTabs) => { addLinkDataFromTab(arrayOfTabs); }
    );
    // This enables links to be opened in new tabs
    $('a').click( (event) => { chrome.tabs.create({url: event.target.href}); } );
  } else {
    browser.tabs.query({active: true, currentWindow: true})
      .then(addLinkDataFromTab);
    // This enables links to be opened in new tabs
    $('a').click( (event) => { browser.tabs.create({url: event.target.href}); } );
  }



});

