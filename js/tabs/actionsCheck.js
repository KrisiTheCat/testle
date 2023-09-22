var $ = jQuery;
var tempPath;
var attendeeID = undefined;
var answerTemplateCanvases = Array(4);
var blackanswerTemplateBlacks = Array(3);
var divStatus;

var changingPageId = -1;

function initCheck(){

    //getID
    let currentUrl = window.location.href;
    let paramString = currentUrl.split('?')[1];
    let queryString = new URLSearchParams(paramString);
    for(let pair of queryString.entries()) {
        if(pair[0] == 'attendee'){
            attendeeID = parseInt(pair[1]);
        }
    }
    if(typeof attendeeID === 'undefined' || isNaN(attendeeID) || !(attendeeID in window.responsesKrisi)){
        window.location.href = document.querySelector('#summaryLink').href;
        return;
    }
    divStatus = $('.statusDivCopy').eq(0);
    tempPath = $('.statusIcon').eq(0).attr('src');
    tempPath = tempPath.substring(0,tempPath.lastIndexOf('/'));

    var text = $('#summaryDiv').html();
    console.log( window.contentKrisi.length);
    for(let i = 0; i < window.contentKrisi.length; i++){
        text += `<div class="moduleSummery">
        <label><b>Module</b> #${i+1}</label>
        <div class="checkTd">
            <div class="progress" style="flex:1">
                <div class="progress-bar correctAnswers" role="progressbar" style="width: 0%" aria-valuenow="15" aria-valuemin="0" aria-valuemax="100"></div>
                <div class="progress-bar wrongAnswers" role="progressbar" style="width: 0%" aria-valuenow="30" aria-valuemin="0" aria-valuemax="100"></div>
                <div class="progress-bar notfilledAnswers" role="progressbar" style="width: 0%" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100"></div>
                <div class="progress-bar toCheckAnswers" role="progressbar" style="width: 0%" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
        </div>
        <div class="checkTd scoreTd">
            <p class="pointsField${i}_-1_-1_-1">65/100</p>
        </div>
    </div>`;
    }
    $('#summaryDiv').html(text);

    refreshResponseTable();
    initAnswerUploadWays();
    displayAllPages(-1);
    answerTemplateInit();

    if(window.pageInfo.length==0){
        $('#photosDiv').html('<p>No form uploaded. Fix <a href="../form">here</p>');
        $('#photosDiv').css('padding-bottom','0px');
    }
}

function initAnswerUploadWays(){
    $(document).on('blur','.answerChField',function(e){
        var $this = $(this);
        var code = decodeIds($this.attr('name'));
        var answer = $this.val();
        $.ajax({
            url: '',
            type: 'post',
            data: { "callResponseEditFunction": "changeAnswerCh", 
            "postID" : window.postID,
            "attendeeID" : attendeeID,
            "moduleID" : code[0],
            "indArr" : code[1],
            "answer" : answer,},
            success: function(data) {
                window.responsesKrisi = JSON.parse(data['responses']);
                refreshResponseTable();
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                toastr.error("Unable to upload answer");
            }
        });
    });

    $(document).on('click','.radioCh',function(e){
        var $this = $(this);
        var code = decodeIds($this.closest('.radioAnswersCh').data('code'));
        var answer = $this.data('answer');
        $.ajax({
            url: '',
            type: 'post',
            data: { "callResponseEditFunction": "changeAnswerCh", 
            "postID" : window.postID,
            "attendeeID" : attendeeID,
            "moduleID" : code[0],
            "indArr" : code[1],
            "answer" : answer,},
            success: function(data) {
                window.responsesKrisi = JSON.parse(data['responses']);
                refreshResponseTable();
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                toastr.error("Unable to upload answer");
            }
        });
    });

    $(document).on('click','.statusIcon',function(e){
        var $this = $(this);
        var code = decodeIds($this.attr('name'));
        var newStatus = $this.parent().children().index($this);
        if(newStatus<4){
            $.ajax({
                url: '',
                type: 'post',
                data: { "callResponseEditFunction": "changeStatus", 
                "postID" : window.postID,
                "attendeeID" : attendeeID,
                "moduleID" : code[0],
                "indArr" : code[1],
                "newStatus" : newStatus,},
                success: function(data) {
                    window.responsesKrisi = JSON.parse(data['responses']);
                    refreshResponseTable();
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    toastr.error("Unable to upload answer");
                }
            });
        }
    });
}

