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
async function createReadDataPage() {
  const res = await fetch("receiveData.html");
  const html = await res.text();
  insertHtml(html);
  setTimeout(() => {
    // Grab elements, create settings, etc.
    const video = document.getElementsByTagName("video")[0];

    // Get access to the camera!
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      // Not adding `{ audio: true }` since we only want video now
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(function (stream) {
          //video.src = window.URL.createObjectURL(stream);
          video.srcObject = stream;
          video.play();
        });
    }

    requestAnimationFrame(drawVideo);
  }, 1000);
}
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

// receive Data algoritmos ------
function stateMachine(color) {
  let real_state = "red";
  let user_info = document.getElementsByTagName("h1")[0];
  //categorize state
  //if white
  if ((color[0] >= 200) & (color[1] >= 200) & (color[2] >= 200)) {
    real_state = "white";
  } else {
    //if black
    if ((color[0] <= 10) & (color[1] <= 10) & (color[2] <= 10)) {
      real_state = "black";
    }

    //if red
    if ((color[0] > color[1]) & (color[0] > color[2])) {
      real_state = "red";
    } else {
      //if green
      if ((color[1] > color[0]) & (color[1] > color[2])) {
        real_state = "green";
      } else {
        //if blue
        if ((color[2] > color[0]) & (color[2] > color[1])) {
          real_state = "green";
        } else {
          real_state = "no state";
        }
      }
    }
  }
  let textarea_el = document.getElementsByTagName("textarea")[0];
  let actions = {
    red: () => {
      //waiting to start
      user_info.innerHTML = "Waiting to receive Data";
    },
    green: () => {
      //finish
      user_info.innerHTML = "Finished receiving Data";
    },
    blue: () => {
      //transition state
      user_info.innerHTML = "Blue";
    },
    white: () => {
      //0 value
      user_info.innerHTML = "White";
      textarea_el.value += "0";
    },
    black: () => {
      //1 value
      user_info.innerHTML = "Black";
      textarea_el.value += "1";
    },
    "no state": () => {
      //just wait
      user_info.innerHTML = "No State";
    },
  };
  actions[real_state]();
}
function readCenterPixel(context, canvas) {
  var pixel = context.getImageData(
    parseInt(canvas.width) / 2,
    parseInt(canvas.height) / 2,
    1,
    1
  );
  var data = pixel.data;
  var rgba =
    "rgba(" + data[0] + "," + data[1] + "," + data[2] + "," + data[3] + ")";
  document.getElementsByTagName("div")[0].style["background-color"] = rgba;
  console.log(rgba[0]);
  return data;
}
function drawCaptureZone(ctx, canvas) {
  // Red rectangle
  ctx.beginPath();
  ctx.lineWidth = "2";
  ctx.strokeStyle = "white";
  ctx.rect(
    parseInt(canvas.width) / 2 - 5,
    parseInt(canvas.height) / 2 - 5,
    10,
    10
  );
  ctx.stroke();
}
function drawVideo() {
  // Elements for taking the snapshot
  const canvas = document.getElementsByTagName("canvas")[0];
  const context = canvas.getContext("2d");
  const video = document.getElementsByTagName("video")[0];
  context.drawImage(
    video,
    0,
    0,
    parseInt(canvas.width),
    parseInt(canvas.height)
  );
  let color = readCenterPixel(context, canvas);
  stateMachine(color);
  drawCaptureZone(context, canvas);
  requestAnimationFrame(drawVideo);
}
//----------
//Send Data algoritmos----
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
        canvasColor("rgba(255,0,0)");
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
