;(function(window){
  "use strict";

  window.requestAnimationFrame = (function(){
    return window.requestAnimationFrame       ||
           window.webkitRequestAnimationFrame ||
           window.mozRequestAnimationFrame    ||
           window.oRequestAnimationFrame      ||
           window.msRequestAnimationFrame     ||
           function(callback, element){
             window.setTimeout(callback, 1000 / 60);
           };
  })();

  var document = window.document, 
      canvasEle = document.querySelector("#line-particle"), 
      context = canvasEle.getContext("2d"), 
      particleNum = 50, 
      propData = [], 
      canvasWidth = 500, 
      canvasHeight = 500, 
      radius = 25, 
      PI = Math.PI, 
      easing = 50;

  var init = function(){
    var i = 0,
        len = particleNum,
        random = Math.random;

    onWinResize();

    for( ; i < len; i ++ ){
      propData[i] = {
        x: random() * canvasWidth,
        y: random() * canvasHeight,
        rotate: 0,//random() * 360,

        dx: random() * -4 + 2,
        dy: random() * -4 + 2,
        toX: 1,
        toY: -1,

        bezierR: random() * 300,
        bezierA: random() * 360,
        bezierD: (random() > 0.5? 1 : -1),
        bezierDa: random(),

        dr: random() * 360,
        toR: random() * -4 + 2,

        dS: 0.1,
        toS: 0.1        
      };

      propData[i].scale = propData[i].toS = ((i % 10) + 1) / 10;
      propData[i].color = getRGB(propData[i].rotate, 0.7, 0.7);

    }

    requestAnimationFrame(draw);
  };

  var draw = function(){

    var pData = propData,
        lo_getDist = getDist,
        i = 0,
        len = particleNum,
        random = Math.random,
        abs = Math.abs,
        cos = Math.cos,
        sin = Math.sin,
        dist = 300,
        endR = 360 * PI / 180,
        lo_getRGB = getRGB,
        lo_context = context,
        gradient;

    lo_context.restore();
    // lo_context.globalCompositeOperation = "source-over";
    // var grd = lo_context.createRadialGradient(238, 50, 10, 238, 50, 300);
    //   // light blue
    //   grd.addColorStop(0, '#8ED6FF');
    //   // dark blue
    //   grd.addColorStop(1, '#004CB3');

      // context.fillStyle = grd;

    // lo_context.clearRect();
    lo_context.fillStyle = "rgba(0, 0, 0, .02)";
    lo_context.fillRect(0, 0, canvasWidth, canvasHeight);


    // rect.position.x += 1;
    for( ; i < len; i ++ ){

      lo_context.beginPath();
      lo_context.fillStyle = pData[i].color;
      lo_context.arc(pData[i].x, pData[i].y, 1, 0, endR);
      lo_context.fill();

      for(var j = i + 1; j < len; j ++){
        if( dist > lo_getDist( pData[i].x, pData[i].y, pData[j].x, pData[j].y ) ){
          // gradient = lo_context.createLinearGradient(pData[i].x, pData[i].y, pData[j].x, pData[j].y);
          // gradient.addColorStop(0, pData[i].color);
          // gradient.addColorStop(1, pData[j].color);
          // lo_context.shadowBlur = 20;
          // lo_context.shadowColor = "red";
          lo_context.strokeStyle = pData[i].color;
          lo_context.beginPath();
          lo_context.moveTo(pData[i].x, pData[i].y);
          lo_context.bezierCurveTo(
            pData[i].x + cos( pData[i].bezierA * (PI / 180) ) * pData[i].bezierR,
            pData[i].y + sin( pData[i].bezierA * (PI / 180) ) * pData[i].bezierR,
            pData[j].x + cos( pData[j].bezierA * (PI / 180) ) * pData[j].bezierR,
            pData[j].y + sin( pData[j].bezierA * (PI / 180) ) * pData[j].bezierR,
            pData[j].x,
            pData[j].y
          );
          // lo_context.lineTo(pData[j].x, pData[j].y);
          lo_context.stroke();
        }// if
      }// for



      pData[i].x = pData[i].x + pData[i].dx * pData[i].toS;
      pData[i].y = pData[i].y + pData[i].dy * pData[i].toS;

      pData[i].dx = pData[i].dx + ( pData[i].toX - pData[i].dx ) / easing;
      pData[i].dy = pData[i].dy + ( pData[i].toY - pData[i].dy ) / easing;

      pData[i].color = lo_getRGB( parseInt(++pData[i].rotate % 360, 10), 0.7, 0.5);
      pData[i].bezierA = (pData[i].bezierA + pData[i].bezierD * pData[i].bezierDa) % 360;

      if( abs(pData[i].toX - pData[i].dx) < 0.01 ){
        pData[i].dx = pData[i].toX;
      }

      if( abs(pData[i].toY - pData[i].dy) < 0.01 ){
        pData[i].dy = pData[i].toY;
      }

      if( abs(pData[i].toS - pData[i].scale) < 0.01 ){
        pData[i].scale = pData[i].toS;
      }

      if( pData[i].x > canvasWidth + radius ){
        pData[i].x = -radius;
      } else if( pData[i].x < -radius ) {
        pData[i].x = canvasWidth + radius;
      }

      if( pData[i].y > canvasHeight + radius ){
        pData[i].y = -radius;
      } else if( pData[i].y < -radius ) {
        pData[i].y = canvasHeight + radius;
      }
    }

    // lo_context.shadowBlur = 20;
    // lo_context.shadowColor = "red";

    lo_context.save();
    requestAnimationFrame(draw);
  };

  var int = function(str) {
    return Math.floor( parseInt(str, 10) );
  };

  var getDist = function(x, y, dx, dy){
    return Math.sqrt( (x - dx) * (x - dx) + (y - dy) * (y - dy) );
  };

  var getRGB = function(h, s, v){
      var r,
          g,
          b,
          hi = (h / 60) >> 0,
          f = (h / 60 - hi),
          p = v * (1 - s),
          q = v * (1 - f * s),
          t = v * (1 - (1 - f) * s);

    if (s === 0){
      return String("rgb(" + parseInt(v * 255) + "," + parseInt(v * 255) + "," + parseInt(v * 255) + ")");
    } else {
      switch( hi ){
        case 0 :
          r = parseInt(v * 255);
          g = parseInt(t * 255);
          b = parseInt(p * 255);
        break;

        case 1 :
         r = parseInt(q * 255);
         g = parseInt(v * 255);
         b = parseInt(p * 255);
        break;

        case 2 :
         r = parseInt(p * 255);
         g = parseInt(v * 255);
         b = parseInt(t * 255);
        break;

        case 3 :
          r = parseInt(p * 255);
          g = parseInt(q * 255);
          b = parseInt(v * 255);
        break;

        case 4 :
          r = parseInt(t * 255);
          g = parseInt(p * 255);
          b = parseInt(v * 255);
        break;

        case 5 :
          r = parseInt(v * 255);
          g = parseInt(p * 255);
          b = parseInt(q * 255);
        break;

      }
      return String("rgb(" + r + "," + g + "," + b + ")");
    }
  };

  var onWinResize = function(event){
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;

    canvasEle.width = canvasWidth;
    canvasEle.height = canvasHeight;
  };

  var onMouseWheel = function(event) {
    var
      i = 0,
      len = particleNum,
      random = Math.random,
      mouseX = event.pageX,
      mouseY = event.pageY,
      direct = event.wheelDelta > 0? 1 : -1,
      dist = 0,
      vol = 10,
      difX = 0,
      difY = 0;

    for( ; i < len; i ++ ){

      dist = getDist( propData[i].x, propData[i].y, mouseX, mouseY );
      difX = (propData[i].x - mouseX);
      difY = (propData[i].y - mouseY);

      propData[i].dx = propData[i].dx + direct * vol * ( difX / dist);
      propData[i].dy = propData[i].dy + direct * vol * ( difY / dist);
      propData[i].dr = propData[i].dr + random() * 100;
    }
  };

  if (window.addEventListener) {
    window.addEventListener('DOMMouseScroll', onMouseWheel, false);
  }
  window.onmousewheel = document.onmousewheel = onMouseWheel;

  // document.addEventListener('DOMMouseScroll', onMouseWheel, false);
  window.addEventListener("resize", onWinResize, false);

  init();

}(window));