function refreshResponseTable(){
    var content = []
    var allModuleChDiv = $('#allModuleChDiv');
    allModuleChDiv.empty();
    if(window.responsesKrisi[attendeeID][0].length > 0) checkedBefore = true;
    $('#attendeeName').val(window.usersKrisi[attendeeID]['name']);
    $('#attendeeIdInput').val(attendeeID);
    var table, row, divStatus, icons = [];
    content['stats'] = [];
    content['stats'][0] = 0;
    content['stats'][1] = 0;
    content['stats'][2] = 0;
    content['stats'][3] = 0;
    var contentMaxPoints = 0;
    var pointsAll = 0;
    for(var moduleID = 0; moduleID < window.contentKrisi.length; moduleID++){
        var modulePoints = 0, maxModulePoints = 0;
        table = `
        <div class="moduleChDiv">
            <p class="moduleID"><b>Module</b> #` + (moduleID+1) + `</p>
            <table class="questionsTable">
                <tr class="moduleTr">
                    <td width="20px"><b>№</b></td>
                    <td min-width="40px"><b>Correct</b> answer</td>
                    <td width="170px"><b>Answered</b></td>
                    <td width="170px"><b>Status</b></td>
                    <td width="100px"><b>Photo</b></td>
                    <td width="100px"><b>Points</b></td>
                </tr>
            </table>
        </div>`;
        allModuleChDiv.append(table);
        table = allModuleChDiv.find('.questionsTable').last();
        content[moduleID] = [];
        content[moduleID]['stats'] = [];
        content[moduleID]['stats'][0] = 0;
        content[moduleID]['stats'][1] = 0;
        content[moduleID]['stats'][2] = 0;
        content[moduleID]['stats'][3] = 0;
        for(var questionID = 0; questionID < window.contentKrisi[moduleID]['subq'].length; questionID++){
            var questionInfo = handleQuestion(
                attendeeID,
                window.responsesKrisi[attendeeID][moduleID]['subq'][questionID],
                window.contentKrisi[moduleID]['subq'][questionID],
                moduleID+'_'+questionID,
                true);
            table.append(questionInfo.text);
            modulePoints += questionInfo.points;
            content[moduleID]['stats'] = addStatusArrays(content[moduleID]['stats'], questionInfo.status);
            content['stats'] = addStatusArrays(content['stats'], questionInfo.status);
        }
        maxModulePoints = parseInt(window.contentKrisi[moduleID]['points']);
        contentMaxPoints += maxModulePoints;
        pointsAll += modulePoints;
        $('.pointsField' + moduleID + '_-1_-1_-1').eq(0).html(modulePoints + ' | ' + maxModulePoints);
        refreshModuleStats(content, moduleID);
    }
    $('.pointsField-1_-1_-1_-1').eq(0).html(pointsAll + ' | ' + contentMaxPoints);

    var openedNotes = false;

    $(document).on('click','.notesBtn',function(e){
        var $this = $(this);
        if(openedNotes){
            $this.find('.arrowImg').addClass('rotate180');
            $('#notesTA').addClass('zeroHeight');
            openedNotes = false;
        } else { 
            $this.find('.arrowImg').removeClass('rotate180');
            $('#notesTA').removeClass('zeroHeight');
            openedNotes = true;
        }
    });
}



function refreshGeneralScoreStats(content){
    var sum = content['stats'][0] + content['stats'][1] + content['stats'][2] + content['stats'][3];
    var right = 100*content['stats'][1]/sum;
    $('.correctAnswers').eq(0).width(right+"%");
    $('.correctAnswers').eq(0).attr('title', (content['stats'][1] + ' points from correct answers'));
    var wrong = 100*content['stats'][0]/sum;
    $('.wrongAnswers').eq(0).width(wrong+"%");
    $('.wrongAnswers').eq(0).attr('title', (content['stats'][0] + ' points from wrong answers'));
    var notfill = 100*content['stats'][2]/sum;
    $('.notfilledAnswers').eq(0).width(notfill+"%");
    $('.notfilledAnswers').eq(0).attr('title', (content['stats'][2] + ' points from not filled questions'));
    var tobe = 100 - right - wrong - notfill;
    $('.toCheckAnswers').eq(0).width(tobe+"%");
    $('.toCheckAnswers').eq(0).attr('title', (content['stats'][3] + ' points from to-be-checked questions'));
}

