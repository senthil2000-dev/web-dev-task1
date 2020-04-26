var colors, bool, dateFrom;
        var startTime, paused=true, totalBefore=0, t, playMode=0, hideMode=false, challenge=false, arrayChallenge=[], flex2;
        var audio = new Audio("sounds/alarm.mp3");
        var i=0,j=0,u=0;
        var n=25,scoreInSec, gamePlaying=false;
        var currentButton=0;
        var oddRowNo=Math.sqrt(n);
        var flag=0;
        var step;
        var layers=2;
        var boxes, multiplier=1;
        var rightOrder;
        var userOrder=new Array();
        var r=55, g=102, b=255;
        
        var shuffled=generate(1, n);
        document.querySelector(".flyOut.win").style.display = 'none';
        function formRows() {
          for(var s=0;s<oddRowNo;++s) {
            if(s==0)
                document.getElementsByClassName("sourceBox")[0].insertAdjacentHTML("afterend", "<div class='row odd'></div>");
            else if(s%2!=0)
                document.getElementsByClassName("odd")[(s-1)/2].insertAdjacentHTML("afterend", "<div class='row even'></div>");
            else
                document.getElementsByClassName("even")[s/2-1].insertAdjacentHTML("afterend", "<div class='row odd'></div>");
            }  
        }
        formRows();
        buttonGenerator(true);
        toggleDisplay();
        seeSource();
        modals();
        document.querySelector(".icons").style.display="none";
        document.getElementsByClassName("modal1")[0].style.display="none"
        function playGame() {
            Array.from(document.getElementsByClassName("row")).forEach(element => element.remove());
            oddRowNo=Math.sqrt(n);
            console.log(oddRowNo);
            formRows();
            userOrder=new Array();
            rightOrder=generateOrder(1, layers*n);
            resetTimer();
            gamePlaying=false;
            if(document.getElementsByClassName("main").length!=0) {
                document.getElementsByClassName("main")[0].remove();
                toggleDisplay();
                if(playMode)
                    addText();
            }
            else 
                toggleDisplay(false);
            
            removeEventListeners();
            deleteBox();
            flex2=1;
            var flyIn=document.querySelectorAll("#flyIn div");
            for(var p=0;p<flyIn.length;++p) {
                flyIn[p].style.animation="switch 10s linear "+(p+0.5)+"s 1";
            }
            document.querySelector(".flyOut.play").style.animation="out 1s linear 5.5s 1";
            document.querySelector(".flyOut.play").addEventListener("webkitAnimationEnd", countEnded);

            
            i=0;j=0;u=0;currentButton=0;flag=0;
            shuffled=generate(1, n);
            console.log(r, g, b);
            buttonGenerator();
            seeSource();   
        }

        function removeEventListeners() {
            document.querySelector(".flyOut.play").removeEventListener("webkitAnimationEnd", countEnded);
            document.querySelector(".flyOut.win").removeEventListener("webkitAnimationEnd", submitScore);
        }

        function deleteBox() {
            var deletingBoxes = document.getElementsByClassName("box");
            var blocks=document.getElementsByClassName("block");
            if(document.getElementsByClassName("newInputScore").length!=0) 
                document.getElementsByClassName("newInputScore")[0].remove();
            Array.from(deletingBoxes).forEach(element => element.remove());
            Array.from(blocks).forEach(element => element.remove());
        }
        function countEnded() {
            document.querySelector(".icons").style.display="";
            toggleDisplay(false);
            playTimer();  
            for(var m=0;m<boxes.length;++m){
                    boxes[m].addEventListener("click", function() {
                    animatePress(this);
                    });
            }
            gamePlaying=true;
        }

        function toggleDisplay(clock=true) {
            if(clock)
                document.getElementsByClassName("clockBlock")[0].style.display = document.getElementsByClassName("clockBlock")[0].style.display === 'none' ? 'flex' : 'none';
            document.getElementById("flyIn").style.display = document.getElementById("flyIn").style.display === 'none' ? '' : 'none';
            document.querySelector(".flyOut.play").style.display = document.querySelector(".flyOut.play").style.display === 'none' ? '' : 'none';
        }
        
        function buttonGenerator(firstCall=false) {
            for(var l=0;l<oddRowNo;++l) {
                if(l%2==0)
                    document.getElementsByClassName("sourceBox")[0].innerHTML+="<div type=button class='box'><div class='inner'>"+
                                                                                (l+1)*oddRowNo+"</div></div>";
                else 
                    document.getElementsByClassName("sourceBox")[0].innerHTML+="<div type=button class='block'><div class='inner'></div></div>";
            }
            for(var l=0;l<n;++l) {
                document.getElementsByClassName("row")[(l-l%oddRowNo)/oddRowNo].innerHTML+="<div type=button class='box'><div class='inner'>"+
                                                                                            (l+1)+"</div></div>";
            }
            for(var l=0;l<oddRowNo;++l) {
                if(l%2==0)
                    document.getElementsByClassName("sourceBox2")[0].innerHTML+="<div type=button class='block'><div class='inner'></div></div>";
                else 
                    document.getElementsByClassName("sourceBox2")[0].innerHTML+="<div type=button class='box'><div class='inner'>"+
                                                                                (l*oddRowNo+1)+"</div></div>";
            }
            boxes = document.getElementsByClassName("box");
            for(var m=0;m<boxes.length;++m) {
                var element=boxes[m].getElementsByClassName("inner");
                element[0].innerHTML="<span class='visible'>"+shuffled[boxes[m].textContent-1]+"</span>";
                if(hideMode)
                    Array.from(document.getElementsByClassName("visible")).forEach(element => element.style.visibility="hidden");
            }
            go(firstCall);
            window.addEventListener('resize', go);
            Array.from(document.getElementsByClassName("block")).forEach(element => element.style.flex=String(1/oddRowNo));
            var max = Math.max(r,Math.max(g,b));
            step = 255 / (max * n * layers);
            for(var m=0;m<boxes.length;++m) {
                var number=layers*n-boxes[m].textContent+1;
                red=Math.floor(r*step*number);
                blue=Math.floor(b*step*number);
                green=Math.floor(g*step*number);
                boxes[m].style.backgroundColor='rgb(' + red + ',' + green + ',' + blue + ')';
                boxes[m].style.flex=String(1/oddRowNo);
            }
                 
        }

        function addText() {
                var keyFrames = [];
                var textNode = null;
                for(var i=1; i<=20; ++i) {
                    var keyFrames = [];
                    var textNode = null;
                    var wide = (document.querySelector(".grid").clientWidth/oddRowNo);
                    var dir=(i<=9?"left":"right");
                    keyFrames = '@keyframes mymove' + i + ' {from {' +dir+ ': 0px;} to {' + dir+ ':' + wide +'px;}}';
                    if(i==19)
                        keyFrames = '@keyframes mymove {from {left: 0px;} to {left:' + wide +'px;}}';
                    if(i==20)
                        keyFrames = '@keyframes mymoves {from {right: 0px;} to {right:' + wide +'px;}}';
                    textNode = document.createTextNode(keyFrames);
                    document.getElementsByTagName("style")[0].appendChild(textNode);
                }
        }

        function go(firstCall){
            if(!firstCall && playMode==1)
                addText();
            var wide = (document.querySelector(".grid").clientWidth/oddRowNo);
            document.getElementsByClassName("hideBox1")[0].style.left = -(wide) + "px";
            document.getElementsByClassName("hideBox2")[0].style.right = -(wide) + "px";
            document.getElementsByClassName("sourceBox")[0].style.left = -(wide) + "px";
            document.getElementsByClassName("sourceBox2")[0].style.right = -(wide) + "px";
            if(document.documentElement.clientWidth<566)
                wide+=0.075;
            document.getElementsByClassName("hideBox1")[0].style.width = wide + "px";
            document.getElementsByClassName("hideBox2")[0].style.width = wide + "px";
            document.getElementsByClassName("sourceBox")[0].style.width = wide + "px";
            document.getElementsByClassName("sourceBox2")[0].style.width = wide + "px";
        }
        function pauseGame() {
            pauseTimer(false);
            gamePlaying=false;
            modals("pause");
        }
        function resumeGame() {
            document.getElementsByClassName("close1")[0].click();
        }
        function playSound(btn) {
            no=String(btn.textContent);
            no=(no%5)+1
            var audio = new Audio("sounds/" + no + ".mp3");
            audio.play();
        }
        function animatePress(btn) {
            
            btn.getElementsByClassName("inner")[0].id="pressed";
            setTimeout(function () {
                btn.getElementsByClassName("inner")[0].removeAttribute("id");
            }, 100);
            text=btn.textContent;
            if(playMode==1) {
                if((btn.nextElementSibling==null)&&(btn.parentNode.classList.contains("odd"))) {
                var sourceFrom=document.getElementsByClassName("sourceBox")[0];
                var requiredBoxes=sourceFrom.querySelectorAll(".box");
                simulator(requiredBoxes, btn, text);
                }
                else if((btn.previousElementSibling==null)&&(btn.parentNode.classList.contains("even"))) {
                    var sourceFrom=document.getElementsByClassName("sourceBox2")[0];
                    var requiredBoxes=sourceFrom.querySelectorAll(".box");
                    simulator(requiredBoxes, btn, text);
                }
                else if(btn.parentNode.classList.contains("sourceBox")) {
                    var requiredBoxes=document.querySelectorAll(".odd .box:last-child");
                    simulator(requiredBoxes, btn, text);
                }
                else if(btn.parentNode.classList.contains("sourceBox2")) {
                    var requiredBoxes=document.querySelectorAll(".even .box:first-child");
                    simulator(requiredBoxes, btn, text);
                }
                else 
                    check(btn, text);
            }
            else
                check(btn, text);
        }
        function simulator(requiredBoxes, btn, text) {
            if(flag==0) {
                for (var i = 0; i < requiredBoxes.length; i++) {
                    if (requiredBoxes[i].textContent == text) {
                        flag=1;
                        if(check(btn, text)) {
                            if(text>n*(layers-1)) {
                                requiredBoxes[i].style.visibility="hidden";
                                requiredBoxes[i].removeEventListener("click", function() {
                                animatePress(this);
                            });
                            }
                            else {
                                var element=requiredBoxes[i].getElementsByClassName("inner")[0];
                                element.innerHTML="<span class='visible'>" +(n+Number(text))+ "</span>";
                                if(hideMode)
                                    element.querySelector(".visible").style.visibility="hidden";
                                var number=layers*n-requiredBoxes[i].textContent+1;
                                red=Math.floor(r*step*number);
                                blue=Math.floor(b*step*number);
                                green=Math.floor(g*step*number);
                                requiredBoxes[i].style.backgroundColor='rgb(' + red + ',' + green + ',' + blue + ')';
                            }
                        }
                        requiredBoxes[i].click();
                        break;
                    }
                }
            }
            else
                flag=0;
        }

        function check(btn, text) {
            userOrder.push(text);
            if(userOrder[currentButton]==rightOrder[currentButton]) {
                playSound(btn);
                
                if(text>n*(layers-1)) {
                    console.log(currentButton);
                    console.log(userOrder[currentButton]);
                    console.log(rightOrder[currentButton]);
                    btn.style.visibility="hidden";
                    btn.removeEventListener("click", function() {
                    animatePress(this);
                    });
                }
                else {
                    console.log(currentButton);
                    console.log(userOrder[currentButton]);
                    console.log(rightOrder[currentButton]);
                    var element=btn.getElementsByClassName("inner")[0];
                    element.innerHTML="<span class='visible'>"+(n+Number(text))+"</span>";
                    if(hideMode)
                            element.querySelector(".visible").style.visibility="hidden";
                    var number=layers*n-btn.textContent+1;
                    red=Math.floor(r*step*number);
                    blue=Math.floor(b*step*number);
                    green=Math.floor(g*step*number);
                    btn.style.backgroundColor='rgb(' + red + ',' + green + ',' + blue + ')';
                }
                currentButton++;
                if(currentButton==n*layers) {
                    endGame(true);
                }
                return true;
            }
            else {
                var audio=new Audio("sounds/error.mp3");
                console.log(currentButton);
                console.log(userOrder[currentButton]);
                console.log(rightOrder[currentButton]);
                audio.play();
                document.getElementsByTagName("body")[0].classList.add("game-over");
                setTimeout(function () {
                    document.getElementsByTagName("body")[0].classList.remove("game-over");
                }, 200);
                endGame(false);
                return false;
            }
        }
        
    function endGame(result, timeUp=false) {
        bool=result?true:false;
        console.log(result);
        pauseTimer(bool);
        dateFrom=Date.now();
        document.querySelector(".flyOut.win").style.webkitTextStroke=(result?"2px darkgreen":"2px brown");
        document.querySelector(".flyOut.win").innerHTML=(result?"YOU WIN":"GAME OVER");
        if(timeUp)
            document.querySelector(".flyOut.win").innerHTML="TIME UP";
        document.querySelector(".flyOut.win").style.color=(result?"green":"red");
        document.querySelector(".flyOut.win").style.display = '';
        document.querySelector(".flyOut.win").style.animation="out 4s linear 1";
        document.querySelector(".flyOut.win").addEventListener("webkitAnimationEnd", submitScore);
    }

    function tryAgain() {
        playGame();
    }

    function submitScore() {
        deleteBox();
        loseText = challenge? "within" : "this";
        document.querySelector(".flyOut.win").style.display = 'none';
          if(bool) {
            if(challenge == true) {
                document.getElementsByClassName("grid")[0].innerHTML+="<div class ='newInputScore' id='inputName'><span>You made it within time!</span><button onclick='location.reload()'>HOME</button></input>";
            }
            else {
                var q;
                var topScores=JSON.parse(localStorage.getItem("scores") || "[]");
                
                for (q = 0; q < topScores.length; q++) {
                    if(topScores[q].scoreInMillisec*layers*n*multiplier>totalBefore)
                        break;
                }
                if(q<5)
                    document.getElementsByClassName("grid")[0].innerHTML+="<div class ='newInputScore' id='inputName'><label for='submitName'>SUBMIT YOUR SCORE:</label><br><input name = 'submitName' type = 'text' id = 'submitName' placeholder='Enter your name' required><button onclick='storeHighScore(" +q+ "," +dateFrom+ ")'>Submit</button></div>";
                else
                    document.getElementsByClassName("grid")[0].innerHTML+="<div class ='newInputScore' id='inputName'><span>But sorry you couldn't make it to the top five</span><button onclick='tryAgain()'>TRY AGAIN</button></input>";
                }  
            }
        else {
            document.getElementsByClassName("grid")[0].innerHTML+="<div class ='newInputScore' id='inputName'><span>Sorry you couldn't make it " +loseText+ " time</span><button onclick='tryAgain()'>TRY AGAIN</button></input>";
        }
    }

    function storeHighScore(q, date) {
        var topScores=JSON.parse(localStorage.getItem("scores") || "[]");
        var submitValue = document.getElementById("submitName").value;
        if(submitValue.trim()!="") {
            var totalTime=formatTime(totalBefore);
            var timePerBlock=totalBefore/(layers*n*multiplier);
            timePerBlock=Number(timePerBlock.toFixed(2));
            formattedTimePerBlock=formatTime(timePerBlock);
            var totalArray = totalTime.split(":");
            var timePerBlockArray = formattedTimePerBlock.split(":");
            var totalText = displayFormat(totalArray);
            var scoreText=displayFormat(timePerBlockArray);
            var player={
                namePlayer:submitValue,
                dateTime:date,
                scoreInMillisec:timePerBlock,
                playerScore:scoreText,
                totalScore:totalText
                };
            topScores.splice(q, 0, player);
            topScores=topScores.slice(0, 5);
            localStorage.setItem("scores", JSON.stringify(topScores));
            location.reload();
        }
        else 
            alert("Please enter a name");
    }


    function displayFormat(scoreArray) {
        var scoreText="";
        var units=["hours", "mins", "secs", " millisecs", "hour", "min", "sec", " millisec"];
            for(var i=0;i<4;++i) {
                if(!("000".includes(scoreArray[i]))) 
                    scoreText+=scoreArray[i].replace(/^0+/, '')+(scoreArray[i]==1? units[i+4]: units[i])+" ";
            }
        return scoreText;
    }
    function timeDifference(current, previous) {
        console.log(current, previous);
        var msPerMinute = 60 * 1000;
        var msPerHour = msPerMinute * 60;
        var msPerDay = msPerHour * 24;
        var msPerMonth = msPerDay * 30;
        var msPerYear = msPerDay * 365;

        var elapsed = current - previous;
        if(elapsed<1000) {
            return "just now";
        }
        else if (elapsed < msPerMinute) {
            return Math.round(elapsed/1000) + ' seconds ago';   
        }

        else if (elapsed < msPerHour) {
            return Math.round(elapsed/msPerMinute) + ' minutes ago';   
        }

        else if (elapsed < msPerDay ) {
            return Math.round(elapsed/msPerHour ) + ' hours ago';   
        }

        else if (elapsed < msPerMonth) {
            return Math.round(elapsed/msPerDay) + ' days ago';   
        }

        else if (elapsed < msPerYear) {
            return Math.round(elapsed/msPerMonth) + ' months ago';   
        }

        else {
            return Math.round(elapsed/msPerYear ) + ' years ago';   
        }
    }
    function myEndFunction() {
        var rows=document.getElementsByClassName("row");
        for(var l=1;l<oddRowNo+1;++l) {
            
            if(l%2!=0) {
                var button=rows[i].lastElementChild;
                var sourceFrom=document.getElementsByClassName("sourceBox")[0];
                var copy=button.previousElementSibling.cloneNode(true)
                copy.getElementsByClassName("inner")[0].removeAttribute("id");
                var ref=sourceFrom.getElementsByClassName("block");
                if(l==oddRowNo) {
                    sourceFrom.appendChild(copy);
                }
                else {
                  sourceFrom.insertBefore(copy, ref[(l-1)/2]);  
                }   
            }
            else {
                var button=rows[i].firstElementChild;
                var sourceFrom=document.getElementsByClassName("sourceBox2")[0];
                var copy=button.nextElementSibling.cloneNode(true);
                copy.getElementsByClassName("inner")[0].removeAttribute("id");
                var ref=sourceFrom.getElementsByClassName("block");
                sourceFrom.insertBefore(copy, ref[l/2]);
            }
            i++;
            
            button.remove();
        }
        var k=document.getElementsByClassName("sourceBox")[0].querySelectorAll(".box");
        Array.from(k).forEach(element => element.classList.remove("inRow"));
        if(gamePlaying)
            Array.from(k).forEach(element => element.addEventListener("click", function() {
            animatePress(this);
            }));
        var k=document.getElementsByClassName("sourceBox2")[0].querySelectorAll(".box");
        Array.from(k).forEach(element => element.classList.remove("inRow"));
        if(gamePlaying)
            Array.from(k).forEach(element => element.addEventListener("click", function() {
            animatePress(this);
            }));
        if(i==oddRowNo) {
            seeSource();
            i=0;
        }
    }

