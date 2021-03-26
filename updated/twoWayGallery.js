class TwoWayGallery {
  TW_LOADED = "tw-loaded";

  constructor(options) {
    const TW_CLASS = "tw-gallery";
    const DIRECTORY = "";
    const DESC_ARR = [];
    const DESC_TYPE = "tw-m-white-desc";
    const START_INDEX = 0;
    const DISPLAY_ITEMS = 5;
    const NAV = true;
    const NAV_ICONS = [
      `<i class="fas fa-chevron-left"></i>`,
      `<i class="fas fa-chevron-right"></i>`,
    ]; // [left, right]
    let NAV_HOVER = false;

    this.TWConf = {
      imgArr: options.imagesArray,
      twGalClass: this._verifyDataType(
        "string",
        options.twGalleryClass,
        TW_CLASS
      ),
      directory: this._verifyDataType("string", options.directory, DIRECTORY),
      descArr: this._verifyDataType(
        "array",
        options.descriptionArray,
        DESC_ARR
      ),
      sIndex: this._verifyDataType("number", options.startItem, START_INDEX),
      displayItems:
        this._verifyDataType("number", options.displayItems, DISPLAY_ITEMS) %
          2 ==
        0
          ? DISPLAY_ITEMS
          : this._verifyDataType("number", options.displayItems, DISPLAY_ITEMS),
      navOn: this._verifyDataType("boolean", options.navigationEnable, NAV),
      navHover: this._verifyDataType(
        "boolean",
        options.navigationShowOnHover,
        NAV_HOVER
      ),
      navIcons: this._verifyDataType(
        "array",
        options.navigationIcons,
        NAV_ICONS
      ),
    };

    const TOUCH_ON = true;
    const AK_ON = false; // ArrowKeys_ON
    const AP_ON = false;
    const AP_TIMEOUT = 2000;
    const AP_DIRECT = "right";
    const AP_P = true; // AP_PAUSE
    const AP_P_NOTIF = true;
    const AP_P_NOTIF_TXT = "PAUSED";

    this.TWMConf = {
      arrowKeysOn: this._verifyDataType(
        "boolean",
        options.enableArrowKeys,
        AK_ON
      ),
    };

    this.TW_LOADED = "tw-loaded";
    this.TW_ARROW_DIRECTION = ["tw-left-arrow", "tw-right-arrow"];
    this.twGallery = document.querySelector(`.${this.TWConf.twGalClass}`);

    this.imgArrLen = this.TWConf.imgArr.length;
    this.descArrLen = this.TWConf.descArr.length;

    if (this.descArrLen !== 0) {
      this.TWConf.descType =
        options.descriptionType === "black" ? "tw-m-black-desc" : DESC_TYPE;
    }

    this._init();
  }

  _verifyDataType(dataType, userInput, defaultInput) {
    if (dataType === "array") {
      return Array.isArray(userInput) ? userInput : defaultInput;
    } else {
      // string, number, boolean
      return typeof userInput === dataType ? userInput : defaultInput;
    }
  }

  _verifyInput() {
    // Check whether the o.imagesArray has been passed
    if (!this.TWConf.imgArr) {
      throw new Error(
        "o.imagesArray is missing from the passing arguments. Stopping execution!"
      );
    }

    // Check whether the lengths of passed arrays are equal
    const arraysNotEqual =
      this.imgArrLen !== this.descArrLen && this.descArrLen !== 0;
    if (arraysNotEqual) {
      throw new Error(
        "this.restructureImagesArray: length of o.imagesArray is not equal to o.descriptionArray"
      );
    }
  }

  _restructureImgArr() {
    const newImgArr = [];
    const newDescArr = [];
    // Find the middle index of the passed array
    let midIndex = Math.floor(this.imgArrLen / 2);
    // store a copy of the original index
    const originalMid = midIndex;
    // store the copy of the index of the startItem
    let i = this.TWConf.sIndex;
    let fullyParsed = false;
    // Parse through array restructuring them the way that
    // o.startingItem always ends up in the middle of the array
    while (!fullyParsed) {
      newImgArr[midIndex] = this.TWConf.imgArr[i];
      newDescArr[midIndex] =
        this.descArrLen !== 0 ? this.TWConf.descArr[i] : [];
      // Check whether the midIndex is more than the length
      // if yes, then set index as 0 else increment it.
      midIndex = midIndex + 1 > this.imgArrLen - 1 ? 0 : midIndex + 1;
      // End parsing when original middle index is equal to new mid index
      // Happens when the value returns back to the middle.
      fullyParsed = midIndex === originalMid;
      // Check whether the i (o.startItem) is more than the length
      // if yes, then set index as 0 else increment it.
      i = i + 1 > this.imgArrLen - 1 ? 0 : i + 1;
    }

    // Properties of o (options) to be reassigned
    return [
      newImgArr,
      originalMid,
      this.TWConf.descArrLen !== 0 ? newDescArr : this.TWConf.descArr,
    ];
  }

  _init() {
    this._verifyInput();
    [
      this.TWConf.imgArr,
      this.TWConf.sIndex,
      this.TWConf.descArr,
    ] = this._restructureImgArr();
    // this.TWConf.itemsForDisplay = centerArray.itemsToBeDisplayed();

    new MainGallery(this.twGallery, false, this.TWConf);
  }
}

