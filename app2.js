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
  const TW_GALLERY = "tw-gallery";
  const TW_ITEMS = "tw-items";
  const TW_ITEM = "tw-item";
  const TW_ITEM_HIDDEN = "tw-hidden";
  const TW_IMAGE = "tw-image";

  const TW_NAV = "tw-nav";
  const TW_NAVS = ["tw-prev", "tw-next"];
  const TW_ARROW = "tw-arrow";

  const TW_AP = "tw-ap";
  const TW_APS = ["tw-play", "tw-pause"];

  const ITEM_LEFT = "left-";
  const ITEM_MID = "middle";
  const ITEM_RIGHT = "right-";

  const twGallery = document.querySelector(`.${TW_GALLERY}`);
  let twItems = [...document.querySelectorAll(`.${TW_GALLERY} .${TW_ITEM}`)];

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
    };
  };

  this.setIndexArray = (startItem, displayItems) => {
    const twGallery = document.querySelector(`.${TW_GALLERY}`);

    const finalIndexArray = [];
    if (twGallery.classList.contains("tw-loaded")) {
      const twItems = document.querySelectorAll(`.${TW_ITEM}`);

      let items = [
        `${ITEM_LEFT}3`,
        `${ITEM_LEFT}2`,
        `${ITEM_LEFT}1`,
        `${ITEM_MID}`,
        `${ITEM_RIGHT}1`,
        `${ITEM_RIGHT}2`,
        `${ITEM_RIGHT}3`,
      ];
      for (const item of items) {
        twItems.forEach((element, i) => {
          if (element.classList.contains(item)) {
            finalIndexArray.push(i);
          }
        });
      }

      return finalIndexArray;
    } else {
      let nextItem = -Math.floor(displayItems / 2);
      for (let i = 0; i < displayItems; i++) {
        if (nextItem < 0) {
          finalIndexArray.push(startItem - nextItem * -1);
        } else if (nextItem === 0) {
          finalIndexArray.push(startItem);
        } else {
          finalIndexArray.push(startItem + nextItem);
        }
        nextItem++;
      }
      return finalIndexArray;
    }
  };

  this.twoWayGallery = (options) => {
    console.log("twoWayGallery: Initiating TwoWayGallery...");
    const arrayExists = this.verifyInput(options);
    const firstInitTW = !twGallery.classList.contains("tw-loaded");

    if (!arrayExists) {
      // user failed to pass items
      return;
    }

    const twConf = this.setConfig(options);
    let arrLen = twConf.imagesArray.length - 1;
    let indexArray = this.setIndexArray(twConf.startItem, twConf.displayItems);

    for (let index of indexArray) {
      if (index < 0 && firstInitTW) {
        indexArray = this.prev(twConf);
        break;
      }

      if (index >= arrLen && firstInitTW) {
        indexArray = this.next(twConf);
        break;
      }
    }

    this.initialRender(twConf);
    this.setIndexes(twConf, indexArray);

    if (firstInitTW) {
      twGallery.classList.add("tw-loaded");
      this.listeners(twConf);
    }
  };

  /**
   * @param {Object} o                   App options that include user options.
   * @param {String[]} o.imagesArray     Array of images passed by the user.
   * @param {String} o.directory         Directory where images are located.
   * @param {String} o.navigationType    Type of navigation to display: arrow, dots, arrow & dots.
   * @param {Boolean} o.navigationHover  Hide/show navigation upon hovering the gallery.
   * @param {String[]} o.navigationIcons Array that contains HTML of the arrow icons.
   */
  this.initialRender = (o) => {
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

        itemDiv.appendChild(itemImg);
        itemsDiv.appendChild(itemDiv);
      }

      twGallery.appendChild(itemsDiv);

      twItems = [...document.querySelectorAll(`.${TW_GALLERY} .${TW_ITEM}`)];

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
    }
  };

  this.setIndexes = (o, indexesToBeModified) => {
    // Resets the tw-item list making them all hidden
    for (const index of twItems) {
      index.className = `${TW_ITEM} ${TW_ITEM_HIDDEN}`;
    }

    // Toggles hidden, and sets appropriate class to each item
    let nextItem = -Math.floor(o.displayItems / 2);
    for (const index of indexesToBeModified) {
      for (const i in twItems) {
        if (i == index) {
          twItems[i].classList.toggle(TW_ITEM_HIDDEN);
          if (nextItem < 0) {
            twItems[i].classList.add(`${ITEM_LEFT}${nextItem * -1}`);
          } else if (nextItem === 0) {
            twItems[i].classList.add(`${ITEM_MID}`);
          } else {
            twItems[i].classList.add(`${ITEM_RIGHT}${nextItem}`);
          }
          nextItem++;
          break;
        }
      }
    }
  };

  this.listeners = (o) => {
    const test2 = document.querySelector(".test2");

    test2.addEventListener("click", (event) => {
      const rotaGal = document.querySelectorAll(".rota-gal");

      const myItemOrig = event.target;
      const myItem = event.target.dataset.id;

      for (const item of rotaGal) {
        item.classList.remove("focus");
      }

      myItemOrig.classList.add("focus");

      const testArr = this.setIndexArray(myItem, o.displayItems);
      // console.log(testArr);
      // console.log(myItem);

      if (testArr[2] > myItem) {
        // let no = true;
        // for (let i = testArr[2]; i > myItem; i--) {
        //   // console.log("prev: " + i);
        //   if (i !== myItem) {
        //     console.log("no " + no);
        //     this.prev(o);
        //   }
        // }

        const diff = testArr[2] - myItem;
        let timesRun = 0;
        let interval = setInterval(() => {
          timesRun++;
          if (timesRun === diff) {
            clearInterval(interval);
          }
          this.prev(o);
        }, 100);
      } else {
        // for (let i = testArr[2]; i < myItem; i++) {
        //   console.log("next: " + i);
        //   if (i !== myItem) {
        //     this.next(o);
        //   }
        // }
        const diff = myItem - testArr[2];
        let timesRun = 0;
        let interval = setInterval(() => {
          timesRun++;
          if (timesRun === diff) {
            clearInterval(interval);
          }
          this.next(o);
        }, 100);
      }

      // console.log(o);
      // console.dir(event.target.dataset.id);
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

    const prevBtn = document.querySelector(`.${TW_NAVS[0]}`); // tw-prev
    const nextBtn = document.querySelector(`.${TW_NAVS[1]}`); // tw-next

    prevBtn.addEventListener("click", this.prev.bind(null, o));
    nextBtn.addEventListener("click", this.next.bind(null, o));

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

  this.prev = (o) => {
    const twConf = this.setConfig(o);
    let arrLen = twConf.imagesArray.length;

    const firstInitTW = !twGallery.classList.contains("tw-loaded");
    let indexArray = this.setIndexArray(twConf.startItem, twConf.displayItems);

    let prev = 1;
    const indexes = [];
    const negativeArray = [];
    for (let i = 0; i < indexArray.length; i++) {
      let point = indexArray[i];

      if (!firstInitTW) {
        point--;
      }

      if (point < 0) {
        point = arrLen - prev;
        negativeArray.push(point);

        if (!firstInitTW) {
          indexes.push(point);
        }

        prev++;
      } else {
        indexes.push(point);
      }
    }

    if (firstInitTW) {
      return [...negativeArray.reverse(), ...indexes];
    }

    this.setIndexes(twConf, indexes);
  };

  this.next = (o) => {
    const twConf = this.setConfig(o);
    let arrLen = twConf.imagesArray.length;
    console.log(arrLen);

    const firstInitTW = !twGallery.classList.contains("tw-loaded");
    let indexArray = this.setIndexArray(twConf.startItem, twConf.displayItems);

    let beginning = 0;
    const indexes = [];
    const positiveArray = [];
    for (let i = indexArray.length - 1; i >= 0; i--) {
      let point = indexArray[i];

      if (!firstInitTW) {
        point++;
      }

      if (point > arrLen - 1) {
        positiveArray.push(beginning);

        if (!firstInitTW) {
          indexes.push(beginning);
        }

        beginning++;
      } else {
        indexes.push(point);
      }
    }

    if (firstInitTW) {
      return [...indexes.reverse(), ...positiveArray];
    }

    this.setIndexes(twConf, indexes.reverse());
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
  enableArrowKeys: true,
  enableTouch: true,
  autoPlay: {
    enable: false,
    direction: "right",
    hoverPause: true,
    hoverPauseNotification: true,
    hoverPauseNotificationText: "PAUSED",
    timeout: 10000,
  },
  navigationType: "arrows",
  navigationHover: false,
  // navigationIcons: [
  //   `<i class="fa fa-angle-left" aria-hidden="true"></i>`,
  //   `<i class="fa fa-angle-right" aria-hidden="true"></i>`,
  // ],
});
