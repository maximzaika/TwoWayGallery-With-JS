const initialiseTWGal = (options) => {
  const twoWayGallery = new TwoWayGallery();
  twoWayGallery.init(options);
};

const removeCurrentGal = () => {
  const demoSection = document.querySelector(`#demo .page-row`);

  // clear all the event listeners
  let twGallery = document.querySelector(`.tw-gallery`),
    elClone = twGallery.cloneNode(true);
  twGallery.parentNode.replaceChild(elClone, twGallery);

  // Clear all timeouts (autoPlay in particular)
  let id = window.setTimeout(function () {}, 0);
  while (id--) {
    window.clearTimeout(id);
  }

  twGallery = document.querySelector(`.tw-gallery`);
  twGallery.remove();

  twGallery = document.createElement("div");
  twGallery.className = "tw-gallery";
  twGallery.style.marginTop = "30px";

  const twmGallery = document.createElement("div");
  twmGallery.className = `tw-m-gallery`;

  const twsGallery = document.createElement("div");
  twsGallery.className = `tw-s-gallery`;

  twGallery.appendChild(twmGallery);
  twGallery.appendChild(twsGallery);

  demoSection.appendChild(twGallery);
};

const toggleBooleanEvent = (element, action) => {
  const el = document.getElementById(element);
  el.addEventListener(action, (event) => {
    removeCurrentGal();

    if (action === "click") {
      options[element] = el.checked;
    } else {
      options[element] = parseInt(el.value) ? +el.value : el.value;
    }

    initialiseTWGal(options);
  });
};

let options = {
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
  startItem: 2,
  directory: "demo/img/",
};
initialiseTWGal(options);

toggleBooleanEvent("startItem", "change");
toggleBooleanEvent("displayItems", "change");
toggleBooleanEvent("descriptionType", "change");
toggleBooleanEvent("enableArrowKeys", "click");
toggleBooleanEvent("enableTouch", "click");
toggleBooleanEvent("autoPlayEnable", "click");
toggleBooleanEvent("autoPlayTimeout", "change");
toggleBooleanEvent("autoPlayDirection", "change");
toggleBooleanEvent("autoPlayPauseOnHover", "click");
toggleBooleanEvent("autoPlayPauseNotification", "click");
toggleBooleanEvent("navigationEnable", "click");
toggleBooleanEvent("navigationShowOnHover", "click");
toggleBooleanEvent("sGalleryEnable", "click");
toggleBooleanEvent("sGalleryInstant", "click");
toggleBooleanEvent("sGalleryDesktopTouch", "click");
toggleBooleanEvent("sGalleryNavigationArrows", "click");
