try {
  importScripts('js/localforage.min.js');
} catch (e) {
  console.error(e);
}

chrome.action.onClicked.addListener(function(tab) {
  chrome.tabs.create({
    url: "cardstack.html", 
    active: true,
    index: tab.index + 1
  }); 
});

chrome.runtime.onMessage.addListener(
  async function(request, sender, sendResponse) {
    // console.log(sender.tab ?
    //             "from a content script:" + sender.tab.url :
    //             "from the extension");
    localforage.config({
      driver      : localforage.INDEXEDDB, // Force INDEXEDDB
      name        : 'Fangpian',
      version     : 1.0
    });
    var word_table = localforage.createInstance({
      name: "Fangpian",
      storeName   : 'word_table', // Should be alphanumeric, with underscores.
      description : 'store the words data of pronunciation and meaning',
      size        : 1000, // Size of database, in bytes. IndexedDB-only for now.
    });
    // console.log(`background：所查词为 ${request.word}，准备返回消息`);
    sendResponse({farewell: `background：所查词为 ${request.word}`});//这个回应要放在异步行为之前，不然会报错：https://stackoverflow.com/questions/54126343/how-to-fix-unchecked-runtime-lasterror-the-message-port-closed-before-a-respon
    await word_table.setItem(request.word, request.word_detail);
  }
);