function refreshModuleStats(content, moduleID){
    var sum = content[moduleID]['stats'][0] + content[moduleID]['stats'][1] + content[moduleID]['stats'][2] + content[moduleID]['stats'][3];
    var right = 100*content[moduleID]['stats'][1]/sum;
    $('.correctAnswers').eq(moduleID+1).width(right+"%");
    $('.correctAnswers').eq(moduleID+1).attr('title', (content['stats'][1] + ' points from correct answers'));
    var wrong = 100*content[moduleID]['stats'][0]/sum;
    $('.wrongAnswers').eq(moduleID+1).width(wrong+"%");
    $('.wrongAnswers').eq(moduleID+1).attr('title', (content['stats'][0] + ' points from wrong answers'));
    var notfill = 100*content[moduleID]['stats'][2]/sum;
    $('.notfilledAnswers').eq(moduleID+1).width(notfill+"%");
    $('.notfilledAnswers').eq(moduleID+1).attr('title', (content['stats'][2] + ' points from not filled questions'));
    var tobe = 100 - right - wrong - notfill;
    $('.toCheckAnswers').eq(moduleID+1).width(tobe+"%");
    $('.toCheckAnswers').eq(moduleID+1).attr('title', (content['stats'][3] + ' points from to-be-checked questions'));
    refreshGeneralScoreStats(content);
}

function addStatusArrays(array, adding){
    for(var i = 0; i < STATUS_COUNT; i++){
        array[i] += adding[i];
    }
    return array;
}

function handleQuestion(attendeeID, questionResp, questionCont, code, generate){
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    var text = '', points = 0, status = Array(STATUS_COUNT).fill(0);
    switch(questionCont['type']){
    case 'Descriptive':
    case 'Composite':
        for(var i = 0; i < questionCont['subq'].length; i++){
            var info = handleQuestion(attendeeID, questionResp['subq'][i],questionCont['subq'][i], code+'_'+i, generate);
            points += info.points;
            status = addStatusArrays(status, info.status);
            text += info.text;
        }
        if(generate){
            if(questionCont['type'][0] == 'D'){
                text = generateDQuestionRow(code, points, questionCont['points']) + text;
            } else {
                text = generateCQuestionRow(code, points, questionCont['points']) + text;
            }
        }
        break;
    case 'Check':
        if(questionResp['status'] == 1){
            points = questionCont['points'];
        }
        
        status[questionResp['status']]+=questionCont['points'];
        if(generate){
            text = generateChQuestionRow(
                code,
                questionCont['answer'],
                points,
                questionCont['points'],
                questionResp['status']);
        }
        break;
    case 'Opened':
        if(questionCont['answer'] == questionResp['answer']){
            points = questionCont['points'];
        }
        status[questionResp['status']]+=questionCont['points'];
        if(generate){
            text = generateOQuestionRow(
                code,
                questionResp['answer'],
                questionCont['answer'],
                points,
                questionCont['points'],
                questionResp['status']);
        }
        break;
    case 'Closed':
        if(questionCont['answer'] == questionResp['answer']){
            points = questionCont['points'];
        }
        status[questionResp['status']]+=questionCont['points'];
        if(generate){
            text = generateClQuestionRow(
                code,
                questionResp['answer'],
                questionCont['answer'],
                points,
                questionCont['points'],
                questionResp['status'],
                responsesKrisi[attendeeID]['images'] && responsesKrisi[attendeeID]['images'][getQuestionPage(window.formKrisi, code)]);
        }
       break;
    }
    return {text: text, points: points, status: status};
}

