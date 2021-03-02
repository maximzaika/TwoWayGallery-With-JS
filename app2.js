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

  const TW_NAV = ["tw-prev", "tw-next"];

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
    const DEF_ROTATE_ENABLE = false;
    const DEF_ROTATE_DELAY = 2000;
    const DEF_ROTATE_PAUSE = true;
    const DEF_ROTATE_DIRECTION = "right";
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
      autoRotate: {
        enable: setOption("boolean", o.autoRotate.enable, DEF_ROTATE_ENABLE),
        direction: setOption(
          "string",
          o.autoRotate.direction,
          DEF_ROTATE_DIRECTION
        ),
        cursorPause: setOption(
          "boolean",
          o.autoRotate.cursorPause,
          DEF_ROTATE_PAUSE
        ),
        delay: setOption("number", o.autoRotate.delay, DEF_ROTATE_DELAY),
      },
    };
  };

  this.setIndexArray = (startItem, displayItems) => {
    const twGallery = document.querySelector(`.${TW_GALLERY}`);

    // if (twGallery.classList.contains("tw-loaded")) {
    //   const twItems = document.querySelectorAll(`.${TW_ITEM}`);
    //   indexArray = this.setIndexArray(null, twConf.displayItems, twItems);
    // }

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
    let arrLen = o.imagesArray.length - 1;
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
        navDiv.className = "tw-nav";

        for (let i = 0; i < TW_NAV.length; i++) {
          const buttonDiv = document.createElement("div");
          // buttonDiv.id = TW_NAV[i];
          buttonDiv.classList.add(TW_NAV[i], "tw-arrow");

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
        console.log("navigationtype: dots selected");
        // navigation === dots
      }
    }
  };

  /**
   * @param {Object} o                   user options
   * @param {Boolean} o.navigationHover  user's choice true or false
   * If this option is true, then navigation buttons are hidden by default
   * and are shown once user hovers/clicks (mouse/touch) over/on the image
   */
  this.setNavigationHover = (o) => {
    function setEventListener(el, ev, items, removeItem, addItem) {
      el.addEventListener(ev, () => {
        setOpacity(items, removeItem, addItem);
      });
    }

    function setOpacity(items, removeItem, addItem) {
      for (const item of items) {
        item.classList.remove(removeItem);
        item.classList.add(addItem);
      }
    }

    const arrows = document.querySelectorAll(
      `.${TW_GALLERY} > .tw-nav .tw-arrow`
    );
    const setClass = o.navigationHover ? "tw-hide" : "tw-hover";

    for (const arrow of arrows) {
      arrow.classList.add(setClass);
    }

    if (o.navigationHover) {
      const images = document.querySelectorAll(
        `.${TW_GALLERY} > .${TW_ITEMS} > .${TW_ITEM} > .${TW_IMAGE}`
      );

      for (const image of images) {
        setEventListener(image, "mouseenter", arrows, "tw-hide", "tw-show");
        setEventListener(image, "mouseleave", arrows, "tw-show", "tw-hide");
      }

      for (const arrow of arrows) {
        setEventListener(arrow, "mouseenter", arrows, "tw-hide", "tw-show");
        setEventListener(arrow, "mouseleave", arrows, "tw-show", "tw-hide");
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
    this.setNavigationHover(o);

    const leftBtnClick = document.querySelector(`.${TW_NAV[0]}`); // tw-prev
    const rightBtnClick = document.querySelector(`.${TW_NAV[1]}`); // tw-next
    const twGallery = document.querySelector(`.${TW_GALLERY}`);

    leftBtnClick.addEventListener("click", this.prev.bind(null, o));
    rightBtnClick.addEventListener("click", this.next.bind(null, o));

    if (o.enableArrowKeys) {
      document.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft" && isInViewport(twGallery)) {
          event.preventDefault();
          leftBtnClick.click();
        }

        if (event.key === "ArrowRight" && isInViewport(twGallery)) {
          event.preventDefault();
          rightBtnClick.click();
        }
      });
    }

    if (o.enableTouch) {
      const touchEventListeners = (items) => {
        let [touchStartX, touchStartTime] = [0, 0];
        const expectedTouchDistance = 40;

        for (const item of items) {
          item.addEventListener("touchstart", (event) => {
            [touchStartX, touchStartTime] = touchStart(event);
          });

          item.addEventListener("touchend", (event) => {
            touchEnd(event, touchStartX, touchStartTime, expectedTouchDistance);
          });
        }
      };

      const touchStart = (event) => {
        const date = new Date();
        const touchStartTime = date.getTime();
        const touchStartX = event.touches[0].pageX;
        return [touchStartX, touchStartTime];
      };

      const touchEnd = (
        event,
        touchStartX,
        touchStartTime,
        expectedTouchDistance
      ) => {
        const touchEndX = event.changedTouches[0].pageX;
        const date = new Date();
        const touchEndTime = date.getTime();
        const touchDuration = Math.abs(touchStartTime - touchEndTime);
        const touchDiffX = Math.abs(touchStartX - touchEndX);

        if (touchDuration < 1500) {
          if (touchDiffX > expectedTouchDistance) {
            if (touchEndX > touchStartX) {
              leftBtnClick.click();
            } else {
              rightBtnClick.click();
            }
          }
        }
      };

      // Enable touch on the images
      const twItemImages = document.querySelectorAll(
        `.${TW_GALLERY} > .${TW_ITEMS} > .${TW_ITEM} > .${TW_IMAGE}`
      );

      // Enable touch on the arrows
      const twNav = document.querySelectorAll(
        `.${TW_GALLERY} > .tw-nav > .tw-arrow`
      );

      touchEventListeners(twItemImages);
      touchEventListeners(twNav);
    }

    if (o.autoRotate.enable) {
      let isPaused = false;
      setInterval(() => {
        if (!isPaused) {
          switch (o.autoRotate.direction) {
            case "right":
              rightBtnClick.click();
              break;
            case "left":
              leftBtnClick.click();
              break;
          }
        }
      }, o.autoRotate.delay);

      if (o.autoRotate.cursorPause) {
        twGallery.addEventListener("mouseenter", () => {
          isPaused = true;
        });

        twGallery.addEventListener("mouseleave", () => {
          isPaused = false;
        });
      }
    }

    // let mouseStartX = 0;
    //
    // twGallery.addEventListener("mousedown" || "touchmove", (event) => {
    //   console.log(event);
    //
    //   event.preventDefault();
    //   mouseStartX = event.pageX;
    // });
    //
    // twGallery.addEventListener("mouseup", (event) => {
    //   event.preventDefault();
    //   const diffX = Math.abs(event.pageX - mouseStartX);
    //   console.log(`event.pageX: ${event.pageX} -- mouseStartX: ${mouseStartX}`);
    //   if (event.pageX > mouseStartX && diffX > 150) {
    //     // scroll left
    //     leftBtnClick.click();
    //   }
    //   if (event.pageX < mouseStartX && diffX > 150) {
    //     // scroll right
    //     rightBtnClick.click();
    //   }
    // });
  };

  this.prev = (o) => {
    const twConf = this.setConfig(o);
    let arrLen = twConf.imagesArray.length - 1;

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
    let arrLen = twConf.imagesArray.length - 1;

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
  displayItems: 7,
  enableArrowKeys: true,
  enableTouch: true,
  autoRotate: {
    enable: false,
    direction: "right",
    cursorPause: true,
    // cursorPauseNotification: true,
    delay: 5000,
  },
  // navigationType: "arrows",
  navigationHover: true,
  // navigationIcons: [
  //   `<i class="fa fa-angle-left" aria-hidden="true"></i>`,
  //   `<i class="fa fa-angle-right" aria-hidden="true"></i>`,
  // ],
});
