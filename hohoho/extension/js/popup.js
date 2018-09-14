$(document).ready(function () {

  let capturedTitle,
    username,
    theme;

  const getOptions = (() => {
    username = localStorage.getItem('user-name');
    theme = localStorage.getItem('current-theme');

    if (username === null) {
      $('#custom-name').text((`Wishlist`).toUpperCase());
    } else {
      $('#custom-name').text((`${username}'s Wishlist`).toUpperCase());
    }
  })();

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

  $(document).on('click', '#add-item-button', (event) => {
    let inputId = '#' + event.target.id.replace('add-item-button', 'urlInput');
    let $capturedURL = $(inputId).val();

    let itemObj = {
      url: $capturedURL,
      title: capturedTitle
    };

    if (wishList.filter(el => el.url === $capturedURL).length < 1) {
      wishList.push(itemObj);

      localStorage.setItem(username + '-wishList', JSON.stringify(wishList));
      let $listItem = $('<li></li>');
      $listItem.html(`<a href=${itemObj.url} target="_parent" id=item_${wishList.length} class="listAnchor">${itemObj.title}</a>
                    <input type="hidden" class="text-input">    
                   `);
      $('.listlist').append($listItem);

      if (theme === 'Birthday') {
        $('.listContainer a').css('background', 'forestgreen');
      }

    } else {
      alert('That item is already on your list!!!');
    }

  });

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
    });

    $inputBox.keypress((e) => {
      if (e.which === 13) {
        title = $inputBox.val();
        $(editTarget).text(title);
        $(editTarget).show();
        $inputBox.hide();
        wishList[index].title = title;
        localStorage.setItem(username + '-wishList', JSON.stringify(wishList));
        // location.reload();
      }
    });
  };

  const deleteItem = (listTarget) => {
    let $deleteUrl = $(listTarget).children('a').attr('href');
    let index = wishList.findIndex(el => el.url === $deleteUrl);
    wishList.splice(index, 1);
    localStorage.setItem(username + '-wishList', JSON.stringify(wishList));
    listTarget.remove();
  };

  const addLinkDataFromTab = (tabs) => {
    currentTab = tabs[0];
    capturedTitle = currentTab.title;
    $('#urlInput').val(currentTab.url);
  };

  // disable right click and show custom context menu
  $('.listlist').on('contextmenu', '.listAnchor', function (e) {
    var id = this.id;
    $('#txt_id').val(id);
    var top = e.pageY + 5;
    var left = e.pageX;

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
  $(document).on('click', '.context-menu li', function () {
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

  $(document).on('click', '#options-button', () => {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open(chrome.runtime.getURL('options.html'));
    }
  });

  const setTheme = (() => {
    if (theme === 'Christmas') {
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
    } else if (theme === 'Birthday') {
      $('body').css('background-color', 'rgba(0,138,203, .7)');
      $('#santa').attr('src', '../images/birthdayfrog.png');
      $('#santa').css({
        'height': '240px',
        'margin': '-65px 0 -50px 10px'
      });
      $('.listContainer a').css('background', 'forestgreen');
      $('h1').css('color', 'forestgreen');
      $('#add-item-button').css('box-shadow', 'none');
      $('#add-item-button').css('background', 'forestgreen');


      (function () {
        // globals
        var canvas;
        var ctx;
        var W;
        var H;
        var mp = 150; //max particles
        var particles = [];
        var angle = 0;
        var tiltAngle = 0;
        var confettiActive = true;
        var animationComplete = true;
        var deactivationTimerHandler;
        var reactivationTimerHandler;
        var animationHandler;

        // objects

        var particleColors = {
          colorOptions: ["DodgerBlue", "OliveDrab", "Gold", "pink", "SlateBlue", "lightblue", "Violet", "PaleGreen", "SteelBlue", "SandyBrown", "Chocolate", "Crimson"],
          colorIndex: 0,
          colorIncrementer: 0,
          colorThreshold: 10,
          getColor: function () {
            if (this.colorIncrementer >= 10) {
              this.colorIncrementer = 0;
              this.colorIndex++;
              if (this.colorIndex >= this.colorOptions.length) {
                this.colorIndex = 0;
              }
            }
            this.colorIncrementer++;
            return this.colorOptions[this.colorIndex];
          }
        }

        function confettiParticle(color) {
          this.x = Math.random() * W; // x-coordinate
          this.y = (Math.random() * H) - H; //y-coordinate
          this.r = RandomFromTo(10, 30); //radius;
          this.d = (Math.random() * mp) + 10; //density;
          this.color = color;
          this.tilt = Math.floor(Math.random() * 10) - 10;
          this.tiltAngleIncremental = (Math.random() * 0.07) + .05;
          this.tiltAngle = 0;

          this.draw = function () {
            ctx.beginPath();
            ctx.lineWidth = this.r / 2;
            ctx.strokeStyle = this.color;
            ctx.moveTo(this.x + this.tilt + (this.r / 4), this.y);
            ctx.lineTo(this.x + this.tilt, this.y + this.tilt + (this.r / 4));
            return ctx.stroke();
          };
        }

        $(document).ready(function () {
          SetGlobals();
          InitializeButton();
          InitializeConfetti();

          $(window).resize(function () {
            W = window.innerWidth;
            H = window.innerHeight;
            canvas.width = W;
            canvas.height = H;
          });

        });

        function InitializeButton() {
          $('#add-item-button').click(RestartConfetti);
        }

        function SetGlobals() {
          canvas = document.getElementById("canvas");
          ctx = canvas.getContext("2d");
          W = window.innerWidth;
          H = window.innerHeight;
          canvas.width = W;
          canvas.height = H;
        }

        function InitializeConfetti() {
          particles = [];
          animationComplete = false;
          for (var i = 0; i < mp; i++) {
            var particleColor = particleColors.getColor();
            particles.push(new confettiParticle(particleColor));
          }
          StartConfetti();
        }

        function Draw() {
          ctx.clearRect(0, 0, W, H);
          var results = [];
          for (var i = 0; i < mp; i++) {
            (function (j) {
              results.push(particles[j].draw());
            })(i);
          }
          Update();

          return results;
        }

        function RandomFromTo(from, to) {
          return Math.floor(Math.random() * (to - from + 1) + from);
        }

        function Update() {
          var remainingFlakes = 0;
          var particle;
          angle += 0.01;
          tiltAngle += 0.1;

          for (var i = 0; i < mp; i++) {
            particle = particles[i];
            if (animationComplete) return;

            if (!confettiActive && particle.y < -15) {
              particle.y = H + 100;
              continue;
            }

            stepParticle(particle, i);

            if (particle.y <= H) {
              remainingFlakes++;
            }
            CheckForReposition(particle, i);
          }

          if (remainingFlakes === 0) {
            StopConfetti();
          }
        }

        function CheckForReposition(particle, index) {
          if ((particle.x > W + 20 || particle.x < -20 || particle.y > H) && confettiActive) {
            if (index % 5 > 0 || index % 2 == 0) //66.67% of the flakes
            {
              repositionParticle(particle, Math.random() * W, -10, Math.floor(Math.random() * 10) - 20);
            } else {
              if (Math.sin(angle) > 0) {
                //Enter from the left
                repositionParticle(particle, -20, Math.random() * H, Math.floor(Math.random() * 10) - 20);
              } else {
                //Enter from the right
                repositionParticle(particle, W + 20, Math.random() * H, Math.floor(Math.random() * 10) - 20);
              }
            }
          }
        }

        function stepParticle(particle, particleIndex) {
          particle.tiltAngle += particle.tiltAngleIncremental;
          particle.y += (Math.cos(angle + particle.d) + 3 + particle.r / 2) / 2;
          particle.x += Math.sin(angle);
          particle.tilt = (Math.sin(particle.tiltAngle - (particleIndex / 3))) * 15;
        }

        function repositionParticle(particle, xCoordinate, yCoordinate, tilt) {
          particle.x = xCoordinate;
          particle.y = yCoordinate;
          particle.tilt = tilt;
        }

        function StartConfetti() {
          W = window.innerWidth;
          H = window.innerHeight;
          canvas.width = W;
          canvas.height = H;
          (function animloop() {
            if (animationComplete) return null;
            animationHandler = requestAnimFrame(animloop);
            return Draw();
          })();
        }

        function ClearTimers() {
          clearTimeout(reactivationTimerHandler);
          clearTimeout(animationHandler);
        }

        function DeactivateConfetti() {
          confettiActive = false;
          ClearTimers();
        }

        function StopConfetti() {
          animationComplete = true;
          if (ctx == undefined) return;
          ctx.clearRect(0, 0, W, H);
        }

        function RestartConfetti() {
          ClearTimers();
          StopConfetti();
          reactivationTimerHandler = setTimeout(function () {
            confettiActive = true;
            animationComplete = false;
            InitializeConfetti();
          }, 100);
          setTimeout(DeactivateConfetti, 2000);

        }

        window.requestAnimFrame = (function () {
          return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
              return window.setTimeout(callback, 1000 / 60);
            };
        })();

        setTimeout(DeactivateConfetti, 2000);
      })();

    } else {
      //get info based on name
      let customTheme = JSON.parse(localStorage.getItem('custom-themes')).filter(el => el[0] === localStorage.getItem('current-theme'));
      let [[a, backgroundColor, titleColor, listColor, buttonColor]] = customTheme;

      $('body').css('background-color', backgroundColor);
      $('#santa').attr('src', '../images/birthdayfrog.png');
      $('#santa').css({
        'height': '240px',
        'margin': '-65px 0 -50px 10px'
      });
      $('.listContainer a').css('background', listColor);
      $('h1').css('color', titleColor);
      $('#add-item-button').css('box-shadow', 'none');
      $('#add-item-button').css('background', buttonColor);
    }

  })();

});



