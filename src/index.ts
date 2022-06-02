import { Application, Loader, Ticker } from 'pixi.js'
import { Group } from 'tweedle.js';
import { assets } from './assets';
import { GameScene } from './scenes/GameScene';
import { Keyboard } from './utils/Keyboard';

export const WIDTH = 1920;
export const HEIGHT = 1080;
export let RIGHTCLICK = false;

const app = new Application({
	view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
	resolution: window.devicePixelRatio || 1,
	autoDensity: true,
	backgroundColor: 0x6495ed,
	width: WIDTH,
	height: HEIGHT
});

Keyboard.initialize();

window.addEventListener("resize", ()=>{
	const scaleX = window.innerWidth / app.screen.width;
	const scaleY = window.innerHeight / app.screen.height;
	const scale = Math.min(scaleX,scaleY);

	const gameWidth = Math.round(app.screen.width * scale);
	const gameHeight = Math.round(app.screen.height * scale);

	const marginHorizontal =  Math.floor((window.innerWidth - gameWidth) / 2);
	const marginVertical =  Math.floor((window.innerHeight - gameHeight) / 2);

	app.view.style.width = gameWidth + "px";
	app.view.style.height = gameHeight + "px";

	app.view.style.marginLeft = marginHorizontal.toString() + "px";
	app.view.style.marginRight = marginHorizontal.toString() + "px";
	app.view.style.marginTop = marginVertical.toString() + "px";
	app.view.style.marginBottom = marginVertical.toString() + "px";

});

window.addEventListener('contextmenu', function (e) {
	RIGHTCLICK = true;
	e.preventDefault();}, 
	false); 

window.dispatchEvent(new Event("resize"));

Loader.shared.add(assets);

Loader.shared.onComplete.add(()=>{
	const myScene = new GameScene();
	app.stage.addChild(myScene);
	Ticker.shared.add(function (deltaFrame){
		Group.shared.update();
		myScene.mousePosition(app.renderer.plugins.interaction.mouse.global);
		myScene.update(Ticker.shared.deltaMS, deltaFrame);
	})
	
});

Loader.shared.load();
