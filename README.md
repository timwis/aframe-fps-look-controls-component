## aframe-fps-look-controls-component

[![Version](http://img.shields.io/npm/v/aframe-fps-look-controls-component.svg?style=flat-square)](https://npmjs.org/package/aframe-fps-look-controls-component)
[![License](http://img.shields.io/npm/l/aframe-fps-look-controls-component.svg?style=flat-square)](https://npmjs.org/package/aframe-fps-look-controls-component)

Move the mouse to look around, without needing to hold the button down.

For [A-Frame](https://aframe.io).

### API

| Property | Description | Default Value |
| -------- | ----------- | ------------- |
| user-height | How much height to add to the camera | 1.6 |

### Installation

#### Browser

Install and use by directly including the [browser files](dist):

```html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/0.6.0/aframe.min.js"></script>
  <script src="https://unpkg.com/aframe-fps-look-controls-component/dist/aframe-fps-look-controls-component.min.js"></script>
</head>

<body>
  <a-scene>
    <a-entity camera fps-look-controls></a-entity>
  </a-scene>
</body>
```

#### npm

Install via npm:

```bash
npm install aframe-fps-look-controls-component
```

Then require and use.

```js
require('aframe');
require('aframe-fps-look-controls-component');
```
