// Box width
var bw = window.innerWidth * 0.9;
// Box height
var bh = window.innerHeight * 0.80;

var dash_stroke_width = 8;
var dash_void_width = 8;

// cell width
var mult = Math.floor(120/dash_stroke_width);
var cw = (Math.round(mult%2)===0?mult:mult+1) * dash_stroke_width;
// cell height
var ch = cw;

function update_grid(x,y,x_s,y_s,Dx,Dy){

  //dx,dy本身就是整数
  var oDx = cw - Dx % cw;
  var oDy = ch - Dy % ch;
  dx = (x-x_s + oDx) % cw
  dy = (y-y_s + oDy) % ch;

  grid = $('.grid')[0];
  grid.width = bw; 
  grid.height = bh;
  grid.style.width = bw + "px"; 
  grid.style.height = bh + "px"; 
  
  var context = grid.getContext("2d");
  // context.lineWidth = 1;//默认就是1
  
  context.setLineDash([dash_stroke_width, dash_void_width]);

  //纵线
  context.beginPath();
  for (let Tx = 0; dx + Tx * cw <= bw; Tx += 1) {
      context.moveTo(dx + Tx * cw, 0);
      context.lineTo(dx + Tx * cw, bh);
  }
  context.lineDashOffset = -dy+dash_stroke_width/2;
  context.strokeStyle = "lightgrey";
  context.stroke();

  //横线
  context.beginPath();
  for (let Ty = 0; dy + Ty * ch <= bh; Ty += 1) {
      context.moveTo( 0, dy + Ty * ch);
      context.lineTo(bw, dy + Ty * ch);
  }
  context.lineDashOffset = -dx+dash_stroke_width/2;
  context.strokeStyle = "lightgrey";
  context.stroke();

  console.log(`dx: ${x - x_s};${x - x_s>0?"右移":"左移"}`);
  console.log(`dy: ${y - y_s};${y - y_s>0?"下移":"上移"}`);
  $(".mouse").css({
    left: parseInt($(".mouse").css("left").replace("px",'')) + x - x_s +'px',
    top: parseInt($(".mouse").css("top").replace("px",'')) + y - y_s +'px'
  });
  // console.log(`x:${x}`);
  
  
}