function changeImage(stIcons, status){
    status = parseInt(status);
    stIcons.addClass('statusIconDis');
    stIcons.eq(status).removeClass('statusIconDis');
    return stIcons;
}
function generateClQuestionRow(code, myanswer, answer, mypoints, points, status, hasPhoto){
    var stIcons = divStatus.find('.statusIcon');
    for(var i = 0; i < stIcons.length; i++){
        stIcons.eq(i).attr('name', code);
    }
    stIcons = changeImage(stIcons, status);
    row='<tr>';
    row += '<td>' + codeToString(code) + '</td>';
    row += '<td>' + answer + '</td>';
    row += `<td>
            <div class="radioAnswersCh" data-code="` + code + `">
                <div class="radioCh`;
                if(myanswer == 'A') row += ' radioChActive';
                row+= `" data-answer="A">A</div>
                <div class="radioCh`;
                if(myanswer == 'B') row += ' radioChActive';
                row+= `" data-answer="B">B</div>
                <div class="radioCh`;
                if(myanswer == 'C') row += ' radioChActive';
                row+= `" data-answer="C">C</div>
                <div class="radioCh`;
                if(myanswer == 'D') row += ' radioChActive';
                row+= `" data-answer="D">D</div>
            </div></td>`;
    row += '<td>' + divStatus.html() + '</td>';
    row += `<td class="photoField">`;
    if(hasPhoto) {
    row += `    <img class="photoFieldImg" data-id="` + code + `" src="` + tempPath + `/photo.png"/>`;
    }
    row += `</td>`;
    row += '<td class="checkTd scoreTd pointsField' + code + '">' + mypoints + ' | ' + points + '</td>';
    row += '</tr>';
    return row;
}
function generateOQuestionRow(code, myanswer, answer, mypoints, points, status){
    var stIcons = divStatus.find('.statusIcon');
    for(var i = 0; i < stIcons.length; i++){
        stIcons.eq(i).attr('name', code);
    }
    stIcons = changeImage(stIcons, status);
    if(myanswer == null) myanswer = '';
    row='<tr>';
    row += '<td>' + codeToString(code) + '</td>';
    row += '<td>' + answer + '</td>';
    row += '<td><input type="text" name="' + code +
        '" class="answerChField answerChField' + code + '" value = "' + myanswer + '"/></td>';
    row += '<td>' + divStatus.html() + '</td>';
    row += `<td class="photoField">`;
    if(responsesKrisi[attendeeID]['images'] && responsesKrisi[attendeeID]['images'][getQuestionPage(window.formKrisi, code)]) {
    row += `    <img class="photoFieldImg" data-id="` + code + `" src="` + tempPath + `/photo.png"/>`;
    }
    row += `</td>`;
    row += '<td class="checkTd scoreTd pointsField' + code + '">' + mypoints + ' | ' + points + '</td>';
    row += '</tr>';
    return row;
}
function generateDQuestionRow(code, mypoints, points){
    row='<tr class="descriptiveTr">';
    row += '<td colspan="5">Descriptive question</td>';
    row += '<td class="checkTd scoreTd pointsField' + code + '">' + mypoints + ' | ' + points + '</td>';
    row += '</tr>';
    return row;
}
function generateCQuestionRow(code, mypoints, points){
    row=`<tr class="compositeTr">
            <td colspan="5">Composite question</td>
            <td class="checkTd scoreTd pointsField${code}">${mypoints} | ${points}</td>
        </tr>`;
    return row;
}
function generateChQuestionRow(code, answer, mypoints, points, status){
    var stIcons = divStatus.find('.statusIcon');
    for(var i = 0; i < stIcons.length; i++){
        stIcons.eq(i).attr('name',code);
    }
    stIcons = changeImage(stIcons, status);
    row ='<tr class="checkTr">';
    row += `<td>${codeToString(code)}</td>`;
    row += '<td class="checkCondition" colspan="2">• ' + answer + '</td>';
    row += '<td>' + divStatus.html() + '</td>';
    row += '<td></td>';
    row += '<td class="checkTd scoreTd pointsField' + code + '">' + mypoints +' | ' + points + '</td>';
    row += '</tr>';
    return row;
}

function answerTemplateInit(){
    answerTemplateCanvases[3] = document.getElementById('diffrencesCanvas');
    for(var i =0 ; i < 3; i++){
        jQuery(`<img width=40 class="answerTemplImage invisible" data-id="` + i + `" src="` + window.srcPath + `/img/answers3/answer` + i + `.jpg"/>
        <canvas class="answerCanvas invisible" id="answerTemplCanvas` + i + `"></canvas>`)
        .appendTo('#usedForChecking');
    }
    $( ".answerTemplImage" ).on( "load", function() {
        var id = parseInt($(this).data('id'));
        answerTemplateCanvases[id] = document.getElementById('answerTemplCanvas'+id);
        answerTemplateCanvases[id].width = 40;
        answerTemplateCanvases[id].height = 40;
        var ctx = answerTemplateCanvases[id].getContext("2d");
        ctx.drawImage(this, 0,0,40,40);
        // var imageData = ctx.getImageData(0,0,40,40);
        // drawBlackRect(imageData.data, 13,25,12,27,40, 40);
        // ctx.putImageData(imageData,0,0);
        blackanswerTemplateBlacks[id] = countBlackPixels(ctx);
    });
}