function seeSource() {
        var y = document.getElementsByClassName("sourceBox");
        var z = y[0].getElementsByClassName("box");
        Array.from(z).forEach(element => element.addEventListener("webkitAnimationEnd", myTransferFunction));
        var y = document.getElementsByClassName("sourceBox2");
        var z = y[0].getElementsByClassName("box");
        Array.from(z).forEach(element => element.addEventListener("webkitAnimationEnd", myTransferFunction));
}

function myTransferFunction() {
    // this.remove();
    var k=j%oddRowNo;j++;
    this.classList.add("inRow");
    if(k<((oddRowNo+1)/2)) {
        this.removeEventListener("webkitAnimationEnd", myTransferFunction);
        document.getElementsByClassName("row")[2*k].prepend(this);
    }
    else {
        this.removeEventListener("webkitAnimationEnd", myTransferFunction);
        document.getElementsByClassName("row")[2*k-oddRowNo].appendChild(this);
    }
    if(j%oddRowNo==0) {
        myEndFunction();
    } 
}
 function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}   
function generate(start, stop) {
    var list = [];
    for (var i = start; i <= stop; i++) {
        list.push(i);
    }
    return shuffle(list);
}

function generateOrder(start, stop) {
    var list = [];
    for (var i = start; i <= stop; i++) {
        list.push(i);
    }
    return list;
}

