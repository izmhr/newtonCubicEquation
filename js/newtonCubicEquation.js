// fx = ax^3 + bx^2 + cx + d = 0 を解く
// a!= 0とする

// 近似開始値
var s  = 0.2; // TODO これは入力してもらう

// 終了判定 繰り返してもほとんど変化がなくなったら終了とする
var THRESH = 0.00001;

// そもそもどんな関数なのかは、grapher(Mac) など使って確認すると良いです

// var a = 1;
// var b = -18;
// var c = 105;
// var d = -196;

// var a = 1;
// var b = -4;
// var c = -10;
// var d = -12;

// var a = 1;
// var b = -2;
// var c = -5;
// var d = 6;

// var a = 1;
// var b = 2;
// var c = 3;
// var d = 0;

var mGraph = new graph();
var result = "";

var calc = function(a, b, c, d)
{

  console.log("solve cubic equation: " + a + 'x^3 + ' + b + 'x^2 + ' + c + 'x + ' + d + ' = 0;');

  var starttime = (new Date()).getTime();

  // 0が解に含まれる場合
  // f(x) = ax(x^2 + (b/a)x + c/a) = 0 を解くことになる
  if(d == 0)
  {
    var D = b*b - 4*a*c;
    if(D > 0)
    {
      // 異なる解三つ
      var r1 = (-b + Math.sqrt(D)) / (2*a);
      var r2 = (-b - Math.sqrt(D)) / (2*a);
      result = "result: " + 0 + ", " + r1 + ", " + r2; 
    }
    else if(D == 0)
    {
      // 0と重解1組
      var r = -b / (2*a);
      result = "result: " + 0 + ", " + r + ", " + r;
    }
    else
    {
      // 0と共役虚数解1組
      var r_real = -b / (2*a);
      var r_imag = Math.sqrt(-D) / (2*a);
      result = "result: " + 0 + ", " + r_real + "+" + r_imag + "i, " + r_real + "-" + r_imag + "i";
    }
  }
  else
  {
    // 近似開始値として与えたsが初めから解だった場合は、それをそのまま利用する
    // if(a*s*s*s + b*s*s + c*s + d == 0)

    // そうで無い場合は、いわゆるニュートン法で近似する
    if(a*s*s*s + b*s*s + c*s + d != 0)
    {
      // 極値になるようなsを指定させてはいけない。(ニュートン法が収束しない)
      if(3*a*s*s + 2*b*s + c == 0)
      {
        // TODO 異なるsを指定させる処理をくわえる。
        console.log("極値を見事に引き当てました");
        return 1;
      }

      // ★★★ニュートン法★★★
      while(true)
      {
        s_ = s; // 一回前のものを覚えておく
        s = (2*a*s*s*s + b*s*s - d) / (3*a*s*s + 2*b*s + c);
        if(Math.abs(s_ - s) < THRESH) break;
      }
    }

    // 判別式
    // http://www2.odn.ne.jp/~aai55890/donnwa2/sanzihannbetu.htm
    var D1 = b*b - 3*a*c; // f'x の判別式。
    var D2 = 27*a*a*d*d - 18*a*b*c*d - b*b*c*c + 4*b*b*b*d + 4*a*c*c*c; // 極値α,βについて f(α)*f(β) の正負を判定する

    // fx = a(x-s)(x^2 + Ax + B) = 0 と分解したとき
    var A = (b + a*s) / a;
    var B = (c + b*s + a*s*s) / a;

    if(D1 > 0 && D2 < 0)
    {
      // 異なる実数解3つ
      var r1 = (-A + Math.sqrt(A*A - 4*B)) / 2;
      var r2 = (-A - Math.sqrt(A*A - 4*B)) / 2;
      result = "result: " + s + ", " + r1 + ", " + r2;
    }
    else if(D1 > 0 && D2 == 0)
    {
      // 異なる実数解2つ(重根あり)
      var r = -A / 2;
      result = "result: " + s + ", " + r + ", " + r;
    }
    else
    {
      // 実数解1つ + 共役虚数解1組
      var r_real = -A / 2;
      var r_imag = Math.sqrt(-A*A + 4*B) / 2;
      result = "result: " + s + ", " + r_real + "+" + r_imag + "i, " + r_real + "-" + r_imag + "i";
    }
  }

  console.log("past: " + ((new Date()).getTime() - starttime) + " ms" );

  mGraph.setCubic(a, b, c, d);
  mGraph.zoomX(graphScaleX);
  mGraph.zoomY(graphScaleY);
  mGraph.drawCubic();

  document.getElementById('result').textContent = result;

};

function calcAndDraw()
{
  console.log("calcAndDraw");
  var a = document.getElementById('a').valueAsNumber;
  var b = document.getElementById('b').valueAsNumber;
  var c = document.getElementById('c').valueAsNumber;
  var d = document.getElementById('d').valueAsNumber;

  calc(a, b, c, d)
};

var graphScaleX = 11;
var graphScaleY = 11;

function zoomX(up)
{
  if(up)
    graphScaleX += 5;
  else
    graphScaleX -= 5;
  if(graphScaleX <= 0)
    graphScaleX = 1;

  mGraph.zoomX(graphScaleX);
  document.getElementById('scalex').textContent = 'scale x: ' + graphScaleX;
}

function zoomY(up)
{
  if(up)
    graphScaleY += 5;
  else
    graphScaleY -= 5;
  if(graphScaleY <= 0)
    graphScaleY = 1;

  mGraph.zoomY(graphScaleY);
  document.getElementById('scaley').textContent = 'scale y: ' + graphScaleY;
}

function init()
{
  document.getElementById('scalex').textContent = 'scale x: ' + graphScaleX;
  document.getElementById('scaley').textContent = 'scale y: ' + graphScaleY;
  mGraph.init();
  calcAndDraw();
};
window.onload = init;