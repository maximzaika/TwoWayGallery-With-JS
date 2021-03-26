export class MainGalleryItem {
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
    twmImage.alt = this.o.descArr.length !== 0 ? this.o.descArr[item] : "";
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
