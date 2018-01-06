/* global AFRAME, THREE */
var bindAll = require('lodash/bindAll')

var HALF_PI = Math.PI / 2
var POINTER_LOCK_CHANGE_EVENTS = ['pointerlockchange', 'mozpointerlockchange', 'webkitpointerlockchange']
var POINTER_LOCK_ERROR_EVENTS = ['pointerlockerror', 'mozpointerlockerror', 'webkitpointerlockerror']
var POINTER_LOCK_ELEMENTS = ['pointerLockElement', 'mozPointerLockElement', 'webkitPointerLockElement']
var POINTER_LOCK_REQUESTS = ['requestPointerLock', 'mozRequestPointerLock', 'webkitRequestPointerLock']
var radToDeg = THREE.Math.radToDeg

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.')
} else if (!isPointerLockSupported()) {
  throw new Error('Pointer lock is not supported by this browser')
}

/**
 * FPS Look Controls component for A-Frame.
 */
AFRAME.registerComponent('fps-look-controls', {
  schema: {
    userHeight: { default: 1.6 }
  },

  /**
   * Set if component needs multiple instancing.
   */
  multiple: false,

  /**
   * Called once when component is attached. Generally for initial setup.
   */
  init: function () {
    bindAll(this, ['onLockChange', 'onLockError', 'onMouseMove', 'addEventListeners'])
    this.hmdEuler = new THREE.Euler()
    this.position = new THREE.Vector3()
    this.rotation = {}
    this.pitchObject = new THREE.Object3D()
    this.yawObject = new THREE.Object3D()
    this.yawObject.position.y = 10
    this.yawObject.add(this.pitchObject)
  },

  addEventListeners: function () {
    bindEvents(document, POINTER_LOCK_CHANGE_EVENTS, this.onLockChange)
    bindEvents(document, POINTER_LOCK_ERROR_EVENTS, this.onLockError)

    var sceneEl = this.el.sceneEl
    var canvasEl = sceneEl.canvas
    if (!canvasEl) { // Wait for canvas to load.
      sceneEl.addEventListener('render-target-loaded', this.addEventListeners)
      return
    }
    canvasEl.onclick = requestPointerLock
  },

  removeEventListeners: function () {
    unbindEvents(document, POINTER_LOCK_CHANGE_EVENTS, this.onLockChange)
    unbindEvents(document, POINTER_LOCK_ERROR_EVENTS, this.onLockError)
  },

  onLockChange: function (event) {
    var scene = this.el.sceneEl
    if (isPointerLockedTo(scene.canvas)) {
      document.addEventListener('mousemove', this.onMouseMove, false)
    } else {
      document.removeEventListener('mousemove', this.onMouseMove, false)
    }
  },

  onLockError: function (event) {
    console.trace(event)
  },

  onMouseMove: function (event) {
    var pitchObject = this.pitchObject
    var yawObject = this.yawObject
    var movementX
    var movementY

    // Calculate delta.
    movementX = (event.movementX || event.mozMovementX) || 0
    movementY = (event.movementY || event.mozMovementY) || 0

    // Calculate rotation.
    yawObject.rotation.y -= movementX * 0.002
    pitchObject.rotation.x -= movementY * 0.002
    pitchObject.rotation.x = Math.max(-HALF_PI, Math.min(HALF_PI, pitchObject.rotation.x))
  },

  /**
   * Called when component is attached and when component data changes.
   * Generally modifies the entity based on the data.
   */
  update: function (oldData) {
    this.addHeightOffset(oldData.userHeight)
  },

  addHeightOffset: function (oldOffset) {
    oldOffset = oldOffset || 0
    var el = this.el
    var userHeightOffset = this.data.userHeight
    var defaultPosition = { x: 0, y: 0, z: 0 }
    var currentPosition = el.getAttribute('position') || defaultPosition
    var newPosition = {
      x: currentPosition.x,
      y: currentPosition.y - oldOffset + userHeightOffset,
      z: currentPosition.z
    }
    el.setAttribute('position', newPosition)
  },

  tick: function (t) {
    this.updateOrientation()
  },

  updateOrientation: function () {
    var hmdEuler = this.hmdEuler
    var pitchObject = this.pitchObject
    var yawObject = this.yawObject
    var rotation = this.rotation

    rotation.x = radToDeg(hmdEuler.x) + radToDeg(pitchObject.rotation.x)
    rotation.y = radToDeg(hmdEuler.y) + radToDeg(yawObject.rotation.y)
    rotation.z = 0

    this.el.setAttribute('rotation', rotation)
  },

  /**
   * Called when a component is removed (e.g., via removeAttribute).
   * Generally undoes all modifications to the entity.
   */
  remove: function () {
    this.removeEventListeners()
  },

  /**
   * Called on each scene tick.
   */
  // tick: function (t) { },

  /**
   * Called when entity pauses.
   * Use to stop or remove any dynamic or background behavior such as events.
   */
  pause: function () {
    this.removeEventListeners()
  },

  /**
   * Called when entity resumes.
   * Use to continue or add any dynamic or background behavior such as events.
   */
  play: function () {
    this.addEventListeners()
  }
})

function isPointerLockSupported () {
  return POINTER_LOCK_ELEMENTS.some(function (key) {
    return key in document
  })
}

function isPointerLockedTo (el) {
  return POINTER_LOCK_ELEMENTS.some(function (key) {
    return document[key] === el
  })
}

function requestPointerLock (event) {
  var el = event.target
  var method = POINTER_LOCK_REQUESTS.find(function (key) {
    return key in el
  })
  el[method]()
}

function bindEvents (target, events, callback) {
  events.forEach(function (event) {
    return target.addEventListener(event, callback)
  })
}

function unbindEvents (target, events, callback) {
  events.forEach(function (event) {
    return target.removeEventListener(event, callback)
  })
}
