var ABC = {
    toAscii: function (bin) {
      return bin.replace(/\s*[01]{8}\s*/g, function (bin) {
        return String.fromCharCode(parseInt(bin, 2));
      });
    },
    toBinary: function (str, spaceSeparatedOctets) {
      return str.replace(/[\s\S]/g, function (str) {
        str = ABC.zeroPad(str.charCodeAt().toString(2));
        return !1 == spaceSeparatedOctets ? str : str + " ";
      });
    },
    zeroPad: function (num) {
      return "00000000".slice(String(num).length) + num;
    },
  };


function insertHtml(html) {
  document.body.innerHTML = html;
}
async function createSendDataPage() {
  const res= await fetch("sendData.html")
  const html=await res.text()
  insertHtml(html);
}
function createReadDataPage(){

}
function goToLink(search_link){
    window.location.search=search_link
}
function createHomePage() {
  let height = window.innerHeight;
  let html = "";
  html += `<button onclick='goToLink("Receive")' style='position:absolute;top:${
    height * 0.2
  }px'>Read Data</button>`;
  html += `<button onclick='goToLink("Send")' style='position:absolute;top:${
    height * 0.4
  }px'>Send Data</button>`;
  insertHtml(html);
}

function textToBinary(textarea_el){
    const binary_value=ABC.toBinary(textarea_el.value)
    textarea_el.value=binary_value
}

function selectPage() {
  const pages = {
      "":createHomePage,
      "?Send":createSendDataPage,
      "?Receive":createReadDataPage
  };
  pages[window.location.search]()
}

//Main--------------
window.onload = () => {
    selectPage()
};
