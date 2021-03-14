# TwoWayGallery

<img src="https://raw.githubusercontent.com/maximzaika/TwoWayGallery/main/TWLogo.png" width="300">

It is a gallery that consists of two parts: *Main Gallery* and *Secondary Gallery*.
It is written in vanilla JavaScript. The *Main Gallery* always needs to be enabled, 
while the *Secondary Gallery* can be either activated or deactivated. This gallery 
can be used for many purposes, but it has been built with the purpose to display
images quickly on single-page websites. It is functional on both mobile and desktop 
devices, but its design is mostly visible on desktop devices.

[Demos (TO BE ADDED MORE)](https://maximzaika.github.io/TwoWayGallery/)

## Contents
* [Recent Changelog](#Recent-Changelog)
* [Install](#Install)
* [Usage](#Usage)
* [Options](#Options)

## Recent Changelog
* 15/03/2021 Updated the README.md usage section 2. Changed the script src.
* 14/03/2021 v2.01 - The first finalised release that includes all the expected options.

## Install
Clone the repository or download the latest 
[release](https://github.com/maximzaika/TwoWayGallery.github.io/releases) from the github.

bower and npm (TO BE ADDED).

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

## Options
| Option                          | Must     | Type                         | Default        | Description                                                                                                                                                                                                                      |
| ---                             | ---      | ---                          | ---            | ---                                                                                                                                                                                                                              |
| `imagesArray`                   | &#10004; | String[]&nbsp; & !empty      |                | Array that contains the list of images to be displayed. Directory can be included. Example: `["image.jpg", "img/image2.jpg"]`                                                                                                    |
| `twGalleryClass`                | &#10008; | String                       | `"tw-gallery"` | Rename or store more than one gallery on the same page. Example: `"tw-gallery2"`                                                                                                                                                 |
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