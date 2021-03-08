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
      o.navigation.enable &&
      typeof o.navigation.enable === "boolean" &&
      o.navigation.hover &&
      typeof o.navigation.hover === "boolean"
    ) {
      DEF_NAV_HOVER = o.navigation.hover;
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
      navigation: {
        enable: setOption("boolean", o.navigation.enable, DEF_NAV),
        hover: DEF_NAV_HOVER,
        icons: setOption("array", o.navigation.icons, DEF_NAV_ICONS),
      },

      // setOption("boolean", o.navigationArrows, DEF_NAV),
      // navigationHover: DEF_NAV_HOVER,
      // navigationIcons: setOption("array", o.navigationIcons, DEF_NAV_ICONS),
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
        navigationArrows: setOption(
          "boolean",
          o.sGallery.navigationArrows,
          DEF_S_GALLERY_ARROWS
        ),
        navigationIcons: setOption(
          "array",
          o.sGallery.navigationIcons,
          DEF_NAV_ICONS
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
    this.renderSGal(twConf);
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
   * @param {Boolean} o.navigation.hover  Hide/show navigation upon hovering the gallery.
   * @param {String[]} o.navigation.icons Array that contains HTML of the arrow icons.
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
    if (o.navigation.enable) {
      const twNav = document.createElement("div");
      twNav.className = TW_NAV;

      for (let i = 0; i < TW_NAVS.length; i++) {
        const twMNav = document.createElement("div");
        // buttonDiv.id = TW_NAVS[i];
        twMNav.classList.add(TW_NAVS[i], TW_ARROW);

        const paddingSpan = document.createElement("span");
        paddingSpan.className = "tw-padding";

        if (i < 1) {
          twMNav.classList.add("tw-left");
        } else {
          twMNav.classList.add("tw-right");
        }

        paddingSpan.innerHTML = o.navigation.icons[i];
        twMNav.append(paddingSpan);
        twNav.appendChild(twMNav);
      }
      twMGallery.prepend(twNav);
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

      if (o.sGallery.navigationArrows) {
        const twSNav = document.createElement("div");
        twSNav.className = "tw-s-nav";

        const twSArrows = [
          ["tw-s-prev", "tw-left"],
          ["tw-s-next", "tw-right"],
        ];
        let i = 0;
        for (const arrow of twSArrows) {
          const twSArrow = document.createElement("div");
          twSArrow.classList.add(arrow[0], "tw-s-arrow", arrow[1]);
          twSArrow.innerHTML = o.sGallery.navigationIcons[i];
          twSNav.append(twSArrow);
          i++;
        }

        twSGallery.prepend(twSNav);
      }
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

  this.listeners = (o) => {
    // Enable action on the arrows
    const twNav = document.querySelectorAll(
      `.${TW_M_GALLERY} > .${TW_NAV} > .${TW_ARROW}`
    );

    // additional user options
    this.eventMGalNavArrows(o);
    this.eventMGalAutoPlay(o);
    const pauseThese = document.querySelectorAll(
      `.${TW_AP}, .${TW_IMAGE}, .${TW_ARROW}`
    );
    this.eventMGalArrowKeys(o);
    this.eventMGalTouch(o, pauseThese);
    this.eventMGalNavigationHover(o, pauseThese, twNav);
    this.eventSGalClickTouch(o);
    this.eventSGalNavArrows(o);
  };

  this.eventMGalNavArrows = (o) => {
    if (o.navigation.enable) {
      const prevBtn = document.querySelector(`.${TW_NAVS[0]}`); // tw-prev
      const nextBtn = document.querySelector(`.${TW_NAVS[1]}`); // tw-next

      prevBtn.addEventListener("click", this.prev.bind(null, o, true));
      nextBtn.addEventListener("click", this.next.bind(null, o, true));
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
   * If this option is true, then the gallery will auto AUTOPLAY based on the
   * options selected.
   */
  this.eventMGalAutoPlay = (o) => {
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

        const pauseThese = document.querySelectorAll(
          `.${TW_AP}, .${TW_IMAGE}, .${TW_ARROW}, .tw-s-nav, .tw-slider`
        );

        eventListener(pauseThese, "mouseenter", true);
        eventListener(pauseThese, "mouseleave", false);
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

      document.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft" && isInViewport(twMGallery)) {
          event.preventDefault();
          this.prev(o, true);
        }

        if (event.key === "ArrowRight" && isInViewport(twMGallery)) {
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
  this.eventMGalNavigationHover = (o, pauseThese, twNav) => {
    const setClass = o.navigation.hover ? "tw-hide" : "tw-hover";

    for (const arrow of twNav) {
      arrow.classList.add(setClass);
    }

    if (o.navigation.hover) {
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
        const cursorPos = Math.floor((mouseStart - event.pageX) / 60);

        let scrollerDiff = scrollPos + cursorPos;
        twSlider.scrollTo({ left: scrollerDiff });
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

  this.eventSGalNavArrows = (o) => {
    if (o.sGallery.enable && o.sGallery.navigationArrows) {
      const slideSGal = (action) => {
        const twSlider = document.querySelector(`.${TW_SLIDER}`);
        const twFocused = document.querySelector(`.${TW_FOCUS}`);
        const focusedWidth = twFocused.offsetWidth;
        const scrollPos = twSlider.scrollLeft;
        let scrollerDiff;

        if (action === "prev") {
          scrollerDiff = scrollPos - focusedWidth;
        } else {
          scrollerDiff = scrollPos + focusedWidth;
        }

        twSlider.scrollTo({ left: scrollerDiff, behavior: "smooth" });
      };

      const prevSBtn = document.querySelector(`.tw-s-prev`);
      const nextSBtn = document.querySelector(`.tw-s-next`);

      prevSBtn.addEventListener("click", slideSGal.bind(null, "prev"));
      nextSBtn.addEventListener("click", slideSGal.bind(null, "next"));

      const twSlider = document.querySelector(`.${TW_SLIDER}`);
      twSlider.addEventListener("scroll", () => {
        const maxSliderScroll = twSlider.scrollWidth - twSlider.clientWidth;
        const scrollPos = twSlider.scrollLeft;

        this.sGalToggleNavigation(scrollPos, maxSliderScroll);
      });
    }
  };

  this.sGalToggleNavigation = (scrollerDiff, maxSliderScroll) => {
    const sPrevBtn = document.querySelector(".tw-s-prev");
    const sNextBtn = document.querySelector(".tw-s-next");

    if (scrollerDiff <= 0) {
      sPrevBtn.classList.toggle("tw-invisible");
      return 0;
    } else if (scrollerDiff >= maxSliderScroll) {
      sNextBtn.classList.toggle("tw-invisible");
    } else {
      if (sNextBtn.classList.contains("tw-invisible")) {
        sNextBtn.classList.remove("tw-invisible");
      } else {
        sPrevBtn.classList.remove("tw-invisible");
      }
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
  descriptionArray: [],
  directory: "",
  startItem: 0,
  displayItems: 5,
  enableArrowKeys: true,
  enableTouch: true,
  autoPlay: {
    enable: false,
    direction: "left",
    hoverPause: true,
    hoverPauseNotification: true,
    hoverPauseNotificationText: `<i class="fa fa-pause" aria-hidden="true"></i>`,
    timeout: 3000,
  },
  navigation: {
    enable: true,
    hover: true,
    // icons: [
    //   `<i class="fa fa-angle-left" aria-hidden="true"></i>`,
    //   `<i class="fa fa-angle-right" aria-hidden="true"></i>`,
    // ],
  },
  sGallery: {
    enable: true,
    instant: false,
    desktopTouch: true,
    navigationArrows: true,
    // navigationIcons: [
    //   `<i class="fa fa-angle-left" aria-hidden="true"></i>`,
    //   `<i class="fa fa-angle-right" aria-hidden="true"></i>`,
    // ],
  },
});
