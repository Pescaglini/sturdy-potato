import { Application, Loader, Sprite } from 'pixi.js'

const app = new Application({
	view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
	resolution: window.devicePixelRatio || 1,
	autoDensity: true,
	backgroundColor: 0x6495ed,
	width: 1080,
	height: 720
});
//Loader, sirve para precargar imagenes si necesito acceder a ella o a su info de antemano.
Loader.shared.add({url: "./silla.jpg", name: "mySilla"});
Loader.shared.add({url: "./clampy.png", name: "myClampy"});

Loader.shared.onComplete.add(()=>{
	const clampy: Sprite = Sprite.from("myClampy");
	const silla: Sprite = Sprite.from("mySilla");

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
	
	app.stage.addChild(silla);
	app.stage.addChild(clampy);
});

Loader.shared.load();
