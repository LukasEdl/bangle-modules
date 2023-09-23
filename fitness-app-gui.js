const MAX_SCREEN_WIDTH = 174;
const MAX_SCREEN_HEIGHT = 174;

function Screen() {
  this.currentPage = null;
  this.uiObjectsToRender = [];
  this.uiObjects = {};
  this.uiObjectsToTouchCheck = [];
  this.touchCallbacks = {};
  this.pageSettings = {
    "exercise": {
      "scrollable": false
    },
    "exercisesOverview": {
      "scrollable": false
    },
    "exercisePlansOverview": {
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
    r5: function(){if(!this.active)return;g.setColor(this.backgroundColor),g.fillRect(this.x,this.y,this.x+this.width,this.y+this.height),g.setColor(this.textColor),g.setFontVector(this.fontSize);const n=g.stringWidth(this.text);g.drawString(this.text,this.x+this.width/2-n/2,this.y+this.height/2-this.fontSize/2,!1)},
    o6: function(n){if(!this.active)return;const t=this.x-this.hitBoxOffsetXLeft<=n.x&&n.x<=this.x+this.width+this.hitBoxOffsetXRight&&this.y-this.hitBoxOffsetYTop<=n.y&&n.y<=this.y+this.height+this.hitBoxOffsetYBottom;return t&&this.vibrate&&Bangle.buzz(100,.2),t},
  };

  const uiObjects = {
    'exercise': [
      {
        active: true,
        name: "exerciseName",
        text: "Übungs-Name",
        x: 2,
        y: 25,
        lineCount: 2,
        width: 90,
        fontSize: 20,
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
        name: "setNr",
        text: "3",
        x: 5,
        y: 113,
        lineCount: 1,
        width: 30,
        fontSize: 22,
        textAlignment: "CENTER",
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
        name: "repsDownBtn",
        width: 40,
        height: 40,
        color: "#000000",
        p1x: 100,
        p1y: 136.33333333333331,
        p2x: 60,
        p2y: 136.33333333333331,
        p3x: 80,
        p3y: 176.33333333333331,
        hitBoxOffsetXLeft: 15,
        hitBoxOffsetXRight: 10,
        hitBoxOffsetYTop: 8,
        hitBoxOffsetYBottom: 10,
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
        name: "valueDownBtn",
        width: 40,
        height: 40,
        color: "#000000",
        p1x: 160,
        p1y: 136.33333333333331,
        p2x: 120,
        p2y: 136.33333333333331,
        p3x: 140,
        p3y: 176.33333333333331,
        hitBoxOffsetXLeft: 10,
        hitBoxOffsetXRight: 15,
        hitBoxOffsetYTop: 8,
        hitBoxOffsetYBottom: 10,
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
        name: "valueUpBtn",
        width: 40,
        height: 40,
        color: "#000000",
        p1x: 120,
        p1y: 114,
        p2x: 160,
        p2y: 114,
        p3x: 140,
        p3y: 74,
        hitBoxOffsetXLeft: 10,
        hitBoxOffsetXRight: 15,
        hitBoxOffsetYTop: 5,
        hitBoxOffsetYBottom: 10,
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
        name: "repsUpBtn",
        width: 40,
        height: 40,
        color: "#000000",
        p1x: 60,
        p1y: 114,
        p2x: 100,
        p2y: 114,
        p3x: 80,
        p3y: 74,
        hitBoxOffsetXLeft: 15,
        hitBoxOffsetXRight: 10,
        hitBoxOffsetYTop: 5,
        hitBoxOffsetYBottom: 10,
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
        name: "repsCounter",
        text: "53",
        x: 60,
        y: 115,
        lineCount: 1,
        width: 40,
        fontSize: 20,
        textAlignment: "CENTER",
        fitText: true,
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
        name: "valueCounter",
        text: "53",
        x: 120,
        y: 115,
        lineCount: 1,
        width: 40,
        fontSize: 20,
        textAlignment: "CENTER",
        fitText: true,
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
        name: "zqMJAz0-3du-herAcpLAj",
        text: "Set Nr:",
        x: 5,
        y: 78,
        lineCount: 2,
        width: 30,
        fontSize: 15,
        textAlignment: "CENTER",
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
        name: "doneBtn",
        x: 99,
        y: 27,
        width: 65,
        height: 30,
        backgroundColor: "#9bc09b",
        textColor: "#000000",
        fontSize: 20,
        text: "Fertig",
        hitBoxOffsetXLeft: 15,
        hitBoxOffsetXRight: 15,
        hitBoxOffsetYTop: 5,
        hitBoxOffsetYBottom: 7,
        vibrate: true,
        render: function anonymous(
        ) {
          globalFunctions['r5'].call(this);
        },
        onScreenTouch: function anonymous(e
        ) {
          return globalFunctions['o6'].bind(this)(e);
        },
        moveElement: function anonymous(x,y
        ) {
          return globalFunctions['m1'].bind(this)(x,y);
        },
      },
    ],
    'exercisesOverview': [
      {
        active: true,
        name: "exerciseNameDisplay",
        text: "ExerciseName",
        x: 1,
        y: 24,
        lineCount: 2,
        width: 130,
        fontSize: 18,
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
        name: "WoTcN4uAecV2Ix_Qj2PDZ",
        text: "Sets: ",
        x: 5,
        y: 65,
        lineCount: 1,
        width: 50,
        fontSize: 15,
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
        name: "5K2UGjwNSkSJRXzVy5hVr",
        text: "Reps: ",
        x: 5,
        y: 85,
        lineCount: 1,
        width: 55,
        fontSize: 15,
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
        name: "setCountDisplay",
        text: "5",
        x: 55,
        y: 65,
        lineCount: 1,
        width: 50,
        fontSize: 15,
        textAlignment: "CENTER",
        fitText: true,
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
        name: "repsCountDisplay",
        text: "5",
        x: 56,
        y: 85,
        lineCount: 1,
        width: 50,
        fontSize: 15,
        textAlignment: "CENTER",
        fitText: true,
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
        name: "eHVpwRrJS7COyEXZuPO9V",
        text: "Value: ",
        x: 5,
        y: 105,
        lineCount: 1,
        width: 60,
        fontSize: 15,
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
        name: "valueDisplay",
        text: "5",
        x: 55,
        y: 106,
        lineCount: 1,
        width: 50,
        fontSize: 15,
        textAlignment: "CENTER",
        fitText: true,
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
        name: "unitDisplay",
        text: "kg",
        x: 113,
        y: 85,
        lineCount: 1,
        width: 60,
        fontSize: 15,
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
        name: "prevExerciseBtn",
        width: 40,
        height: 60,
        color: "#000000",
        p1x: 59,
        p1y: 169,
        p2x: 59,
        p2y: 129,
        p3x: -1,
        p3y: 149,
        hitBoxOffsetXLeft: 0,
        hitBoxOffsetXRight: 15,
        hitBoxOffsetYTop: 20,
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
        name: "nextExerciseBtn",
        width: 40,
        height: 60,
        color: "#000000",
        p1x: 113,
        p1y: 130,
        p2x: 113,
        p2y: 170,
        p3x: 173,
        p3y: 150,
        hitBoxOffsetXLeft: 15,
        hitBoxOffsetXRight: 0,
        hitBoxOffsetYTop: 20,
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
        name: "completedSetDisplay",
        text: "5/5",
        x: 64,
        y: 150,
        lineCount: 1,
        width: 40,
        fontSize: 20,
        textAlignment: "CENTER",
        fitText: true,
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
        name: "SDlmKUJPJu9pv_IiKXnLD",
        text: "Sets",
        x: 66,
        y: 125,
        lineCount: 1,
        width: 40,
        fontSize: 20,
        textAlignment: "CENTER",
        fitText: true,
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
        name: "exercisePlanOverviewBtn",
        x: 137,
        y: 32,
        width: 30,
        height: 30,
        backgroundColor: "#bcf542",
        textColor: "#000000",
        fontSize: 10,
        text: "Plans",
        hitBoxOffsetXLeft: 15,
        hitBoxOffsetXRight: 15,
        hitBoxOffsetYTop: 15,
        hitBoxOffsetYBottom: 15,
        vibrate: true,
        render: function anonymous(
        ) {
          globalFunctions['r5'].call(this);
        },
        onScreenTouch: function anonymous(e
        ) {
          return globalFunctions['o6'].bind(this)(e);
        },
        moveElement: function anonymous(x,y
        ) {
          return globalFunctions['m1'].bind(this)(x,y);
        },
      },
    ],
    'exercisePlansOverview': [
      {
        active: true,
        name: "exercisePlanNameDisplay",
        text: "this is",
        x: 2,
        y: 24,
        lineCount: 2,
        width: 110,
        fontSize: 20,
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
        name: "1661602556662",
        text: "Exercises:",
        x: 0,
        y: 67,
        lineCount: 1,
        width: 100,
        fontSize: 20,
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
        name: "exerciseCountDisplay",
        text: "20",
        x: 98,
        y: 69,
        lineCount: 1,
        width: 30,
        fontSize: 20,
        textAlignment: "CENTER",
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
        name: "prevPlanBtn",
        width: 40,
        height: 60,
        color: "#000000",
        p1x: 60,
        p1y: 157,
        p2x: 60,
        p2y: 117,
        p3x: 0,
        p3y: 137,
        hitBoxOffsetXLeft: 0,
        hitBoxOffsetXRight: 15,
        hitBoxOffsetYTop: 20,
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
        name: "nextPlanBtn",
        width: 40,
        height: 60,
        color: "#000000",
        p1x: 116,
        p1y: 115,
        p2x: 116,
        p2y: 155,
        p3x: 176,
        p3y: 135,
        hitBoxOffsetXLeft: 15,
        hitBoxOffsetXRight: 0,
        hitBoxOffsetYTop: 20,
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
        name: "reloadExerciseBtn",
        x: 124,
        y: 33,
        width: 40,
        height: 40,
        backgroundColor: "#60f542",
        textColor: "#000000",
        fontSize: 15,
        text: "Reload",
        hitBoxOffsetXLeft: 15,
        hitBoxOffsetXRight: 15,
        hitBoxOffsetYTop: 15,
        hitBoxOffsetYBottom: 15,
        vibrate: true,
        render: function anonymous(
        ) {
          globalFunctions['r5'].call(this);
        },
        onScreenTouch: function anonymous(e
        ) {
          return globalFunctions['o6'].bind(this)(e);
        },
        moveElement: function anonymous(x,y
        ) {
          return globalFunctions['m1'].bind(this)(x,y);
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
