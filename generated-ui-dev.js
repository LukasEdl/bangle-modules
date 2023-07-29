const MAX_SCREEN_WIDTH = 174;
const MAX_SCREEN_HEIGHT = 174;

function Screen() {
  this.currentPage = null;
  this.uiObjectsToRender = [];
  this.uiObjects = {};
  this.uiObjectsToTouchCheck = [];
  this.touchCallbacks = {};

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
      this.uiObjectsToRender.push(obj.name);
    }
  };

  this.get = function (name, page) {
    if (!this.uiObjects[page]) return null;
    return this.uiObjects[page][name];
  }

  this.onTouch = function (name, callback) {
    this.touchCallbacks[name] = callback;
  }

  this.setupTouchHandling = () => {
    const onTouch = (btn, e) => {
      const touchedUiElements = this.uiObjectsToTouchCheck.filter((uiObject) => uiObject.onScreenTouch.bind(uiObject)(e));
      touchedUiElements.forEach(element => this.touchCallbacks[element.name] ? this.touchCallbacks[element.name]() : null);
    }
    Bangle.on('touch', onTouch);
  }

  this.switchToPage = (newPageName) => {
    this.uiObjectsToTouchCheck = [];
    this.uiObjectsToRender = [];
    if (!this.uiObjects[newPageName]) {
      console.log(`No page with the name ${newPageName.toString()} found`);
      this.render();
      return;
    }
    const pageUiElements = this.uiObjects[newPageName];
    Object.keys(pageUiElements).forEach((key) => {
      this.uiObjectsToRender.push(pageUiElements[key]);
      if (pageUiElements[key].onScreenTouch) {
        this.uiObjectsToTouchCheck.push(pageUiElements[key]);
      }
    });
    this.render();
  }

  const globalFunctions = {r0: function(){let n=this.fontSize;if(g.setFontVector(n),this.fitText){let t=g.stringWidth(this.text);for(;t/this.lineCount>this.width&&n>0;)n-=1,g.setFontVector(n),t=g.stringWidth(this.text);0===n&&g.setFontVector(n)}let t=[],e="";for(let n=0;n<this.text.length;n++)g.stringWidth(e)>this.width?(t.push(e),e=this.text[n]):e+=this.text[n];0!==e.length&&t.push(e),t=t.splice(0,this.lineCount);for(let e=0;e<t.length;e++){let r=0;"CENTER"===this.textAlignment&&(r=this.width/2-g.stringWidth(t[e])/2),g.drawString(t[e],this.x+r,this.y+(this.fontSize-n)/2+this.fontSize*e,!0)}},
    r1: function(){g.setColor(this.color),g.fillPoly([this.p1x,this.p1y,this.p2x,this.p2y,this.p3x,this.p3y])},
    o2: function(n){let t={x:this.p1x,y:this.p1y},e={x:this.p1x,y:this.p1y};return t.x=this.p2x<t.x?this.p2x:t.x,t.x=this.p3x<t.x?this.p3x:t.x,t.y=this.p2y<t.y?this.p2y:t.y,t.y=this.p3y<t.y?this.p3y:t.y,e.x=this.p2x>e.x?this.p2x:e.x,e.x=this.p3x>e.x?this.p3x:e.x,e.y=this.p2y>e.y?this.p2y:e.y,e.y=this.p3y>e.y?this.p3y:e.y,t.x-=this.hitBoxOffsetX,t.y-=this.hitBoxOffsetY,e.x+=this.hitBoxOffsetX,e.y+=this.hitBoxOffsetY,n.x>=t.x&&n.x<=e.x&&n.y>=t.y&&n.y<=e.y},
    r3: function(){g.setColor(this.backgroundColor),g.fillRect(this.x,this.y,this.x+this.width,this.y+this.height),g.setColor(this.textColor),g.setFontVector(this.fontSize);const n=g.stringWidth(this.text);g.drawString(this.text,this.x+this.width/2-n/2,this.y+this.height/2-this.fontSize/2,!1)},
    o4: function(n){return this.x<=n.x&&n.x<=this.x+this.width&&this.y<=n.y&&n.y<=this.y+this.height},
  };

  const uiObjects = {
    'exercise': [
      {
        name: "exerciseName",
        text: "Übungs-Name",
        x: 10,
        y: 4,
        lineCount: 2,
        width: 90,
        fontSize: 20,
        textAlignment: "LEFT",
        fitText: false,
        render: function anonymous(
        ) {
          globalFunctions['r0'].call(this);
        },
      },
      {
        name: "setNr",
        text: "3",
        x: 6,
        y: 98,
        lineCount: 1,
        width: 30,
        fontSize: 35,
        textAlignment: "CENTER",
        fitText: false,
        render: function anonymous(
        ) {
          globalFunctions['r0'].call(this);
        },
      },
      {
        name: "repsDownBtn",
        width: 40,
        height: 40,
        color: "#000000",
        p1x: 85,
        p1y: 133.33333333333337,
        p2x: 45,
        p2y: 133.33333333333337,
        p3x: 65,
        p3y: 173.33333333333337,
        hitBoxOffsetX: 17,
        hitBoxOffsetY: 10,
        render: function anonymous(
        ) {
          globalFunctions['r1'].call(this);
        },
        onScreenTouch: function anonymous(e
        ) {
          return globalFunctions['o2'].bind(this)(e);
        },
      },
      {
        name: "valueDownBtn",
        width: 40,
        height: 40,
        color: "#000000",
        p1x: 159,
        p1y: 133.33333333333337,
        p2x: 119,
        p2y: 133.33333333333337,
        p3x: 139,
        p3y: 173.33333333333337,
        hitBoxOffsetX: 17,
        hitBoxOffsetY: 10,
        render: function anonymous(
        ) {
          globalFunctions['r1'].call(this);
        },
        onScreenTouch: function anonymous(e
        ) {
          return globalFunctions['o2'].bind(this)(e);
        },
      },
      {
        name: "valueUpBtn",
        width: 40,
        height: 40,
        color: "#000000",
        p1x: 119,
        p1y: 95,
        p2x: 159,
        p2y: 95,
        p3x: 139,
        p3y: 55,
        hitBoxOffsetX: 17,
        hitBoxOffsetY: 10,
        render: function anonymous(
        ) {
          globalFunctions['r1'].call(this);
        },
        onScreenTouch: function anonymous(e
        ) {
          return globalFunctions['o2'].bind(this)(e);
        },
      },
      {
        name: "repsUpBtn",
        width: 40,
        height: 40,
        color: "#000000",
        p1x: 45,
        p1y: 95,
        p2x: 85,
        p2y: 95,
        p3x: 65,
        p3y: 55,
        hitBoxOffsetX: 17,
        hitBoxOffsetY: 10,
        render: function anonymous(
        ) {
          globalFunctions['r1'].call(this);
        },
        onScreenTouch: function anonymous(e
        ) {
          return globalFunctions['o2'].bind(this)(e);
        },
      },
      {
        name: "repsCounter",
        text: "53",
        x: 46,
        y: 98,
        lineCount: 1,
        width: 40,
        fontSize: 35,
        textAlignment: "CENTER",
        fitText: true,
        render: function anonymous(
        ) {
          globalFunctions['r0'].call(this);
        },
      },
      {
        name: "valueCounter",
        text: "53",
        x: 119,
        y: 99,
        lineCount: 1,
        width: 40,
        fontSize: 35,
        textAlignment: "CENTER",
        fitText: true,
        render: function anonymous(
        ) {
          globalFunctions['r0'].call(this);
        },
      },
      {
        name: "zqMJAz0-3du-herAcpLAj",
        text: "Set Nr:",
        x: 7,
        y: 60,
        lineCount: 2,
        width: 30,
        fontSize: 18,
        textAlignment: "CENTER",
        fitText: false,
        render: function anonymous(
        ) {
          globalFunctions['r0'].call(this);
        },
      },
      {
        name: "doneBtn",
        x: 115,
        y: 3,
        width: 65,
        height: 30,
        backgroundColor: "#9bc09b",
        textColor: "#000000",
        fontSize: 20,
        text: "Fertig",
        render: function anonymous(
        ) {
          globalFunctions['r3'].call(this);
        },
        onScreenTouch: function anonymous(e
        ) {
          return globalFunctions['o4'].bind(this)(e);
        },
      },
    ],
    'exercisesOverview': [
      {
        name: "exerciseNameDisplay",
        text: "ExerciseName",
        x: 5,
        y: 3,
        lineCount: 2,
        width: 130,
        fontSize: 20,
        textAlignment: "LEFT",
        fitText: false,
        render: function anonymous(
        ) {
          globalFunctions['r0'].call(this);
        },
      },
      {
        name: "WoTcN4uAecV2Ix_Qj2PDZ",
        text: "Sets: ",
        x: 5,
        y: 50,
        lineCount: 1,
        width: 50,
        fontSize: 20,
        textAlignment: "LEFT",
        fitText: false,
        render: function anonymous(
        ) {
          globalFunctions['r0'].call(this);
        },
      },
      {
        name: "5K2UGjwNSkSJRXzVy5hVr",
        text: "Reps: ",
        x: 5,
        y: 76,
        lineCount: 1,
        width: 55,
        fontSize: 20,
        textAlignment: "LEFT",
        fitText: false,
        render: function anonymous(
        ) {
          globalFunctions['r0'].call(this);
        },
      },
      {
        name: "setCountDisplay",
        text: "5",
        x: 65,
        y: 50,
        lineCount: 1,
        width: 50,
        fontSize: 20,
        textAlignment: "CENTER",
        fitText: true,
        render: function anonymous(
        ) {
          globalFunctions['r0'].call(this);
        },
      },
      {
        name: "repsCountDisplay",
        text: "5",
        x: 65,
        y: 76,
        lineCount: 1,
        width: 50,
        fontSize: 20,
        textAlignment: "CENTER",
        fitText: true,
        render: function anonymous(
        ) {
          globalFunctions['r0'].call(this);
        },
      },
      {
        name: "eHVpwRrJS7COyEXZuPO9V",
        text: "Value: ",
        x: 5,
        y: 104,
        lineCount: 1,
        width: 60,
        fontSize: 20,
        textAlignment: "LEFT",
        fitText: false,
        render: function anonymous(
        ) {
          globalFunctions['r0'].call(this);
        },
      },
      {
        name: "valueDisplay",
        text: "5",
        x: 65,
        y: 104,
        lineCount: 1,
        width: 50,
        fontSize: 20,
        textAlignment: "CENTER",
        fitText: true,
        render: function anonymous(
        ) {
          globalFunctions['r0'].call(this);
        },
      },
      {
        name: "unitDisplay",
        text: "kg",
        x: 119,
        y: 104,
        lineCount: 1,
        width: 60,
        fontSize: 20,
        textAlignment: "LEFT",
        fitText: false,
        render: function anonymous(
        ) {
          globalFunctions['r0'].call(this);
        },
      },
      {
        name: "prevExerciseBtn",
        width: 40,
        height: 60,
        color: "#000000",
        p1x: 65,
        p1y: 169,
        p2x: 65,
        p2y: 129,
        p3x: 5,
        p3y: 149,
        hitBoxOffsetX: 15,
        hitBoxOffsetY: 10,
        render: function anonymous(
        ) {
          globalFunctions['r1'].call(this);
        },
        onScreenTouch: function anonymous(e
        ) {
          return globalFunctions['o2'].bind(this)(e);
        },
      },
      {
        name: "nextExerciseBtn",
        width: 40,
        height: 60,
        color: "#000000",
        p1x: 111,
        p1y: 129,
        p2x: 111,
        p2y: 169,
        p3x: 171,
        p3y: 149,
        hitBoxOffsetX: 15,
        hitBoxOffsetY: 10,
        render: function anonymous(
        ) {
          globalFunctions['r1'].call(this);
        },
        onScreenTouch: function anonymous(e
        ) {
          return globalFunctions['o2'].bind(this)(e);
        },
      },
      {
        name: "completedSetDisplay",
        text: "5/5",
        x: 68,
        y: 147,
        lineCount: 1,
        width: 40,
        fontSize: 20,
        textAlignment: "CENTER",
        fitText: true,
        render: function anonymous(
        ) {
          globalFunctions['r0'].call(this);
        },
      },
      {
        name: "SDlmKUJPJu9pv_IiKXnLD",
        text: "Sets",
        x: 69,
        y: 127,
        lineCount: 1,
        width: 40,
        fontSize: 20,
        textAlignment: "CENTER",
        fitText: true,
        render: function anonymous(
        ) {
          globalFunctions['r0'].call(this);
        },
      },
      {
        name: "exercisePlanOverviewBtn",
        x: 138,
        y: 3,
        width: 30,
        height: 30,
        backgroundColor: "#bcf542",
        textColor: "#000000",
        fontSize: "10",
        text: "Plans",
        render: function anonymous(
        ) {
          globalFunctions['r3'].call(this);
        },
        onScreenTouch: function anonymous(e
        ) {
          return globalFunctions['o4'].bind(this)(e);
        },
      },
    ],
    'exercisePlansOverview': [
      {
        name: "exercisePlanNameDisplay",
        text: "this is",
        x: 7,
        y: 7,
        lineCount: 2,
        width: 110,
        fontSize: 20,
        textAlignment: "LEFT",
        fitText: false,
        render: function anonymous(
        ) {
          globalFunctions['r0'].call(this);
        },
      },
      {
        name: "1661602556662",
        text: "Exercises:",
        x: 7,
        y: 55,
        lineCount: 1,
        width: 100,
        fontSize: 20,
        textAlignment: "LEFT",
        fitText: false,
        render: function anonymous(
        ) {
          globalFunctions['r0'].call(this);
        },
      },
      {
        name: "exerciseCountDisplay",
        text: "20",
        x: 105,
        y: 55,
        lineCount: 1,
        width: 30,
        fontSize: 20,
        textAlignment: "CENTER",
        fitText: false,
        render: function anonymous(
        ) {
          globalFunctions['r0'].call(this);
        },
      },
      {
        name: "prevPlanBtn",
        width: 40,
        height: 60,
        color: "#000000",
        p1x: 63,
        p1y: 160,
        p2x: 63,
        p2y: 120,
        p3x: 3,
        p3y: 140,
        hitBoxOffsetX: 15,
        hitBoxOffsetY: 10,
        render: function anonymous(
        ) {
          globalFunctions['r1'].call(this);
        },
        onScreenTouch: function anonymous(e
        ) {
          return globalFunctions['o2'].bind(this)(e);
        },
      },
      {
        name: "nextPlanBtn",
        width: 40,
        height: 60,
        color: "#000000",
        p1x: 113,
        p1y: 120,
        p2x: 113,
        p2y: 160,
        p3x: 173,
        p3y: 140,
        hitBoxOffsetX: 15,
        hitBoxOffsetY: 10,
        render: function anonymous(
        ) {
          globalFunctions['r1'].call(this);
        },
        onScreenTouch: function anonymous(e
        ) {
          return globalFunctions['o2'].bind(this)(e);
        },
      },
      {
        name: "reloadExerciseBtn",
        x: 127,
        y: 6,
        width: 40,
        height: 40,
        backgroundColor: "#60f542",
        textColor: "#000000",
        fontSize: "15",
        text: "Reload",
        render: function anonymous(
        ) {
          globalFunctions['r3'].call(this);
        },
        onScreenTouch: function anonymous(e
        ) {
          return globalFunctions['o4'].bind(this)(e);
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
}


function clear() {
  g.clearRect(0, 0, MAX_SCREEN_WIDTH, MAX_SCREEN_HEIGHT);
}


module.exports = {
  Screen: Screen,
};