var slideIndex;
function startSlides() {
  slideIndex = 1;
  showSlides(slideIndex);  
}


function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("dot");
  if (n > slides.length)
    slideIndex=n-1;
  else if(n<1)
    slideIndex=1
  else {
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";  
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex-1].style.display = "block";  
    dots[slideIndex-1].className += " active"; 
  }
}
function countTimer() {
        var now = Date.now();
        var totalMilliSeconds=totalBefore+now-startTime;
        var timeElapsed=formatTime(totalMilliSeconds).slice(0, formatTime(totalMilliSeconds).lastIndexOf(":"));
        document.getElementById("timer").innerHTML = timeElapsed;
        document.getElementById("time").innerHTML = "Time elapsed:" + timeElapsed;
        t = setTimeout(countTimer, 100);
        timeRemaining(totalMilliSeconds);
    }

    function timeRemaining(totalMilliSeconds, pausedTimer=false) {
      var topScores=JSON.parse(localStorage.getItem("scores") || "[]").slice(0, 3);
      arrayStrings=["Top the leaderboard: ", "Become a runner-up: ", "Become 2<sup>nd</sup> runner-up: "];
      if(challenge) {
        topScores=arrayChallenge;
        arrayStrings=["Reach primary target: ", "Reach secondary target: ", "Reach tertiary target: "];
      }
      var j=0, k=0;
      for(var i=0;i<3;++i) {
        var diff=(topScores[i]?topScores[i].scoreInMillisec*n*layers*multiplier:0)-totalMilliSeconds;
        if(pausedTimer && diff>0) {
            document.querySelectorAll(".details span")[i+2].innerHTML=arrayStrings[i] + "achieved";
            document.querySelectorAll(".details span")[i+2].classList=["succeeded"];
            document.querySelector(".clock1").style.backgroundColor="lightgreen";
        }
        else if(diff>0) {
           var updateTime=formatTime(diff).slice(0, formatTime(diff).lastIndexOf(":"));
            document.querySelectorAll(".details span")[i+2].innerHTML=arrayStrings[i] + updateTime;
            if(diff<=6000 && j==0) {
                console.log("no");
                document.querySelectorAll(".details span")[i+2].classList.add("alert");
                document.getElementsByClassName("clock1")[0].classList.add("blinking");
                console.log(flex2);
                if(flex2||audio.ended||audio.paused) {
                    audio.play(); 
                    flex2=0
                }
                j++;
            } 
        }
        else {
            document.querySelectorAll(".details span")[i+2].style.display="none";
            document.getElementsByClassName("clock1")[0].classList.remove("blinking");
            audio.pause();
            k++;
        }
      }
      if(k==3){
         document.querySelectorAll(".details span")[1].style.display="none";
         endGame(false, true);
      }
      if(pausedTimer) {
        document.getElementsByClassName("clock1")[0].classList.remove("blinking");
      }
    }

    function formatTime(totalMilliSeconds) {
        var milliSeconds=totalMilliSeconds%1000;
        var totalSeconds = Math.floor(totalMilliSeconds/1000);
        var hour = Math.floor(totalSeconds /3600);
        var minute = Math.floor((totalSeconds - hour*3600)/60);
        var seconds = totalSeconds - (hour*3600 + minute*60);
        if(hour < 10)
            hour = "0"+hour;
        if(minute < 10)
            minute = "0"+minute;
        if(seconds < 10)
            seconds = "0"+seconds;
        if(milliSeconds<10)
            milliSeconds="00"+milliSeconds;
        else if(milliSeconds<100)
            milliSeconds="0"+milliSeconds
        return (hour + ":" + minute + ":" + seconds + ":" + milliSeconds);
    }

  function playTimer() {
    document.getElementsByClassName("blue")[0].click();
    if(paused) {
      startTime = Date.now();
      paused=false;
      countTimer();
      console.log("no1");
    }
  }

  function pauseTimer(end=true) {
    document.getElementsByClassName("black")[0].click();
    if(!paused) {
    console.log("2");console.log(t);
      clearTimeout(t);
      
      console.log(t);
      totalBefore+=Date.now()-startTime;
      paused=true;
      if(end) 
          timeRemaining(totalBefore, true);          
    }
  }

  function resetTimer() {
    document.getElementsByClassName("red")[0].click();
    clearTimeout(t);
    Array.from(document.querySelectorAll(".details span")).forEach(element => element.classList=[]);
    Array.from(document.querySelectorAll(".details span")).forEach(element => element.style.display="");
    timeRemaining(0);
    document.getElementById("timer").innerHTML = "00:00:00";
    document.getElementById("time").innerHTML = "Time elapsed: 00:00:00";
    totalBefore=0;
    paused=true;
  }

  document.addEventListener("keyup", function(event) {
  if (event.keyCode === 13 && document.getElementsByClassName("modal1")[0].style.display=="none")
    document.getElementsByClassName("selecting")[0].click();
});

  document.addEventListener('keydown', keyPress);

  function keyPress() {
    if(event.key=='ArrowDown'||event.key=='Down') {
        if(document.getElementsByClassName("selecting")[0].nextElementSibling!=null) {
            document.getElementsByClassName("selecting")[0].nextElementSibling.classList=["selecting"];
            document.getElementsByClassName("selecting")[0].classList=["menuButton"];
        }
            
        else {
            document.getElementsByClassName("selecting")[0].classList=["menuButton"];
            document.getElementsByClassName("main")[0].firstElementChild.classList=["selecting"];
        }      
    }
    else if(event.key=='ArrowUp'||event.key=='Up') {
        if(document.getElementsByClassName("selecting")[0].previousElementSibling!=null) {
            document.getElementsByClassName("selecting")[0].previousElementSibling.classList=["selecting"];
            document.getElementsByClassName("selecting")[1].classList=["menuButton"];
        }
            
        else {
            document.getElementsByClassName("selecting")[0].classList=["menuButton"];
            document.getElementsByClassName("main")[0].lastElementChild.classList=["selecting"];
        }     
    }  
  }

        function modals(item) {
            var modal = document.getElementById("myModal");
            var btn = document.getElementsByClassName("btn1");
            var span = document.getElementsByClassName("close1")[0];
            if(item!="pause") {
               for(var i=0;i<btn.length;i++) {
                btn[i].addEventListener("click", function() {
                modal.style.display = "block";
                addHtml(this);
                }); 
            }
                span.onclick = function() {
                            modal.style.display = "none";
                            } 
            }
            
            if(item=="pause") {
                modal.style.display = "block";
                addHtml(item);
                span.onclick = function() {
                            modal.style.display = "none";
                            gamePlaying=true;
                            playTimer();
                            }
            }
        }

    function addHtml(button) {
        var modalbody=document.getElementsByClassName("modal-body1")[0];
        var modalheading=document.querySelector(".modal-header1 h2");
        if(button.textContent=="INSTRUCTIONS") {
            modalheading.innerHTML="INSTRUCTIONS";
            modalbody.innerHTML="<div class='list-type1'><ol id='olist'><li><a>Click the blocks in ascending(or descending) order of their numbers.</a></li><li><a>Incase you click the wrong block you do not get any score .i.e GAME OVER.</a></li><li><a>You win if you click all the blocks in the right order.</a></li><li><a>The time you take for finishing the game is taken into account for score calculation</a></li><li><a>The player with the lowest time per block tops the leaderboard.</a></li><li><a>If the player plays in dynamic mode(blocks moving), player gets a multiplier of 2x(his time is divided by 2)</a></li><li><a>If the player plays in hide numbers mode(guess the order by the shade of the block), player gets a multiplier of 3x.</a></li><li><a>Top 5 lowest time scores reach the leaderboard.</a></li><li><a>In challenge mode, you can set 3 targets-primary, secondary and tertiary.</a></li><li><a>If the player doesn't make it to the top 5, a 'Try again' option allows you to restart the game with the same difficulty modes</a></li></ol></div>";
        }

        if(button=="pause") {
            modalheading.innerHTML="OPTIONS";
            modalbody.innerHTML="<div class='pauseMenu'><button onclick='resumeGame()'>RESUME</button><button onclick='location.reload()'>GO TO HOME</button></div>";
        }

        if(button.textContent=="HIGH SCORES") {
            modalheading.innerHTML="LEADERBOARD";
            modalbody.innerHTML="<div id='playersDiv'><table id='players'><tr><th>Player name</th><th>Score(millisecs per block)</th><th>Total time</th><th>Time ago</th></tr></table></div>";
            var topScores=JSON.parse(localStorage.getItem("scores") || "[]");
            var tableRef = document.getElementById('players').getElementsByTagName('tbody')[0];
            for(var w=0; w<topScores.length; ++w) {
                var newRow = tableRef.insertRow(tableRef.rows.length);
                newRow.innerHTML+="<tr><td>" +topScores[w].namePlayer+ "</td><td>" +topScores[w].playerScore+ "</td><td>" +topScores[w].totalScore+ "</td><td>" +timeDifference(Date.now(), topScores[w].dateTime)+ "</td></tr>";
            }
        }

        if(button.textContent=="PLAY GAME") {
            challenge=false;
            playMode=false;
            hideMode=false;
            modalheading.textContent="DIFFICULTY MODES";
            modalbody.innerHTML="<div class='slideshow-container'><div class='mySlides fade'><div class='numbertext'>1 / 3</div><div class='full flexing'></div><div class='text'>Select your color:</div></div><div class='mySlides fade'><div class='numbertext'>2 / 3</div><div class='full'></div><div class='text'>Select your game mode:</div></div><div class='mySlides fade'><div class='numbertext'>3 / 3</div><div class='full inputDiv'></div><div class='text'>Caption Three</div></div><a class='prev' onclick='plusSlides(-1)'>&#10094;</a><a class='next' onclick='plusSlides(1)'>&#10095;</a></div><br>";
            modalbody.innerHTML+="<div style='text-align:center'><span class='dot' onclick='currentSlide(1)'></span><span class='dot' onclick='currentSlide(2)'></span><span class='dot' onclick='currentSlide(3)'></span></div>";
            startSlides();
            slides=document.getElementsByClassName("full");
            colors={v:[148, 0, 211], i:[75, 0, 130], b:[0, 0, 255], g:[0, 255, 0], y:[255, 255, 0], o:[255, 127, 0], r:[255, 0 , 0]};
            for(var i=0;i<7;++i) {
               slides[0].innerHTML+="<div class='color' type='button' onclick='colorUpdate(this)'></div>";
               document.getElementsByClassName("color")[i].id=String(Object.keys(colors)[i]);
            }
            slides[1].innerHTML="<div class='toggleDiv'><label>Challenge Mode:</label><div class='toggle'><label class='switch'><input type='checkbox' id='checking' onchange='status(this)'><span class='slider round'></span></label></div></div>";
            slides[1].innerHTML+="<div class='toggleDiv'><label>Visibilty Mode (Hide Numbers?):</label><div class='toggle'><label class='switch'><input type='checkbox' id='checking1' onchange='hide(this)'><span class='slider round'></span></label></div></div>";
            slides[1].innerHTML+="<div class='toggleDiv'><label>Dynamic Mode (Moving blocks?):</label><div class='toggle'><label class='switch'><input type='checkbox' id='checking2' onchange='linkStyle(this)'><span class='slider round'></span></label></div></div>";
            thirdSlide();
        }
    }

    function status(btn) {
        if(btn.checked==true) {
            challenge=true;
            document.getElementsByClassName("text")[2].innerHTML="Set your Targets (time limits)  and number of blocks";
            document.getElementsByClassName("full")[2].insertAdjacentHTML("afterBegin", "<input class='target' type='number' placeholder='Tertiary target (in sec)' value=30></input>");
            document.getElementsByClassName("full")[2].insertAdjacentHTML("afterBegin", "<input class='target' type='number' placeholder='Secondary target (in sec)' value=20></input>");
            document.getElementsByClassName("full")[2].insertAdjacentHTML("afterBegin", "<input class='target' type='number' placeholder='Primary target (in sec)' value=10></input>");
        }
        else {
          thirdSlide();
          challenge=false;
        }
                 
    }

    function thirdSlide() {
        var slides=document.getElementsByClassName("full");
        
        slides[2].innerHTML="<input class='target' id='layering' type='number' placeholder='Number of layers' value=2></input>";
        slides[2].innerHTML+="<div class='selecter'><label for='gridBox'>Choose the type of grid:</label><select id='gridBox'><option value='0'>3 x 3</option><option selected value='1'>5 x 5</option><option value='2'>7 x 7</option><option value='3'>9 x 9</option></select></div>";
        slides[2].innerHTML+="<button class='target' onclick='setTargets()'>PLAY NOW</button></form>";
        document.getElementsByClassName("text")[2].innerHTML="Set the number of blocks";
    }
    function linkStyle(btn) {
        playMode = (btn.checked==true)? 1: 0;
    }

    function hide(btn) {
        hideMode = (btn.checked==true)? true: false;
    }

    function setTargets() {
        var invalid=false;
        var e=document.getElementById("gridBox");
        var strUser = e.options[e.selectedIndex].value;
        n=(3+2*strUser)*(3+2*strUser);
        layers = document.getElementById("layering").value? document.getElementById("layering").value : 2;
        multiplier*=(playMode? 2 :1);
        multiplier*=(hideMode? 3 :1);
        if(challenge) {
            var topScores=new Array();
            var inputs = document.getElementsByClassName("target");
            for(var i=0; i<3; ++i) {
                if(i!=0 && inputs[i].value<inputs[i-1].value) {
                    alert("primary target > secondary target > tertiary target is the order");
                    arrayChallenge=[];
                    invalid=true;
                    break;
                }
                var playerActive= {scoreInMillisec: (inputs[i].value*1000)/(multiplier*n*layers)};
                arrayChallenge.push(playerActive);
            } 
        }
        if(!invalid) {
           document.getElementsByClassName("close1")[0].click();
            playGame(); 
        }  
    }
    function colorUpdate(btn) {
        color=btn.id;
        r=colors[color][0];
        g=colors[color][1];
        b=colors[color][2];
        Array.from(document.getElementsByClassName("color")).forEach(element => element.classList.remove("selected"));
        btn.classList.add("selected");
    }

    window.onclick = function(event) {
    if (event.target == document.getElementById("myModal")) {
        document.getElementsByClassName("close1")[0].click();
      }
    }
