/* MIT License

  Copyright (c) 2021 Maxim Zaika

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.

  Original Github repository: https://maximzaika.github.io/TwoWayGallery/
*/

function TwoWayGallery() {
  // Classes related to the tw-gallery
  const [TWM_GALLERY, TWS_GALLERY, TW_LOADED] = [
    "tw-m-gallery",
    "tw-s-gallery",
    "tw-loaded",
  ];

  // Classes related to navigation buttons that assign custom css to each arrow
  const TW_ARROW_DIRECTION = ["tw-left-arrow", "tw-right-arrow"];

  // Classes related to tw-m-gallery
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

  // Classes related to tw-s-gallery
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

  /**
   * @description Initialises the rendering of the TwoWayGallery
   * @pre-condition Option imagesArray cannot be [] (empty)
   * @post-condition Initiates all the options and renders both main and secondary galleries.
   * @param {Object} options Options that user can pass to the gallery.
   * @param {String[]} options.imagesArray Contains the list of images to be displayed.
   Directory can be included. Example: ["image.jpg", "img/image2.jpg"]
   * @param {String} options.twGalleryClass Used for renaming gallery. Also can be used to include
   more than one gallery on the same page. Example: "tw-gallery2"
   * @param {String} options.directory A directory where your images in the imagesArray are located.
   Slash needs to be included. Example: "img/".
   * @param {String[]} options.descriptionArray Contains the list of descriptions to be displayed. It's length must be
   the same as imagesArray. Example: ["This is image.jpg",
   "This is image img/image2.jpg"]
   * @param {String} options.descriptionType The way the description is attached to the image. "White" has white
   *   background
   that overwrites image borders and the black font, while "black" has black
   semi-transparent background and white font within image borders.
   * @param {Number} options.startItem The index of the image that needs to be displayed first (in the middle of the
   *   Main
   Gallery and focused in the Secondary Gallery).
   * @param {Number} options.displayItems The number of items to be displayed in the Main Gallery in the Desktop view.
   Examples: 3 = 1 left, middle, and 1 right. 5 = 2 left, middle, and 2 right.
   7 = 3 left, middle, and 3 right.
   * @param {Boolean} options.enableArrowKeys If true, use of arrow keys to control the Main Gallery, whenever it is in
   view, is enabled.
   * @param {Boolean} options.enableTouch If true, swipe gesture to control the Main Gallery, is enabled.
   * @param {Boolean} options.autoPlayEnable If true, the gallery will automatically scroll based on default
   autoPlayTimeout, autoPlayDirection, autoPlayPauseOnHover,
   autoPlayPauseNotification, and autoPlayPauseNotificationText options.
   * @param {Number} options.autoPlayTimeout The timeout before it triggers auto scrolling in milliseconds (ms).
   * @param {String} options.autoPlayDirection The direction that gallery needs to be scrolled to.
   * @param {Boolean} options.autoPlayPauseOnHover If true, hover over event on any element (both Main and Secondary),
   pauses auto scrolling instantly.
   * @param {Boolean} options.autoPlayPauseNotification If true, the notification over the gallery is displayed when
   it is paused.
   * @param {String} options.autoPlayPauseNotificationText The text that is displayed inside the
   *   autoPlayPauseNotification.
   Another great example to display pause icon instead of the default
   text: "<i class='fa fa-pause' aria-hidden='true'></i>". Note: to
   use this example, default font awesome icons that are included
   in the Usage part must be passed to your page.
   * @param {Boolean} options.navigationEnable If true, navigation arrows in the main gallery are displayed on each
   *   side
   (left and right).
   * @param {Boolean} options.navigationShowOnHover If true, navigation is hidden by default and is displayed on hover
   *   over
   the main gallery. If false, navigation is hidden by default but hovering
   over the arrows enlarges them.
   * @param {String[]} options.navigationIcons An array that contains ["left", "right"] arrow icons of the Main
   *   Gallery.
   Text or any other icons in the same format as default can be passed.
   * @param {Boolean} options.sGalleryEnable If true and markup with the class tw-s-gallery is included, then the
   *   Secondary
   Gallery is displayed. If false then the class tw-s-gallery can be excluded from
   the markup.
   * @param {Boolean} options.sGalleryInstant If true, clicks on the images inside the Secondary Gallery instantly
   *   display
   the image in the Main Gallery. If false, clicks on the images force Main
   Gallery scroll to the required image one by one showing the animation.
   * @param {Boolean} options.sGalleryDesktopTouch If true, the touch and scroll on the Secondary Image is enabled in
   *   the
   Desktop view. Note: this cannot be disabled in the mobile view.
   * @param {Boolean} options.sGalleryNavigationArrows If true, navigation arrows in the Secondary Gallery are
   *   displayed on
   hover. Note: if this and sGalleryDesktopTouch options are false,
   then it will not be possible to scroll in the Secondary Gallery.
   * @param {String[]} options.sGalleryNavigationIcons An array that contains ["left", "right"] arrow icons of the
   Secondary Gallery. Text or any other icons in the same format
   as default can be passed.
   */
  this.init = (options) => {
    // Check whether user has included options.imagesArray
    const arrayExists = this.verifyInput(options);
    if (!arrayExists) {
      return;
    }
    // Set the settings required for the gallery to render
    let twConf = this.setConfig(options);
    // Restructure the array to ensure that the o.startItem is always in the middle
    twConf = this.restructureImagesArray(twConf);
    // Generate indexes that required to be configured (sets as middle, left, right, or inactive)
    const indexesToRender = this.generateMItems(
      twConf.startItem,
      twConf.displayItems
    );
    // Initiate the render of the main gallery and its navigation (excluding items)
    const twItemsPath = this.renderMGal(twConf);
    // Initiate the render of the items in the main gallery (set as middle, left, right, or inactive)
    this.renderMItems(twConf, indexesToRender, twItemsPath);
    // Initiate the render of the secondary gallery and its navigation
    this.renderSGal(twConf);
    // Initiate all the listeners based on default/user's options
    this.listeners(twConf);
    // Once it is fully loaded, add 'tw-loaded' class
    document.querySelector(`.${twConf.TW_GALLERY}`).classList.add(TW_LOADED);
  };

  /**
   * @description Initialises the rendering of the TwoWayGallery
   * @pre-condition Must be called by this.init (upon initialisation)
   * @post-condition Returns all the options (either users or default)
   * @param {Object} o Receives all the options passed by the twConfig
   */
  this.setConfig = (o) => {
    /**
     * @description checks whether the option is of the appropriate type, if not then sets it to default
     * @param {String} dataType a type of data expected
     * @param {Object} userInput any datatype of user's input
     * @param {Object} defaultInput any datatype of default input
     * @pre-condition the dataType needs to be assigned
     * @post-condition returns user's input if it is matching the dataType, otherwise returns default input.
     */
    function setOption(dataType, userInput, defaultInput) {
      if (dataType === "array") {
        return Array.isArray(userInput) ? userInput : defaultInput;
      } else {
        // string, number, boolean
        return typeof userInput === dataType ? userInput : defaultInput;
      }
    }

    // Default preassigned options
    const TW_GALLERY_CLASS = "tw-gallery";
    const DESCRIPTIONS = [];
    const DESCRIPTION_TYPE = "tw-m-white-desc";
    const DIRECTORY = "";
    const START_ITEM = 0;
    const DISPLAY_ITEMS = 5;
    const ARROW_KEYS = false;
    const TOUCH_ENABLE = true;
    const AP_ENABLE = false;
    const AP_TIMEOUT = 2000;
    const AP_PAUSE = true;
    const AP_PAUSE_NOTIF = true;
    const AP_PAUSE_NOTIF_TEXT = "PAUSED";
    const AP_DIRECTION = "right";
    const NAVIGATION = true;
    let NAVIGATION_HOVER = false;
    const NAVIGATION_ICONS = [
      `<i class="fas fa-chevron-left"></i>`,
      `<i class="fas fa-chevron-right"></i>`,
    ]; // [left, right]
    const S_GAL_ENABLE = true;
    const S_GAL_INSTANT = false;
    const S_GAL_MOUSE_DRAG = true;
    const S_GAL_NAVIGATION = true;

    return {
      TW_GALLERY: setOption("string", o.twGalleryClass, TW_GALLERY_CLASS),
      imagesArray: o.imagesArray,
      descriptionArray: setOption("array", o.descriptionArray, DESCRIPTIONS),
      descriptionType:
        o.descriptionType === "black" ? "tw-m-black-desc" : DESCRIPTION_TYPE,
      directory: setOption("string", o.directory, DIRECTORY),
      startItem: setOption("number", o.startItem, START_ITEM),
      displayItems:
        setOption("number", o.displayItems, DISPLAY_ITEMS) % 2 == 0
          ? DISPLAY_ITEMS
          : setOption("number", o.displayItems, DISPLAY_ITEMS),
      navigation: {
        enable: setOption("boolean", o.navigationEnable, NAVIGATION),
        // hover: NAVIGATION_HOVER,
        hover: setOption("boolean", o.navigationShowOnHover, NAVIGATION_HOVER),
        icons: setOption("array", o.navigationIcons, NAVIGATION_ICONS),
      },
      enableArrowKeys: setOption("boolean", o.enableArrowKeys, ARROW_KEYS),
      enableTouch: setOption("boolean", o.enableTouch, TOUCH_ENABLE),
      autoPlay: {
        enable: setOption("boolean", o.autoPlayEnable, AP_ENABLE),
        direction: setOption("string", o.autoPlayDirection, AP_DIRECTION),
        hoverPause: setOption("boolean", o.autoPlayPauseOnHover, AP_PAUSE),
        hoverPauseNotification: setOption(
          "boolean",
          o.autoPlayPauseNotification,
          AP_PAUSE_NOTIF
        ),
        hoverPauseNotificationText: setOption(
          "string",
          o.autoPlayPauseNotificationText,
          AP_PAUSE_NOTIF_TEXT
        ),
        timeout: setOption("number", o.autoPlayTimeout, AP_TIMEOUT),
      },
      sGallery: {
        enable: setOption("boolean", o.sGalleryEnable, S_GAL_ENABLE),
        instant: setOption("boolean", o.sGalleryInstant, S_GAL_INSTANT),
        desktopTouch: setOption(
          "boolean",
          o.sGalleryDesktopTouch,
          S_GAL_MOUSE_DRAG
        ),
        navigationArrows: setOption(
          "boolean",
          o.sGalleryNavigationArrows,
          S_GAL_NAVIGATION
        ),
        navigationIcons: setOption(
          "array",
          o.sGalleryNavigationIcons,
          NAVIGATION_ICONS
        ),
      },
    };
  };

  /**
   * @description Restructures the array of images to ensure that the
                  middle item is always in the middle.
   * @pre-condition Must be called by this.init (upon initialisation).
                    Length of o.descriptionArray must be equal to o.imagesArray.
   * @post-condition Returns options that include newly generate arrays
   * @param {Object} o Options based on twConf
   */
  this.restructureImagesArray = (o) => {
    const newImagesArray = [];
    const newDescArray = [];
    const imgArrLength = o.imagesArray.length;
    const descArrLength = o.descriptionArray.length;
    // Check whether the lengths of passed arrays are equal
    try {
      const notAllowed = imgArrLength !== descArrLength && descArrLength !== 0;
      if (notAllowed) {
        throw new Error(
          "this.restructureImagesArray: length of o.imagesArray is not equal to o.descriptionArray"
        );
      }
    } catch (error) {
      console.log(error);
    }
    // Find the middle index of the passed array
    let midIndex = Math.floor(imgArrLength / 2);
    // store a copy of the original index
    const originalMid = midIndex;
    // store the copy of the index of the startItem
    let i = o.startItem;
    let fullyParsed = false;
    // Parse through array restructuring them the way that
    // o.startingItem always ends up in the middle of the array
    while (!fullyParsed) {
      newImagesArray[midIndex] = o.imagesArray[i];
      newDescArray[midIndex] =
        descArrLength !== 0 ? o.descriptionArray[i] : newDescArray;
      // Check whether the midIndex is more than the length
      // if yes, then set index as 0 else increment it.
      midIndex = midIndex + 1 > imgArrLength - 1 ? 0 : midIndex + 1;
      // End parsing when original middle index is equal to new mid index
      // Happens when the value returns back to the middle.
      fullyParsed = midIndex === originalMid;
      // Check whether the i (o.startItem) is more than the length
      // if yes, then set index as 0 else increment it.
      i = i + 1 > imgArrLength - 1 ? 0 : i + 1;
    }
    // Reassign the following properties of the o (options)
    o.imagesArray = newImagesArray;
    o.startItem = originalMid;
    o.descriptionArray =
      descArrLength !== 0 ? newDescArray : o.descriptionArray;
    return o;
  };

  /**
   * @description renders the Main Gallery based on default or user's options. (tw-m-gallery class)
   * @pre-condition Must be called by this.init (upon initialisation).
                    html needs to be included to ensure that it is rendering correctly
   * @post-condition generate NodeList of items with the class tw-m-items where images and descriptions are stored
   * @return NodeList items (tw-m-items)
   * @param {Object} o Options based on twConf
   */
  this.renderMGal = (o) => {
    // Path to tw-m-gallery.
    const twmGallery = document.querySelector(
      `.${o.TW_GALLERY} > .${TWM_GALLERY}`
    );
    // Reusable lengths of the arrays
    const imgArrLength = o.imagesArray.length;
    const descArrLength = o.descriptionArray.length;
    // Create div.tw-m-items element
    const twmItems = document.createElement("div");
    twmItems.className = TWM_ITEMS;

    // Add tw-m-item inside tw-m-items
    for (let i = 0; i < imgArrLength; i++) {
      // Create div.tw-m-item.tw-m-hidden element
      const twmItem = document.createElement("div");
      twmItem.classList.add(TWM_ITEM, TWM_ITEM_HIDDEN);
      // Create div.tw-m-wrapper element
      const twmWrapper = document.createElement("div");
      twmWrapper.className = TWM_WRAPPER;
      // Create img.tw-m-image element with dataset tw-m-id and src of the image
      const twmImage = document.createElement("img");
      twmImage.src = o.directory + o.imagesArray[i];
      twmImage.alt = descArrLength !== 0 ? o.descriptionArray[i] : "";
      twmImage.className = TWM_IMAGE;
      twmImage.dataset.twMId = i.toString();
      twmWrapper.appendChild(twmImage);
      // Initiate if descriptionArray exists
      if (o.descriptionArray.length !== 0) {
        // Create div.tw-m-description.tw-m-white/tw-m-black element
        const twmDesc = document.createElement("div");
        twmDesc.classList.add(TWM_DESC, o.descriptionType);
        twmDesc.innerHTML = o.descriptionArray[i];
        twmWrapper.appendChild(twmDesc);
      }
      twmItem.appendChild(twmWrapper);
      twmItems.appendChild(twmItem);
    }
    twmGallery.appendChild(twmItems);

    // Initiate if navigation is enabled (enabled by Default)
    if (o.navigation.enable) {
      // Create div.tw-m-nav element
      const twmNav = document.createElement("div");
      twmNav.className = TWM_NAV;
      // Create navigations (left and right)
      for (let i = 0; i < TWM_NAVS.length; i++) {
        // Create div.tw-m-prev/tw-m-next.tw-m-prev.tw-left-arrow/tw-right-arrow element
        const twmNavBtn = document.createElement("div");
        twmNavBtn.classList.add(TWM_NAVS[i], TWM_ARROW, TW_ARROW_DIRECTION[i]);
        // Create span.tw-m-padding element
        const twmNavPadding = document.createElement("span");
        twmNavPadding.className = TWM_PADDING;
        twmNavPadding.innerHTML = o.navigation.icons[i];

        twmNavBtn.append(twmNavPadding);
        twmNav.appendChild(twmNavBtn);
      }
      twmGallery.prepend(twmNav);
    }
    // Return the NodeList of tw-m-items
    return `.${o.TW_GALLERY} > .${TWM_GALLERY} > .${TWM_ITEMS} > .${TWM_ITEM}`;
  };

  /**
   * @pre-condition Must be called by this.init (upon initialisation).
                    Gallery must be fully rendered to ensure its initialisation.
   * @post-condition Generates array of indexes where appropriate classes will go
   * @return array of indexes where appropriate classes will go
   * @param {Number} startItem Starting index of an image. Comes from o.startItem
   * @param {Number} displayItems Number of items to display (3, 5, 7) Comes from o.displayItems
   */
  this.generateMItems = (startItem, displayItems) => {
    const generatedIndex = [];
    // Get the center item of the displayItems.
    // If -2, then need to generate left-2, left-1, middle, right-1, right-2 classes
    // If -1, then need to generate left-1, middle, right-1 classes
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

  /**
   * @pre-condition Must be called by this.init (upon initialisation).
                    Gallery must be fully rendered to ensure its initialisation.
   * @post-condition Sets appropriate classes to appropriate index of NodeList (tw-m-item) generated
                     in the this.generateMItems function. Assigns the appropriate class:
                     left-1, middle, right-1
   * @return midItemId - the new index of the mid item
   * @param {Object} o Options based on twConf
   * @param {Number[]} indexesToSet Array that contains the indexes of the array that need to be changed
   * @param {String} twmItemsPath The string that contains the path to the tw-m-items
   */
  this.renderMItems = (o, indexesToSet, twmItemsPath) => {
    const twmItems = document.querySelectorAll(twmItemsPath);
    // Turns all the tw-m-item classes into hidden: tw-m-item tw-m-hidden
    twmItems.forEach((element) => {
      element.className = `${TWM_ITEM} ${TWM_ITEM_HIDDEN}`;
    });
    // Variable that will store the index of the middle item
    let midItemId;
    // Detects how many displayItems need to be shown
    let classVal = -Math.floor(o.displayItems / 2);
    // Toggles hidden, and sets appropriate class to each item
    for (const index of indexesToSet) {
      for (let i = 0; i < twmItems.length; i++) {
        if (+i === +index) {
          // If index is found, then remove tw-m-hidden class from it
          twmItems[i].classList.toggle(TWM_ITEM_HIDDEN);
          if (classVal < 0) {
            // Sets tw-left-3, tw-left-2, tw-left-1 class
            twmItems[i].classList.add(`${TWM_LEFT}${classVal * -1}`);
          } else if (classVal === 0) {
            // Identifies the index of the middle item
            // Sets tw-mid class
            midItemId = twmItems[i].childNodes[0].childNodes[0].dataset.twMId;
            twmItems[i].classList.add(`${TWM_MID}`);
          } else {
            // Sets tw-right-1, tw-right-2, tw-right-3 class
            twmItems[i].classList.add(`${TWM_RIGHT}${classVal}`);
          }
          classVal++;
          break;
        }
      }
    }
    // Returns the new middle index. Used later to set the focus in the secondary gallery
    return midItemId;
  };

  /**
   * @description renders the Secondary Gallery based on default or user's options. tw-s-gallery class
   * @pre-condition Must be called by this.init (upon initialisation).
                    html needs to be included to ensure that it is rendering without any errors
   * @post-condition renders the Secondary Gallery and the navigation arrows
   * @return None
   * @param {Object} o Options based on twConf
   */
  this.renderSGal = (o) => {
    // Initiates render if sGallery is enabled
    if (o.sGallery.enable) {
      const twsGallery = document.querySelector(
        `.${o.TW_GALLERY} > .${TWS_GALLERY}`
      );
      // Create div.tw-s-slider element
      const twsSlider = document.createElement("div");
      twsSlider.className = TWS_SLIDER;
      // The id of the dataset
      let id = 0;
      for (const image of o.imagesArray) {
        // Create img.tw-s-thumb element with dataset tw-s-id and src of the image
        const twsThumbnail = document.createElement("img");
        twsThumbnail.dataset.twSId = id.toString();
        twsThumbnail.className = TWS_THUMB;
        twsThumbnail.src = o.directory + image;
        twsSlider.appendChild(twsThumbnail);
        id++;
      }
      twsGallery.append(twsSlider);
      // Initiates the focus on the image that needs to be selected and centered
      this.focusSGal(o, o.startItem);
      // Initiates render of navigationArrows if sGallery is enabled
      if (o.sGallery.navigationArrows) {
        // Creates div.tw-s-nav element
        const twsNav = document.createElement("div");
        twsNav.className = TWS_NAV;
        // Counter of the icons (expected 2 only)
        let icon = 0;
        for (const arrow of TWS_NAVS) {
          // Creates div.tw-s-prev/tw-s-next.tw-s-arrow.tw-left-arrow/tw-right-arrow element
          const twSArrow = document.createElement("div");
          twSArrow.classList.add(arrow, TWS_ARROW, TW_ARROW_DIRECTION[icon]);
          twSArrow.innerHTML = o.sGallery.navigationIcons[icon];
          twsNav.append(twSArrow);
          icon++;
        }

        twsGallery.prepend(twsNav);
      }
    }
  };

  /**
   * @description Sets the tw-s-focus class to selected image and centers it if prev/next arrows clicked in main gallery
   * @pre-condition Must be called by this.renderSGal (upon initialisation), or this.prev/this.next (upon click).
   * @post-condition Sets tw-s-focus class and centers the tw-s-slider
   * @return None
   * @param {Object} o Options based on twConf
   * @param {Number} index The image that needs to be focused based on data-tw-s-id
   */
  this.focusSGal = (o, index) => {
    // Paths to exact locations
    const sliderPath = `.${o.TW_GALLERY} > .${TWS_GALLERY} > .${TWS_SLIDER}`;
    const thumbPath = `${sliderPath} > .${TWS_THUMB}`;
    const thumbIndex = `${thumbPath}[data-tw-s-id="${index}"]`;

    const element = document.querySelector(thumbIndex);
    // Initiate when sGallery is enabled and selected element is correct
    if (o.sGallery.enable && element) {
      const twsSlider = document.querySelector(sliderPath);
      const currFocusedImage = document.querySelector(
        `${thumbPath}.${TWS_FOCUS}`
      );
      // if current focused image exists, then remove the remove the focus (must always exist)
      if (currFocusedImage) {
        currFocusedImage.classList.remove(TWS_FOCUS);
      }
      // add tw-s-focus to the element selected based on data-tw-s-id
      element.classList.add(TWS_FOCUS);
      // work around to center the item. Initial load width is smaller than expected so need to
      // slightly delay it. Can be even 0ms
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

  /**
   * @description Initiates all the functions with the event listeners
   * @pre-condition Must be called by this.init on initialisation of the TwoWayGallery
   * @post-condition Based on options, initiates required events
   * @return None
   * @param {Object} o Options based on twConf
   */
  this.listeners = (o) => {
    // Path to all the required NodeElements
    const twmGalPath = `.${o.TW_GALLERY} > .${TWM_GALLERY}`;
    const twmGalApPath = `${twmGalPath} > .${TWM_AP}`;
    const twmArrowPath = `${twmGalPath} > .${TWM_NAV} > .${TWM_ARROW}`;
    const twmGalWrapperPath = `${twmGalPath} > .${TWM_ITEMS} > .${TWM_ITEM} > .${TWM_WRAPPER}`;
    const twmGalImgPath = `${twmGalWrapperPath} > .${TWM_IMAGE}`;
    const twmGalDescPath = `${twmGalWrapperPath} > .${TWM_DESC}`;
    const listenablePath = `${twmGalApPath}, ${twmGalImgPath}, ${twmGalDescPath}, ${twmArrowPath}`;
    // Navigation Arrows
    const twmNav = document.querySelectorAll(twmArrowPath);
    // Elements that will listen for all the following events
    const listenableElements = document.querySelectorAll(listenablePath);
    // eventListeners based on default/user options
    this.eventMGalNavArrows(o);
    this.eventMGalAutoPlay(o, listenablePath);
    this.eventMGalArrowKeys(o);
    this.eventMGalTouch(o, listenableElements);
    this.eventMGalnavigationShowOnHover(o, listenableElements, twmNav);
    this.eventSGalClickTouch(o);
    this.eventSGalNavArrows(o);
  };

  /**
   * @description Main Gallery - enables listening on navigation arrows.
   * @pre-condition o.navigation.enable must be true and called by this.listeners function
   * @post-condition enables listening on navigation arrows.
   * @return None
   * @param {Object} o Options based on twConf
   */
  this.eventMGalNavArrows = (o) => {
    // Initiates only if navigation is enabled (true)
    if (o.navigation.enable) {
      // Path to the navigation arrows
      const twmNavs = `.${o.TW_GALLERY} > .${TWM_GALLERY} > .${TWM_NAV}`;
      // Listenable node elements
      const prevBtn = document.querySelector(`${twmNavs} > .${TWM_NAVS[0]}`); // tw-m-prev
      const nextBtn = document.querySelector(`${twmNavs} > .${TWM_NAVS[1]}`); // tw-m-next
      // Enable event listeners
      prevBtn.addEventListener("click", this.prev.bind(null, o, true));
      nextBtn.addEventListener("click", this.next.bind(null, o, true));
    }
  };

  /**
   * @description If this option is true, then the gallery will auto AUTOPLAY based on the options selected.
   * @pre-condition o.autoPlay.enable must be true. Also listenablePath needs to be passed
   * @post-condition Based on o.autoPlay.direction, o.autoPlay.timeout, and o.TW_GALLERY initiates auto rotation
                     Also o.autoPlay.hoverPause listens for mouse enter/leave event to pause the autoPlay.
                     While o.hoverPauseNotification is responsible for showing a notification when this event happens.
   * @param {Object} o default/user options
   * @param {String} listenablePath a string that contains the path to CSS listenable by pause
   */
  this.eventMGalAutoPlay = (o, listenablePath) => {
    // Initiate autoPlay when it is true
    if (o.autoPlay.enable) {
      // Boolean that responsible for pausing the execution of the autoPlay when it is true
      let isPaused = false;
      // Initiate autoPlay based on o.autoPlay.timeout in ms
      setInterval(() => {
        // Only autoPlay when it is not paused. This boolean is changed when mouse enters/leaves the gallery
        if (!isPaused) {
          // User's/default option to scroll the gallery right or left
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
      // If hoverPause is enabled (true)
      if (o.autoPlay.hoverPause) {
        const twmGallery = document.querySelector(
          `.${o.TW_GALLERY} > .${TWM_GALLERY}`
        );
        // Render tw-m-ap class that will contain contain pause status
        let twmAP;
        if (o.autoPlay.hoverPauseNotification) {
          // Create div.tw-m-ap.tw-m-play element with the text/icon set by default/user
          twmAP = document.createElement("div");
          twmAP.innerHTML = o.autoPlay.hoverPauseNotificationText;
          twmAP.className = `${TWM_AP} ${TWM_APS[0]}`;
          twmGallery.prepend(twmAP);
        }

        /**
         * @description responsible for initiating mouseenter/mouseleave events
         * @pre-condition called within the current function also. tw-m-ap class must be rendered
         * @post-condition upon mouseenter, changes isPause to true, while upon mouseleave changes isPause to false.
                           Also, adds tw-ap-pause class to tw-m-ap that will show the notification
         * @param {NodeListOf} items elements that are going to listen for autoplay
         * @param {String} event Expected "mouseleave" or "mouseenter" events
         * @param {Boolean} paused State to which isPause needs to be changed to upon mouseenter/mouseleave
         */
        const eventListener = (items, event, paused) => {
          // Initiate event listeners on all the items
          for (const item of items) {
            item.addEventListener(event, () => {
              // enable housePauseNotification if true
              if (o.autoPlay.hoverPauseNotification) {
                // add tw-ap-pause class to tw-m-ap class
                twmAP.classList.add(TWM_APS[1]);
                if (event === "mouseleave") {
                  // when mouse leaves the gallery, then remove tw-ap-pause event
                  twmAP.classList.remove(TWM_APS[1]);
                }
              }
              // change the state of isPause to true(paused)/false(resumed)
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
   * @description If this option is true, then user can use left and right arrow keyboard keys to trigger
                  clicks on the next/prev buttons.
   * @pre-condition o.enableArrowKeys must be true.
   * @post-condition 'scroll' event triggers isInViewport() function that identifies whether the gallery
                     is focused. If it is, then it enables ArrowLeft and ArrowRight keys to initiate gallery
                     rotation.
   * @param {Object} o default/user options
   */
  this.eventMGalArrowKeys = (o) => {
    if (o.enableArrowKeys) {
      /**
       * @description Verifies whether the element (gallery) is focused and returns True or False.
       * @pre-condition o.enableArrowKeys must be true.
       * @post-condition Checks the position of the element on the page.
       * @return boolean
       * @param {Node} element that needs to be focused (twGallery) expected
       */
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

      /**
       * @description Verifies whether the element (gallery) is focused and returns True or False.
       * @pre-condition Triggered by scrollEvent() when isInViewport() is true.
       * @post-condition Checked what key is clicked, and does appropriate action.
       * @return None
       * @param {ListeningState} event Currently executing event (Detected clicked button)
       */
      const keydownEvent = (event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          this.prev(o, true);
        }

        if (event.key === "ArrowRight") {
          event.preventDefault();
          this.next(o, true);
        }
      };

      /**
       * @description Checks whether twGallery is in viewport and initiates event listeners or removes them.
       * @pre-condition Page must be scrolled. Must be called by the scroll event.
       * @post-condition When twGallery is in viewport, it initiates/removes eventListener on keydownEvent() function
       * @return None
       */
      const scrollEvent = () => {
        const twGallery = document.querySelector(`.${o.TW_GALLERY}`);
        // Adds/removes event listener when in viewport
        if (isInViewport(twGallery)) {
          document.addEventListener("keydown", keydownEvent);
        } else {
          document.removeEventListener("keydown", keydownEvent);
        }
      };
      // Initiates scroll event listener on window
      window.addEventListener("scroll", scrollEvent.bind(this));
    }
  };

  /**
   * @description If this option is true, then user can swipe right/left (both touch
                  and mouse drag events) to trigger scrolling on Main Gallery.
   * @pre-condition o.enableTouch must be true.
   * @post-condition initiates touchstart and mousedown events that calculate the touch distance to trigger it
   * @param {Object} o user options
   * @param {NodeListOf} pauseThese items that will listen for a pause event
   */
  this.eventMGalTouch = (o, pauseThese) => {
    if (o.enableTouch) {
      const eventListeners = (items, evStart, evEnd) => {
        let [touchStartX, touchStartTime] = [0, 0];
        const expectedTouchDistance = 60;

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

        if (touchDuration < 400) {
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
        document.body.addEventListener("mouseup", mouseLeaveFunction);
      });

      const mouseOverFunction = (event) => {
        const twSlider = document.querySelector(sliderPath);
        const scrollPos = twSlider.scrollLeft;
        const cursorPos = Math.floor((mouseStart - event.pageX) / 60);

        let scrollerDiff = scrollPos + cursorPos;
        twSlider.scrollTo({ left: scrollerDiff });
      };

      const mouseLeaveFunction = () => {
        const date = new Date();
        const touchEndTime = date.getTime();
        touchDuration = Math.abs(touchStartTime - touchEndTime);
        twsSlider.removeEventListener("mousemove", mouseOverFunction);
        document.body.removeEventListener("mousemove", mouseLeaveFunction);
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
