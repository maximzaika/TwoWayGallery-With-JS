import { MainGalleryItem } from "./MainGalleryItem.js";
import { MainGalleryNav } from "./MainGalleryNav.js";

export class MainGallery {
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
