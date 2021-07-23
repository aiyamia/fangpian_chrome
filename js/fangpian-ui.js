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

function update_grid(Dx,Dy){
  //dx,dy本身就是整数
  del_x = Dx % cw;
  del_y = Dy % ch;

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
  for (let Tx = 0; del_x + Tx * cw <= bw; Tx += 1) {
      context.moveTo(del_x + Tx * cw, 0);
      context.lineTo(del_x + Tx * cw, bh);
  }
  context.lineDashOffset = -del_y+dash_stroke_width/2;
  context.strokeStyle = "lightgrey";
  context.stroke();

  //横线
  context.beginPath();
  for (let Ty = 0; del_y + Ty * ch <= bh; Ty += 1) {
      context.moveTo( 0, del_y + Ty * ch);
      context.lineTo(bw, del_y + Ty * ch);
  }
  context.lineDashOffset = -del_x+dash_stroke_width/2;
  context.strokeStyle = "lightgrey";
  context.stroke();
}
function update_mouse(dx,dy){
  $(".mouse").css({
    left: parseInt($(".mouse").css("left").replace("px",'')) + dx +'px',
    top: parseInt($(".mouse").css("top").replace("px",'')) + dy +'px'
  });
}