function displayAllPages(justChanged){
    var photosDiv = $('#photosDiv');
    photosDiv.html(`<p>Upload student's answers to the corresponding pages here:</p>`);
    for(var pageId in window.pageInfo){
        var image = window.responsesKrisi[attendeeID]['images'] && pageId in window.responsesKrisi[attendeeID]['images'];
        var text = `<div id="attendeePageDiv` + pageId + `" class="attendeePageDiv" data-id=`+pageId+`>
                        <img id="attendeePageImg` + pageId + `"/>`;
        if(!image){
            text+=     `<div class="emptyPageOverlay">
                            <img class="center" style="padding: 0px 0px 10px 10px; width: 70px" src="` + tempPath + `/missingImage.png" />
                        </div>`;
        }
        text+=         `<div style="display:none">
                            <button class="attendeePageBtn attendeeChangeBtn">Change photo</button>
                            <button class="attendeePageBtn attendeeUploadBtn">Upload photo</button>
                            <button class="attendeePageBtn attendeeReextractBtn">Reextract answers</button>
                        </div>
                    </div>`;
        jQuery(text).appendTo(photosDiv);
        if(image){
            $('#attendeePageDiv' + pageId).find('.emptyPageOverlay').hide();
            $.ajax({
                url: '',
                type: 'post',
                data: { "getImageURL": window.responsesKrisi[attendeeID]['images'][pageId]['attID'], 
                        "pageId": pageId},
                success: function(data) { 
                    data = JSON.parse(data);
                    $('#attendeePageDiv' + data.pageId).find('.attendeeUploadBtn').hide();
                    $('#attendeePageDiv' + data.pageId).find('img').first().attr('src',data.url);
                    if(justChanged == data.pageId){
                        $('#attendeePageDiv' + data.pageId).find('img').first().load(function(){
                            extractFromPage(justChanged);
                        });
                    }
                    
                }
            });
        } else {
            $('#attendeePageDiv' + pageId).find('.emptyPageOverlay').show();
            $('#attendeePageDiv' + pageId).find('.attendeeChangeBtn').hide();
            $('#attendeePageDiv' + pageId).find('.attendeeReextractBtn').hide();
            $('#attendeePageDiv' + pageId).find('img').first().attr('src',window.pageInfo[pageId]['url']);
        }
    }
}
$(document).on('click', '.attendeeUploadBtn', function(){
    var pageId = $(this).parent().parent().data('id');
    changingPageId = pageId;
    $('#imageUploadPopupDiv').modal('show');

    $('#photoUploadStage1').hide();
    $('#photoUploadStage2').hide();
    initStage1();
});

$(document).on('click', '.attendeeChangeBtn', function(){
    var pageId = $(this).parent().parent().data('id');
    $.ajax({
        url: '',
        type: 'post',
        data: { "callResponseEditFunction": "deleteAttendeeImage", 
                "postID" : window.postID,
                "attendeeID" : attendeeID,
                "pageID" : pageId},
        success: function(data) {
            window.responsesKrisi = JSON.parse(data['responses']);
            displayAllPages(-1);
            changingPageId = pageId;
            $('#imageUploadPopupDiv').modal('show');
            
            $('#photoUploadStage1').hide();
            $('#photoUploadStage2').hide();
            initStage1();
        }
    });
});


$(document).on('click', '.attendeeReextractBtn', function(){
    var pageId = $(this).parent().parent().data('id');
    extractFromPage(pageId);
});

function extractFromPage(pageId){
    var image = document.getElementById('attendeePageImg' + pageId);
    var queries = [];
    for (var m in window.formKrisi) {
        var arr = checkQuestion(
            pageId, 
            window.formKrisi[m],
            window.contentKrisi[m], 
            image, 
            m);
        queries = queries.concat(arr);
    }
    $.ajax({
        url: '',
        type: 'post',
        data: { "callResponseEditFunction": "changeAnswerChArr", 
        "postID" : window.postID,
        "attendeeID" : attendeeID,
        "queries" : queries},
        success: function(data) {
            var ans = JSON.parse(data['ansStatus']);
            toastr.success('</br>' + ans[1] + ' right answers</br>' + ans[0] + ' wrong answers</br>' + ans[2] + ' not filled questions</br>' + ans[3] + ' questions to check', 
                            queries.length + ' answers extracted');
            window.responsesKrisi = JSON.parse(data['responses']);
            refreshResponseTable();  
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            toastr.error("Unable to upload result");
        }
    });
}

