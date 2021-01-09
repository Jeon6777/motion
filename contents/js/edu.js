const webcamElement = document.getElementById('webcam'); // 카메라 인식
const canvasElement = document.getElementById('canvas');
var x = document.getElementById("video");
const webcam = new Webcam(webcamElement, 'enviroment');
const canvas = document.getElementById('canvas_capture');
const context = canvas.getContext('2d');
let model = null;
let cameraFrame = null;
let handCount = 0;
let fireElements = [];
var count=0;
var sum=0;
var content = paramValue;
var yy = 81;


$('.md-modal').addClass('md-show');
webcam.start(false)
    .then(result =>{
    })
    .catch(err => {
        displayError();
});

console.log("edu.js")

x.onloadedmetadata = function() {
    console.log('metadata loaded!');
    console.log(this.duration);
};

  
x.ontimeupdate = function () {myFunction ()};

var h_1 = document.querySelector('h1');
var process_bar = document.getElementById('bar');

function myFunction () {

  console.log(x.currentTime)
  if(x.currentTime >81.31 && x.currentTime < 82 && yy ==81){
    eight(81,count,0);
    yy = 115;
  }else if(x.currentTime >115.7 && x.currentTime < 116 && yy == 115){
    eight(115,count,1);
    yy=0;
  }
    
}

function eight(time,value,ss){
    
    if(parseInt(x.currentTime) == time && value == ss){
        x.hidden=true;
        x.pause();
        count++;
        webcam.stream()
            .then(result => {
                cameraStarted();
                loadModel().then(res => {
                    console.log("안녕");
                    interval = setInterval(sendImage, 700);
                })
                .catch(err => {
                    displayError('Fail to load hand tracking model, please refresh the page to try again');
                });
            })
            .catch(err => {
                displayError();
            });


    
      }

}


function ozit_interval_test(){
        
        x.hidden = false;
        x.play();
        stop();
        if(yy == 115){
            x.currentTime = 81.519934;

        }else{
            x.currentTime = 115.952325;
        }
        stopCamera();
        h_1.innerHTML=""
        process_bar.width = 0
}

$('#closeError').click(function() {
    $("#webcam-switch").prop('checked', false).change();
});





function stopCamera(){
    cameraStopped();
    webcam.stop();
    if(cameraFrame!= null){
        cancelAnimationFrame(cameraFrame);
    }
}

function displayError(err = ''){
    if(err!=''){
        $("#errorMsg").html(err);
    }
    $("#errorMsg").removeClass("d-none");
}

async function loadModel() {
    // $(".loading").removeClass('d-none');
    console.log("loadModel")
    var flipWebcam = (webcam.facingMode =='user') ? true: false
    return new Promise((resolve, reject) => {
        const modelParams = {
            flipHorizontal: flipWebcam,   // flip e.g for video  
            maxNumBoxes: 20,        // maximum number of boxes to detect
            iouThreshold: 0.5,      // ioU threshold for non-max suppression
            scoreThreshold: 0.8,    // confidence threshold for predictions.
        }

        handTrack.load(modelParams).then(mdl => { 
            model = mdl;
            // $(".loading").addClass('d-none');
            console.log("loadModel naka")
            resolve();
        }).catch(err => {
            reject(error);
        });
    });
}



$(window).resize(function() {
    var ratioWebCamWidth = webcamElement.scrollHeight * (webcamElement.width/webcamElement.height);
    var canvasWidth = (ratioWebCamWidth < window.innerWidth) ? ratioWebCamWidth : window.innerWidth;
    $("#canvas").css({width: canvasWidth});
});

function cameraStarted(){
    $("#errorMsg").addClass("d-none");
    $("#webcam-caption").html("on");
    $("#webcam-control").removeClass("webcam-off");
    $("#webcam-control").addClass("webcam-on");
    $(".webcam-container").removeClass("d-none");
    var ratioWebCamWidth = webcamElement.scrollHeight * (webcamElement.width/webcamElement.height);
    var webCamFullWidth = webcamElement.scrollWidth;
    $("#canvas").css({width: ((ratioWebCamWidth < webCamFullWidth) ? ratioWebCamWidth : webCamFullWidth)});
    if( webcam.webcamList.length > 1){
        $("#cameraFlip").removeClass('d-none');
    }
    if(webcam.facingMode == 'user'){
        $("#webcam").addClass("webcam-mirror");
    }
    else{
        $("#webcam").removeClass("webcam-mirror");
    }
    $("#wpfront-scroll-top-container").addClass("d-none");
    window.scrollTo(0, 0); 
    $('body').css('overflow-y','hidden');
}

function cameraStopped(){
    $("#wpfront-scroll-top-container").removeClass("d-none");
    $("#cameraFlip").addClass('d-none');
    $(".webcam-container").addClass("d-none");
    $('body').css('overflow-y','scroll');
}


window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function( callback ){
            window.setTimeout(callback, 1000 / 60);
        };
})();

window.cancelAnimationFrame = (function(){
    return  window.cancelAnimationFrame || window.mozCancelAnimationFrame;
})();



function sendAjax(imageData){

    $.ajax({
        url: "http://ec2-13-125-208-57.ap-northeast-2.compute.amazonaws.com:8000/ajax", // 클라이언트가 요청을 보낼 서버의 URL 주소
        type: "POST",
        data:{
            imageBase64: imageData
        }
    })
    // HTTP 요청이 성공하면 요청한 데이터가 done() 메소드로 전달됨.
    .done(function(json) {
        console.log(json["label"]);
        h_1.innerHTML = json["label"];
                if(yy== 115){
                    if(h_1.innerHTML == "노젓기"){
                        if (process_bar.width <= 520){
                            process_bar.width += 50;
                        }else if(process_bar.width > 520){
                            h_1.innerHTML ="잠시후 화면이 넘어갑니다."
                            setTimeout("ozit_interval_test()", 1000);
                        }
                    }

                }else if(yy==0){
                    if(h_1.innerHTML == "활쏘기"){
                        if (process_bar.width <= 520){
                            process_bar.width += 50;
                        }else if(process_bar.width > 520){
                            h_1.innerHTML ="잠시후 화면이 넘어갑니다."
                            setTimeout("ozit_interval_test()", 1000);
                        }
                    }
                }

    })
    // HTTP 요청이 실패하면 오류와 상태에 관한 정보가 fail() 메소드로 전달됨.
    .fail(function(xhr, status, errorThrown) {
        console.log("error");
    })
}


const minPartConfidence = 0.7;
const minPoseConfidence = 0.4;
var label = document.querySelector("#label");
var interval;

async function sendImage() {
    var image, data, i, r, g, b, brightness;

    context.drawImage(webcamElement, 0, 0, webcamElement.width, webcamElement.height);
    var dataURL = canvas.toDataURL();
   
    await sendAjax(dataURL);
    console.log("찰칵");
    
}

function stop(){
    clearInterval(interval);
}

