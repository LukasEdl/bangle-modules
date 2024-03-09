const MAX_SCREEN_WIDTH = 174;
const MAX_SCREEN_HEIGHT = 174;

function Screen() {
  this.currentPage = null;
  this.uiObjectsToRender = [];
  this.uiObjects = {};
  this.uiObjectsToTouchCheck = [];
  this.touchCallbacks = {};
  this.pageSettings = {
	 "home-controls": {
  "scrollable": false
},
}

  this.render = function () {
    clear();
    this.uiObjectsToRender.forEach(function (objectToRender) {
      objectToRender.render.call(objectToRender);
    }.bind(this));
  };

  this.addObject = function (obj, page) {
    if (this.currentPage === null) {
      this.currentPage = page;
    }
    if (!this.uiObjects[page]) {
      this.uiObjects[page] = {}
    }
    this.uiObjects[page][obj.name] = obj;
    if (this.currentPage === page) {
      this.uiObjectsToRender.push(obj);
    }
  };

  this.get = function (name, page) {
    if (!this.uiObjects[page]) return null;
    return this.uiObjects[page][name];
  }

  this.onTouch = function (name, callback) {
    this.touchCallbacks[name] = callback;
  }

  this.buttonUpdate = function (x, y) {
    const e = {
      x: x,
      y: y,
    }
    const touchedUiElements = this.uiObjectsToTouchCheck.filter((uiObject) => uiObject.onScreenTouch.bind(uiObject)(e));
    touchedUiElements.forEach(element => this.touchCallbacks[element.name] ? this.touchCallbacks[element.name]() : null);
  }

  this.setupTouchHandling = () => {
    let start = 0;
    let continueId;
    let startPosition = {
      x: 0,
      y: 0
    }
    let lastEvent;

    function resetPressTimer() {
      if (continueId) {
        clearInterval(continueId);
      }
      start = 0;
      lastEvent = null;
      startPosition = {
        x: 0,
        y: 0,
      }
    }

    Bangle.on('lock', function (on) {
      if (!on) {
        resetPressTimer();
      }
    });

    function isStillOnStartPosition(startPosition, event) {
      return Math.sqrt(Math.pow(startPosition.x - event.x, 2) + Math.pow(startPosition.y - event.y, 2)) < 2;
    }

    function onDrag(event) {

      let isPressed = event.b === 1;
      if (!(event.dx === 0 && event.dy === 0)) {
        resetPressTimer();
        return;
      }
      lastEvent = event;

      if (isPressed && start === 0) {
        start = Date.now();
        startPosition = {
          x: event.x,
          y: event.y,
        }
        if (continueId) {
          clearInterval(continueId);
        }
        continueId = setInterval(() => {

          if (isStillOnStartPosition(startPosition, lastEvent)) {
            this.buttonUpdate(lastEvent.x, lastEvent.y);
          }
        }, 250);
      }
      if (!isPressed) {
        if (continueId) {
          clearInterval(continueId);
        }
        let dif = Date.now() - start;

        if (dif <= 250) {
          if (lastEvent) {
            if (isStillOnStartPosition(startPosition, lastEvent)) {
              this.buttonUpdate(lastEvent.x, lastEvent.y);
            }
          }
        }
        resetPressTimer();
      }

    }

    Bangle.on('drag', onDrag.bind(this));
  }

  this.setupDragHandling = () => {
    const onDrag = (e) => {
      if (!this.pageSettings[this.currentPage]) return;
      if (this.pageSettings[this.currentPage].scrollable) {
        this.uiObjectsToRender.forEach((object) => {
          object.moveElement(0, e.dy);
        })
        this.render();
      }
    }
    Bangle.on('drag', onDrag);
  }

  this.switchToPage = (newPageName) => {

    if (!this.uiObjects[newPageName]) {
      console.log(`No page with the name ${newPageName.toString()} found`);
      this.render();
      return;
    }
    const pageUiElements = this.uiObjects[newPageName];
    this.uiObjectsToTouchCheck = [];
    this.uiObjectsToRender = [];
    Object.keys(pageUiElements).forEach((key) => {
      this.uiObjectsToRender.push(pageUiElements[key]);
      if (pageUiElements[key].onScreenTouch) {
        this.uiObjectsToTouchCheck.push(pageUiElements[key]);
      }
    });
    this.currentPage = newPageName;
    this.render();
  }

  const globalFunctions = {r0: function(){if(!this.active)return;g.setColor(this.backgroundColor),g.fillRect(this.x,this.y,this.x+this.width,this.y+this.height),g.setColor(this.textColor),g.setFontVector(this.fontSize);const n=g.stringWidth(this.text);g.drawString(this.text,this.x+this.width/2-n/2,this.y+this.height/2-this.fontSize/2,!1)},
o1: function(n){if(!this.active)return;const t=this.x-this.hitBoxOffsetXLeft<=n.x&&n.x<=this.x+this.width+this.hitBoxOffsetXRight&&this.y-this.hitBoxOffsetYTop<=n.y&&n.y<=this.y+this.height+this.hitBoxOffsetYBottom;return t&&this.vibrate&&Bangle.buzz(100,.2),t},
m2: function(n,t){this.x+=n,this.y+=t},
};

  const uiObjects = {
'home-controls': [
{
    active: true,
    name: "btn3",
    x: 5,
    y: 105,
    width: 80,
    height: 50,
    backgroundColor: "#9bc09b",
    textColor: "#000000",
    fontSize: 20,
    text: "btn3",
    hitBoxOffsetXLeft: 0,
    hitBoxOffsetXRight: 0,
    hitBoxOffsetYTop: 10,
    hitBoxOffsetYBottom: 10,
    vibrate: true,
    render: function anonymous(
) {
globalFunctions['r0'].call(this);
},
    onScreenTouch: function anonymous(e
) {
return globalFunctions['o1'].bind(this)(e);
},
    moveElement: function anonymous(x,y
) {
return globalFunctions['m2'].bind(this)(x,y);
},
},
{
    active: true,
    name: "btn4",
    x: 90,
    y: 105,
    width: 80,
    height: 50,
    backgroundColor: "#9bc09b",
    textColor: "#000000",
    fontSize: 20,
    text: "btn4",
    hitBoxOffsetXLeft: 0,
    hitBoxOffsetXRight: 0,
    hitBoxOffsetYTop: 10,
    hitBoxOffsetYBottom: 10,
    vibrate: true,
    render: function anonymous(
) {
globalFunctions['r0'].call(this);
},
    onScreenTouch: function anonymous(e
) {
return globalFunctions['o1'].bind(this)(e);
},
    moveElement: function anonymous(x,y
) {
return globalFunctions['m2'].bind(this)(x,y);
},
},
{
    active: true,
    name: "btn1",
    x: 5,
    y: 40,
    width: 80,
    height: 50,
    backgroundColor: "#9bc09b",
    textColor: "#000000",
    fontSize: 20,
    text: "btn1",
    hitBoxOffsetXLeft: 0,
    hitBoxOffsetXRight: 0,
    hitBoxOffsetYTop: 10,
    hitBoxOffsetYBottom: 10,
    vibrate: true,
    render: function anonymous(
) {
globalFunctions['r0'].call(this);
},
    onScreenTouch: function anonymous(e
) {
return globalFunctions['o1'].bind(this)(e);
},
    moveElement: function anonymous(x,y
) {
return globalFunctions['m2'].bind(this)(x,y);
},
},
{
    active: true,
    name: "btn2",
    x: 90,
    y: 40,
    width: 80,
    height: 50,
    backgroundColor: "#9bc09b",
    textColor: "#000000",
    fontSize: 20,
    text: "btn2",
    hitBoxOffsetXLeft: 0,
    hitBoxOffsetXRight: 0,
    hitBoxOffsetYTop: 10,
    hitBoxOffsetYBottom: 10,
    vibrate: true,
    render: function anonymous(
) {
globalFunctions['r0'].call(this);
},
    onScreenTouch: function anonymous(e
) {
return globalFunctions['o1'].bind(this)(e);
},
    moveElement: function anonymous(x,y
) {
return globalFunctions['m2'].bind(this)(x,y);
},
},
],
}

  Object.keys(uiObjects).forEach(pageKey => {
    uiObjects[pageKey].forEach(uiObject => {
      this.addObject(uiObject, pageKey);
    });
  });
  this.switchToPage(this.currentPage);
  this.setupTouchHandling();
  this.setupDragHandling();
}


function clear() {
  g.reset();
  g.clearRect(0, 0, MAX_SCREEN_WIDTH, MAX_SCREEN_HEIGHT);
}


module.exports = {
  Screen: Screen,
};