function checkQuestion(formPageID, form, content, image, code){
    var answerArr = [];
    if(form!=undefined && form!=null && 'subq' in form){
        for (var qId in form['subq']) {
            qId = parseInt(qId);
            var arr = checkQuestion(
                formPageID, 
                form['subq'][qId], 
                content['subq'][qId], 
                image,
                code + '_' + qId);
            //  if(code == 0 && qId==1)return;
            answerArr = answerArr.concat(arr);
        }
    } 
    else if(form!=undefined && form!=null && 'page' in form && form['page'] == formPageID){
        var krisi, type;
        var edgesToChange = JSON.parse(JSON.stringify(window.pageInfo[formPageID]['edges']));
        krisi = findRectByGuideEdges(parseRectFromString(form),edgesToChange);
        var width = image.naturalWidth;
        var height = image.naturalHeight;
        type = content.type;
        if(type=='Closed'){
            var arrScaling = [];
            for(i = 0; i < 4; i++){
                var questionCanvas = document.getElementById('canvasCutQuest'+ i);
                questionCanvas.width = krisi.width*width/4;
                questionCanvas.height = krisi.height*height;
                var questionCanvasCxt = questionCanvas.getContext("2d");
                questionCanvasCxt.drawImage(image, 
                    krisi.left*width + i*(krisi.width*width/4)  -5, 
                    krisi.top*height                            -5, 
                    krisi.width*width/4                         +10, 
                    krisi.height*height                         +10,
                    0,0, krisi.width*width/4, krisi.height*height);
                var newImageData = contrastImage(questionCanvasCxt.getImageData(0, 0, questionCanvas.width/4, questionCanvas.height), 10);
                //var newImageData = questionCanvasCxt.getImageData(0, 0, questionCanvas.width/4, questionCanvas.height);
                questionCanvasCxt.putImageData(newImageData,0,0);
                arrScaling.push(croppedImageWhitespaceRect(questionCanvas));
            }   
            console.log(arrScaling);
            var ratio = averageRatio(arrScaling);
            var arrStatus = [];
            for(var i = 0; i < 4; i++){
                var questionCanvas = document.getElementById('canvasCutQuest'+i);
                var questionCanvasCxt = questionCanvas.getContext("2d");
                cropImage(questionCanvas, arrScaling[i], ratio);
                scaleTo(questionCanvas,40);
                questionCanvasCxt.putImageData(questionCanvasCxt.getImageData(0, 0, questionCanvas.width, questionCanvas.height),0,0,0,0,40,40);
                // questionCanvasCxt.fillStyle = "black";
                // questionCanvasCxt.fillRect(14, 12, 12, 16);

                // var imageData = questionCanvasCxt.getImageData(0,0,40,40);
                // drawBlackRect(imageData.data, 13,25,12,27,40,40);
                // questionCanvasCxt.putImageData(imageData,0,0);

                //drawSeparetingLines(questionCanvas);
                arrStatus.push(statusOfCircle(questionCanvasCxt));
                //return;
            }   
            console.log(blackanswerTemplateBlacks);
            console.log(code, arrStatus);
            var answer = answerByCircleStatus(arrStatus);
            //reportedAnswers.push({questionID: questionID, subID: subID, answer:answer});
            if(answer!=-1)answer = String.fromCharCode(answer + 65);
            else answer = '';
            code = decodeIds(code);
            answerArr[0] = {};
            answerArr[0]['moduleID'] = code[0];
            answerArr[0]['indArr'] = code[1];
            answerArr[0]['answer'] = answer;
        } else {
            var questionCanvas = document.getElementById('canvasCutQuest0');
            questionCanvas.width = krisi.width*width;
            questionCanvas.height = krisi.height*height;
            var questionCanvasCxt = questionCanvas.getContext("2d");
            questionCanvasCxt.drawImage(image, 
                krisi.left*width, krisi.top*height, krisi.width*width, krisi.height*height,
                0,0, krisi.width*width, krisi.height*height);
            code = decodeIds(code);
            answerArr[0] = {};
            answerArr[0]['moduleID'] = code[0];
            answerArr[0]['indArr'] = code[1];
        }
    }
    return answerArr;
}

function saveImageToMedia(canvas, edges){
    var imgURL = {imgURL:canvas.toDataURL("image/png"),
    edges: edges};
    //console.log(attendeeID);
    $.ajax({
        url: '',
        type: 'post',
        data: { "callResponseEditFunction": "uploadAttendeeImage", 
                "postID" : window.postID,
                "attendeeID" : attendeeID,
                "imgBase64": imgURL,
                "imageID": changingPageId},
        success: function(data) { 
            responsesKrisi = JSON.parse(data['responses']);
            displayAllPages(changingPageId);
            changingPageId = -1;
        }
    });
}

//reading answers from status of circles
function answerByCircleStatus(stats){
    var ones = [];
    for(i = 0; i < 4; i++){
        if(stats[i] == 1) ones.push(i);
    }
    if(ones.length == 1) return ones[0];
    return -1;
}
function statusOfCircle(canvas){
    var black = countBlackPixels(canvas);
    console.log(black);
    if(black < blackanswerTemplateBlacks[0]) return 0;
    // var diff0 = Math.abs(black-blackanswerTemplateBlacks[0]);
    var diff1 = Math.abs(black-blackanswerTemplateBlacks[1]);
    var diff2 = Math.abs(black-blackanswerTemplateBlacks[2]);
    if(diff2 < diff1) return 2;
    return 1;
}
function scaleTo(canvas, size){
    var cw = canvas.width, ch = canvas.height, cxt = canvas.getContext("2d");
    answerTemplateCanvases[3].getContext("2d").drawImage(canvas,0,0);
    canvas.width = size;
    canvas.height = size;
    cxt.drawImage(answerTemplateCanvases[3],0,0,cw,ch,0,0,size,size);
}
function averageRatio(arr){
    var ratio = {w: 0, h: 0};
    for(var i = 0; i < arr.length; i++){
        ratio.w += (arr[i].colsRange.end-arr[i].colsRange.start);
        ratio.h += (arr[i].rowsRange.end-arr[i].rowsRange.start);
    }
    ratio.w = Math.floor(ratio.w/arr.length);
    ratio.h = Math.floor(ratio.h/arr.length);
    return ratio;
}


