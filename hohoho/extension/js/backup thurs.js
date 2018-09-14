$(document).ready(function () {

  let capturedTitle,
    username,
    christmas,
    birthday;

  const getOptions = (() => {
    christmas = localStorage.getItem('christmas') ?
      JSON.parse(localStorage.getItem('christmas')) :
      true;
    birthday = localStorage.getItem('birthday') ?
      JSON.parse(localStorage.getItem('birthday')) :
      true;
  })();

  const getUsername = () => {
    username = localStorage.getItem('username');

    if (username === null) {
      $('#custom-name').text((`Wishlist`).toUpperCase());
    } else {
      $('#custom-name').text((`${username}'s Wishlist`).toUpperCase());
    }
  };

  getUsername();


  $('#options-button').on('click', () => {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open(chrome.runtime.getURL('options.html'));
    }
  });

  let wishList = [];
  wishList = JSON.parse(localStorage.getItem(username + '-wishList')) || [];

  const populateList = () => {

    for (let i = 0; i < wishList.length; i++) {
      let $listItem = $('<li></li>');
      $listItem.html(`<a href=${wishList[i].url} target="_parent" id=item_${i} class="listAnchor">${wishList[i].title}</a>
                      <input type="hidden" class="text-input">
                     `);
      $('.listlist').append($listItem);
    }
  };

  populateList();


  const deleteItem = ($toDelete) => {

    let $deleteUrl = $($toDelete).children('a').attr('href');
    let index = wishList.findIndex(el => el.url === $deleteUrl);
    wishList.splice(index, 1);
    localStorage.setItem(username + '-wishList', JSON.stringify(wishList));
    location.reload();
  };

  const editItem = (editTarget) => {

    $(editTarget).hide();
    let $inputBox = $(editTarget).siblings();
    let title = editTarget.text();
    let url = editTarget.attr('href');
    let index = wishList.findIndex(el => el.url === url);
    $inputBox.show();
    $inputBox.attr('type', 'text').val(title).focus();
    $inputBox.select();
    $inputBox.blur(() => {
      title = $inputBox.val();
      $(editTarget).text(title);
      $(editTarget).show();
      $inputBox.hide();
      wishList[index].title = title;
      localStorage.setItem(username + '-wishList', JSON.stringify(wishList));
      location.reload();
    });
    $inputBox.keypress((e) => {
      if (e.which === 13) {
        title = $inputBox.val();
        $(editTarget).text(title);
        $(editTarget).show();
        $inputBox.hide();
        wishList[index].title = title;
        localStorage.setItem(username + '-wishList', JSON.stringify(wishList));
        location.reload();
      }
    });
  };

  const addItem = (item) => {
    let $listItem = $('<li></li>');
    $listItem.html(`<a href=${item.url} target="_parent" id=item_${wishList.length} class="listAnchor">${item.title}
                    <input type="hidden" class="text-input">    
                   `);
    $('.listlist').append($listItem);
  };

  // const confirmAdded = (id) => {
  //   $('[data-toggle="popover"]').popover('disable').popover('hide');
  //   $(id).popover('enable').popover('show');
  //   setTimeout(() => { $(id).popover('disable').popover('hide'); }, 2000);
  //   $(id).select();
  // };

  // let grow =  localStorage.getItem('santa') || "100";
  // $("#custom-name").append(`<img src="../images/santa.png" id="santa" height="${grow}">`);
  $('#add-item-button').click((event) => {
    let inputId = '#' + event.target.id.replace('add-item-button', 'urlInput');
    let $capturedURL = $(inputId).val();
    // let $capturedTitle = $('#tabTitle').text();

    let itemObj = {
      url: $capturedURL,
      title: capturedTitle
    };

    if (wishList.filter(el => el.url === $capturedURL).length < 1) {
      wishList.push(itemObj);


      localStorage.setItem(username + '-wishList', JSON.stringify(wishList));
      addItem(itemObj);

    } else {
      alert('That item is already on your list!!!');
    }

    location.reload(); // could fix with event delegation

    // grow = (Number(grow) + 20).toString();
    // $("#santa").css("height", grow + 'px');
    // localStorage.setItem('santa', grow);

  });

  const addLinkDataFromTab = (tabs) => {
    currentTab = tabs[0];
    capturedTitle = currentTab.title;
    // $('#tabTitle').text(currentTab.title); //dont know if I want to keep this
    $('#urlInput').val(currentTab.url);
  };

  // disable right click and show custom context menu
  $('.listlist').on('contextmenu', '.listAnchor', function (e) {
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
  $(document).bind('contextmenu click', function () {
    $('.context-menu').hide();
    $('#txt_id').val('');
  });

  // disable context-menu from custom menu
  $('.context-menu').bind('contextmenu', function () {
    return false;
  });

  // Clicked context-menu item
  $('.context-menu li').click(function () {
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

  if (chrome) {
    chrome.tabs.query(
      {active: true, currentWindow: true},
      (arrayOfTabs) => {
        addLinkDataFromTab(arrayOfTabs);
      }
    );
    // This enables links to be opened in new tabs
    $('a').click((event) => {
      chrome.tabs.update({url: event.target.href});
    });
  } else {
    browser.tabs.query({active: true, currentWindow: true})
      .then(addLinkDataFromTab);
    // This enables links to be opened in new tabs
    $('a').click((event) => {
      browser.tabs.update({url: event.target.href});
    });
  }


  if (christmas === true) {
    var w = window.innerWidth, h = window.innerHeight,
      container = document.getElementById("container"),
      sizes = ["Small", "Medium", "Large"],
      types = ["round", "star", "real", "sharp", "ring"],
      snowflakes = 50;

    for (var i = 0; i < snowflakes; i++) {
      var snowflakeDiv = document.createElement('div');
      var sizeIndex = Math.ceil(Math.random() * 3) - 1; //get random number between 0 and 2
      var size = sizes[sizeIndex]; //get random size
      var typeIndex = Math.ceil(Math.random() * 5) - 1;
      var type = types[typeIndex];
      TweenMax.set(snowflakeDiv, {attr: {class: type + size}, x: R(0, w), y: R(-200, -150)});
      container.appendChild(snowflakeDiv);
      snowing(snowflakeDiv);
    }

    function snowing(element) {
      TweenMax.to(element, R(5, 12), {y: h + 100, ease: Linear.easeNone, repeat: -1, delay: -15});
      TweenMax.to(element, R(4, 8), {x: '+=100', repeat: -1, yoyo: true, ease: Sine.easeInOut});
      TweenMax.to(element, R(2, 8), {rotation: R(0, 360), repeat: -1, yoyo: true, ease: Sine.easeInOut, delay: -5});
    };

    function R(min, max) {
      return min + Math.random() * (max - min);
    };
  }


});



