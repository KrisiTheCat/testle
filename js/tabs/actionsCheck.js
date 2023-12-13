var $ = jQuery;
var tempPath;
var attendeeID = undefined;
var answerTemplateCanvases = Array(5);
var blackanswerTemplateBlacks = Array(4);
var divStatus;

var testArray = [];

var changingPageId = -1;

var imageInCanvas = false;

let model;

async function init() {
    (async () => {
        try
        {
            model = await tf.loadLayersModel('http://testle/wp-content/themes/lalita-child/models/12.12.23/model.json');
        }
        catch(error)
        {
            console.error(error);
        }
    })();
    return 0;
}

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
    uploadAnswersAsPdf();

    if(window.pageInfo.length==0){
        $('#photosDiv').html('<p>No form uploaded. Fix <a href="../form">here</p>');
        $('#photosDiv').css('padding-bottom','0px');
    }

    init().then(result => {
      console.log(result);
    });
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
    answerTemplateCanvases[4] = document.getElementById('diffrencesCanvas');
    for(var i =0 ; i < 4; i++){
        answerTemplateCanvases[i] = Array(3);
        blackanswerTemplateBlacks[i] = Array(3);
        for(var j =0 ; j < 3; j++){
            jQuery(`<img width=40 class="answerTemplImage invisible" data-ans="${i}" data-id="${j}" src="` + window.srcPath + `/img/answers5/answer${i}_${j}.jpg"/>
            <canvas class="answerCanvas invisible" id="answerTemplCanvas${i}${j}"></canvas>`)
            .appendTo('#usedForChecking');
        }
    }
    $( ".answerTemplImage" ).on( "load", function() {
        var id = parseInt($(this).data('id'));
        var ans = parseInt($(this).data('ans'));
        answerTemplateCanvases[ans][id] = document.getElementById('answerTemplCanvas'+ans+''+id);
        answerTemplateCanvases[ans][id].width = 40;
        answerTemplateCanvases[ans][id].height = 40;
        var ctx = answerTemplateCanvases[ans][id].getContext("2d", { willReadFrequently: true });
        ctx.drawImage(this, 0,0,40,40);
        // var imageData = ctx.getImageData(0,0,40,40);
        // drawBlackRect(imageData.data, 13,25,12,27,40, 40);
        // ctx.putImageData(imageData,0,0);
        blackanswerTemplateBlacks[ans][id] = countBlackPixels(ctx);
    });
}