function drawEdgesOnPageCheck(edges, width, height){
    var edgePoints = $('#photoUploadStage2').find('.edgePoint');
    for(i = 0; i< 4;i++){
        edgePoints[i].style.left = edges[i].x*width+'px';
        edgePoints[i].style.top = edges[i].y*height+'px';
    }
}

$(document).on('mouseenter', '.attendeePageDiv', function(){
    $(this).find('img').css('visibility', 'hidden');
    $(this).find('div').show(); 
    $(this).find('.emptyPageOverlay').hide(); 
});
$(document).on('mouseleave', '.attendeePageDiv', function(){
    $(this).find('img').css('visibility', 'visible');
    $(this).find('div').hide();
    $(this).find('.emptyPageOverlay').show();
});
$(document).on('mouseenter', '.photoFieldImg', function(){
    var $this = $(this);
    var code = $this.data('id');
    var formQuestion = getQuestion(window.formKrisi,code);
    if(formQuestion == -1){ console.log('Form question = -1'); return; }
    var attendeePageImg = document.getElementById('attendeePageImg' + formQuestion['page']);
    var krisi = findRectByGuideEdges(parseRectFromString(formQuestion),window.pageInfo[formQuestion['page']]['edges']);
    var canvas = document.getElementById('hoverPopupPhotoCanvas');
    var width = attendeePageImg.naturalWidth, height = attendeePageImg.naturalHeight;
    canvas.width = krisi.width*width;
    canvas.height = krisi.height*height;
    var canvasCxt = canvas.getContext("2d");
    canvasCxt.drawImage(attendeePageImg, 
        krisi.left*width, krisi.top*height, krisi.width*width, krisi.height*height,
        0,0, krisi.width*width, krisi.height*height);
    $('#hoverPopupPhoto').show();
    $('#hoverPopupPhoto').css({left: this.getBoundingClientRect().x - 310,
                                top: this.getBoundingClientRect().y - 30});
});
$(document).on('mouseleave', '.photoFieldImg', function(){
    $('#hoverPopupPhoto').hide();
});


function initStage1(){
    $('#photoUploadStage1').show();
    var steps = $('.progressStepsHeader').find('.step');
    steps.eq(0).attr("class","step currentStep");
    steps.eq(1).attr("class","step");
    steps.eq(2).attr("class","step");
    var src = document.getElementById('attendeePageImg' + changingPageId).src;
    document.getElementById('backgroundImageStage1').style.backgroundImage="url('"+src+"')";
	document.getElementById('backgroundImageStage1').style.backgroundSize="cover";
    const dropArea = document.getElementById("dropArea");
    dropArea.addEventListener("dragenter", (e) => {
        e.preventDefault();
        dropArea.classList.add("dragover");
    });
    dropArea.addEventListener("dragover", (e) => {
        e.preventDefault();
    });
    dropArea.addEventListener("dragleave", () => {
        dropArea.classList.remove("dragover");
    });
    dropArea.addEventListener("drop", (e) => {
        e.preventDefault();
        dropArea.classList.remove("dragover");

        const files = e.dataTransfer.files;
        if(files.length > 1){
            toastr.error('Too many files');
        }
        else{
            const file = files[0];
            console.log("File name:", file.name);
            console.log("File size:", file.size, "bytes");
            if (file.type.startsWith("image/")) {
                const img = document.getElementById("uploadImageImg");
                img.src = URL.createObjectURL(file);
                $('#photoUploadStage1').hide(500);
                initStage2();
            }
            else{
                toastr.error('Please use only: JPEG,PNG,GIF,BMP,WebP,SVG','Incompatible file type');
            }
        }
    });

    $(document).on('click','#uploadImageAtt',function(){
        $( "#uploadImageInput" ).click();
    });

    $( "#uploadImageInput" ).on( "change", function() {
        var image = document.getElementById('uploadImageImg');
        blob = event.target.files[0];
        image.src = URL.createObjectURL(blob);
        $('#photoUploadStage1').hide(500);
        initStage2();
    });
}

