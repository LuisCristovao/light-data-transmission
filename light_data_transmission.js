


function insertHtml(html){
    document.body.innerHTML=html
}
function createSendDataPage(){
    let height=window.innerHeight
    let html="<button>Click to Start Sending Data</button>"
    html+=`<canvas onclick='createReadDataPage()' style='position:absolute;top:${height*0.2}px'>Read Data</button>`
    html+=`<button onclick='createSendDataPage()' style='position:absolute;top:${height*0.4}px'>Send Data</button>`
    insertHtml(html) 
}

function createHomePage(){
    let height=window.innerHeight
    let html=""
    html+=`<button onclick='createReadDataPage()' style='position:absolute;top:${height*0.2}px'>Read Data</button>`
    html+=`<button onclick='createSendDataPage()' style='position:absolute;top:${height*0.4}px'>Send Data</button>`
    insertHtml(html) 
}


//Main--------------
window.onload=()=>{
    createHomePage()
}