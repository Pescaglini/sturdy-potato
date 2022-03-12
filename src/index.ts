import { Application, Container, Loader, Sprite } from 'pixi.js'

const app = new Application({
	view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
	resolution: window.devicePixelRatio || 1,
	autoDensity: true,
	backgroundColor: 0x6495ed,
	width: 1080,
	height: 720
});

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
window.dispatchEvent(new Event("resize"));

Loader.shared.add({url: "./silla.jpg", name: "mySilla"});
Loader.shared.add({url: "./clampy.png", name: "myClampy"});
Loader.shared.add({url: "./crack.png", name: "myCrack"});

Loader.shared.onComplete.add(()=>{
	const clampy: Sprite = Sprite.from("myClampy");
	const silla: Sprite = Sprite.from("mySilla");
	const crack: Sprite = Sprite.from("myCrack");
	const clampeada: Container = new Container();
	
	console.log("Tamaño imagen: ", clampy.width, clampy.height);
	
	//Clampy
	clampy.anchor.set(0.5);
	clampy.x = 0 + (clampy.width / 2);
	clampy.y = -60 + (clampy.height / 2);
	clampy.angle = 35;
	
	//Silla
	silla.anchor.set(0.5);
	silla.x = app.screen.width / 2;
	silla.y = app.screen.height / 2;

	//Crack
	crack.position.set(app.screen.width/2,app.screen.height/2);
	crack.scale.set(0.2);
	
	clampeada.addChild(silla);
	clampeada.addChild(clampy);

	clampeada.scale.set(0.5);
	clampeada.position.set(100,100);

	app.stage.addChild(clampeada);
	app.stage.addChild(crack);
});

Loader.shared.load();
