const MAX_SCREEN_WIDTH = 174;
const MAX_SCREEN_HEIGHT = 174;

function Screen() {
  this.currentPage = null;
  this.uiObjectsToRender = [];
  this.uiObjects = {};
  this.uiObjectsToTouchCheck = [];
  this.touchCallbacks = {};
  this.pageSettings = {
    "shop-entry": {
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
    this.uiObjects.forEach((e) => print(e.name));
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

    let lastEvent;

    function onDrag(event) {

      let isPressed = event.b === 1;
      if (event.dx === 0 && event.dy === 0) {
        lastEvent = event;
      }

      if (isPressed && start === 0) {
        start = Date.now();
        if (continueId) {
          clearInterval(continueId);
        }
        continueId = setInterval(() => {

          this.buttonUpdate(lastEvent.x, lastEvent.y);
        }, 250);
      }
      if (!isPressed) {
        if (continueId) {
          clearInterval(continueId);
        }
        let dif = Date.now() - start;

        if (dif <= 250) {
          if (lastEvent) {
            this.buttonUpdate(lastEvent.x, lastEvent.y);
          }
        }
        start = 0;
        lastEvent = null;
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

  const globalFunctions = {r0: function(){if(!this.active)return;let n=this.fontSize;if(g.setFontVector(n),this.fitText){let t=g.stringWidth(this.text);for(;t/this.lineCount>this.width&&n>0;)n-=1,g.setFontVector(n),t=g.stringWidth(this.text);0===n&&g.setFontVector(n)}let t=[],e="";for(let n=0;n<this.text.length;n++)g.stringWidth(e)>this.width?(t.push(e),e=this.text[n]):e+=this.text[n];0!==e.length&&t.push(e),t=t.splice(0,this.lineCount);for(let e=0;e<t.length;e++){let r=0;"CENTER"===this.textAlignment&&(r=this.width/2-g.stringWidth(t[e])/2),g.drawString(t[e],this.x+r,this.y+(this.fontSize-n)/2+this.fontSize*e,!0)}},
    m1: function(n,t){this.x+=n,this.y+=t},
    r2: function(){this.active&&(g.setColor(this.color),g.fillPoly([this.p1x,this.p1y,this.p2x,this.p2y,this.p3x,this.p3y]))},
    o3: function(n){if(!this.active)return;let t={x:this.p1x,y:this.p1y},r={x:this.p1x,y:this.p1y};return t.x=this.p2x<t.x?this.p2x:t.x,t.x=this.p3x<t.x?this.p3x:t.x,t.y=this.p2y<t.y?this.p2y:t.y,t.y=this.p3y<t.y?this.p3y:t.y,r.x=this.p2x>r.x?this.p2x:r.x,r.x=this.p3x>r.x?this.p3x:r.x,r.y=this.p2y>r.y?this.p2y:r.y,r.y=this.p3y>r.y?this.p3y:r.y,t.x-=this.hitBoxOffsetXLeft,t.y-=this.hitBoxOffsetYTop,r.x+=this.hitBoxOffsetXRight,r.y+=this.hitBoxOffsetYBottom,e=n.x>=t.x&&n.x<=r.x&&n.y>=t.y&&n.y<=r.y,e&&this.vibrate&&Bangle.buzz(100,.2),e},
    m4: function(n,t){this.p1x+=n,this.p2x+=n,this.p3x+=n,this.p1y+=t,this.p2y+=t,this.p3y+=t},
  };

  const uiObjects = {
    'shop-entry': [
      {
        active: true,
        name: "nHundred",
        text: "9",
        x: 4,
        y: 79,
        lineCount: 1,
        width: 20,
        fontSize: 30,
        textAlignment: "LEFT",
        fitText: false,
        render: function anonymous(
        ) {
          globalFunctions['r0'].call(this);
        },
        moveElement: function anonymous(x,y
        ) {
          return globalFunctions['m1'].bind(this)(x,y);
        },
      },
      {
        active: true,
        name: "nTen",
        text: "9",
        x: 25,
        y: 79,
        lineCount: 1,
        width: 20,
        fontSize: 30,
        textAlignment: "LEFT",
        fitText: false,
        render: function anonymous(
        ) {
          globalFunctions['r0'].call(this);
        },
        moveElement: function anonymous(x,y
        ) {
          return globalFunctions['m1'].bind(this)(x,y);
        },
      },
      {
        active: true,
        name: "nOne",
        text: "9",
        x: 45,
        y: 79,
        lineCount: 1,
        width: 20,
        fontSize: 30,
        textAlignment: "LEFT",
        fitText: false,
        render: function anonymous(
        ) {
          globalFunctions['r0'].call(this);
        },
        moveElement: function anonymous(x,y
        ) {
          return globalFunctions['m1'].bind(this)(x,y);
        },
      },
      {
        active: true,
        name: "nCTen",
        text: "9",
        x: 75,
        y: 79,
        lineCount: 1,
        width: 20,
        fontSize: 30,
        textAlignment: "LEFT",
        fitText: false,
        render: function anonymous(
        ) {
          globalFunctions['r0'].call(this);
        },
        moveElement: function anonymous(x,y
        ) {
          return globalFunctions['m1'].bind(this)(x,y);
        },
      },
      {
        active: true,
        name: "nCOne",
        text: "9",
        x: 95,
        y: 79,
        lineCount: 1,
        width: 20,
        fontSize: 30,
        textAlignment: "LEFT",
        fitText: false,
        render: function anonymous(
        ) {
          globalFunctions['r0'].call(this);
        },
        moveElement: function anonymous(x,y
        ) {
          return globalFunctions['m1'].bind(this)(x,y);
        },
      },
      {
        active: true,
        name: "13916953158484568",
        text: "EUR",
        x: 113,
        y: 79,
        lineCount: 1,
        width: 80,
        fontSize: 30,
        textAlignment: "LEFT",
        fitText: false,
        render: function anonymous(
        ) {
          globalFunctions['r0'].call(this);
        },
        moveElement: function anonymous(x,y
        ) {
          return globalFunctions['m1'].bind(this)(x,y);
        },
      },
      {
        active: true,
        name: "86892885403898350",
        text: ".",
        x: 63,
        y: 79,
        lineCount: 1,
        width: 20,
        fontSize: 30,
        textAlignment: "LEFT",
        fitText: false,
        render: function anonymous(
        ) {
          globalFunctions['r0'].call(this);
        },
        moveElement: function anonymous(x,y
        ) {
          return globalFunctions['m1'].bind(this)(x,y);
        },
      },
      {
        active: true,
        name: "nUpBtn",
        width: 40,
        height: 40,
        color: "#000000",
        p1x: 15,
        p1y: 80,
        p2x: 55,
        p2y: 80,
        p3x: 35,
        p3y: 40,
        hitBoxOffsetXLeft: 10,
        hitBoxOffsetXRight: 5,
        hitBoxOffsetYTop: 20,
        hitBoxOffsetYBottom: 15,
        vibrate: true,
        render: function anonymous(
        ) {
          globalFunctions['r2'].call(this);
        },
        moveElement: function anonymous(x,y
        ) {
          return globalFunctions['m4'].bind(this)(x,y);
        },
        onScreenTouch: function anonymous(e
        ) {
          return globalFunctions['o3'].bind(this)(e);
        },
      },
      {
        active: true,
        name: "nCUpBtn",
        width: 40,
        height: 40,
        color: "#000000",
        p1x: 72,
        p1y: 80,
        p2x: 112,
        p2y: 80,
        p3x: 92,
        p3y: 40,
        hitBoxOffsetXLeft: 5,
        hitBoxOffsetXRight: 10,
        hitBoxOffsetYTop: 20,
        hitBoxOffsetYBottom: 15,
        vibrate: true,
        render: function anonymous(
        ) {
          globalFunctions['r2'].call(this);
        },
        moveElement: function anonymous(x,y
        ) {
          return globalFunctions['m4'].bind(this)(x,y);
        },
        onScreenTouch: function anonymous(e
        ) {
          return globalFunctions['o3'].bind(this)(e);
        },
      },
      {
        active: true,
        name: "nCDownBtn",
        width: 40,
        height: 40,
        color: "#000000",
        p1x: 113,
        p1y: 123.33333333333331,
        p2x: 73,
        p2y: 123.33333333333331,
        p3x: 93,
        p3y: 163.33333333333331,
        hitBoxOffsetXLeft: 5,
        hitBoxOffsetXRight: 10,
        hitBoxOffsetYTop: 15,
        hitBoxOffsetYBottom: 20,
        vibrate: true,
        render: function anonymous(
        ) {
          globalFunctions['r2'].call(this);
        },
        moveElement: function anonymous(x,y
        ) {
          return globalFunctions['m4'].bind(this)(x,y);
        },
        onScreenTouch: function anonymous(e
        ) {
          return globalFunctions['o3'].bind(this)(e);
        },
      },
      {
        active: true,
        name: "nDownBtn",
        width: 40,
        height: 40,
        color: "#000000",
        p1x: 56,
        p1y: 122.33333333333331,
        p2x: 16,
        p2y: 122.33333333333331,
        p3x: 36,
        p3y: 162.33333333333331,
        hitBoxOffsetXLeft: 10,
        hitBoxOffsetXRight: 5,
        hitBoxOffsetYTop: 15,
        hitBoxOffsetYBottom: 20,
        vibrate: true,
        render: function anonymous(
        ) {
          globalFunctions['r2'].call(this);
        },
        moveElement: function anonymous(x,y
        ) {
          return globalFunctions['m4'].bind(this)(x,y);
        },
        onScreenTouch: function anonymous(e
        ) {
          return globalFunctions['o3'].bind(this)(e);
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
