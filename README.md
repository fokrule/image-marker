Here is a well-structured and clean `README.md` file for your `image-marker` project.

-----

# Image Marker

A lightweight JavaScript tool to add markers and annotations to images directly in the browser.

## Features

  * Mark an image with star icons.
  * Add resizable boxes to an image.
  * Change the color of existing markers.
  * Save the final marked image as a PNG file.
  * Simple and easy to integrate with any web project.

## Installation

Install the package in your project using npm:

```bash
npm install image-marker
```

## Usage

The `image-marker` package exposes a single function, `initImageMarker`, that you call to set up the tool on your page.

### HTML

You need a container for your image and a toolbar for the controls.

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="path/to/your/styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
</head>
<body>

<div id="main-div">
  <img src="path/to/your/image.png" alt="" id="image">
</div>

<div id="mark-type-button" class="toolbar d-flex">
    <button id="star" class="btn"><i class="fas fa-star"></i></button>
    <button id="box" class="btn"><i class="fas fa-vector-square"></i></button>
    <button id="delete" class="btn"><i class="fas fa-trash-alt"></i></button>
    <button id="convert" class="btn"><i class="fas fa-save"></i></button>
    </div>

<script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
<script src="path/to/your/node_modules/image-marker/dist/bundle.js"></script>

<script>
  // Initialize the image marker tool
  initImageMarker({
    containerId: '#main-div',
    toolbarId: '#mark-type-button'
  });
</script>

</body>
</html>
```

### API

The `initImageMarker` function takes a single configuration object with the following properties:

  * `containerId` (string): The ID of the `div` that contains your image.
  * `toolbarId` (string): The ID of the `div` that contains your control buttons and color palette.

## License

This project is licensed under the MIT License.