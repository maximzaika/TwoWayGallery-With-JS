export class MainGalleryNav {
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
