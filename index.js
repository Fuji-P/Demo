"use strict";
//広域変数
let engine;		//物理エンジンオブジェクト
let ctx;		//グラフィックコンテキスト
let colors = ["yellow", "green", "orange", "blue", "white"];	//色の配列

//整数の乱数
function rand(v) {
	return Math.floor(Math.random() * v);
}

function init() {
	let r;
	//コンストラクタの引数(世界の座標、幅、高さ、重力)
	engine = new Engine(0, 0, 600, 800, 0, 9.8);

	//(x, y)を左上座標とする幅width、高さheightの矩形を作成
	r = new RectangleEntity(500, 50, 50, 400);
	r.color = "green";
	//作成したオブジェクトを物理世界に追加
	engine.entities.push(r);

	//(x, y)を左上座標とする幅width、高さheightの矩形を作成
	r = new RectangleEntity(0, 50, 50, 400);
	r.color = "yellow";
	//作成したオブジェクトを物理世界に追加
	engine.entities.push(r);

	//(x0, y0)から(x1, y1)への線を引く
	r = new LineEntity(50, 300, 400, 350);
	r.color = "orange";
	//作成したオブジェクトを物理世界に追加
	engine.entities.push(r);

	//(x0, y0)から(x1, y1)への線を引く
	r = new LineEntity(500, 400, 100, 450);
	r.color = "orange";
	//作成したオブジェクトを物理世界に追加
	engine.entities.push(r);

	for (let i = 0; i < 7; i++) {
		for (let j = 0; j < 3; j++) {
			//(x, y)を中心座標とする半径radiusの円を作成(BodyStatic = 円が固定されているか)
			r = new CircleEntity(i * 60 + 100, j * 60 + 100, 5, BodyStatic);
			r.color = colors[j];
			//作成したオブジェクトを物理世界に追加
			engine.entities.push(r);
		}
	}

	for (let i = 0; i < 20; i++) {
		//(x, y)を中心座標とする半径radiusの円を作成(BodyDynamic = 動的に動くか)
		r = new CircleEntity(rand(400) + 50, rand(200), 10, BodyDynamic);
		r.color = colors[rand(5)];

		//円オブジェクトの初速度を設定
		r.velocity.x = rand(10) - 5;
		r.velocity.y = rand(10) - 5;
		//作成したオブジェクトを物理世界に追加
		engine.entities.push(r);
	}

	ctx = document.getElementById("canvas").getContext("2d");
	setInterval(tick, 50);
}

function tick() {
	//エンジンの時間を0.01進める
	engine.step(0.01);
	//再描画
	repaint();
}

//再描画
function repaint() {
	//画面全体を黒で塗りつぶしてクリア
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, 600, 600);
	for (let i = 0; i < engine.entities.length; i++) {
		let e = engine.entities[i];
		//コンテキストの塗りつぶし色をcolorプロパティで設定
		ctx.fillStyle = e.color;
		//コンテキストの描画色をcolorプロパティで設定
		ctx.strokeStyle = e.color;
		switch (e.shape) {
			//矩形のとき
			case ShapeRectangle:
				ctx.fillRect(e.x, e.y, e.w, e.h);
				break;
			//円のとき
			case ShapeCircle:
				ctx.beginPath();
				ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
				ctx.closePath();
				ctx.fill();
				break;
			//線のとき
			case ShapeLine:
				ctx.beginPath();
				ctx.moveTo(e.x0, e.y0);
				ctx.lineTo(e.x1, e.y1);
				ctx.stroke();
				break;
		}
	}
}