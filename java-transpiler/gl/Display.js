const electron = require('electron');

const EventEmitter = require('events');

function start(module, { canvas = true }, graphics) {
  if (canvas) createWindow(graphics)
}
function createWindow(graphics) {
  const { app, BrowserWindow } = electron
  let window
  app.on('ready', () => {
    window = new BrowserWindow({})
    window.loadURL('./assets/default.html')
    graphics.window = window;
  })
}

class Graphics {
  constructor() {
    this.window = null
  }

  updateDimensions(width, height) {
    if(this.window != null) {
      this.window.setSize(width, height)
    }
  }
}

let mainGraphics = new Graphics()
/**
 * @param {{
 *      canvas: boolean
 * }} options the configuration of your app
 * @param {boolean} [options.canvas=true] whether or not your app will use a canvas
 */
module.exports = options => {
  let module = require(require.main.filename)
  return {
    run: () => start(module, options, mainGraphics),
    canvas: mainGraphics,
  }
}

