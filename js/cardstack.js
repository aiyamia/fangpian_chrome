$(document).ready(async function () {
  $('#clear').click(async()=>{
    if (window.confirm('确认要全部清空吗，清空后无法恢复哟~')) {
      let word_table_todelete = localforage.createInstance({
        name: "Fangpian",
        storeName   : 'word_table'
      });
      await word_table_todelete.clear();
      window.location.reload();
    }
  })
  $('#flavor').click(async()=>{
    $(":root").css({"--is-squre":1-$(":root").css("--is-squre")});
    setTimeout(()=>{
      Array.prototype.map.call($('.back'),el=>{if (checkOverflow(el)){$(el).css({'justify-content':"flex-start"})}})
    },1000);
  })

  const loadData = async() =>{
    var word_table = localforage.createInstance({
      name: "Fangpian",
      storeName   : 'word_table', // Should be alphanumeric, with underscores.
      description : 'store the words data of pronunciation and meaning',
      size        : 1000, // Size of database, in bytes. IndexedDB-only for now.
    });
    try {
      var words = await word_table.keys();
      let data,$card,$front,$back,$pron,$meanings,$meaning,$ps,$exp;
      words.forEach(async word => {
        data = await word_table.getItem(word);
        $card = $('<div class="card"></div>');
        $front = $(`<div class="front">${word}</div>`)
        $back = $('<div class="back"></div>')
        $pron = $('<div class="pronunciation"></div>');
        $meanings = $('<table class="meanings"></table>');
        data.meanings.forEach(meaning => {
          $ps = $(`<td class="meaning_ps">${meaning.ps}</td>`);
          $exp = $('<td class="meaning_exp"></td>');
          meaning.exp.forEach((exp_word,index,exp_arr)=>{
            if(index != exp_arr.length-1){
              $exp.append(`<span class="exp_word">${exp_word}；</span>`);
            }else{
              $exp.append(`<span class="exp_word">${exp_word}</span>`);
            }
          })
          $meaning = $('<tr class="meaning"></tr>');
          $meaning.append($ps);
          $meaning.append($exp);
          $meanings.append($meaning);
        });
        $pron.append( `/${data.pronunciation.BrE}/` );
        $back.append($pron);
        $back.append($meanings);
        $card.append($front)
        $card.append($back)
        $("#cardstack").append($card);
      });
      $('#cardstack').on('click', '.card', (e) => {
        e.target.classList.toggle("flipCard");
      });
      $('#cardstack').on('click', '.card .back', (e) => {
        e.stopPropagation();
      });
      var observer = new MutationObserver(function(mutations) {
        if ($('.back').length==words.length) {
            Array.prototype.map.call($('.back'),el=>{if (checkOverflow(el)){$(el).css({'justify-content':"flex-start"})}})
            observer.disconnect();
         }
      });
      observer.observe(document, {attributes: false, childList: true, characterData: false, subtree:true});
    }
    catch(err) {
      console.log(err);
    };
  };
  
  // await loadData();
  update_grid(0,0,0,0,0,0);
  let isPan = false;
  let isMove = false;
  var x_start = 0;
  var y_start = 0;
  var Dx = 0;
  var Dy = 0;
  var keydownFired = false;
  $("body").keydown((e)=>{
    keydownFired = true;
    if (e.ctrlKey || macKeys.cmdKey) {
      isPan = true;
      $(".grid").css("cursor", "grab");
    }
  });
  $("body").keyup((e)=>{
    keydownFired = false;
    if (!e.ctrlKey || !macKeys.cmdKey) {
      isPan = false;
      $(".grid").css("cursor", "initial");
    }
  });
  $(".grid").mousedown((e)=>{
    if (isPan) {
      $(".grid").css("cursor", "grabbing");
      x_start  = e.offsetX;
      y_start = e.offsetY;
      isMove = true;
    }else{
      $(this).trigger('onmousedown');
    }
  });
  $(".grid").mousemove((e)=>{
    if (isMove&&isPan) {
      update_grid(e.offsetX,e.offsetY,x_start,y_start,Dx,Dy)
    }
  });
  $(".grid").mouseup((e)=>{
    if (isPan&&isMove) {
      $(".grid").css("cursor", "grab");
      Dx += x_start - e.offsetX;
      Dy += y_start - e.offsetY;
      isMove = false;
    }else{
      $(this).trigger('onmouseup');
    }
  });
  
  $(".grid").click((e)=>{
    if (!keydownFired) {
      let y = e.offsetY;
      let x = e.offsetX;
      // let ddy = Dy>=0 ? (y-(y+Dy)%ch) : (y-(ch-(-Dy-y)%ch));
      // // console.log(`ddy: ${ddy};ch:${ch};Dy:${Dy};y:${y};\ny+Dy:${y+Dy};(y+Dy)%ch:${(y+Dy)%ch};\ny-(y+Dy)%ch:${y-(y+Dy)%ch}`);
      // console.log(`ddy: ${ddy};ch:${ch};Dy:${Dy};y:${y};\n-Dy-y:${-Dy-y};(-Dy-y)%ch:${(-Dy-y)%ch};\n(ch-(-Dy-y)%ch):${(ch-(-Dy-y)%ch)}\ny-(ch-(-Dy-y)%ch):${y-(ch-(-Dy-y)%ch)}`);
      
      let z1 = Math.floor((Dx+x)/cw);
      let z2 = Math.floor((Dy+y)/ch);
  
      let x_mouse_global = z1 * cw;
      let y_mouse_global = z2 * ch;
  
      let mouse_left = x_mouse_global - Dx + cw/2 + 2.5;
      let mouse_top = y_mouse_global - Dy + ch/2 + 1.5;
  
      $(".mouse").css({
        width:cw-2 + 'px',
        height:ch-2 + 'px',
        left: mouse_left + 'px',
        top: mouse_top + 'px'
      });
    }
  })
  

  function checkOverflow(el)
  {
    var curOverflow = el.style.overflow;
    if ( !curOverflow || curOverflow === "visible" )
        el.style.overflow = "hidden";
    var isOverflowing = el.clientWidth < el.scrollWidth 
        || el.clientHeight < el.scrollHeight;
    el.style.overflow = curOverflow;
    return isOverflowing;
  }
});