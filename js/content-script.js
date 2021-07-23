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

      var word = getSelectedWord(s);
      if (word != '') {
        var sentence=getSelectedSentence(s);
        let [word_text,word_detail] = await fetchData(word);
        const word_context = {sentence,url:window.location.href,timestamp:Date.now()};
        chrome.runtime.sendMessage({word_text,word_detail,word_context});
        $card = await getCardNode(word_detail);
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

  const getSelectedSentence = (s)=>{
    let range = s.getRangeAt(0);
    let node = s.anchorNode;
    let regexp = /[^\.。?!？！]/;
    while (range.startOffset > 0 && regexp.test(range.toString()[0])) {
      range.setStart(node, (range.startOffset - 1));
    }
    if (range.startOffset != 0)
      range.setStart(node, range.startOffset + 1);
    do {
      range.setEnd(node, range.endOffset + 1);
    }
    while (regexp.test(range.toString().slice(-1)));
    range.setEnd(node, range.endOffset - 1);

    let sentence = range.toString().trim();
    s.removeRange(range);
    return sentence;
  }

  const getSelectedWord = (s)=>{
    let range = s.getRangeAt(0);
    let node = s.anchorNode;
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
    let word = range.toString().trim();
    return word;
  }

  const getCardNode = async(data)=>{
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
    console.log(result);
    let data = {
      meanings:result.oxford_dict_info.abstract,
      pronunciation:result.oxford_dict_info.ph_json ?? result.book_word_info.phonetic ?? ""
    };
    return [result.word.text ?? word,data];
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
