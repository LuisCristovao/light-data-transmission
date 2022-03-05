//import LZString from "./lz-string.js";
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
  const res = await fetch("sendData.html");
  const html = await res.text();
  insertHtml(html);
  setTimeout(() => {
    canvasColor("rgb(255,0,0,1)");
  }, 300);
}
function createReadDataPage() {}
function goToLink(search_link) {
  window.location.search = search_link;
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
//algoritmos----
function textToBinary(textarea_el) {
  const binary_value = ABC.toBinary(textarea_el.value);
  textarea_el.value = binary_value.replaceAll(" ", "");
}
function canvasColor(color) {
  var c = document.getElementsByTagName("canvas")[0];
  var ctx = c.getContext("2d");
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, parseInt(c.width), parseInt(c.height));
}
function sendBits(bit, position, transition_state) {
  let textarea_value = document.getElementsByTagName("textarea")[0].value;
  let state_machine = {
    0: () => {
      canvasColor("rgba(255,255,255)");
    },
    1: () => {
      canvasColor("rgba(0,0,0)");
    },
  };
  try {
    if (!transition_state) {
      state_machine[bit]();
    } else {
      canvasColor("rgba(0,0,255)");
    }
  } catch {
    canvasColor("rgba(0,255,0)");
    //end recursive cycle
    return false;
  }
  let fps = parseInt(document.getElementsByTagName("input")[0].value);
  setTimeout(() => {
    let next_position = !transition_state ? position + 1 : position;
    sendBits(
      parseInt(textarea_value[next_position]),
      next_position,
      !transition_state
    );
  }, Math.round(1000 / fps, 0));
}
function sendData(state) {
  const button = document.getElementsByTagName("button")[0];
  let state_machine = {
    start: () => {
      setTimeout(() => {
        //let textarea_el = document.getElementsByTagName("textarea")[0];
        //textarea_el.value=LZString.compressToEncodedURIComponent(textarea_el.value);
        button.innerText = "Starting in : 3 seconds";
        sendData("1s");
      }, 1000);
    },
    "1s": () => {
      setTimeout(() => {
        let textarea_el = document.getElementsByTagName("textarea")[0];
        textToBinary(textarea_el);
        button.innerText = "Starting in : 2 seconds";
        sendData("2s");
      }, 1000);
    },
    "2s": () => {
      setTimeout(() => {
        button.innerText = "Starting in : 1 seconds";
        sendData("3s");
      }, 1000);
    },
    "3s": () => {
      setTimeout(() => {
        button.innerText = "Sending Bits !";
        sendData("send-bits");
      }, 1000);
    },
    "send-bits": () => {
      let textarea_value = document.getElementsByTagName("textarea")[0].value;
      sendBits(parseInt(textarea_value[0]), 0, false);
    },
  };
  state_machine[state]();
}

//-----------
function selectPage() {
  const pages = {
    "": createHomePage,
    "?Send": createSendDataPage,
    "?Receive": createReadDataPage,
  };
  pages[window.location.search]();
}

//Main--------------
window.onload = () => {
  selectPage();
};
