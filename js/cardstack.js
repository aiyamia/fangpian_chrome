$(document).ready(async function () {
  $('#clear').click(async()=>{
    let word_table_todelete = localforage.createInstance({
      name: "Fangpian",
      storeName   : 'word_table'
    });
    await word_table_todelete.clear();
    window.location.reload();
  })
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
      $meanings = $('<div class="meanings"></div>');
      data.meanings.forEach(meaning => {
        $ps = $(`<div class="meaning_ps">${meaning.ps}</div>`);
        $exp = $('<div class="meaning_exp"></div>');
        meaning.exp.forEach(exp_word=>{
          $exp.append(`<span class="exp_word">${exp_word}；</span>`);
          console.log(`<span class="exp_word">${exp_word}；</span>`);
        })
        $meaning = $('<div class="meaning"></div>');
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
  }

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