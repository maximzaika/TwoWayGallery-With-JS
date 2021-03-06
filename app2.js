/*
    passing arguments:
       must:
         - imagesArray
       optional:
         - descriptionArray
         - directory
         - startItem
         - displayItems
         - itemClass
  */
function TwoWayGallery() {
  // tw-gallery related pre-defined classes
  const [TW_GALLERY, TW_M_GALLERY, TW_S_GALLERY, TW_LOADED] = [
    "tw-gallery",
    "tw-m-gallery",
    "tw-s-gallery",
    "tw-loaded",
  ];

  // tw-m-gallery related pre-defined classes
  const [TW_ITEMS, TW_ITEM, TW_ITEM_HIDDEN, TW_IMAGE] = [
    "tw-items",
    "tw-item",
    "tw-hidden",
    "tw-image",
  ];

  // tw-m-gallery > tw-item related pre-defined classes
  const [ITEM_LEFT, ITEM_MID, ITEM_RIGHT] = ["left-", "middle", "right-"];

  // tw-m-gallery navigation related pre-defined classes
  const [TW_NAV, TW_NAVS, TW_ARROW] = [
    "tw-nav",
    ["tw-prev", "tw-next"],
    "tw-arrow",
  ];

  // tw-m-gallery > tw-ap (autoplay) related pre-defined classes
  const [TW_AP, TW_APS] = ["tw-ap", ["tw-play", "tw-pause"]];

  // tw-s-gallery related pre-defined classes
  const [TW_SLIDER, TW_THUMB, TW_FOCUS] = [
    "tw-slider",
    "tw-thumbnail",
    "tw-focus",
  ];

  const twMGallery = document.querySelector(
    `.${TW_GALLERY} > .${TW_M_GALLERY}`
  );

  // Argument: options
  this.setConfig = (o) => {
    function setOption(dataType, userInput, defaultInput) {
      if (dataType === "array") {
        return Array.isArray(userInput) ? userInput : defaultInput;
      } else {
        // string, number, boolean
        return typeof userInput === dataType ? userInput : defaultInput;
      }
    }

    const DEF_DESCRIPTION_ARRAY = [];
    const DEF_DIRECTORY = "img/";
    const DEF_START_ITEM = 0;
    const DEF_DISPLAY_ITEMS = 5;
    const DEF_ARROW_KEYS = false;
    const DEF_TOUCH = true;
    const DEF_AUTOPLAY_ENABLE = false;
    const DEF_AUTOPLAY_TIMEOUT = 2000;
    const DEF_AUTOPLAY_PAUSE = true;
    const DEF_AUTOPLAY_PAUSE_NOTIFICATION = true;
    const DEF_AUTOPLAY_PAUSE_NOTIFICATION_TEXT = "PAUSED";
    const DEF_AUTOPLAY_DIRECTION = "right";
    const DEF_NAV = "arrows"; //arrows, dots, arrows & dots
    let DEF_NAV_HOVER = false;
    const DEF_NAV_ICONS = [
      `<i class="fas fa-chevron-left"></i>`,
      `<i class="fas fa-chevron-right"></i>`,
    ]; // [left, right]
    const DEF_S_GALLERY_ENABLE = true;
    const DEF_S_GALLERY_INSTANT = false;
    const DEF_S_GALLERY_DESK_TOUCH = true;

    if (
      typeof o.navigationHover === "boolean" &&
      o.navigationHover &&
      o.navigationType !== "dots"
    ) {
      DEF_NAV_HOVER = o.navigationHover;
    }

    return {
      imagesArray: o.imagesArray,
      descriptionArray: setOption(
        "array",
        o.descriptionArray,
        DEF_DESCRIPTION_ARRAY
      ),
      directory: setOption("string", o.directory, DEF_DIRECTORY),
      startItem: setOption("number", o.startItem, DEF_START_ITEM),
      displayItems: setOption("number", o.displayItems, DEF_DISPLAY_ITEMS),
      navigationType: setOption("string", o.navigationType, DEF_NAV),
      navigationHover: DEF_NAV_HOVER,
      navigationIcons: setOption("array", o.navigationIcons, DEF_NAV_ICONS),
      enableArrowKeys: setOption("boolean", o.enableArrowKeys, DEF_ARROW_KEYS),
      enableTouch: setOption("boolean", o.enableTouch, DEF_TOUCH),
      autoPlay: {
        enable: setOption("boolean", o.autoPlay.enable, DEF_AUTOPLAY_ENABLE),
        direction: setOption(
          "string",
          o.autoPlay.direction,
          DEF_AUTOPLAY_DIRECTION
        ),
        hoverPause: setOption(
          "boolean",
          o.autoPlay.hoverPause,
          DEF_AUTOPLAY_PAUSE
        ),
        hoverPauseNotification: setOption(
          "boolean",
          o.autoPlay.hoverPauseNotification,
          DEF_AUTOPLAY_PAUSE_NOTIFICATION
        ),
        hoverPauseNotificationText: setOption(
          "string",
          o.autoPlay.hoverPauseNotificationText,
          DEF_AUTOPLAY_PAUSE_NOTIFICATION_TEXT
        ),
        timeout: setOption("number", o.autoPlay.timeout, DEF_AUTOPLAY_TIMEOUT),
      },
      sGallery: {
        enable: setOption("boolean", o.sGallery.enable, DEF_S_GALLERY_ENABLE),
        instant: setOption(
          "boolean",
          o.sGallery.instant,
          DEF_S_GALLERY_INSTANT
        ),
        desktopTouch: setOption(
          "boolean",
          o.sGallery.desktopTouch,
          DEF_S_GALLERY_DESK_TOUCH
        ),
      },
    };
  };

  this.twoWayGallery = (options) => {
    console.log("twoWayGallery: Initiating TwoWayGallery...");
    const arrayExists = this.verifyInput(options);

    if (!arrayExists) {
      return; // user failed to pass imagesArray
    }

    options = this.restructureImagesArray(options);
    const twConf = this.setConfig(options);
    let indexesToRender = this.generateMItems(
      twConf.startItem,
      twConf.displayItems
    );

    let twItems = this.renderMGal(twConf);
    this.renderMItems(twConf, indexesToRender, twItems);
    this.listeners(twConf);
    document.querySelector(`.${TW_GALLERY}`).classList.add(TW_LOADED);
  };

  this.restructureImagesArray = (o) => {
    let arrLen = o.imagesArray.length;

    const restructuredArray = [];

    let mid = Math.floor(arrLen / 2);
    let i = o.startItem;
    const originalMid = mid;

    let fullyParsed = false;

    while (!fullyParsed) {
      restructuredArray[mid] = o.imagesArray[i];
      mid++;
      if (mid > arrLen - 1) {
        mid = 0;
      }

      if (mid === originalMid) {
        fullyParsed = true;
      }

      i++;
      if (i > arrLen - 1) {
        i = 0;
      }
    }

    o.imagesArray = restructuredArray;
    o.startItem = originalMid;
    return o;
  };

  /**
   * @param {Object} o                   App options that include user options.
   * @param {String[]} o.imagesArray     Array of images passed by the user.
   * @param {String} o.directory         Directory where images are located.
   * @param {String} o.navigationType    Type of navigation to display: arrow, dots, arrow & dots.
   * @param {Boolean} o.navigationHover  Hide/show navigation upon hovering the gallery.
   * @param {String[]} o.navigationIcons Array that contains HTML of the arrow icons.
   * @param {Number} o.startItem
   */
  this.renderMGal = (o) => {
    let arrLen = o.imagesArray.length;
    const itemsDiv = document.createElement("div");
    itemsDiv.className = TW_ITEMS;

    // Add tw-item inside tw-items
    for (let i = 0; i < arrLen; i++) {
      const itemDiv = document.createElement("div");
      itemDiv.classList.add(TW_ITEM, TW_ITEM_HIDDEN);

      const itemImg = document.createElement("img");
      itemImg.src = o.directory + o.imagesArray[i];
      itemImg.className = TW_IMAGE;
      itemImg.dataset.itemId = i.toString();

      itemDiv.appendChild(itemImg);
      itemsDiv.appendChild(itemDiv);
    }

    twMGallery.appendChild(itemsDiv);

    // create prev and next arrows
    if (o.navigationType.includes("arrows")) {
      const navDiv = document.createElement("div");
      navDiv.className = TW_NAV;

      for (let i = 0; i < TW_NAVS.length; i++) {
        const buttonDiv = document.createElement("div");
        // buttonDiv.id = TW_NAVS[i];
        buttonDiv.classList.add(TW_NAVS[i], TW_ARROW);

        const paddingSpan = document.createElement("span");
        paddingSpan.className = "tw-padding";

        if (i < 1) {
          buttonDiv.classList.add("tw-left");
        } else {
          buttonDiv.classList.add("tw-right");
        }

        paddingSpan.innerHTML = o.navigationIcons[i];
        buttonDiv.append(paddingSpan);
        navDiv.appendChild(buttonDiv);
      }
      twMGallery.appendChild(navDiv);
    } else {
      console.log("navigationType: dots selected");
      // navigation === dots
    }

    return document.querySelectorAll(
      `.${TW_M_GALLERY} > .${TW_ITEMS} > .${TW_ITEM}`
    );
  };

  // Generates array of indexes where appropriate classes will go
  this.generateMItems = (startItem, displayItems) => {
    const generatedIndex = [];

    let classVal = -Math.floor(displayItems / 2);
    for (let i = 0; i < displayItems; i++) {
      if (classVal < 0) {
        generatedIndex.push(startItem - classVal * -1);
      } else if (classVal === 0) {
        generatedIndex.push(startItem);
      } else {
        generatedIndex.push(startItem + classVal);
      }
      classVal++;
    }

    return generatedIndex;
  };

  // Sets appropriate classes to appropriate index of
  // NodeList (tw-item) generated in the this.generateMItems function
  this.renderMItems = (o, indexesToSet, nodeItemsList) => {
    // Turns all the tw-item classes into hidden: tw-item tw-hidden
    nodeItemsList.forEach((element) => {
      element.className = `${TW_ITEM} ${TW_ITEM_HIDDEN}`;
    });

    let midItemId;

    // Toggles hidden, and sets appropriate class to each item
    let classVal = -Math.floor(o.displayItems / 2);
    for (const index of indexesToSet) {
      for (let i = 0; i < nodeItemsList.length; i++) {
        if (+i === +index) {
          nodeItemsList[i].classList.toggle(TW_ITEM_HIDDEN);
          if (classVal < 0) {
            nodeItemsList[i].classList.add(`${ITEM_LEFT}${classVal * -1}`);
          } else if (classVal === 0) {
            midItemId = nodeItemsList[i].childNodes[0].dataset.itemId;
            nodeItemsList[i].classList.add(`${ITEM_MID}`);
          } else {
            nodeItemsList[i].classList.add(`${ITEM_RIGHT}${classVal}`);
          }
          classVal++;
          break;
        }
      }
    }
    return midItemId;
  };

  this.listeners = (o) => {
    const prevBtn = document.querySelector(`.${TW_NAVS[0]}`); // tw-prev
    const nextBtn = document.querySelector(`.${TW_NAVS[1]}`); // tw-next

    prevBtn.addEventListener("click", this.prev.bind(null, o, true));
    nextBtn.addEventListener("click", this.next.bind(null, o, true));

    // Enable action on the arrows
    const twNav = document.querySelectorAll(
      `.${TW_M_GALLERY} > .${TW_NAV} > .${TW_ARROW}`
    );

    // Enable actions on the following items
    let pauseThese = document.querySelectorAll(
      `.${TW_AP}, .${TW_IMAGE}, .${TW_ARROW}`
    );

    // additional user options
    pauseThese = this.eventMGalAutoPlay(o, pauseThese, prevBtn, nextBtn);
    this.eventMGalNavigationHover(o, pauseThese, twNav);
    this.eventMGalTouch(o, pauseThese, prevBtn, nextBtn);
    this.eventMGalArrowKeys(o, prevBtn, nextBtn);
    this.renderSGal(o);
    this.eventSGalClickTouch(o);
  };

  this.renderSGal = (o) => {
    if (o.sGallery.enable) {
      const twSGallery = document.querySelector(
        `.${TW_GALLERY} > .${TW_S_GALLERY}`
      );

      const twSlider = document.createElement("div");
      twSlider.className = TW_SLIDER;
      let id = 0;
      for (const item of o.imagesArray) {
        const twSliderImage = document.createElement("img");
        twSliderImage.dataset.id = id.toString();
        id++;
        twSliderImage.className = TW_THUMB;
        twSliderImage.src = o.directory + item;
        twSlider.appendChild(twSliderImage);
      }
      twSGallery.append(twSlider);

      this.focusSGal(o, o.startItem);
    }
  };

  this.focusSGal = (o, index) => {
    const element = document.querySelector(`.${TW_THUMB}[data-id="${index}"]`);

    if (o.sGallery.enable && element) {
      const twSlider = document.querySelector(`.${TW_SLIDER}`);

      const currFocusedImage = document.querySelector(
        `.${TW_THUMB}.${TW_FOCUS}`
      );

      if (currFocusedImage) {
        // const currFocusedImageOffset = currFocusedImage.offsetLeft;
        currFocusedImage.classList.remove(`${TW_FOCUS}`);
      }

      element.classList.add(`${TW_FOCUS}`);
      const changedFocusedImageOffset =
        element.offsetLeft + element.offsetWidth / 2 - twSlider.offsetWidth / 2;
      twSlider.scrollTo({
        left: changedFocusedImageOffset - 10,
        behavior: "smooth",
      });
    }
  };

  /**
   * @param {Object} o user options
   * @param {Boolean} o.autoPlay.enable user's choice true or false
   * @param {Number} o.autoPlay.timeout user's choice of timeout duration
   * @param {Boolean} o.autoPlay.hoverPause user's choice true or false to enable pause on hover
   * @param {Boolean} o.autoPlay.hoverPauseNotification true or false to display the pause notification
   * @param {String} o.autoPlay.hoverPauseNotificationText text to display upon pause
   * @param {NodeListOf} pauseThese items that will listen for a pause event
   * @param {Element} prev prevBtn query selector of the prev button
   * @param {Element} next nextBtn query selector of the next button
   * If this option is true, then the gallery will auto AUTOPLAY based on the
   * options selected.
   */
  this.eventMGalAutoPlay = (o, pauseThese, prev, next) => {
    if (o.autoPlay.enable) {
      let isPaused = false;

      setInterval(() => {
        if (!isPaused) {
          switch (o.autoPlay.direction) {
            case "right":
              next.click();
              break;
            case "left":
              prev.click();
              break;
          }
        }
      }, o.autoPlay.timeout);

      if (o.autoPlay.hoverPause) {
        let pauseDiv;
        if (o.autoPlay.hoverPauseNotification) {
          pauseDiv = document.createElement("div");
          pauseDiv.innerHTML = o.autoPlay.hoverPauseNotificationText;
          pauseDiv.className = `${TW_AP} ${TW_APS[0]}`;
          twMGallery.prepend(pauseDiv);
        }

        const eventListener = (items, event, paused) => {
          for (const item of items) {
            item.addEventListener(event, () => {
              if (o.autoPlay.hoverPauseNotification) {
                pauseDiv.classList.add(TW_APS[1]);
                if (event === "mouseleave") {
                  pauseDiv.classList.remove(TW_APS[1]);
                }
              }
              isPaused = paused;
            });
          }
        };

        pauseThese = document.querySelectorAll(
          `.${TW_AP}, .${TW_IMAGE}, .${TW_ARROW}`
        );

        eventListener(pauseThese, "mouseenter", true);
        eventListener(pauseThese, "mouseleave", false);
      }
    }
    return pauseThese;
  };

  /**
   * @param {Object} o user options
   * @param {Boolean} o.enableArrowKeys user's choice true or false
   * @param {Element} prev prevBtn query selector of the prev button
   * @param {Element} next nextBtn query selector of the next button
   * If this option is true, then user can use left and right arrow keyboard keys
   * to trigger clicks on the next/prev buttons.
   */
  this.eventMGalArrowKeys = (o, prev, next) => {
    if (o.enableArrowKeys) {
      const isInViewport = (element) => {
        const rect = element.getBoundingClientRect();
        return (
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <=
            (window.innerHeight || document.documentElement.clientHeight) &&
          rect.right <=
            (window.innerWidth || document.documentElement.clientWidth)
        );
      };

      document.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft" && isInViewport(twMGallery)) {
          event.preventDefault();
          prev.click();
        }

        if (event.key === "ArrowRight" && isInViewport(twMGallery)) {
          event.preventDefault();
          next.click();
        }
      });
    }
  };

  /**
   * @param {Object} o user options
   * @param {Boolean} o.enableTouch user's choice true or false
   * @param {NodeListOf} pauseThese items that will listen for a pause event
   * @param {Element} prev prevBtn query selector of the prev button
   * @param {Element} next nextBtn query selector of the next button
   * If this option is true, then user can swipe right/left (both touch
   * and mouse events) to trigger clicks on the next/prev buttons.
   */
  this.eventMGalTouch = (o, pauseThese, prev, next) => {
    if (o.enableTouch) {
      const eventListeners = (items, evStart, evEnd) => {
        let [touchStartX, touchStartTime] = [0, 0];
        const expectedTouchDistance = 40;

        for (const item of items) {
          item.addEventListener(evStart, (event) => {
            [touchStartX, touchStartTime] = touchStart(event, evStart);
          });

          item.addEventListener(evEnd, (event) => {
            touchEnd(
              event,
              touchStartX,
              touchStartTime,
              expectedTouchDistance,
              evEnd
            );
          });
        }
      };

      const touchStart = (event, ev) => {
        const date = new Date();
        const touchStartTime = date.getTime();
        let touchStartX = 0;

        if (ev.includes("touch")) {
          touchStartX = event.touches[0].pageX;
        } else {
          // mouse event
          touchStartX = event.pageX;
          event.preventDefault();
        }
        return [touchStartX, touchStartTime];
      };

      const touchEnd = (
        event,
        touchStartX,
        touchStartTime,
        expectedTouchDistance,
        ev
      ) => {
        let touchEndX = 0;

        if (ev.includes("touch")) {
          touchEndX = event.changedTouches[0].pageX;
        } else {
          // mouse event
          touchEndX = event.pageX;
          event.preventDefault();
        }

        const date = new Date();
        const touchEndTime = date.getTime();
        const touchDuration = Math.abs(touchStartTime - touchEndTime);
        const touchDiffX = Math.abs(touchStartX - touchEndX);

        if (touchDuration < 1500) {
          if (touchDiffX > expectedTouchDistance) {
            if (touchEndX > touchStartX) {
              prev.click();
            } else {
              next.click();
            }
          }
        }
      };

      eventListeners(pauseThese, "touchstart", "touchend");
      eventListeners(pauseThese, "mousedown", "mouseup");
    }
  };

  /**
   * @param {Object} o user options
   * @param {Boolean} o.navigationHover user's choice true or false
   * @param {NodeListOf} pauseThese items that will listen for a hover event
   * @param {NodeListOf} twNav navigation buttons that will listen for a hover event
   * If this option is true, then navigation buttons are hidden by default
   * and are shown once user hovers/clicks (mouse/touch) over/on the image
   */
  this.eventMGalNavigationHover = (o, pauseThese, twNav) => {
    const setClass = o.navigationHover ? "tw-hide" : "tw-hover";

    for (const arrow of twNav) {
      arrow.classList.add(setClass);
    }

    if (o.navigationHover) {
      const eventListener = (event, items, removeClass, addClass) => {
        for (const item of items) {
          item.addEventListener(event, () => {
            setOpacity(items, removeClass, addClass);
          });
        }
      };

      function setOpacity(items, removeClass, addClass) {
        for (const item of items) {
          item.classList.remove(removeClass);
          item.classList.add(addClass);
        }
      }

      eventListener("mouseenter", pauseThese, "tw-hide", "tw-show");
      eventListener("mouseleave", pauseThese, "tw-show", "tw-hide");
    }
  };

  this.eventSGalClickTouch = (o) => {
    const twSlider = document.querySelector(".tw-slider");

    // Enable touch rotation on the desktop (mobile should would by default)
    let touchDuration = 0;
    if (o.sGallery.desktopTouch && o.sGallery.enable && twSlider) {
      let mouseStart = 0;
      let touchStartTime;
      twSlider.addEventListener("mousedown", (event) => {
        const date = new Date();
        touchStartTime = date.getTime();
        mouseStart = event.pageX;
        event.preventDefault();
        twSlider.addEventListener("mousemove", mouseOverFunction);
      });

      document.addEventListener("mouseup", () => {
        const date = new Date();
        const touchEndTime = date.getTime();
        touchDuration = Math.abs(touchStartTime - touchEndTime);
        twSlider.removeEventListener("mousemove", mouseOverFunction);
      });

      const mouseOverFunction = (event) => {
        const twSlider = document.querySelector(".tw-slider");
        const scrollPos = twSlider.scrollLeft;
        const cursorPos = Math.floor((mouseStart - event.pageX) / 40);

        const scrollerDiff = scrollPos + cursorPos;
        if (scrollerDiff > 0) {
          twSlider.scrollTo({ left: scrollerDiff });
        }
      };
    }

    // Clicking on the sGallery but listen for the clicks on the images only
    if (o.sGallery.enable && twSlider) {
      twSlider.addEventListener("click", (event) => {
        if (touchDuration > 120) {
          return;
        }

        const imgClicked = event.target;
        const imgClickedId = imgClicked.dataset.id;

        this.focusSGal(o, imgClickedId);

        const mMidItem = document.querySelector(`.${TW_ITEM}.middle`);
        const mMidIndex = mMidItem.firstChild.dataset.itemId;

        switch (true) {
          // Scroll the mGallery to the left
          case mMidIndex > imgClickedId:
            if (o.sGallery.instant) {
              for (let i = mMidIndex; i > imgClickedId; i--) {
                if (i !== imgClickedId) {
                  this.prev(o, false);
                }
              }
            } else {
              const diff = mMidIndex - imgClickedId;
              let timesRun = 0;
              let interval = setInterval(() => {
                timesRun++;
                if (timesRun === diff) {
                  clearInterval(interval);
                }
                this.prev(o, false);
              }, 100);
            }
            break;
          // Do nothing if the same element is selected
          case mMidIndex == imgClickedId:
            break;
          // Scroll the mGallery to the right
          case mMidIndex < imgClickedId:
            if (o.sGallery.instant) {
              for (let i = mMidIndex; i < imgClickedId; i++) {
                if (i !== imgClickedId) {
                  this.next(o, false);
                }
              }
            } else {
              const diff = imgClickedId - mMidIndex;
              let timesRun = 0;
              let interval = setInterval(() => {
                timesRun++;
                if (timesRun === diff) {
                  clearInterval(interval);
                }
                this.next(o, false);
              }, 100);
            }
            break;
        }
      });
    }
  };

  this.prev = (o, isArrowClick = false) => {
    const twConf = this.setConfig(o);

    let indexArray = this.generateMItems(twConf.startItem, twConf.displayItems);
    const newIndexArray = []; // holds decremented indexes
    indexArray.forEach((element) => {
      newIndexArray.push(element - 1);
    });

    const twItems = document.querySelectorAll(
      `.${TW_M_GALLERY} > .${TW_ITEMS} > .${TW_ITEM}`
    );
    const twLastItem = twItems[twItems.length - 1];

    // move last item to the front of the NodeList
    document
      .querySelector(`.${TW_GALLERY} > .${TW_M_GALLERY} > .${TW_ITEMS}`)
      .prepend(twLastItem);

    const midId = this.renderMItems(twConf, newIndexArray, twItems);

    if (isArrowClick && o.sGallery.enable) {
      const twThumbs = document.querySelectorAll(
        `.${TW_GALLERY} > .${TW_S_GALLERY} > .${TW_SLIDER} > .${TW_THUMB}`
      );

      const twThumbLast = twThumbs[twItems.length - 1];
      document.querySelector(`.${TW_SLIDER}`).prepend(twThumbLast);

      this.focusSGal(o, midId);
    }
  };

  this.next = (o, isArrowClick = false) => {
    const twConf = this.setConfig(o);

    let indexArray = this.generateMItems(twConf.startItem, twConf.displayItems);
    const newIndexArray = []; // holds incremented indexes
    indexArray.forEach((element) => {
      newIndexArray.push(element + 1);
    });

    const twItems = document.querySelectorAll(
      `.${TW_M_GALLERY} > .${TW_ITEMS} > .${TW_ITEM}`
    );
    const twFirstItem = twItems[0];

    // move last item to the front of the NodeList
    document
      .querySelector(`.${TW_GALLERY} > .${TW_M_GALLERY} > .${TW_ITEMS}`)
      .appendChild(twFirstItem);

    const midId = this.renderMItems(twConf, newIndexArray, twItems);

    if (isArrowClick && o.sGallery.enable) {
      const twThumbs = document.querySelectorAll(
        `.${TW_GALLERY} > .${TW_S_GALLERY} > .${TW_SLIDER} > .${TW_THUMB}`
      );
      const twThumbLast = twThumbs[0];
      document.querySelector(`.${TW_SLIDER}`).appendChild(twThumbLast);
      this.focusSGal(o, midId);
    }
  };

  this.verifyInput = (o) => {
    let arrayExists = true;
    new Promise((resolve, reject) => {
      if (!o.imagesArray) {
        arrayExists = false;
        throw new Error(
          "imagesArray is missing from the passing arguments. Stopping execution!"
        );
      }
    }).catch((error) => {
      throw error;
    });
    return arrayExists;
  };
}

const twoWayGallery = new TwoWayGallery();
twoWayGallery.twoWayGallery({
  imagesArray: [
    "0.1.jpg",
    "0.3.jpg",
    "0.4.jpg",
    "2.jpg",
    "0.5.jpg",
    "0.11.jpg",
    "12.jpg",
    "13.jpg",
    "14.jpg",
  ],
  descriptionArray: [],
  directory: "img/",
  startItem: 0,
  displayItems: 5,
  enableArrowKeys: true,
  enableTouch: true,
  autoPlay: {
    enable: false,
    direction: "right",
    hoverPause: true,
    hoverPauseNotification: true,
    hoverPauseNotificationText: "PAUSED",
    timeout: 3000,
  },
  navigationType: "arrows",
  navigationHover: false,
  sGallery: {
    enable: true,
    instant: false,
    desktopTouch: true,
    arrows: true,
  },
  // navigationIcons: [
  //   `<i class="fa fa-angle-left" aria-hidden="true"></i>`,
  //   `<i class="fa fa-angle-right" aria-hidden="true"></i>`,
  // ],
});
