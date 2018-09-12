
$(document).ready(function() {


  let wishList = [];
  wishList = JSON.parse(localStorage.getItem('wishList')) || [];

  console.log(wishList);


  const populateList = () => {

    for (let i = 0; i < wishList.length; i++) {
      let $listItem = $('<div></div>');
      $listItem.html(`<a href=${wishList[i].url} target="_self" id=item_${i} class="listAnchor">${wishList[i].title}</a>
                      <input type="hidden" class="text-input">
                     `);
      $('.listContainer').append($listItem);
    }
  };

  populateList();



  const deleteItem = ($toDelete) => {
    // let $toDelete = $(e.target).parent();
    // $($toDelete).fadeOut('slow', ()=> {
    //   ($toDelete).hide();
    // });
    let $deleteUrl = $($toDelete).children('a').attr('href');
    let index = wishList.findIndex(el => el.url === $deleteUrl);
    wishList.splice(index, 1);
    localStorage.setItem('wishList', JSON.stringify(wishList));
    location.reload();
  };

  const editItem = (editTarget) => {
    console.log('ran');
    $(editTarget).hide();
    let $inputBox = $(editTarget).siblings();
    let title = editTarget.text();
    let url = editTarget.attr('href');
    let index = wishList.findIndex(el => el.url === url);
    $inputBox.show();
    $inputBox.attr('type', 'text').val(title).focus();
    $inputBox.select();
    $inputBox.blur(()=>{
      title = $inputBox.val();
      $(editTarget).text(title);
      $(editTarget).show();
      $inputBox.hide();
      wishList[index].title = title;
      localStorage.setItem('wishList', JSON.stringify(wishList));
      location.reload();
    });
    $inputBox.keypress((e)=>{
      if (e.which === 13) {
        title = $inputBox.val();
        $(editTarget).text(title);
        $(editTarget).show();
        $inputBox.hide();
        wishList[index].title = title;
        localStorage.setItem('wishList', JSON.stringify(wishList));
        location.reload();
      }


    });




  };



  const addItem = (item) => {
    let $listItem = $('<div></div>');
    $listItem.html(`<a href=${item.url} target="_self" id=item_${wishList.length} class="listAnchor">${item.title}
                    <input type="hidden" class="text-input">    
                   `);
    $('.listContainer').append($listItem);
  };

  const confirmAdded = (id) => {
    $('[data-toggle="popover"]').popover('disable').popover('hide');
    $(id).popover('enable').popover('show');
    setTimeout(() => { $(id).popover('disable').popover('hide'); }, 2000);
    $(id).select();
  };

  $('#add-item-button').click((event) => {
    let inputId = '#' + event.target.id.replace('add-item-button', 'urlInput');
    let $capturedURL = $(inputId).val();
    let $capturedTitle = $('#tabTitle').text();

    confirmAdded(inputId);

    let itemObj = {
      url: $capturedURL,
      title: $capturedTitle
    };


    if (wishList.filter(el => el.url === $capturedURL).length < 1) {
      wishList.push(itemObj);


      localStorage.setItem('wishList', JSON.stringify(wishList));
      addItem(itemObj);

    } else {
      alert('That item is already on your list!!!');
    }

    location.reload(); // could fix with event delegation

  });


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


  // disable right click and show custom context menu
  $('.listContainer').on('contextmenu', '.listAnchor', function (e) {
    var id = this.id;
    $('#txt_id').val(id);
    var top = e.pageY + 5;
    var left = e.pageX;
    // let url = $('#' + id).attr('href');
    //
    // $('#url').text(url);

    // Show contextmenu
    $('.context-menu').toggle(100).css({
      top: top + 'px',
      left: left + 'px'
    });

    // disable default context menu
    return false;
  });

  // Hide context menu
  $(document).bind('contextmenu click', function() {
    $('.context-menu').hide();
    $('#txt_id').val('');
  });

  // disable context-menu from custom menu
  $('.context-menu').bind('contextmenu', function() {
    return false;
  });

  // Clicked context-menu item
  $('.context-menu li').click(function() {
    var className = $(this).find('span:nth-child(1)').attr('class');
    var titleid = $('#txt_id').val();
    let listTarget = $('#' + titleid).parent();
    let editTarget = $('#' + titleid);
    if (className === 'delete') {
      deleteItem(listTarget);

    }
    if (className === 'edit') {
      editItem(editTarget);
    }
    $('.context-menu').hide();

  });





});


