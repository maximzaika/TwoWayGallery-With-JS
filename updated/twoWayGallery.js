import { MainGallery } from "./MainGallery.js";

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
