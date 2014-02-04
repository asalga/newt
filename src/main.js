// User controls to help build level
var Controls = function() {
  this.brush = 'none';  

  // Remove all sprites from the level
  this.clearSprites = function(){
    console.log("clearing all sprites");
  };

  // Object manipulation
  this.rotation = 0;
  this.density = 1;
  this.friction = 1;
  this.isDynamic = true;

  // View
  this.showGridlines = false;
  this.snapToGrid = false;
  this.showDebug = false;
  // spacing dropdown?

  // Simulation
  this.isRunning = false;
  this.play = function(){};
  this.takeSnapShot = function(){};
  this.resetToSnapShot = function(){};
  this.timeScale = 1;

  // File
  this.save = function(){};
  this.load = function(){};
};

var object;
var brushControl = null;

window.onload = function() {
  mainControls = new Controls();
  var gui = new dat.GUI();

  // FILE
  var file = gui.addFolder('File');
  file.add(mainControls, 'save');
  file.add(mainControls, 'load');
  file.close();

  // OBJECT
  object = gui.addFolder('Object');
  object.add(mainControls, 'rotation', 0.0, 3.14159).onChange(function(a){
    if(selectedSprite){
      selectedSprite.getBody().SetAngle(a);
    }
  });
  object.add(mainControls, 'density', 0.01, 1);
  object.add(mainControls, 'friction', 0.01, 1);
  object.add(mainControls, 'isDynamic').onChange(function(b){
    if(selectedSprite){
    }
  });
  object.open();

  // VIEW
  var view = gui.addFolder('View');
  view.add(mainControls, 'showGridlines');
  view.add(mainControls, 'snapToGrid');
  view.add(mainControls, 'showDebug');
  view.open();

  // SIMULATION
  var simulation = gui.addFolder('Simulation');
  simulation.add(mainControls, 'isRunning');
  simulation.add(mainControls, 'play');
  simulation.add(mainControls, 'takeSnapShot');
  simulation.add(mainControls, 'resetToSnapShot');
  simulation.add(mainControls, 'timeScale', 0, 1);
  simulation.open();

  brushControl = gui.add(mainControls, 'brush', [ 'none', 'ground', 'box', 'boxitem', 'brick']).onChange(function(b){
    // plank
    // tire
    // barrel
    // lava
    // water
    // cinderblock
    cc.Director.getInstance()._runningScene._children[0].setBrush(b);
  });
  gui.add(mainControls, 'clearSprites');
};


var cocos2dApp = cc.Application.extend({
    config:document['ccConfig'],
    s: null,

    ctor:function (scene) {
        this._super();
        this.startScene = scene;
        this.s = scene;
        cc.COCOS2D_DEBUG = this.config['COCOS2D_DEBUG'];
        cc.initDebugSetting();
        cc.setup(this.config['tag']);
        cc.AppController.shareAppController().didFinishLaunchingWithOptions();
    },
    applicationDidFinishLaunching:function () {
        if(cc.RenderDoesnotSupport()){
            alert("Browser doesn't support WebGL");
            return false;
        }
        var director = cc.Director.getInstance();

        cc.EGLView.getInstance().resizeWithBrowserSize(true);
        cc.EGLView.getInstance().setDesignResolutionSize(640, 480);//, cc.RESOLUTION_POLICY.SHOW_ALL);

        // turn on display FPS
        // director.setDisplayStats(this.config['showFPS']);

        // set FPS. the default value is 1.0/60 if you don't call this
        director.setAnimationInterval(1.0 / this.config['frameRate']);

        // load resources
        cc.LoaderScene.preload(g_resources, function () {
            director.replaceScene(new this.startScene());
        }, this);

        return true;
    }
});
var myApp = new cocos2dApp(HelloWorldScene);