class MainGallery {
  constructor(twGalEl, loaded, conf) {
    const TWM_GALLERY = "tw-m-gallery";

    this.loaded = loaded;
    this.o = conf;

    this.twmGallery = document.querySelector(
      `.${this.o.twGalClass} > .${TWM_GALLERY}`
    );

    this.imgArrLen = this.o.imgArr.length;
    this.descArrLen = this.o.descArr.length;

    if (!this.loaded) {
      console.log("Initiating item render...");
      this._render();
    }
  }

  _render() {
    console.log("Rendering items...");
    const MGItem = new MainGalleryItem(this.o, this.loaded);
    const MGNav = new MainGalleryNav(this.o);
    // Create tw-m-items > tw-m-item (all items)
    const twmItems = MGItem.renderItems();
    this.twmGallery.appendChild(twmItems);
    // Create tw-m-nav (navigation)
    const twmNav = MGNav.renderNavs();
    if (twmNav !== 0) {
      this.twmGallery.prepend(twmNav);
    }
  }
}

class MainGalleryItem {
  constructor(conf, loaded) {
    this.TWM_ITEMS = "tw-m-items";
    this.TWM_ITEM = "tw-m-item";
    this.TWM_ITEM_HIDDEN = "tw-m-hidden";
    this.TWM_WRAPPER = "tw-m-wrapper";
    this.TWM_IMAGE = "tw-m-image";
    this.TWM_DESC = "tw-m-description";

    this.TWM_LEFT = "tw-m-left-";
    this.TWM_MID = "tw-m-mid";
    this.TWM_RIGHT = "tw-m-right-";

    this.o = conf;
    this.loaded = loaded;
  }

  renderItems() {
    // Create div.tw-m-items element
    const twmItems = document.createElement("div");
    twmItems.className = this.TWM_ITEMS;
    // Add tw-m-item inside tw-m-items
    for (let i = 0; i < this.o.imgArr.length; i++) {
      const twmItem = this._renderItem(i);
      twmItems.appendChild(twmItem);
    }
    // Set appropriate classes to each item
    this.setItemClass(twmItems, this.o.displayItems);
    return twmItems;
  }

  _renderItem(item) {
    const twmItem = this._createItem();
    const twmWrapper = this._createWrapper();
    const twmImage = this._createImage(item);
    const twmDesc = this._createDescription(item);
    twmWrapper.appendChild(twmImage);
    if (twmDesc !== 0) {
      twmWrapper.appendChild(twmDesc);
    }
    twmItem.appendChild(twmWrapper);
    return twmItem;
  }

  _createItem() {
    // Create div.tw-m-item.tw-m-hidden element
    const twmItem = document.createElement("div");
    twmItem.classList.add(this.TWM_ITEM, this.TWM_ITEM_HIDDEN);
    return twmItem;
  }

  _createWrapper() {
    // Create div.tw-m-wrapper element
    const twmWrapper = document.createElement("div");
    twmWrapper.className = this.TWM_WRAPPER;
    return twmWrapper;
  }

  _createImage(item) {
    // Create img.tw-m-image element with dataset tw-m-id and src of the image
    const twmImage = document.createElement("img");
    twmImage.src = this.o.directory + this.o.imgArr[item];
    twmImage.alt = this.descArrLen !== 0 ? this.o.descArr[item] : "";
    twmImage.className = this.TWM_IMAGE;
    twmImage.dataset.twMId = item.toString();
    return twmImage;
  }

