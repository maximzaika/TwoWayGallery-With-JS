const initialiseTWGal = (options) => {
  const twoWayGallery = new TwoWayGallery();
  twoWayGallery.init(options);
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
  directory: "../demo/img/",
};
initialiseTWGal(options);
