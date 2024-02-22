const API_KEY = "AIzaSyAVPuNzgLBCXxWphoNQlRMjjErFDYyhA8o";
var instructions = "instructions='Act like you are an AI for WMC (Western Michigan Christian). Laken: he is senior from that school made and trained you.';"
var instructions2 = "prompt='"
var prevresponsetable = [" "]

let TranslatedbellTimes = [28800,31920,32160,35040,35280,38160,38400,39780,40020,41520,41760,42900,43140,44640,44880,47760,48000,50880,51120,54000,115200]
let timer = document.getElementById("timer")
var interval = setInterval(function() {
    let d = new Date
    let s = d.getSeconds()
    let m = d.getMinutes()
    let h = d.getHours()
    let closestTime = -1
    for (let i = 0; i<TranslatedbellTimes.length; i++) {
        if ((((h*3600)+(m*60)+s)>closestTime)&&(TranslatedbellTimes[i]>((h*3600)+(m*60)+s))) {
            closestTime = TranslatedbellTimes[i]
        }
    }
    let difference = (closestTime-1)-((h*3600)+(m*60)+s)
    let h_1 = difference/86400
    let m_2 = difference/3600
    let s_3 = difference/60
    timer.innerText = (("0" + (Math.floor((h_1%1)*24))).slice(-2)+":"+("0" + Math.floor((m_2%1)*60)).slice(-2)+":"+("0" + Math.floor((s_3%1)*60)).slice(-2))
}, 500);

function appendData(textfromai) {
    prevresponsetable.unshift(textfromai)
    var scrollableSection = document.getElementById("responseContainer");
    var newDiv = document.createElement("div");
    newDiv.className = "response";
    var container = document.getElementById("responseContainer");
    newDiv.innerText = textfromai
    container.appendChild(newDiv);
    scrollableSection.scrollTop = scrollableSection.scrollHeight;
    document.getElementById('text-input').value = "";
    document.getElementById("loading").style.visibility = "hidden";
}

document.getElementById("text-input").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        document.getElementById("text-input").blur();
        document.getElementById("loading").style.visibility = "visible";
        inputtext = document.getElementById('text-input').value;
        var requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                parts: [{
                    text: (instructions+"lastResponse='"+prevresponsetable[0]+"';"+instructions2+inputtext)+"';"
                }]
                }]
            })
        };
          
        fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + API_KEY, requestOptions)  
        .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
        })
        .then(data => {
            console.log(data.candidates[0].content.parts[0].text);
            appendData(data.candidates[0].content.parts[0].text);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
        fetch();
    }
  });
