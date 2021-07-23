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
  
  await loadData();
  update_grid(0,0);
  let isPan = false;
  let isMove = false;
  var x = 0;
  var y = 0;
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
      x = e.offsetX;
      y = e.offsetY;
      isMove = true;
    }else{
      $(this).trigger('onmousedown');
    }
  });
  $(".grid").mousemove((e)=>{
    if (isMove&&isPan) {
      dx = e.offsetX - x;
      dy = e.offsetY - y;
      Dx += dx;
      Dy += dy;
      update_grid(Dx,Dy);
      update_mouse(dx,dy);
      x = e.offsetX;
      y = e.offsetY;
    }
  });
  $(".grid").mouseup((e)=>{
    if (isPan&&isMove) {
      $(".grid").css("cursor", "grab");
      isMove = false;
    }else{
      $(this).trigger('onmouseup');
    }
  });
  
  $(".grid").click((e)=>{
    if (!keydownFired) {
  
      let mouse_left = $(".grid")[0].offsetLeft + $(".grid")[0].clientLeft + cw * Math.floor((-Dx+e.offsetX)/cw)+Dx + 1;
      let mouse_top = $(".grid")[0].offsetTop + $(".grid")[0].clientTop + ch * Math.floor((-Dy+e.offsetY)/ch)+Dy + 1;
  
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