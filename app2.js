let firstInitTwoWayGallery = true;

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
  const TW_ITEM = "tw-item";
  const TW_ITEM_HIDDEN = "tw-hidden";
  const TW_IMAGE = "tw-image";

  const TW_NAV = ["tw-prev", "tw-next"];

  const ITEM_LEFT = "left-";
  const ITEM_MID = "middle";
  const ITEM_RIGHT = "right-";

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
      console.log("CONF: o.navigationHover is Boolean");
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

  this.setIndexArray = (startItem, displayItems, secondInit = null) => {
    const finalIndexArray = [];
    if (secondInit) {
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
        secondInit.forEach((element, i) => {
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

  this.init = (options) => {
    console.log("Initiating TwoWayGallery...");
    const arrayExists = this.verifyInput(options);

    if (!arrayExists) {
      return;
    }

    const twConf = this.setConfig(options);
    let arrLen = twConf.imagesArray.length - 1;
    let indexArray = this.setIndexArray(twConf.startItem, twConf.displayItems);

    for (let index of indexArray) {
      if (index < 0 && firstInitTwoWayGallery) {
        indexArray = this.prev(twConf);
        firstInitTwoWayGallery = false;
        console.log("this.prev output:");
        console.log(indexArray);
        break;
      }

      if (index >= arrLen && firstInitTwoWayGallery) {
        indexArray = this.next(twConf);
        firstInitTwoWayGallery = false;
        console.log("this.next output:");
        console.log(indexArray);
        break;
      }
    }

    // this.render(twConf, indexArray);
    this.initialRender(twConf);
    this.setIndexes(twConf, indexArray);
    this.listeners(twConf);
  };

  this.initialRender = (o) => {
    const galleryDiv = document.querySelector(`.${TW_GALLERY}`);

    let items = [...document.querySelectorAll(`.${TW_GALLERY} .${TW_ITEM}`)];
    let arrLen = o.imagesArray.length - 1;

    if (items.length === 0) {
      // create a gallery on the first iteration
      for (let i = 0; i < arrLen; i++) {
        const itemDiv = document.createElement("div");
        itemDiv.classList.add(TW_ITEM, TW_ITEM_HIDDEN);

        const itemImg = document.createElement("img");
        itemImg.src = o.directory + o.imagesArray[i];
        itemImg.className = TW_IMAGE;

        galleryDiv.appendChild(itemDiv);
        itemDiv.appendChild(itemImg);
      }

      // create prev and next arrows
      if (o.navigationType.includes("arrows")) {
        const navDiv = document.createElement("div");
        navDiv.className = "tw-nav";

        if (o.navigationHover) {
          navDiv.classList.add("tw-show");
          console.log("navigationHover: tw-show");
        }

        for (let i = 0; i < TW_NAV.length; i++) {
          const buttonDiv = document.createElement("div");
          buttonDiv.id = TW_NAV[i];
          buttonDiv.classList.add("tw-arrow");

          if (!o.navigationHover) {
            buttonDiv.classList.add("tw-hover");
            console.log("navigationHover: tw-hover");
          }

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
        galleryDiv.appendChild(navDiv);
      } else {
        // navigation === dots
      }
    }
  };

  this.setIndexes = (o, indexesToBeModified) => {
    items = [...document.querySelectorAll(`.${TW_GALLERY} .${TW_ITEM}`)];
    if (items.length > 0) {
      // set gallery to contain right classes in the hidden state
      for (const index of items) {
        index.className = `${TW_ITEM} ${TW_ITEM_HIDDEN}`;
      }
    }

    let nextItem = -Math.floor(o.displayItems / 2);
    for (const index of indexesToBeModified) {
      for (const i in items) {
        if (i == index) {
          items[i].classList.toggle(TW_ITEM_HIDDEN);
          if (nextItem < 0) {
            items[i].classList.add(`${ITEM_LEFT}${nextItem * -1}`);
          } else if (nextItem === 0) {
            items[i].classList.add(`${ITEM_MID}`);
          } else {
            items[i].classList.add(`${ITEM_RIGHT}${nextItem}`);
          }
          nextItem++;
          break;
        }
      }
    }
  };

  this.listeners = (o) => {
    const leftBtnClick = document.getElementById(TW_NAV[0]); // tw-prev
    const rightBtnClick = document.getElementById(TW_NAV[1]); // tw-next
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
      let touchStartX = 0;
      let touchStartTime;
      const expectedTouchDistance = 40;

      const touchStart = (event) => {
        // event.preventDefault();
        const date = new Date();
        touchStartTime = date.getTime();
        touchStartX = event.touches[0].pageX;
      };

      const touchEnd = (event) => {
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

      twGallery.addEventListener("touchstart", (event) => {
        if (event.target.id === "tw-prev" || event.target.id === "tw-next") {
          event.stopPropagation();
        } else {
          touchStart(event);
        }
      });

      twGallery.addEventListener("touchend", (event) => {
        if (event.target.id === "tw-prev" || event.target.id === "tw-next") {
          event.stopPropagation();
        } else {
          touchEnd(event);
        }
      });
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
    console.log("this.prev: Initiating...");
    const twConf = this.setConfig(o);
    let indexArray = this.setIndexArray(twConf.startItem, twConf.displayItems);
    if (!firstInitTwoWayGallery) {
      const items = document.querySelectorAll(`.${TW_ITEM}`);
      indexArray = this.setIndexArray(null, twConf.displayItems, items);
    }

    let arrLen = twConf.imagesArray.length - 1;
    let indexes = [];

    let prev = 1;
    let negativeArray = [];
    for (let i = 0; i < indexArray.length; i++) {
      let point = indexArray[i];

      if (!firstInitTwoWayGallery) {
        point--;
      }

      if (point < 0) {
        point = arrLen - prev;
        negativeArray.push(point);

        if (!firstInitTwoWayGallery) {
          indexes.push(point);
        }

        prev++;
      } else {
        indexes.push(point);
      }
    }

    if (firstInitTwoWayGallery) {
      return [...negativeArray.reverse(), ...indexes];
    } else {
      this.render(twConf, indexes);
    }
  };

  this.next = (o) => {
    console.log("this.next: Initiating...");
    const twConf = this.setConfig(o);
    let indexArray = this.setIndexArray(twConf.startItem, twConf.displayItems);

    if (!firstInitTwoWayGallery) {
      const items = document.querySelectorAll(`.${TW_ITEM}`);
      indexArray = this.setIndexArray(null, twConf.displayItems, items);
    }

    let arrLen = twConf.imagesArray.length - 1;
    let indexes = [];

    let beginning = 0;
    let positiveArray = [];
    for (let i = indexArray.length - 1; i >= 0; i--) {
      let point = indexArray[i];

      if (!firstInitTwoWayGallery) {
        point++;
      }

      if (point > arrLen - 1) {
        positiveArray.push(beginning);

        if (!firstInitTwoWayGallery) {
          indexes.push(beginning);
        }

        beginning++;
      } else {
        indexes.push(point);
      }
    }

    if (firstInitTwoWayGallery) {
      return [...indexes.reverse(), ...positiveArray];
    } else {
      this.render(twConf, indexes.reverse());
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
twoWayGallery.init({
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
    delay: 5000,
  },
  navigationType: "arrows & dots",
  navigationHover: true,
  // navigationIcons: [
  //   `<i class="fa fa-angle-left" aria-hidden="true"></i>`,
  //   `<i class="fa fa-angle-right" aria-hidden="true"></i>`,
  // ],
});
