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
  // Gallery related pre-defined classes that user can change later on
  const [TW_GALLERY, TW_ITEMS, TW_ITEM, TW_ITEM_HIDDEN, TW_IMAGE] = [
    "tw-gallery",
    "tw-items",
    "tw-item",
    "tw-hidden",
    "tw-image",
  ];

  // Item related pre-defined classes
  const [ITEM_LEFT, ITEM_MID, ITEM_RIGHT] = ["left-", "middle", "right-"];

  // Navigation related pre-defined classes that user can change later on
  const [TW_NAV, TW_NAVS, TW_ARROW] = [
    "tw-nav",
    ["tw-prev", "tw-next"],
    "tw-arrow",
  ];

  // Auto play related pre-defined classes that user can change later on
  const [TW_AP, TW_APS] = ["tw-ap", ["tw-play", "tw-pause"]];

  const twGallery = document.querySelector(`.${TW_GALLERY}`);
  // let twItems = [...document.querySelectorAll(`.${TW_GALLERY} .${TW_ITEM}`)];

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
    const DEF_ITEM_GALLERY = false;
    const DEF_ITEM_GALLERY_INSTANT = false;

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
      itemGallery: {
        enable: setOption("boolean", o.itemGallery.enable, DEF_ITEM_GALLERY),
        instant: setOption(
          "boolean",
          o.itemGallery.instant,
          DEF_ITEM_GALLERY_INSTANT
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
    let indexesToRender = this.generateItems(
      twConf.startItem,
      twConf.displayItems
    );

    let twItems = this.renderGallery(twConf);
    this.renderItems(twConf, indexesToRender, twItems);

    twGallery.classList.add("tw-loaded");
    this.listeners(twConf);
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
  this.renderGallery = (o) => {
    let arrLen = o.imagesArray.length;
    const itemsDiv = document.createElement("div");
    itemsDiv.className = TW_ITEMS;

    if (!twGallery.classList.contains("tw-loaded")) {
      // create a gallery on the first iteration
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

      twGallery.appendChild(itemsDiv);

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
        twGallery.appendChild(navDiv);
      } else {
        console.log("navigationType: dots selected");
        // navigation === dots
      }

      return document.querySelectorAll(
        `.${TW_GALLERY} > .${TW_ITEMS} > .${TW_ITEM}`
      );
    }
  };

  // Generates array of indexes where appropriate classes will go
  this.generateItems = (startItem, displayItems) => {
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
  // NodeList (tw-item) generated in the this.generateItems function
  this.renderItems = (o, indexesToSet, nodeItemsList) => {
    // Turns all the tw-item classes into hidden: tw-item tw-hidden
    nodeItemsList.forEach((element) => {
      element.className = `${TW_ITEM} ${TW_ITEM_HIDDEN}`;
    });

    // Toggles hidden, and sets appropriate class to each item
    let classVal = -Math.floor(o.displayItems / 2);
    for (const index of indexesToSet) {
      for (let i = 0; i < nodeItemsList.length; i++) {
        if (+i === +index) {
          nodeItemsList[i].classList.toggle(TW_ITEM_HIDDEN);
          if (classVal < 0) {
            nodeItemsList[i].classList.add(`${ITEM_LEFT}${classVal * -1}`);
          } else if (classVal === 0) {
            nodeItemsList[i].classList.add(`${ITEM_MID}`);
          } else {
            nodeItemsList[i].classList.add(`${ITEM_RIGHT}${classVal}`);
          }
          classVal++;
          break;
        }
      }
    }
  };

  this.listeners = (o) => {
    const prevBtn = document.querySelector(`.${TW_NAVS[0]}`); // tw-prev
    const nextBtn = document.querySelector(`.${TW_NAVS[1]}`); // tw-next

    prevBtn.addEventListener("click", this.prev.bind(null, o, true));
    nextBtn.addEventListener("click", this.next.bind(null, o, true));

    // Enable action on the arrows
    const twNav = document.querySelectorAll(
      `.${TW_GALLERY} > .${TW_NAV} > .${TW_ARROW}`
    );

    // Enable actions on the following items
    let pauseThese = document.querySelectorAll(
      `.${TW_AP}, .${TW_IMAGE}, .${TW_ARROW}`
    );

    // additional user options
    pauseThese = this.eventAutoPlay(o, pauseThese, prevBtn, nextBtn);
    this.eventNavigationHover(o, pauseThese, twNav);
    this.eventTouch(o, pauseThese, prevBtn, nextBtn);
    this.eventArrowKeys(o, prevBtn, nextBtn);
    this.renderItemGallery(o);
  };

  this.renderItemGallery = (o) => {
    if (o.itemGallery.enable) {
      const test2 = document.querySelector(".test2");

      // const activeMid = document.querySelector(".tw-item.middle");
      // const midIndex = activeMid.firstChild.dataset.itemId;
      // console.dir(midIndex);

      // const rotaGal = document.querySelectorAll(`.rota-gal[data-id="${[o.startItem]}"]`);
      // rotaGal[o.startItem].classList.add("focus");

      this.focusItemGallery(o, o.startItem);

      test2.addEventListener("click", (event) => {
        const imgClicked = event.target;
        const imgClickedId = imgClicked.dataset.id;

        if (imgClicked.classList.contains("rota-gal")) {
          // remove focus from old image
          const focusedImage = document.querySelector(".rota-gal.focus");
          focusedImage.classList.remove("focus");

          // add focus to the new image
          imgClicked.classList.add("focus");
        } else {
          return;
        }

        const midItem = document.querySelector(`.${TW_ITEM}.middle`);
        const midItemIndex = midItem.firstChild.dataset.itemId;
        console.dir(midItem);

        // const testArr = this.generateItems(myItem, o.displayItems);
        // console.log(testArr);
        // console.log(myItem);

        switch (true) {
          case midItemIndex > imgClickedId:
            console.log("prev");
            switch (true) {
              case o.itemGallery.instant:
                for (let i = midItemIndex; i > imgClickedId; i--) {
                  if (i !== imgClickedId) {
                    this.prev(o);
                  }
                }
                break;
              case !o.itemGallery.instant:
                const diff = midItemIndex - imgClickedId;
                let timesRun = 0;
                let interval = setInterval(() => {
                  timesRun++;
                  if (timesRun === diff) {
                    clearInterval(interval);
                  }
                  this.prev(o);
                }, 100);
                break;
            }
            break;
          case midItemIndex == imgClickedId:
            console.log("stop");
            break;
          case midItemIndex < imgClickedId:
            console.log("next");
            switch (true) {
              case o.itemGallery.instant:
                for (let i = midItemIndex; i < imgClickedId; i++) {
                  if (i !== imgClickedId) {
                    this.next(o, false);
                  }
                }
                break;
              case !o.itemGallery.instant:
                const diff = imgClickedId - midItemIndex;
                let timesRun = 0;
                let interval = setInterval(() => {
                  timesRun++;
                  if (timesRun === diff) {
                    clearInterval(interval);
                  }
                  this.next(o, false);
                }, 100);
                break;
            }
            break;
        }
      });

      // const testBtn1 = document.querySelector("#testBtn");
      // const testBtn2 = document.querySelector("#testBtn2");
      // const testBtn3 = document.querySelector("#testBtn3");
      //
      // const test = document.querySelector(".test2");
      // console.log("test");
      //
      // const testItem0 = document.querySelector("#jsTest0");
      // const testItem0off = testItem0.offsetLeft;
      // console.log(testItem0off);
      //
      // const testItem1 = document.querySelector("#jsTest1");
      // const testItem1off = testItem1.offsetLeft;
      // console.log(testItem1off);
      //
      // const testItem2 = document.querySelector("#jsTest2");
      // const testItem12off = testItem2.offsetLeft;
      // console.log(testItem12off);
      //
      // const diff = testItem0off - testItem12off;
      // console.log(diff);
      //
      // const diff2 = testItem1off - testItem0off;
      // console.log(diff2);
      //
      // test.addEventListener("click", (event) => {
      //   console.log(event);
      // });
      //
      // testBtn1.addEventListener("click", (event) => {
      //   console.log("clicked 1");
      //   test.scrollTo({ left: testItem12off, behavior: "smooth" });
      //   testItem2.classList.add("focus");
      // });
      //
      // testBtn2.addEventListener("click", (event) => {
      //   console.log("clicked 2");
      //   test.scrollTo({ left: diff, behavior: "smooth" });
      // });
      //
      // testBtn3.addEventListener("click", (event) => {
      //   console.log("clicked 2");
      //   test.scrollTo({ left: diff2, behavior: "smooth" });
      // });
    }
  };

  this.focusItemGallery = (o, index) => {
    const element = document.querySelector(`.rota-gal[data-id="${index}"]`);
    if (o.itemGallery.enable && element.classList.contains("rota-gal")) {
      const test2 = document.querySelector(".test2");

      const currFocusedImage = document.querySelector(".rota-gal.focus");
      if (currFocusedImage) {
        // const currFocusedImageOffset = currFocusedImage.offsetLeft;
        currFocusedImage.classList.remove("focus");
      }
      element.classList.add("focus");
      const changedFocusedImageOffset = element.offsetLeft;
      test2.scrollTo({
        left: changedFocusedImageOffset - 10,
        behavior: "smooth",
      });
    }
  };

  // The general formula is as following - you find your
  // element of interest, find its middle point (x + width / 2),
  //   then subtract half of container's width from that:

  // window.addEventListener("load", function(e) {
  //   var container = document.querySelector(".scroll_container");
  //   var middle = container.children[Math.floor((container.children.length - 1) / 2)];
  //   container.scrollLeft = middle.offsetLeft +
  //     middle.offsetWidth / 2 - container.offsetWidth / 2;
  // });

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
  this.eventAutoPlay = (o, pauseThese, prev, next) => {
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
          twGallery.prepend(pauseDiv);
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
  this.eventArrowKeys = (o, prev, next) => {
    if (o.enableArrowKeys) {
      document.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft" && isInViewport(twGallery)) {
          event.preventDefault();
          prev.click();
        }

        if (event.key === "ArrowRight" && isInViewport(twGallery)) {
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
  this.eventTouch = (o, pauseThese, prev, next) => {
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
  this.eventNavigationHover = (o, pauseThese, twNav) => {
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

  this.prev = (o, isArrowClick = false) => {
    const twConf = this.setConfig(o);

    let indexArray = this.generateItems(twConf.startItem, twConf.displayItems);
    const newIndexArray = []; // holds decremented indexes
    indexArray.forEach((element) => {
      newIndexArray.push(element - 1);
    });

    const twItems = document.querySelectorAll(
      `.${TW_GALLERY} > .${TW_ITEMS} > .${TW_ITEM}`
    );
    const twLastItem = twItems[twItems.length - 1];

    // move last item to the front of the NodeList
    document.querySelector(`.${TW_ITEMS}`).prepend(twLastItem);

    // if (isArrowClick) {
    //   const mid = indexes[Math.floor(indexes.length / 2)];
    //   this.focusItemGallery(o, mid);
    // }

    this.renderItems(twConf, newIndexArray, twItems);
  };

  this.next = (o, isArrowClick = false) => {
    const twConf = this.setConfig(o);

    let indexArray = this.generateItems(twConf.startItem, twConf.displayItems);
    const newIndexArray = []; // holds incremented indexes
    indexArray.forEach((element) => {
      newIndexArray.push(element + 1);
    });

    const twItems = document.querySelectorAll(
      `.${TW_GALLERY} > .${TW_ITEMS} > .${TW_ITEM}`
    );
    const twFirstItem = twItems[0];

    // move last item to the front of the NodeList
    document.querySelector(`.${TW_ITEMS}`).appendChild(twFirstItem);

    // if (isArrowClick) {
    //   const mid = indexes[Math.floor(indexes.length / 2)];
    //   this.focusItemGallery(o, mid);
    // }

    this.renderItems(twConf, newIndexArray, twItems);
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

function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
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
  enableArrowKeys: false,
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
  itemGallery: {
    enable: true,
    instant: false,
    arrows: true,
    touch: true,
  },
  // navigationIcons: [
  //   `<i class="fa fa-angle-left" aria-hidden="true"></i>`,
  //   `<i class="fa fa-angle-right" aria-hidden="true"></i>`,
  // ],
});
