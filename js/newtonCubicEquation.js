// fx = ax^3 + bx^2 + cx + d = 0 を解く
// a!= 0とする

// 近似開始値
var s  = 0.2; // TODO これは入力してもらう

// 終了判定 繰り返してもほとんど変化がなくなったら終了とする
var THRESH = 0.00001;

// そもそもどんな関数なのかは、grapher(Mac) など使って確認すると良いです

var PRESETS = [
  {a: 1, b:-18, c: 105, d: -196},
  {a: 1, b: -4, c: -10, d:  -12},
  {a: 1, b: -2, c:  -5, d:    6},
  {a: 1, b:  2, c:   3, d:    0},
  {a: 1, b:  7, c:  -5, d:  -75}
];

var mGraph = new graph();
var result = "";

var calc = function(a, b, c, d, s)
{

  console.log("solve cubic equation: " + a + 'x^3 + ' + b + 'x^2 + ' + c + 'x + ' + d + ' = 0; start with x = ' + s);

  var starttime = (new Date()).getTime();

  var realAns = [];

  // 0が解に含まれる場合
  // f(x) = ax(x^2 + (b/a)x + c/a) = 0 を解くことになる
  if(d == 0)
  {
    s = 0;
    var D = b*b - 4*a*c;
    if(D > 0)
    {
      // 異なる解三つ
      var r1 = (-b + Math.sqrt(D)) / (2*a);
      var r2 = (-b - Math.sqrt(D)) / (2*a);
      result = "result: " + 0 + ", " + r1 + ", " + r2;
      realAns = [s, r1, r2];
    }
    else if(D == 0)
    {
      // 0と重解1組
      var r = -b / (2*a);
      result = "result: " + 0 + ", " + r + ", " + r;
      realAns = [s, r];
    }
    else
    {
      // 0と共役虚数解1組
      var r_real = -b / (2*a);
      var r_imag = Math.sqrt(-D) / (2*a);
      result = "result: " + 0 + ", " + r_real + "+" + r_imag + "i, " + r_real + "-" + r_imag + "i";
      realAns = [s];
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
        console.log("極値を見事に引き当ててしまったので、ちょっとずらします");
        s += 0.01;
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

    if(D1 > 0 && D2 < 0)  // ★異なる実数解3つ
    {
      var r1 = (-A + Math.sqrt(A*A - 4*B)) / 2;
      var r2 = (-A - Math.sqrt(A*A - 4*B)) / 2;
      result = "result: " + s + ", " + r1 + ", " + r2;
      realAns = [s, r1, r2];
    }
    else if(D1 > 0 && D2 == 0)  // ★異なる実数解2つ(重根あり)
    {
      var r = -999999;
      if( Math.abs(A*A - 4*B) < THRESH) // sが重解の一つではない場合
      {
        r = -A/2;
        result = "result: " + s + ", " + r + ", " + r;
      }
      else  // sが重解の一つで、 fx = a(x-s)(x-s)(x-C) = 0 と分解できるとき
      {
        r = -d / (s*s*a); // = C;
        result = "result: " + s + ", " + s + ", " + r;
      }
      realAns = [s, r];
    }
    else
    {
      // 実数解1つ + 共役虚数解1組
      var r_real = -A / 2;
      var r_imag = Math.sqrt(-A*A + 4*B) / 2;
      result = "result: " + s + ", " + r_real + "+" + r_imag + "i, " + r_real + "-" + r_imag + "i";
      realAns = [s];
    }
  }

  console.log("result: " + result);
  console.log("past: " + ((new Date()).getTime() - starttime) + " ms" );

  return {text: result, realAnsArray: realAns};
};

function draw(a, b, c, d, realAnsArray)
{
  mGraph.setCubic(a, b, c, d);
  mGraph.zoomX(graphScaleX);
  mGraph.zoomY(graphScaleY);
  mGraph.drawCubic();
  mGraph.drawAns(realAnsArray);
};

function calcAndDraw()
{
  var s = document.getElementById('s').valueAsNumber;
  var a = document.getElementById('a').valueAsNumber;
  var b = document.getElementById('b').valueAsNumber;
  var c = document.getElementById('c').valueAsNumber;
  var d = document.getElementById('d').valueAsNumber;

  var result = calc(a, b, c, d, s)
  draw(a, b, c, d, result.realAnsArray);

  document.getElementById('result').textContent = result.text;
};

var graphScaleX = 11;
var graphScaleY = 11;

function zoomX(up)
{
  if(up)
    graphScaleX += 1;
  else
    graphScaleX -= 1;
  if(graphScaleX <= 1)
    graphScaleX = 2;

  graphScaleY = graphScaleX / 2;

  calcAndDraw();

  document.getElementById('scalex').textContent = 'scale x: ' + graphScaleX;
  document.getElementById('scaley').textContent = 'scale y: ' + graphScaleY;
}

function init()
{
  document.getElementById('scalex').textContent = 'scale x: ' + graphScaleX;
  document.getElementById('scaley').textContent = 'scale y: ' + graphScaleY;
  mGraph.init();

  // PRESETS FUNCS
  var domSelect = document.getElementById('presets');
  for(var i = 0; i < PRESETS.length; i++)
  {
    var domOption = document.createElement('option');
    domOption.textContent = PRESETS[i].a + 'x^3 + ' + PRESETS[i].b + 'x^2 + ' + PRESETS[i].c + 'x + ' + PRESETS[i].d;
    domOption.id = 'preset' + i;

    domSelect.appendChild(domOption);
  }
  domSelect.onchange = function()
  {
    document.getElementById('a').value = PRESETS[domSelect.selectedIndex].a;
    document.getElementById('b').value = PRESETS[domSelect.selectedIndex].b;
    document.getElementById('c').value = PRESETS[domSelect.selectedIndex].c;
    document.getElementById('d').value = PRESETS[domSelect.selectedIndex].d;
  };
  calcAndDraw();
};
window.onload = init;