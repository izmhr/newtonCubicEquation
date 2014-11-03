var graph = function()
{
  var scaleX = 1.0;
  var scaleY = 1.0;
  var canvas = null;
  var stage = null;

  var wDefault = 1.0;
  var hDefault = 1.0;

  var w = 0;
  var h = 0;

  var a, b, c, d;

  var mainContainer = new createjs.Container();
  var axisContainer = new createjs.Container();
  var line = new createjs.Shape();
  var xaxis = new createjs.Shape();
  var yaxis = new createjs.Shape();

  var init = function()
  {
    // console.log(scale);
    canvas = document.getElementById('graph');
    stage = new createjs.Stage(canvas);
    stage.addChild(mainContainer);
    
    mainContainer.addChild(line);
    axisContainer.addChild(xaxis);
    axisContainer.addChild(yaxis);
    mainContainer.addChild(axisContainer);

    wDefault = stage.canvas.clientWidth;
    hDefault = stage.canvas.clientHeight;
    w = wDefault * scaleX;
    h = hDefault * scaleY;

    mainContainer.x = w/2;
    mainContainer.y = h/2;

    line.scaleY = -1; // 天地反転

    drawAxis();

    stage.update();
  };

  var drawCubic = function()
  {
    line.graphics.clear();
    var l = line.graphics.setStrokeStyle(1).beginStroke('#fff');
    var x = Math.floor(-w/2);
    l.moveTo(x, scaleY * calcCubic(x/scaleX));
    var xmax = Math.floor(w/2);
    for(; x < xmax; x++)
    {
      l.lineTo(x, scaleY * calcCubic(x/scaleX));
    };

    stage.update();
  };

  var calcCubic = function(x)
  {
    return a*x*x*x + b*x*x + c*x + d;
  };

  var setCubic = function(_a, _b, _c, _d)
  {
    a = _a;
    b = _b;
    c = _c;
    d = _d;
  };

  var drawAxis = function()
  {
    xaxis.graphics.clear();
    var lx = xaxis.graphics.setStrokeStyle(1).beginStroke('#F00');
    lx.moveTo(-w/2, 0);
    lx.lineTo( w/2, 0);

    yaxis.graphics.clear();
    var ly = yaxis.graphics.setStrokeStyle(1).beginStroke('#00F');
    ly.moveTo(0, -h/2);
    ly.lineTo(0,  h/2);
  };

  var zoomX = function(val)
  {
    scaleX = val;
    if(scaleX <= 0.0) scaleX = 0.0;

    w = wDefault * scaleX;

    drawAxis();
    drawCubic();
    stage.update();
  };

  var zoomY = function(val)
  {
    scaleY = val;
    if(scaleY <= 0.0) scaleY = 0.0;

    h = hDefault * scaleY;

    drawAxis();
    drawCubic();
    stage.update();
  };

  return {
    init: init,
    drawCubic: drawCubic,
    setCubic: setCubic,
    drawCubic: drawCubic,
    zoomX: zoomX,
    zoomY: zoomY
  };

};