  _createDescription(item) {
    if (this.o.descArr === 0) {
      return 0;
    }

    // Create div.tw-m-description.tw-m-white/tw-m-black element
    const twmDesc = document.createElement("div");
    twmDesc.classList.add(this.TWM_DESC, this.o.descriptionType);
    twmDesc.innerHTML = this.o.descArr[item];
    return twmDesc;
  }

  // renderMItems
  setItemClass(itemEl, displayItems) {
    const items = itemEl.children;
    // Turns all the tw-m-item classes into hidden: tw-m-item tw-m-hidden
    // only when prev/next buttons are clicked
    if (this.loaded) {
      console.log("Hiding items...");
      items.children.forEach((element) => {
        element.className = `${this.TWM_ITEM} ${this.TWM_ITEM_HIDDEN}`;
      });
    }

    // Variable that will store the index of the middle item
    let midItemId;
    // Detects how many displayItems need to be shown
    let classVal = -Math.floor(displayItems / 2);

    // Get the center item of the displayItems.
    // If -2, then need to generate left-2, left-1, middle, right-1, right-2 classes
    // If -1, then need to generate left-1, middle, right-1 classes
    for (let i = displayItems - 1; i > -1; i--) {
      let index;
      let setClass;

      if (classVal < 0) {
        // left items
        index = this.o.sIndex - classVal * -1;
        setClass = `${this.TWM_LEFT}${classVal * -1}`;
      } else if (classVal === 0) {
        // middle (main) item
        index = this.o.sIndex;
        midItemId = items[index].childNodes[0].childNodes[0].dataset.twMId;
        setClass = `${this.TWM_MID}`;
      } else {
        // right items
        index = this.o.sIndex + classVal;
        setClass = `${this.TWM_RIGHT}${classVal}`;
      }

      items[index].classList.toggle(this.TWM_ITEM_HIDDEN);
      items[index].classList.add(setClass);

      classVal++;
    }

    // Returns the new middle index. Used later to set the focus in the secondary gallery
    return midItemId;
  }
}

class MainGalleryNav {
  constructor(conf) {
    this.TWM_NAV = "tw-m-nav";
    this.TWM_NAVS = ["tw-m-prev", "tw-m-next"];
    this.TWM_ARROW = "tw-m-arrow";
    this.TWM_NAV_HIDE = "tw-m-hide-nav";
    this.TWM_NAV_HOVER = "tw-m-hover-nav";
    this.TWM_NAV_SHOW = "tw-m-show-nav";
    this.TWM_PADDING = "tw-m-nav-padding";
    this.TW_ARROW_DIRECTION = ["tw-left-arrow", "tw-right-arrow"];

    this.o = conf;
  }

  renderNavs() {
    if (!this.o.navOn) {
      return 0;
    }

    // Create div.tw-m-nav element
    const twmNav = document.createElement("div");
    twmNav.className = this.TWM_NAV;
    // Create navigations (left and right)
    for (let i = 0; i < this.TWM_NAVS.length; i++) {
      const twmNavBtn = this._createNav(i);
      twmNav.appendChild(twmNavBtn);
    }

    return twmNav;
  }

  _createNav(arrow) {
    // Create div.tw-m-prev/tw-m-next.tw-m-prev.tw-left-arrow/tw-right-arrow element
    const twmNavBtn = document.createElement("div");
    twmNavBtn.classList.add(
      this.TWM_NAVS[arrow],
      this.TWM_ARROW,
      this.TW_ARROW_DIRECTION[arrow]
    );
    // Create span.tw-m-padding element
    const twmNavPadding = document.createElement("span");
    twmNavPadding.className = this.TWM_PADDING;
    twmNavPadding.innerHTML = this.o.navIcons[arrow];

    twmNavBtn.append(twmNavPadding);
    return twmNavBtn;
  }
}

new TwoWayGallery({
  imagesArray: [
    "Different-types-of-descriptions.png",
    "Easy-to-setup.png",
    "Free.png",
    "Many-options-available.png",
    "Supports-lots-of-images.png",
    "Toggleable-descriptions.png",
    "Two-galleries-in-one.png",
  ],
  descriptionArray: [
    "Supports different styles of descriptions",
    "Stress free setup",
    `Available in the MIT license`,
    "Large variety of options available",
    "Memory and bandwidth are the limits",
    "Descriptions can be disabled or enabled whenever necessary",
    "Secondary gallery allows the user to scroll through images quickly",
  ],
  directory: "../demo/img/",
});
