//=============================================================================
// Emerald Engine Plugins - Splash Screen
// EM_SplashScreen.js
//=============================================================================
/*:
 * @plugindesc Emerald engine : splash screen system
 *
 * @target MZ MV
 * @author LunaTechs | Nio Kasgami
 * @url
 * @base Gemstone
 * @orderAfter Gemstone
 * @param core
 * @text Core
 * 
 * @param useMe
 * @parent core
 * @text use ME
 * @desc tell whether or not logos should use ME
 * @type boolean
 * @default true
 * @on yes
 * @off no
 * 
 * @param useColor
 * @text Use Color bitmap
 * @parent core
 * @desc whether or not if the background should use a bitmap color or an sprite
 * @type boolean
 * @default true
 * @on yes
 * @off no
 * 
 * @param background
 * @text Background
 * 
 * @param backfilename
 * @parent background
 * @desc the background filename
 * @type file
 * @dir img/titles1
 * @default Default
 * 
 * @param color
 * @text Color
 * @parent background
 * @desc The background bitmap color
 * @type struct<rgb>
 * 
 * @param logos
 * @desc The list of logos to display
 * @type struct<logos>[]
 * @default []
 *
 *
 @help
  this plugins does not have plugin commands
  

*/

/*~struct~rgb:
 * @param r
 * @text Red
 * @desc the red color
 * @type number
 * @min 0
 * @max 250
 * @default 0
 *
 * @param g
 * @text Green
 * @desc the green color
 * @type number
 * @min 0
 * @max 250
 * @default 0
 *
 * @param b
 * @text Blue
 * @desc the blue color
 * @type number
 * @min 0
 * @max 250
 * @default 0
 */

/*~struct~logos:
* @param filename
* @desc the logo filename
* @type file
* @dir img/titles1
* @default Default

* @param duration
* @desc The number of time in frame the logo stay shown
* @type number
* @default 120

* @param me
* @desc ME
* @desc the audio ME
* @type file
* @dir audio/me
* @default Default
*/

var EM = EM || {};
EM.param = EM.param || {};

//=============================================================================
// Parameter Variables
//=============================================================================

(() => {
  const pluginName = "EM_SplashScreen";
  const rawParams = Gem.ParamManager.find();

  EM.param.splash = Gem.ParamManager.register(pluginName, rawParams);
})();


//=============================================================================
// Scene_SplashScreen
//=============================================================================

/**
 * the scene who handles the display of game logos
 */
class Scene_SplashScreen extends Scene_Base {

  /**
   * Creates an instance of Scene_SplashScreen.
   * @memberof Scene_SplashScreen
   */
  constructor() {
    super();
  }

  /**
   * initialize the scene
   *
   * @memberof Scene_SplashScreen
   */
  initialize() {
    super.initialize();
    this._params = EM.param.splash;
    this._index = 0;
    this._timer = 0;
    this._switching = false;
    this._logos = [];
    this._switchingScene = false;
  }

  /**
   * start the scene.
   *
   * @memberof Scene_SplashScreen
   */
  start() {
    super.start();
    this.executeLogos();
    if (this._params.useMe) {
      this.playMe();
    }
    this.startFadeIn(this.fadeSpeed(), false);
  }

  /**
   * update the scene
   *
   * @memberof Scene_SplashScreen
   */
  update() {
    super.update();
    if (!this._switchingScene) {
      if (this.isReady() && !this._switching) {
        this._timer++;
      }
      if (this._timer >= this._params.logos[this._index].duration && this.isReady() && !this._switching) {
        this.startFadeOut(this.fadeSpeed(), false);
        this._switching = true;
      }
      if (!this.isFading() && this._switching) {
        this.switchLogo();
        this.startFadeIn(this.fadeSpeed(), false);
      }
    }
  }

  /**
   * execute the logo visibility
   *
   * @memberof Scene_SplashScreen
   */
  executeLogos() {
    this._logos[this._index].visible = true;
  }

  /**
   * switch the logo to the next logo.
   *
   * @memberof Scene_SplashScreen
   */
  switchLogo() {
    this._logos[this._index].visible = false;
    this._index++;
    if (this._index < this._logos.length) {
      this._logos[this._index].visible = true;
      this._timer = 0;
      this._switching = false;
      if (this._params.useMe) {
        this.playMe();
      }
    } else {
      this.gotoTitleScreen();
    }
  }

  /**
   * play the scene ME
   *
   * @memberof Scene_SplashScreen
   */
  playMe() {
    let audio = {};
    audio.name = this._params.logos[this._index].me;
    audio.volume = 100;
    audio.pan = 0;
    audio.pitch = 100;
    audio.pos = 0;
    AudioManager.stopAll();
    AudioManager.playMe(audio);
  }

  /**
   * create the scene contents
   *
   * @memberof Scene_SplashScreen
   */
  create() {
    super.create();
    this.createBackground();
    this.createLogos();
  }

  /**
   * create the scene background.
   *
   * @memberof Scene_SplashScreen
   */
  createBackground() {
    this.createBitmap();
    this._backgroundSprite = new Sprite(this._backgroundBitmap);
    this.centerSprite(this._backgroundSprite);
    this.addChild(this._backgroundSprite);
  }

  /**
   * create the bitmap according the settings
   *
   * @memberof Scene_SplashScreen
   */
  createBitmap() {
    if (this._params.useColor) {
      this._backgroundBitmap = new Bitmap(Graphics.width, Graphics.height);
      let color = this._params.color;
      let rgb = Gem.Utils.convertToRGB(color.r, color.g, color.b);
      this._backgroundBitmap.fillAll(rgb);
    } else {
      this._backgroundBitmap = ImageManager.loadTitle1(this._params.backfilename);
    }
  }

  /**
   * create the array of sprite
   *
   * @memberof Scene_SplashScreen
   */
  createLogos() {
    this._logos = [];
    let param = this._params.logos;
    for (let i = 0; i < param.length; i++) {
      let bitmap = ImageManager.loadTitle1(param[i].filename);
      this._logos[i] = new Sprite(bitmap);
      this._logos[i].visible = false;
      this.centerSprite(this._logos[i]);
      this.addChild(this._logos[i]);
    }
  }

  /**
   * Stop the scene and go to the titlescreen
   *
   * @memberof Scene_SplashScreen
   */
  gotoTitleScreen() {
    this._switchingScene = true;
    this.checkPlayerLocation();
    DataManager.setupNewGame();
    SceneManager.goto(Scene_Title);
    Window_TitleCommand.initCommandPosition();
  }

  /**
   * check wether the player location is valid (due to change to boot)
   *
   * @memberof Scene_SplashScreen
   */
  checkPlayerLocation() {
    if ($dataSystem.startMapId == 0) {
      throw new Error("Player's starting position is not set");
    }
  }
}

//=============================================================================
// Scene_Boot
// Overwriting the function due to it's nature
//=============================================================================

Gem.Utils.inject(Scene_Boot, "startNormalGame", function () {
  this.fadeOutAll();
  SceneManager.goto(Scene_SplashScreen);
}, false, true);

//=============================================================================
// Scene_GameEnd
// Overwriting the function due to it's nature
//=============================================================================

Gem.Utils.inject(Scene_GameEnd, "commandToTitle", function () {
  this.fadeOutAll();
  SceneManager.goto(Scene_SplashScreen);
}, false, true);

//=============================================================================
// END OF FILE
//=============================================================================