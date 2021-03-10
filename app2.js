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
  // tw-gallery classes
  const [TWM_GALLERY, TWS_GALLERY, TW_LOADED] = [
    "tw-m-gallery",
    "tw-s-gallery",
    "tw-loaded",
  ];
  const TW_ARROW_DIRECTION = ["tw-left-arrow", "tw-right-arrow"];

  /* ----- tw-m-gallery  ----- */
  const [
    TWM_ITEMS,
    TWM_ITEM,
    TWM_ITEM_HIDDEN,
    TWM_WRAPPER,
    TWM_IMAGE,
    TWM_DESC,
  ] = [
    "tw-m-items",
    "tw-m-item",
    "tw-m-hidden",
    "tw-m-wrapper",
    "tw-m-image",
    "tw-m-description",
  ];
  const [TWM_LEFT, TWM_MID, TWM_RIGHT] = [
    "tw-m-left-",
    "tw-m-mid",
    "tw-m-right-",
  ];
  const [
    TWM_NAV,
    TWM_NAVS,
    TWM_ARROW,
    TWM_NAV_HIDE,
    TWM_NAV_HOVER,
    TWM_NAV_SHOW,
    TWM_PADDING,
  ] = [
    "tw-m-nav",
    ["tw-m-prev", "tw-m-next"],
    "tw-m-arrow",
    "tw-m-hide-nav",
    "tw-m-hover-nav",
    "tw-m-show-nav",
    "tw-m-nav-padding",
  ];
  const [TWM_AP, TWM_APS] = ["tw-m-ap", ["tw-m-play", "tw-m-pause"]];

  // tw-s-gallery related pre-defined classes
  const [TWS_SLIDER, TWS_THUMB, TWS_FOCUS] = [
    "tw-s-slider",
    "tw-s-thumbnail",
    "tw-s-focus",
  ];

  const [TWS_NAV, TWS_NAVS, TWS_ARROW, TWS_NAV_HIDE] = [
    "tw-s-nav",
    ["tw-s-prev", "tw-s-next"],
    "tw-s-arrow",
    "tw-s-hide-nav",
  ];

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

    const DEF_TW_GALLERY = "tw-gallery";

    const DEF_DESCRIPTION_ARRAY = [];
    const DEF_DESCRIPTION_TYPE = "tw-m-white-desc";
    const DEF_DIRECTORY = "";
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
    const DEF_NAV = true;
    let DEF_NAV_HOVER = false;
    const DEF_NAV_ICONS = [
      `<i class="fas fa-chevron-left"></i>`,
      `<i class="fas fa-chevron-right"></i>`,
    ]; // [left, right]
    const DEF_S_GALLERY_ENABLE = true;
    const DEF_S_GALLERY_INSTANT = false;
    const DEF_S_GALLERY_DESK_TOUCH = true;
    const DEF_S_GALLERY_ARROWS = true;

    if (
      o.navigationEnable &&
      typeof o.navigationEnable === "boolean" &&
      o.navigationShowOnHover &&
      typeof o.navigationShowOnHover === "boolean"
    ) {
      DEF_NAV_HOVER = o.navigationShowOnHover;
    }

    return {
      TW_GALLERY: setOption("string", o.twGalleryClass, DEF_TW_GALLERY),
      imagesArray: o.imagesArray,
      descriptionArray: setOption(
        "array",
        o.descriptionArray,
        DEF_DESCRIPTION_ARRAY
      ),
      descriptionType:
        o.descriptionType === "black"
          ? "tw-m-black-desc"
          : DEF_DESCRIPTION_TYPE,
      directory: setOption("string", o.directory, DEF_DIRECTORY),
      startItem: setOption("number", o.startItem, DEF_START_ITEM),
      displayItems:
        setOption("number", o.displayItems, DEF_DISPLAY_ITEMS) % 2 == 0
          ? DEF_DISPLAY_ITEMS
          : setOption("number", o.displayItems, DEF_DISPLAY_ITEMS),
      navigation: {
        enable: setOption("boolean", o.navigationEnable, DEF_NAV),
        hover: DEF_NAV_HOVER,
        icons: setOption("array", o.navigationIcons, DEF_NAV_ICONS),
      },
      enableArrowKeys: setOption("boolean", o.enableArrowKeys, DEF_ARROW_KEYS),
      enableTouch: setOption("boolean", o.enableTouch, DEF_TOUCH),
      autoPlay: {
        enable: setOption("boolean", o.autoPlayEnable, DEF_AUTOPLAY_ENABLE),
        direction: setOption(
          "string",
          o.autoPlayDirection,
          DEF_AUTOPLAY_DIRECTION
        ),
        hoverPause: setOption(
          "boolean",
          o.autoPlayPauseOnHover,
          DEF_AUTOPLAY_PAUSE
        ),
        hoverPauseNotification: setOption(
          "boolean",
          o.autoPlayPauseNotification,
          DEF_AUTOPLAY_PAUSE_NOTIFICATION
        ),
        hoverPauseNotificationText: setOption(
          "string",
          o.autoPlayPauseNotificationText,
          DEF_AUTOPLAY_PAUSE_NOTIFICATION_TEXT
        ),
        timeout: setOption("number", o.autoPlayTimeout, DEF_AUTOPLAY_TIMEOUT),
      },
      sGallery: {
        enable: setOption("boolean", o.sGalleryEnable, DEF_S_GALLERY_ENABLE),
        instant: setOption("boolean", o.sGalleryInstant, DEF_S_GALLERY_INSTANT),
        desktopTouch: setOption(
          "boolean",
          o.sGalleryDesktopTouch,
          DEF_S_GALLERY_DESK_TOUCH
        ),
        navigationArrows: setOption(
          "boolean",
          o.sGalleryNavigationArrows,
          DEF_S_GALLERY_ARROWS
        ),
        navigationIcons: setOption(
          "array",
          o.sGalleryNavigationIcons,
          DEF_NAV_ICONS
        ),
      },
    };
  };

  this.init = (options) => {
    const arrayExists = this.verifyInput(options);

    if (!arrayExists) {
      return; // user failed to pass imagesArray
    }

    let twConf = this.setConfig(options);
    twConf = this.restructureImagesArray(twConf);

    const indexesToRender = this.generateMItems(
      twConf.startItem,
      twConf.displayItems
    );

    const twItemsPath = this.renderMGal(twConf);
    this.renderMItems(twConf, indexesToRender, twItemsPath);
    this.renderSGal(twConf);
    this.listeners(twConf);

    document.querySelector(`.${twConf.TW_GALLERY}`).classList.add(TW_LOADED);
  };

  this.restructureImagesArray = (o) => {
    const newImagesArray = [];
    const newDescArray = [];
    const imgArrLength = o.imagesArray.length;
    const descArrLength = o.descriptionArray.length;

    let midIndex = Math.floor(imgArrLength / 2);
    const originalMid = midIndex;

    let i = o.startItem;
    let fullyParsed = false;

    // Parse through array restructuring them the way that
    // o.startingItem always ends up in the middle of the array
    while (!fullyParsed) {
      newImagesArray[midIndex] = o.imagesArray[i];
      newDescArray[midIndex] =
        descArrLength !== 0 ? o.descriptionArray[i] : newDescArray;

      midIndex = midIndex + 1 > imgArrLength - 1 ? 0 : midIndex + 1;
      fullyParsed = midIndex === originalMid;
      i = i + 1 > imgArrLength - 1 ? 0 : i + 1;
    }

    o.imagesArray = newImagesArray;
    o.startItem = originalMid;
    o.descriptionArray =
      descArrLength !== 0 ? newDescArray : o.descriptionArray;

    return o;
  };

  /**
   * @param {Object} o                   App options that include user options.
   * @param {String} o.TW_GALLERY the class of the main gallery. Default: tw-gallery
   * @param {String[]} o.imagesArray     Array of images passed by the user.
   * @param {String[]} o.descriptionArray Array of descriptions passed by the user.
   * @param {String} o.descriptionType String that contains type and color of the description.
   * @param {String} o.directory         Directory where images are located.
   * @param {String} o.navigationType    Type of navigation to display: arrow, dots, arrow & dots.
   * @param {Boolean} o.navigation.hover  Hide/show navigation upon hovering the gallery.
   * @param {String[]} o.navigation.icons Array that contains HTML of the arrow icons.
   * @param {Number} o.startItem
   */
  this.renderMGal = (o) => {
    const twmGallery = document.querySelector(
      `.${o.TW_GALLERY} > .${TWM_GALLERY}`
    );

    let imgArrLength = o.imagesArray.length;
    const descArrLength = o.descriptionArray.length;
    const twmItems = document.createElement("div");
    twmItems.className = TWM_ITEMS;

    // Add tw-m-item inside tw-m-items
    for (let i = 0; i < imgArrLength; i++) {
      const twmItem = document.createElement("div");
      twmItem.classList.add(TWM_ITEM, TWM_ITEM_HIDDEN);

      const twmWrapper = document.createElement("div");
      twmWrapper.className = TWM_WRAPPER;

      const twmImage = document.createElement("img");
      twmImage.src = o.directory + o.imagesArray[i];
      twmImage.alt = descArrLength !== 0 ? o.descriptionArray[i] : "";
      twmImage.className = TWM_IMAGE;
      twmImage.dataset.twMId = i.toString();
      twmWrapper.appendChild(twmImage);

      if (o.descriptionArray.length !== 0) {
        const twmDesc = document.createElement("div");
        twmDesc.classList.add(TWM_DESC);
        twmDesc.classList.add(o.descriptionType);
        twmDesc.innerHTML = o.descriptionArray[i];
        twmWrapper.appendChild(twmDesc);
      }

      twmItem.appendChild(twmWrapper);
      twmItems.appendChild(twmItem);
    }

    twmGallery.appendChild(twmItems);

    // create prev and next arrows
    if (o.navigation.enable) {
      const twmNav = document.createElement("div");
      twmNav.className = TWM_NAV;

      for (let i = 0; i < TWM_NAVS.length; i++) {
        const twmNavBtn = document.createElement("div");
        twmNavBtn.classList.add(TWM_NAVS[i], TWM_ARROW, TW_ARROW_DIRECTION[i]);

        const twmNavPadding = document.createElement("span");
        twmNavPadding.className = TWM_PADDING;
        twmNavPadding.innerHTML = o.navigation.icons[i];

        twmNavBtn.append(twmNavPadding);
        twmNav.appendChild(twmNavBtn);
      }
      twmGallery.prepend(twmNav);
    }

    return `.${o.TW_GALLERY} > .${TWM_GALLERY} > .${TWM_ITEMS} > .${TWM_ITEM}`;
  };

  // Generates array of indexes where appropriate classes will go
  this.generateMItems = (startItem, displayItems) => {
    const generatedIndex = [];
    let noOfItems = -Math.floor(displayItems / 2);
    for (let i = 0; i < displayItems; i++) {
      let index;
      if (noOfItems < 0) {
        // all items on the left
        index = startItem - noOfItems * -1;
      } else if (noOfItems === 0) {
        // middle (main) item
        index = startItem;
      } else {
        // all items on the right
        index = startItem + noOfItems;
      }

      generatedIndex.push(index);
      noOfItems++;
    }
    return generatedIndex;
  };

  // Sets appropriate classes to appropriate index of
  // NodeList (tw-m-item) generated in the this.generateMItems function
  this.renderMItems = (o, indexesToSet, twmItemsPath) => {
    // Turns all the tw-m-item classes into hidden: tw-m-item tw-m-hidden
    const twmItems = document.querySelectorAll(twmItemsPath);

    twmItems.forEach((element) => {
      element.className = `${TWM_ITEM} ${TWM_ITEM_HIDDEN}`;
    });

    let midItemId;

    // Toggles hidden, and sets appropriate class to each item
    let classVal = -Math.floor(o.displayItems / 2);

    for (const index of indexesToSet) {
      for (let i = 0; i < twmItems.length; i++) {
        if (+i === +index) {
          twmItems[i].classList.toggle(TWM_ITEM_HIDDEN);
          if (classVal < 0) {
            twmItems[i].classList.add(`${TWM_LEFT}${classVal * -1}`);
          } else if (classVal === 0) {
            midItemId = twmItems[i].childNodes[0].childNodes[0].dataset.twMId;
            twmItems[i].classList.add(`${TWM_MID}`);
          } else {
            twmItems[i].classList.add(`${TWM_RIGHT}${classVal}`);
          }
          classVal++;
          break;
        }
      }
    }
    return midItemId;
  };

  this.renderSGal = (o) => {
    if (o.sGallery.enable) {
      const twsGallery = document.querySelector(
        `.${o.TW_GALLERY} > .${TWS_GALLERY}`
      );

      const twsSlider = document.createElement("div");
      twsSlider.className = TWS_SLIDER;
      let id = 0;
      for (const image of o.imagesArray) {
        const twsThumbnail = document.createElement("img");
        twsThumbnail.dataset.twSId = id.toString();
        twsThumbnail.className = TWS_THUMB;
        twsThumbnail.src = o.directory + image;
        twsSlider.appendChild(twsThumbnail);
        id++;
      }
      twsGallery.append(twsSlider);

      this.focusSGal(o, o.startItem);

      if (o.sGallery.navigationArrows) {
        const twsNav = document.createElement("div");
        twsNav.className = TWS_NAV;

        let i = 0;
        for (const arrow of TWS_NAVS) {
          const twSArrow = document.createElement("div");
          twSArrow.classList.add(arrow, TWS_ARROW, TW_ARROW_DIRECTION[i]);
          twSArrow.innerHTML = o.sGallery.navigationIcons[i];
          twsNav.append(twSArrow);
          i++;
        }

        twsGallery.prepend(twsNav);
      }
    }
  };

  this.focusSGal = (o, index) => {
    const sliderPath = `.${o.TW_GALLERY} > .${TWS_GALLERY} > .${TWS_SLIDER}`;
    const thumbPath = `${sliderPath} > .${TWS_THUMB}`;
    const thumbIndex = `${thumbPath}[data-tw-s-id="${index}"]`;

    const element = document.querySelector(thumbIndex);
    if (o.sGallery.enable && element) {
      const twsSlider = document.querySelector(sliderPath);

      const currFocusedImage = document.querySelector(
        `${thumbPath}.${TWS_FOCUS}`
      );

      if (currFocusedImage) {
        currFocusedImage.classList.remove(TWS_FOCUS);
      }

      element.classList.add(TWS_FOCUS);
      setTimeout(() => {
        const changedFocusedImageOffset =
          element.offsetLeft +
          element.offsetWidth / 2 -
          twsSlider.offsetWidth / 2;
        twsSlider.scrollTo({
          left: changedFocusedImageOffset - 10,
          behavior: "smooth",
        });
      }, 15);
    }
  };

  this.listeners = (o) => {
    const twmGalPath = `.${o.TW_GALLERY} > .${TWM_GALLERY}`;
    const twmGalApPath = `${twmGalPath} > .${TWM_AP}`;
    const twmArrowPath = `${twmGalPath} > .${TWM_NAV} > .${TWM_ARROW}`;
    const twmGalWrapperPath = `${twmGalPath} > .${TWM_ITEMS} > .${TWM_ITEM} > .${TWM_WRAPPER}`;
    const twmGalImgPath = `${twmGalWrapperPath} > .${TWM_IMAGE}`;
    const twmGalDescPath = `${twmGalWrapperPath} > .${TWM_DESC}`;
    const listenablePath = `${twmGalApPath}, ${twmGalImgPath}, ${twmGalDescPath}, ${twmArrowPath}`;

    // Enable action on the arrows
    const twmNav = document.querySelectorAll(twmArrowPath);

    const listenableElements = document.querySelectorAll(listenablePath);
    // additional user options
    this.eventMGalNavArrows(o);
    this.eventMGalAutoPlay(o, listenablePath);
    this.eventMGalArrowKeys(o);
    this.eventMGalTouch(o, listenableElements);
    this.eventMGalnavigationShowOnHover(o, listenableElements, twmNav);
    this.eventSGalClickTouch(o);
    this.eventSGalNavArrows(o);
  };

  this.eventMGalNavArrows = (o) => {
    if (o.navigation.enable) {
      const twmNavs = `.${o.TW_GALLERY} > .${TWM_GALLERY} > .${TWM_NAV}`;

      const prevBtn = document.querySelector(`${twmNavs} > .${TWM_NAVS[0]}`); // tw-m-prev
      const nextBtn = document.querySelector(`${twmNavs} > .${TWM_NAVS[1]}`); // tw-m-next

      prevBtn.addEventListener("click", this.prev.bind(null, o, true));
      nextBtn.addEventListener("click", this.next.bind(null, o, true));
    }
  };

  /**
   * @param {Object} o user options
   * @param {String} o.TW_GALLERY the class of the main gallery. Default: tw-gallery
   * @param {Boolean} o.autoPlay.enable user's choice true or false
   * @param {Number} o.autoPlay.timeout user's choice of timeout duration
   * @param {Boolean} o.autoPlay.hoverPause user's choice true or false to enable pause on hover
   * @param {Boolean} o.autoPlay.hoverPauseNotification true or false to display the pause notification
   * @param {String} o.autoPlay.hoverPauseNotificationText text to display upon pause
   * @param {String} listenablePath a string that contains the path to CSS listenable by pause
   * If this option is true, then the gallery will auto AUTOPLAY based on the
   * options selected.
   */
  this.eventMGalAutoPlay = (o, listenablePath) => {
    if (o.autoPlay.enable) {
      let isPaused = false;

      setInterval(() => {
        if (!isPaused) {
          switch (o.autoPlay.direction) {
            case "right":
              this.next(o, true);
              break;
            case "left":
              this.prev(o, true);
              break;
          }
        }
      }, o.autoPlay.timeout);

      if (o.autoPlay.hoverPause) {
        const twmGallery = document.querySelector(
          `.${o.TW_GALLERY} > .${TWM_GALLERY}`
        );

        let twmAP;
        if (o.autoPlay.hoverPauseNotification) {
          twmAP = document.createElement("div");
          twmAP.innerHTML = o.autoPlay.hoverPauseNotificationText;
          twmAP.className = `${TWM_AP} ${TWM_APS[0]}`;
          twmGallery.prepend(twmAP);
        }

        const eventListener = (items, event, paused) => {
          for (const item of items) {
            item.addEventListener(event, () => {
              if (o.autoPlay.hoverPauseNotification) {
                twmAP.classList.add(TWM_APS[1]);
                if (event === "mouseleave") {
                  twmAP.classList.remove(TWM_APS[1]);
                }
              }
              isPaused = paused;
            });
          }
        };

        const twsGalPath = `.${o.TW_GALLERY} > .${TWS_GALLERY}`;
        const autoplayableElement = document.querySelectorAll(
          `${listenablePath}, ${twsGalPath} > .${TWS_NAV}, ${twsGalPath} > .${TWS_SLIDER}`
        );

        eventListener(autoplayableElement, "mouseenter", true);
        eventListener(autoplayableElement, "mouseleave", false);
      }
    }
  };

  /**
   * @param {Object} o user options
   * @param {Boolean} o.enableArrowKeys user's choice true or false
   * If this option is true, then user can use left and right arrow keyboard keys
   * to trigger clicks on the next/prev buttons.
   */
  this.eventMGalArrowKeys = (o) => {
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

      const twmGallery = document.querySelector(
        `.${o.TW_GALLERY} > .${TWM_GALLERY}`
      );

      document.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft" && isInViewport(twmGallery)) {
          event.preventDefault();
          this.prev(o, true);
        }

        if (event.key === "ArrowRight" && isInViewport(twmGallery)) {
          event.preventDefault();
          this.next(o, true);
        }
      });
    }
  };

  /**
   * @param {Object} o user options
   * @param {Boolean} o.enableTouch user's choice true or false
   * @param {NodeListOf} pauseThese items that will listen for a pause event
   * If this option is true, then user can swipe right/left (both touch
   * and mouse events) to trigger clicks on the next/prev buttons.
   */
  this.eventMGalTouch = (o, pauseThese) => {
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
        let touchEndX;

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
              this.prev(o, true);
            } else {
              this.next(o, true);
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
   * @param {Boolean} o.navigation.hover user's choice true or false
   * @param {NodeListOf} pauseThese items that will listen for a hover event
   * @param {NodeListOf} twNav navigation buttons that will listen for a hover event
   * If this option is true, then navigation buttons are hidden by default
   * and are shown once user hovers/clicks (mouse/touch) over/on the image
   */
  this.eventMGalnavigationShowOnHover = (o, pauseThese, twNav) => {
    const setClass = o.navigation.hover ? TWM_NAV_HIDE : TWM_NAV_HOVER;

    for (const arrow of twNav) {
      arrow.classList.add(setClass);
    }

    if (o.navigation.hover) {
      const eventListener = (event, items, removeClass, addClass) => {
        for (const item of items) {
          item.addEventListener(event, () => {
            setOpacity(twNav, removeClass, addClass);
          });
        }
      };

      function setOpacity(items, removeClass, addClass) {
        for (const item of items) {
          item.classList.remove(removeClass);
          item.classList.add(addClass);
        }
      }

      eventListener("mouseenter", pauseThese, TWM_NAV_HIDE, TWM_NAV_SHOW);
      eventListener("mouseleave", pauseThese, TWM_NAV_SHOW, TWM_NAV_HIDE);
    }
  };

  this.eventSGalClickTouch = (o) => {
    const sliderPath = `.${o.TW_GALLERY} > .${TWS_GALLERY} > .${TWS_SLIDER}`;
    const twsSlider = document.querySelector(sliderPath);

    // Enable touch rotation on the desktop (mobile should would by default)
    let touchDuration = 0;
    if (o.sGallery.desktopTouch && o.sGallery.enable && twsSlider) {
      let mouseStart = 0;
      let touchStartTime;
      twsSlider.addEventListener("mousedown", (event) => {
        const date = new Date();
        touchStartTime = date.getTime();
        mouseStart = event.pageX;
        event.preventDefault();
        twsSlider.addEventListener("mousemove", mouseOverFunction);
      });

      document.addEventListener("mouseup", () => {
        const date = new Date();
        const touchEndTime = date.getTime();
        touchDuration = Math.abs(touchStartTime - touchEndTime);
        twsSlider.removeEventListener("mousemove", mouseOverFunction);
      });

      const mouseOverFunction = (event) => {
        const twSlider = document.querySelector(sliderPath);
        const scrollPos = twSlider.scrollLeft;
        const cursorPos = Math.floor((mouseStart - event.pageX) / 60);

        let scrollerDiff = scrollPos + cursorPos;
        twSlider.scrollTo({ left: scrollerDiff });
      };
    }

    // Clicking on the sGallery but listen for the clicks on the images only
    if (o.sGallery.enable && twsSlider) {
      twsSlider.addEventListener("click", (event) => {
        if (touchDuration > 120) {
          // do not execute the click if touch is triggered
          return;
        }

        const imgClicked = event.target;
        const imgClickedId = imgClicked.dataset.twSId;
        this.focusSGal(o, imgClickedId);
        const twmItemPath = `.${o.TW_GALLERY} > .${TWM_GALLERY} > .${TWM_ITEMS} > .${TWM_ITEM}`;
        const mMidItem = document.querySelector(`${twmItemPath}.${TWM_MID}`);
        const mMidIndex = mMidItem.firstChild.firstChild.dataset.twMId;

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

  this.eventSGalNavArrows = (o) => {
    if (o.sGallery.enable && o.sGallery.navigationArrows) {
      const slideSGal = (action) => {
        const sliderPath = `.${o.TW_GALLERY} > .${TWS_GALLERY} > .${TWS_SLIDER}`;
        const twSlider = document.querySelector(sliderPath);
        const twFocused = document.querySelector(
          `${sliderPath} > .${TWS_FOCUS}`
        );
        const focusedWidth = twFocused.offsetWidth;
        const scrollPos = twSlider.scrollLeft;
        const scrollerDiff =
          action === "prev"
            ? scrollPos - focusedWidth
            : scrollPos + focusedWidth;
        twSlider.scrollTo({ left: scrollerDiff, behavior: "smooth" });
      };

      const twsNavPath = `.${o.TW_GALLERY} > .${TWS_GALLERY} > .${TWS_NAV}`;
      const prevSBtn = document.querySelector(
        `${twsNavPath} > .${TWS_NAVS[0]}`
      );
      const nextSBtn = document.querySelector(
        `${twsNavPath} > .${TWS_NAVS[1]}`
      );

      prevSBtn.addEventListener("click", slideSGal.bind(null, "prev"));
      nextSBtn.addEventListener("click", slideSGal.bind(null, "next"));

      const twSlider = document.querySelector(`.${TWS_SLIDER}`);
      twSlider.addEventListener("scroll", () => {
        const maxSliderScroll = twSlider.scrollWidth - twSlider.clientWidth;
        const scrollPos = twSlider.scrollLeft;

        this.sGalToggleNavigation(
          scrollPos,
          maxSliderScroll,
          prevSBtn,
          nextSBtn
        );
      });
    }
  };

  this.sGalToggleNavigation = (
    scrollerDiff,
    maxSliderScroll,
    sPrevBtn,
    sNextBtn
  ) => {
    if (scrollerDiff <= 0) {
      sPrevBtn.classList.toggle(TWS_NAV_HIDE);
      return 0;
    } else if (scrollerDiff >= maxSliderScroll) {
      sNextBtn.classList.toggle(TWS_NAV_HIDE);
    } else {
      if (sNextBtn.classList.contains(TWS_NAV_HIDE)) {
        sNextBtn.classList.remove(TWS_NAV_HIDE);
      } else {
        sPrevBtn.classList.remove(TWS_NAV_HIDE);
      }
    }
  };

  this.prev = (o, isArrowClick = false) => {
    const itemsPath = `.${o.TW_GALLERY} > .${TWM_GALLERY} > .${TWM_ITEMS}`;
    const twConf = this.setConfig(o);
    const newIndexArray = this.generateMItems(o.startItem, o.displayItems);

    const twItemsPath = `${itemsPath} > .${TWM_ITEM}`;
    const twmItems = document.querySelectorAll(twItemsPath);
    const twLastItem = twmItems[twmItems.length - 1];

    // move the last item to the front of the NodeList
    document.querySelector(itemsPath).prepend(twLastItem);

    const midId = this.renderMItems(twConf, newIndexArray, twItemsPath);

    if (isArrowClick && o.sGallery.enable) {
      const sliderPath = `.${o.TW_GALLERY} > .${TWS_GALLERY} > .${TWS_SLIDER}`;
      const twThumbs = document.querySelectorAll(
        `${sliderPath} > .${TWS_THUMB}`
      );

      const twThumbLast = twThumbs[twmItems.length - 1];
      document.querySelector(sliderPath).prepend(twThumbLast);

      this.focusSGal(o, midId);
    }
  };

  this.next = (o, isArrowClick = false) => {
    const itemsPath = `.${o.TW_GALLERY} > .${TWM_GALLERY} > .${TWM_ITEMS}`;
    const twConf = this.setConfig(o);
    const newIndexArray = this.generateMItems(o.startItem, o.displayItems);

    const twItemsPath = `${itemsPath} > .${TWM_ITEM}`;
    const twItems = document.querySelectorAll(twItemsPath);
    const twFirstItem = twItems[0];

    // move the first item to the back of the list
    document.querySelector(itemsPath).appendChild(twFirstItem);

    const midId = this.renderMItems(twConf, newIndexArray, twItemsPath);

    if (isArrowClick && o.sGallery.enable) {
      const sliderPath = `.${o.TW_GALLERY} > .${TWS_GALLERY} > .${TWS_SLIDER}`;
      const twThumbs = document.querySelectorAll(
        `${sliderPath} > .${TWS_THUMB}`
      );
      const twThumbLast = twThumbs[0];
      document.querySelector(sliderPath).appendChild(twThumbLast);
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
twoWayGallery.init({
  twGalleryClass: "tw-gallery3",
  imagesArray: [
    "https://images.unsplash.com/photo-1553241880-0cdc914d1d88?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1268&q=80",
    "https://images.unsplash.com/photo-1561781565-3c2fcbf552cf?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    "https://images.unsplash.com/photo-1561781569-4f942d7bfa86?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    "https://images.unsplash.com/photo-1610872853577-98ffd151ff2b?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    "https://images.unsplash.com/photo-1590354501494-b2038be5b83d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    "https://images.unsplash.com/photo-1494626594498-792a9632e9a4?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    "https://images.unsplash.com/photo-1596312906091-281b15599021?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1268&q=80",
    "https://images.unsplash.com/photo-1529784237789-45cc21f5705b?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1351&q=80",
    "https://images.unsplash.com/photo-1605260082899-300f8867d39e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1491&q=80",
  ],
  descriptionArray: [
    "Fantastic view from the above.",
    "River view.",
    "City view during the day.",
    "Awesome looking church!",
    "Beautiful flower.",
    "Bench that you can sit on. :)",
    "Destroyed castle. :(",
    "City view during the night.",
    "Hotel in the desert...",
  ],
  descriptionType: "white",
  directory: "",
  startItem: 0,
  displayItems: 3,
  enableArrowKeys: true,
  enableTouch: true,
  autoPlayEnable: true,
  autoPlayDirection: "left",
  autoPlayPauseOnHover: true,
  autoPlayPauseNotification: true,
  autoPlayPauseNotificationText: `<i class="fa fa-pause" aria-hidden="true"></i>`,
  autoPlayTimeout: 3000,
  navigationEnable: true,
  navigationShowOnHover: true,
  // navigationIcons: [
  //   `<i class="fa fa-angle-left" aria-hidden="true"></i>`,
  //   `<i class="fa fa-angle-right" aria-hidden="true"></i>`,
  // ],
  sGalleryEnable: true,
  sGalleryInstant: false,
  sGalleryDesktopTouch: true,
  sGalleryNavigationArrows: true,
  // sGalleryNavigationIcons: [
  //   `<i class="fa fa-angle-left" aria-hidden="true"></i>`,
  //   `<i class="fa fa-angle-right" aria-hidden="true"></i>`,
  // ],
});

const twoWayGallery2 = new TwoWayGallery();
twoWayGallery2.init({
  twGalleryClass: "tw-gallery",
  imagesArray: [
    "https://images.unsplash.com/photo-1553241880-0cdc914d1d88?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1268&q=80",
    "https://images.unsplash.com/photo-1561781565-3c2fcbf552cf?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    "https://images.unsplash.com/photo-1561781569-4f942d7bfa86?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    "https://images.unsplash.com/photo-1561781565-3c2fcbf552cf?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    "https://images.unsplash.com/photo-1561781569-4f942d7bfa86?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    "https://images.unsplash.com/photo-1561781569-4f942d7bfa86?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    "https://images.unsplash.com/photo-1561781569-4f942d7bfa86?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    "https://images.unsplash.com/photo-1561781569-4f942d7bfa86?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  ],
  descriptionArray: [
    "Fantastic view from the above.",
    "River view.",
    "City view during the day.",
    "River view.",
    "City view during the day.",
    "City view during the day.",
    "City view during the day.",
    "City view during the day.",
  ],
  descriptionType: "black",
  displayItems: 7,
  navigationIcons: [
    `<i class="fa fa-angle-left" aria-hidden="true"></i>`,
    `<i class="fa fa-angle-right" aria-hidden="true"></i>`,
  ],
  sGalleryNavigationIcons: [
    `<i class="fa fa-angle-left" aria-hidden="true"></i>`,
    `<i class="fa fa-angle-right" aria-hidden="true"></i>`,
  ],
});