function initStage2(){
    var uploadImageImgWidth;
    var uploadImageImgHeight;

    let lastX, lastY,x,y;
    let draggingEdge = undefined;
    const canvasPadding = 10;
    const minX = canvasPadding;
    const minY = canvasPadding;
    var maxX = uploadImageImgWidth - canvasPadding;
    var maxY = uploadImageImgHeight - canvasPadding;

    $('#photoUploadStage2').show();
    var steps = $('.progressStepsHeader').find('.step');
    steps.eq(0).attr("class","step finishedStep");
    steps.eq(1).attr("class","step currentStep");
    steps.eq(2).attr("class","step");
    
    document.getElementById('uploadImageImg').addEventListener("load", function() {
        let image = cv.imread(this);
        cv.imshow('imageCanvas', image);
        image.delete();
        imageCanvas = document.getElementById('imageCanvas');
        uploadImageImgWidth = this.width;
        uploadImageImgHeight = this.height;
        console.log(this);
        console.log($(this).width());
        maxX = uploadImageImgWidth - canvasPadding;
        maxY = uploadImageImgHeight - canvasPadding;
        edges = find4Edges(document.getElementById('imageCanvas'));
        ableToMoveCrosses = true;
        console.log(uploadImageImgWidth,uploadImageImgHeight);
        drawEdgesOnPageCheck(edges,uploadImageImgWidth, uploadImageImgHeight);
    }, {once : true});

    $(document).on('mousedown', '.edgePoint', function(e){
        draggingEdge = this;
        e.preventDefault();
        lastX = e.clientX - draggingEdge.offsetLeft;
        lastY = e.clientY - draggingEdge.offsetTop;
    });


    $(".edgePoint").on("mousemove", function(e) {
        if (typeof draggingEdge !== 'undefined') {  
            x = e.clientX - lastX;
            y = e.clientY - lastY;
            x = Math.min(Math.max(x, minX), maxX);
            y = Math.min(Math.max(y, minY), maxY);
            draggingEdge.style.left = x + 'px';
            draggingEdge.style.top = y + 'px';
        }
    });
    $(".edgePoint").on("mouseup", function(e) {
        if(typeof draggingEdge !== 'undefined'){
            var ind = parseInt($(this).data('id'));
            edges[ind].x = draggingEdge.offsetLeft/uploadImageImgWidth;
            edges[ind].y = draggingEdge.offsetTop/uploadImageImgHeight;
            drawEdgesOnPageCheck(edges,uploadImageImgWidth, uploadImageImgHeight);
            draggingEdge = undefined;
        }
    });

    $(".formPageCanvas").on("mousemove", function(e) {
        if (typeof draggingEdge !== 'undefined') {  
            x = e.clientX - lastX;
            y = e.clientY - lastY;
            x = Math.min(Math.max(x, minX), maxX);
            y = Math.min(Math.max(y, minY), maxY);
            draggingEdge.style.left = x + 'px';
            draggingEdge.style.top = y + 'px';
        }
    });

    $(document).on('click', '#cutPage', function(){
        var $this = $(this);
        var steps = $('.progressStepsHeader').find('.step');
        steps.eq(0).attr("class","step finishedStep");
        steps.eq(1).attr("class","step finishedStep");
        steps.eq(2).attr("class","step currentStep");
        let src = cv.imread('uploadImageImg');
        let dst = new cv.Mat();
        let dsize = new cv.Size(src.cols, src.rows);
        let srcTri = cv.matFromArray(4, 1, cv.CV_32FC2, [
            edges[0].x*uploadImageImgWidth, edges[0].y*uploadImageImgHeight, 
            edges[1].x*uploadImageImgWidth, edges[1].y*uploadImageImgHeight, 
            edges[2].x*uploadImageImgWidth, edges[2].y*uploadImageImgHeight, 
            edges[3].x*uploadImageImgWidth, edges[3].y*uploadImageImgHeight]);
        let dstTri = cv.matFromArray(4, 1, cv.CV_32FC2, [0, 0, uploadImageImgWidth, 0, 0, uploadImageImgHeight,  uploadImageImgWidth, uploadImageImgHeight]);
        let M = cv.getPerspectiveTransform(srcTri, dstTri);
        cv.warpPerspective(src, dst, M, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());
        var canvas = document.getElementById('imageCanvas');
        clearCanvas(canvas);
        cv.imshow('imageCanvas', dst);
        src.delete(); dst.delete(); M.delete(); srcTri.delete(); dstTri.delete();
        saveImageToMedia(canvas, edges);
        $('#imageUploadPopupDiv').modal('hide');
    });

}

$(document).on('click','#resetBtn', function(){
    $.ajax({
        url: '',
        type: 'post',
        data: { "callResponseEditFunction": "resetAttendee", 
        "postID" : window.postID,
        "attendeeID" : attendeeID,},
        success: function(data) {
            window.responsesKrisi = JSON.parse(data['responses']);
            refreshResponseTable();
            displayAllPages(-1);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            toastr.error("Unable to upload answer");
        }
    });
});