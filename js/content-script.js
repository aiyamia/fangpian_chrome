$(document).ready(function () {
  $(document.body).bind('mousedown', function (e) {
    if (e.ctrlKey || macKeys.cmdKey) {
      $(document.body).css("cursor", "pointer");
      var s = window.getSelection();
      s.removeAllRanges();//取消选择
      $(".FangPianCard").remove();
    }else{
      $(this).trigger('onmousedown');
    }
  });
  $(document.body).bind('mouseup', async function (e) {
    if (e.ctrlKey || macKeys.cmdKey) {
      $(document.body).css("cursor", "initial");
      var s;
      if (window.getSelection) {
        s = window.getSelection();
      } else if (document.selection) {
        s = document.selection.createRange();
      }
      var range = s.getRangeAt(0);
      var node = s.anchorNode;
      while (range.startOffset > 0 && /[a-zA-Z]/.test(range.toString()[0])) {
        range.setStart(node, (range.startOffset - 1));
      }
      if (range.startOffset != 0)
        range.setStart(node, range.startOffset + 1);
      do {
        range.setEnd(node, range.endOffset + 1);
      }
      while (/[a-zA-Z]/.test(range.toString().slice(-1)));
      range.setEnd(node, range.endOffset - 1);
      var word = range.toString().trim();
      if (word != '') {
        $card = await getCardNode(word);
        $card.css({
          "top": e.pageY,
          "left": e.pageX
        });
        $card.appendTo('body');
        window.addEventListener("click", onClickOutside);
      }
    }else{
      $(this).trigger('onmouseup');
    }
  });
  const getCardNode = async(word)=>{
    const data = await fetchData(word);
    chrome.runtime.sendMessage({word: word,word_detail:data}, function(response) {
      // console.log(response.farewell);
    });
    $card = $('<div class="FangPianCard"></div>');
    $pron = $('<div class="pronunciation"></div>');
    $mean = $('<div class="meanings"></div>');
    data.meanings.forEach(element => {
      const mean_str = element.ps+ " " + element.exp.join("；");
      $mean.append( `<p>${mean_str}</p>` );
    });
    $pron.append( `/${data.pronunciation.BrE ?? data.pronunciation ?? ""}/` );
    $card.append($pron);
    $card.append($mean);
    return $card;
  };
  const fetchData = async(word)=>{
    let response = await fetch(`https://dictweb.translator.qq.com/api/elementary?word=${word}`);
    let result = await response.json();
    let data = {
      meanings:result.oxford_dict_info.abstract,
      pronunciation:result.oxford_dict_info.ph_json ?? result.book_word_info.phonetic ?? ""
    };
    return data;
  };
  const onClickOutside = (e) => {
    if (!$(e.target).closest('.FangPianCard').length) {
      var s = window.getSelection();
      s.removeAllRanges();//取消选择
      $(".FangPianCard").remove();
      window.removeEventListener("click", onClickOutside);
    }
  };
});