function displayPage(pageId, url, justChanged){
    $('#attendeePageDiv' + pageId).find('.attendeeUploadBtn').hide();
    $('#attendeePageDiv' + pageId).find('img').first().attr('src',url);
    if(justChanged){
        $('#attendeePageDiv' + pageId).find('.emptyPageOverlay').hide();
        $('#attendeePageDiv' + pageId).find('img').first().load(function(){
            console.log("HERE");
            extractFromPage(pageId);
        });
    }
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
    console.log(testArray);
    if(queries.length == 0){
        toastr.info("Please set locations in form");
    }
    else{
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
}

function checkQuestion(formPageID, form, content, image, code){
    var answerArr = [];
    if(form!=undefined && form!=null && 'subq' in form && form.subq != null){
        for (var qId in form['subq']) {
            qId = parseInt(qId);
            var arr = checkQuestion(
                formPageID, 
                form['subq'][qId], 
                content['subq'][qId], 
                image,
                code + '_' + qId);
            // if(code + '_' + qId == '0_14') return;
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
                var questionCanvasCxt = questionCanvas.getContext("2d", { willReadFrequently: true });
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
                var questionCanvasCxt = questionCanvas.getContext("2d", { willReadFrequently: true });
                cropImage(questionCanvas, arrScaling[i], ratio);
                scaleTo(questionCanvas,40);
                questionCanvasCxt.putImageData(questionCanvasCxt.getImageData(0, 0, questionCanvas.width, questionCanvas.height),0,0,0,0,40,40);
                // questionCanvasCxt.fillStyle = "black";
                // questionCanvasCxt.fillRect(14, 12, 12, 16);

                // var imageData = questionCanvasCxt.getImageData(0,0,40,40);
                // drawBlackRect(imageData.data, 13,25,12,27,40,40);
                // questionCanvasCxt.putImageData(imageData,0,0);

                //drawSeparetingLines(questionCanvas);
                scaleTo(questionCanvas,28);
                var id=statusOfCircleDL(questionCanvasCxt, blackanswerTemplateBlacks[i]);
                arrStatus.push(id);

                var arr = [0,0,0];
                arr[id] = 1;
                testArray.push({
                    input: JSON.stringify(getArrData(questionCanvasCxt)),
                    output: JSON.stringify(arr)
                });

                //return;
            }   
            //console.log(blackanswerTemplateBlacks);
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
            var questionCanvasCxt = questionCanvas.getContext("2d", { willReadFrequently: true });
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

function saveImageToMedia(canvas, edges, pageId){
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
                "imageID": pageId},
        success: function(data) { 
            displayPage(pageId, data.url, true);
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
function statusOfCircle(canvas, templateBlacks){
    var black = countBlackPixels(canvas);
   // console.log(black);
    var diff0 = Math.abs(black-templateBlacks[0]);
    var diff1 = Math.abs(black-templateBlacks[1]);
    var diff2 = Math.abs(black-templateBlacks[2]);
    if(black < templateBlacks[1]-10) return 0;
    if(diff1 < diff2) return 1;
    return 2;
}
function statusOfCircleDL(canvasCxt){
    const tensor = model.predict(tf.tensor(getArrData(canvasCxt), [1, 784]))
    const value = tensor.dataSync();
    //console.log(value);
    if(value[0]>=value[1] && value[0]>=value[2]) return 0;
    if(value[1]>=value[2]) return 1;
    return 2;
}
function scaleTo(canvas, size){
    var cw = canvas.width, ch = canvas.height, cxt = canvas.getContext("2d", { willReadFrequently: true });
    answerTemplateCanvases[4].getContext("2d", { willReadFrequently: true }).drawImage(canvas,0,0);
    canvas.width = size;
    canvas.height = size;
    cxt.drawImage(answerTemplateCanvases[4],0,0,cw,ch,0,0,size,size);
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
    var canvasCxt = canvas.getContext("2d", { willReadFrequently: true });
    canvasCxt.drawImage(attendeePageImg, 
        krisi.left*width, krisi.top*height, krisi.width*width, krisi.height*height,
        0,0, krisi.width*width, krisi.height*height);
    $('#hoverPopupPhoto').show();
    $('#hoverPopupPhoto').css({left: this.getBoundingClientRect().x - 480,
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
                document.getElementById('imageImg').src = URL.createObjectURL(file);
                $('#photoUploadStage1').hide(500);
                imageInCanvas = false;
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
        document.getElementById('imageImg').src = URL.createObjectURL(blob);
        $('#photoUploadStage1').hide(500);
        imageInCanvas = false;
        initStage2();
    });
}

function initStage2(){
    var uploadImageImgWidth;
    var uploadImageImgHeight;
    var uploadImageImgWidthB;
    var uploadImageImgHeightB;

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
    
    document.getElementById('imageImg').addEventListener("load", function() {
        uploadImageImgWidthB = this.width;
        uploadImageImgHeightB = this.height;
    });
    
    document.getElementById('uploadImageImg').addEventListener("load", function() {
        let canvas = document.createElement("canvas");
        canvas.setAttribute("id", "canvasAn");
        document.body.appendChild(canvas);
        let ctx = canvas.getContext("2d", { willReadFrequently: true });
        let image = cv.imread(this);
        cv.imshow('canvasAn', image);
        image.delete();

        uploadImageImgWidth = this.width;
        uploadImageImgHeight = this.height;
        // uploadImageImgWidth = 332;
        // uploadImageImgHeight = 430;
        console.log(this);
        console.log($(this).width());
        maxX = uploadImageImgWidth - canvasPadding;
        maxY = uploadImageImgHeight - canvasPadding;
        edges = find4Edges3(canvasAn);
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

    $(document).on('touchstart click', '#cutPage', function(){
        var $this = $(this);
        var steps = $('.progressStepsHeader').find('.step');
        steps.eq(0).attr("class","step finishedStep");
        steps.eq(1).attr("class","step finishedStep");
        steps.eq(2).attr("class","step currentStep");
        let src = cv.imread('imageImg');
        let dst = new cv.Mat();
        let dsize = new cv.Size(src.cols, src.rows);
        let srcTri = cv.matFromArray(4, 1, cv.CV_32FC2, [
            edges[0].x*uploadImageImgWidthB, edges[0].y*uploadImageImgHeightB, 
            edges[1].x*uploadImageImgWidthB, edges[1].y*uploadImageImgHeightB, 
            edges[2].x*uploadImageImgWidthB, edges[2].y*uploadImageImgHeightB, 
            edges[3].x*uploadImageImgWidthB, edges[3].y*uploadImageImgHeightB]);
        let dstTri = cv.matFromArray(4, 1, cv.CV_32FC2, [0, 0, uploadImageImgWidthB, 0, 0, uploadImageImgHeightB,  uploadImageImgWidthB, uploadImageImgHeightB]);
        let M = cv.getPerspectiveTransform(srcTri, dstTri);
        cv.warpPerspective(src, dst, M, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());
        var canvas = document.getElementById('imageCanvas');
        clearCanvas(canvas);
        cv.imshow('imageCanvas', dst);
        src.delete(); dst.delete(); M.delete(); srcTri.delete(); dstTri.delete();
        saveImageToMedia(canvas, edges, changingPageId);
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

/* upload answers as PDF */

function uploadAnswersAsPdf(){

    var thePDF, numPages, pdf_url, dataURLs;

    $(document).on('click', '#uploadPhotosPdf', function(){
        $("#uploadImagesPDFInput").click();
    });

    $(document).on('change', '#uploadImagesPDFInput', function(){
        if(['application/pdf'].indexOf($("#uploadImagesPDFInput").get(0).files[0].type) == -1) {
            toastr.error("Not a PDF");
            return;
        }
        if($("#uploadImagesPDFInput")[0].files.length != 1) {
            toastr.error("Too many files");
            return;
        }
        pdf_url = URL.createObjectURL($("#uploadImagesPDFInput").get(0).files[0]);
        console.log(pdf_url);
        PDFJS.getDocument(pdf_url).then(function(pdf) {
            thePDF = pdf;
            numPages = pdf.numPages;
            console.log(numPages);
            if(numPages != window.pageInfo.length) {
                toastr.error("Not correct number of pages!");
                return;
            }
            currPage = 1;
            dataURLs = [];
            thePDF.getPage(currPage).then( handlePDFPages );
            //showLoader();
        }).catch(function(error) {
            alert(error.message);
        });
    });
    
    function handlePDFPages(page){
        var canvas = $('#imageCanvas').get(0);
        var pageRendering = drawPageInCanvas(page,canvas, false);
        console.log('here');
        pageRendering.promise.then(function(){
            var targetCanvas = document.getElementById('imageCanvas2');
            var targetCtx = targetCanvas.getContext("2d");
            // $('#photoUploadStage1').hide();
            // $('#photoUploadStage2').show();
            // $('#imageUploadPopupDiv').modal('show');
            // console.log('here');
            // var img = document.getElementById('uploadImageImg');
            // console.log('here');
            // img.src = canvas.toDataURL('image/png');
            // console.log('here');
            // imageInCanvas = true;
            // initStage2();

            console.log(canvas.width, canvas.height);
            targetCanvas.height = canvas.height;
            targetCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height);
            cutPDFPage(canvas, currPage, find4Edges3(targetCanvas));
            
            currPage++;
            if ( thePDF !== null && currPage <= numPages ){
                thePDF.getPage( currPage ).then( handlePDFPages );
            }
            if(currPage == numPages+1){  
                //hideLoader();  
                console.log("ready");
                // $.ajax({
                //     url: '',
                //     type: 'post',
                //     data: { "callResponseEditFunction": "uploadAttendeeImages", 
                //             "postID" : window.postID,
                //             "attendeeID" : attendeeID,
                //             "queries": dataURLs,},
                //     success: function(data) { 
                //         console.log(data);
                //         console.log(JSON.parse(data));
                //     },
                //     error: function(XMLHttpRequest, textStatus, errorThrown) {
                //         toastr.error("Unable to save images");
                //     }
                // });
            }
        });
    }

    function cutPDFPage(canvas, pageId, edges){
        console.log(edges);
        // return;
        var width = canvas.width;
        var height = canvas.height;
        var img = document.getElementById('imageImg');
        img.src = canvas.toDataURL('image/png');//TODO
        img.onload = function() {
            let src = cv.imread('imageImg');
            let dst = new cv.Mat();
            let dsize = new cv.Size(src.cols, src.rows);
            let srcTri = cv.matFromArray(4, 1, cv.CV_32FC2, [
                edges[0].x*width, edges[0].y*height, 
                edges[1].x*width, edges[1].y*height, 
                edges[2].x*width, edges[2].y*height, 
                edges[3].x*width, edges[3].y*height]);
            let dstTri = cv.matFromArray(4, 1, cv.CV_32FC2, [0, 0, width, 0, 0, height,  width, height]);
            let M = cv.getPerspectiveTransform(srcTri, dstTri);
            cv.warpPerspective(src, dst, M, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());
            var canvas = document.getElementById('imageCanvas2');
            clearCanvas(canvas);
            cv.imshow('imageCanvas2', dst);
            src.delete(); dst.delete(); M.delete(); srcTri.delete(); dstTri.delete();
            saveImageToMedia(canvas, edges, pageId-1);
        };
    }
}