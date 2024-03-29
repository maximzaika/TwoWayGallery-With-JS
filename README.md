# TwoWayGallery

<img src="https://raw.githubusercontent.com/maximzaika/TwoWayGallery/main/demo/img/TWLogo.png" width="300">

It is a gallery that consists of two parts: *Main Gallery* and *Secondary Gallery*.
It is written in vanilla JavaScript. The *Main Gallery* always needs to be enabled, 
while the *Secondary Gallery* can be either activated or deactivated. This gallery 
can be used for many purposes, but it has been built with the purpose to display
images quickly on single-page websites. It is functional on both mobile and desktop 
devices, but its design is mostly visible on desktop devices.

[Demos & Configs](https://maximzaika.github.io/TwoWayGallery/)

## Contents
* [Recent Changelog](#Recent-Changelog)
* [Install](#Install)
* [Usage](#Usage)
* [HTML Render](#Html-Render)
* [Options](#Options)

## Recent Changelog
* 17/03/2021:
  - TwoWay Gallery v2.07:
    - twoWayGallery.js:
      - fully commented
      - this.eventSGalClickTouch function: reduced the time required to disable the touch event on the mGallery.
      - Previously it was scrolling at the same time user is scrolling the page. 
      - Also, increased the distance required for the finger to travel to initiate the touch event.
      - this.verifyInput function: added error checking whether length of images and description are equal. To ensure that error does not propagate and no human errors are made.
      - this.prev & this.next functions: removed twConf that initiated this.setConfig each time. It is no longer required and was just doing unnecessary action.
      - renamed few variables here and there but it does not affect overall logic at all.
    - twoWayGallery.css:
      - fully commented
      - added grab cursor to sGallery when pressed and hold happens
* 16/03/2021:
  - TwoWay Gallery v2.04:
    - Modified function this.eventSGalClickTouch to ensure that event is always listening once and to document.body instead of the document. Event mouseup is not listening only when mousedown on the twsSlider is triggered.
    - this.eventMGalArrowKeys is now enables the listening for arrow keys when the gallery is in viewport based on the scroll event
    - Option navigationShowOnHover has been fixed. Setting it to true was not making any changes to the gallery.
  - demo page:
    - updated
    - refactored directories
* 15/03/2021 Updated the README.md usage section 2. Changed the script src.
* 14/03/2021 TwoWay Gallery v2.01 - The first finalised release that includes all the expected options.

## Install
Clone the repository (src folder in particular) or download the latest 
[release](https://github.com/maximzaika/TwoWayGallery.github.io/releases) from the github.

Using npm: 
- npm i tw-gallery

## Usage
1. Add CSS link to the `<head>` of your HTML page:
    ```html
    <link rel="stylesheet" href="twoWayGallery.css" />
    ```
2. By default, it is required to add [Font Awesome 4](https://fontawesome.com/v4.7.0/icons/) 
stylesheet to the `<head>` of your HTML page. 
    ```html
    <script src="https://kit.fontawesome.com/a076d05399.js"></script>
    ```
   - *Note*: this part is **OPTIONAL** if default [Options](#Options) `navigationIcons` and 
      `sGalleryNavigationIcons` are overwritten.
3. Add twoWayGallery.js to the `<head>` of your HTML:
    ```html
    <script src="twoWayGallery.js"></script>
    ``` 
4. Add markup to the `<body>` of your HTML: 
    ```html
    <div class="tw-gallery">
       <div class="tw-m-gallery"></div>
       <div class="tw-s-gallery"></div>
    </div>
    ```
   - *Note*: `<div class="tw-s-gallery"></div>` can be excluded if default [Option](#Options) 
   `sGalleryEnable` is set to `false`.
5. Initiate the gallery using the following JS by adding it in the `<script>` tag before 
the `</html>` tag or in any other JS file:
    ```javascript
    const twoWayGallery = new TwoWayGallery();
    twoWayGallery.init({
       imagesArray: ["image1.jpg", "image2.jpg", ... , "image100.jpg"]
    });
    ```
   - *Note*: [Option](#Options) `imagesArray` **NEEDS TO BE INCLUDED**

## HTML Render
An example of how the twGallery is rendered. For now, `tw-gallery` class 
can be replaced using [Option](#Options)  `twGalleryClass`.

<details>
<summary>Click to expand HTML Render</summary>
    
```html
<div class="tw-gallery tw-loaded">
  <div class="tw-m-gallery">
    <div class="tw-m-ap tw-m-play">PAUSED</div> <!-- If autoPlayEnabled is true -->

    <div class="tw-m-nav">
      <div class="tw-m-prev tw-m-arrow tw-left-arrow tw-m-hover-nav">
        <span class="tw-m-nav-padding">
          prev
        </span>
      </div>
      <div class="tw-m-next tw-m-arrow tw-right-arrow tw-m-hover-nav">
        <span class="tw-m-nav-padding">
          next
        </span>
      </div>
    </div>

    <div class="tw-m-items">
      <div class="tw-m-item tw-m-hidden">
        image & description
      </div>
      <div class="tw-m-item tw-m-left-3">
        image & description
      </div>
      <div class="tw-m-item tw-m-left-2">
        image & description
      </div>
      <div class="tw-m-item tw-m-left-1">
        image & description
      </div>
      <div class="tw-m-item tw-m-mid">
        image & description
      </div>
      <div class="tw-m-item tw-m-right-1">
        image & description
      </div>
      <div class="tw-m-item tw-m-right-2">
        image & description
      </div>
      <div class="tw-m-item tw-m-right-3">
        image & description
      </div>
    </div>
  </div>

  <div class="tw-s-gallery">
    <div class="tw-s-nav">
        <div class="tw-s-prev tw-s-arrow tw-left-arrow">
          prev
        </div>
        <div class="tw-s-next tw-s-arrow tw-right-arrow">
        next
        </div>
    </div>

    <div class="tw-s-slider">
      <img data-tw-s-id="0" class="tw-s-thumbnail" src="">
      ...
      <img data-tw-s-id="7" class="tw-s-thumbnail" src="">
    </div>
  </div>
</div>
```

</details>

## Options
| Option                          | Must     | Type                         | Default        | Description                                                                                                                                                                                                                      |
| ---                             | ---      | ---                          | ---            | ---                                                                                                                                                                                                                              |
| `imagesArray`                   | &#10004; | String[]&nbsp; & !empty      |                | Array that contains the list of images to be displayed. Directory can be included. Example: `["image.jpg", "img/image2.jpg"]`                                                                                                    |
| `twGalleryClass`                | &#10008; | String                       | `"tw-gallery"` | Used for renaming gallery. Also can be used to include more than one gallery on the same page. Example: `"tw-gallery2"`                                                                                                                                                 |
| `directory`                     | &#10008; | String                       | `""`           | A directory where your images in the `imagesArray` are located. Slash needs to be included. Example: `"img/"`.                                                                                                                   |
| `descriptionArray`              | &#10008; | String[]                     | `[]`           | Array that contains the list of descriptions to be displayed. It's length must be the same as `imagesArray`. Example: `["This is image.jpg", "This is image img/image2.jpg"]`                                                    |
| `descriptionType`               | &#10008; | "white"&nbsp; &#124; "black" | `"white"`      | The way the description is attached to the image. `"White"` has white background that overwrites image borders and the black font, while `"black"` has black semi-transparent background and white font within image borders.    |
| `startItem`                     | &#10008; | Positive Integer             | `0`            | The index of the image that needs to be displayed first (in the middle of the Main Gallery and focused in the Secondary Gallery).                                                                                                |
| `displayItems`                  | &#10008; | Positive Integer (3, 5, 7)   | `5`            | The number of items to be displayed in the Main Gallery in the Desktop view. Examples: `3` = 1 left, middle, and 1 right. `5` = 2 left, middle, and 2 right. `7` = 3 left, middle, and 3 right.                                  |
| `enableArrowKeys`               | &#10008; | Boolean                      | `false`        | If `true`, use of arrow keys to control the Main Gallery, whenever it is in view, is enabled.                                                                                                                                    |
| `enableTouch`                   | &#10008; | Boolean                      | `true`         | If `true`, swipe gesture to control the Main Gallery, is enabled.                                                                                                                                                                |
| `autoPlayEnable`                | &#10008; | Boolean                      | `false`        | If `true`, the gallery will automatically scroll based on default `autoPlayTimeout`, `autoPlayDirection`, `autoPlayPauseOnHover`, `autoPlayPauseNotification`, and `autoPlayPauseNotificationText` options.                      |
| `autoPlayTimeout`               | &#10008; | Positive Integer             | `2000`         | The timeout before it triggers auto scrolling in milliseconds (ms).                                                                                                                                                              |
| `autoPlayDirection`             | &#10008; | "left"&nbsp; &#124; "right"  | `"right"`      | The direction that gallery needs to be scrolled to.                                                                                                                                                                              |
| `autoPlayPauseOnHover`          | &#10008; | Boolean                      | `true`         | If `true`, hover over event on any element (both Main and Secondary), pauses auto scrolling instantly.                                                                                                                           |
| `autoPlayPauseNotification`     | &#10008; | Boolean                      | `true`         | If `true`, the notification over the gallery is displayed when it is paused.                                                                                                                                                     |
| `autoPlayPauseNotificationText` | &#10008; | String                       | `"PAUSED"`     | The text that is displayed inside the `autoPlayPauseNotification`. Another great example to display pause icon instead of the default text: `"<i class='fa fa-pause' aria-hidden='true'></i>"`. *Note:* to use this example, default font awesome icons that are included in the [Usage](#Usage) part must be passed to your page. |                                |
| `navigationEnable`              | &#10008; | Boolean                      | `true`         | If `true`, navigation arrows in the main gallery are displayed on each side (left and right).                                                                                                                                    |
| `navigationShowOnHover`         | &#10008; | Boolean                      | `false`        | If `true`, navigation is hidden by default and is displayed on hover over the main gallery. If `false`, navigation is hidden by default but hovering over the arrows enlarges them.                                              |
| `navigationIcons`               | &#10008; | String[]                     | `["<i class='fas fa-chevron-left'></i>", "<i class='fas fa-chevron-right'></i>"]` | An array that contains `["left", "right"]` arrow icons of the Main Gallery. Text or any other icons in the same format as `default` can be passed.            |
| `sGalleryEnable`                | &#10008; | Boolean                      | `true`         | If `true` and markup with the class `tw-s-gallery` is included, then the Secondary Gallery is displayed. If `false` then the class `tw-s-gallery` can be excluded from the markup.                                               |
| `sGalleryInstant`               | &#10008; | Boolean                      | `false`        | If `true`, clicks on the images inside the Secondary Gallery instantly display the image in the Main Gallery. If `false`, clicks on the images force Main Gallery scroll to the required image one by one showing the animation. |
| `sGalleryDesktopTouch`          | &#10008; | Boolean                      | `true`         | If `true`, the touch and scroll on the Secondary Image is enabled in the Desktop view. *Note:* this cannot be disabled in the mobile view.                                                                                       |
| `sGalleryNavigationArrows`      | &#10008; | Boolean                      | `true`         | If `true`, navigation arrows in the Secondary Gallery are displayed on hover. *Note:* if this and `sGalleryDesktopTouch` options are `false`, then it will not be possible to scroll in the Secondary Gallery.                   |
| `sGalleryNavigationIcons`       | &#10008; | String[]                     | `["<i class='fas fa-chevron-left'></i>", "<i class='fas fa-chevron-right'></i>"]` | An array that contains `["left", "right"]` arrow icons of the Secondary Gallery. Text or any other icons in the same format as `default` can be passed.       |

## License
This project is available in the [MIT](https://opensource.org/licenses/mit-license.php) license.