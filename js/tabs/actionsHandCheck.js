var $ = jQuery;
var allToCheckQuestions = {};

function initHandCheck(){
    allToCheckQuestions = {};
    for(var attendeeID in window.responsesKrisi){
        if(attendeeID == 0) continue;
        attendeeID = parseInt(attendeeID);
        for(var moduleID = 0; window.responsesKrisi[attendeeID][moduleID]; moduleID++){
            var arr = findToCheckQuestions(window.responsesKrisi[attendeeID][moduleID], window.contentKrisi[moduleID], moduleID);
            addToCheckForAttendee(allToCheckQuestions, arr, attendeeID);
        }
    }
    $('#handCheckOpenedDashboard').html('');
    $('#handCheckDescrDashboard').html('');
    let allKeys = Object.keys(allToCheckQuestions);
    allKeys.sort();
    let temp = {};
    for (let i = 0; i < allKeys.length; i++) { 
        temp[allKeys[i]] = allToCheckQuestions[allKeys[i]];
    }
    allToCheckQuestions = JSON.parse(JSON.stringify(temp));

    for(var code in allToCheckQuestions){
        initButtonForQuestion(code);
    }
    initBasketActions();

}

var currChecking = {
    type: undefined,
    attInArrId: undefined,
    attendeeID: undefined,
    moduleID: undefined,
    indArr: undefined,
    questionF: undefined,
    questionC: undefined,
    seshResults: undefined,
    checkPoints: undefined,
    checkStatus: undefined,
}

function initButtonForQuestion(code){
    var qContent = getQuestion(window.contentKrisi, code);
    var type = qContent['type'];
    var text = `<div class="handCheckQuestionDiv" id="handCheckQuestionDiv` + code + `"data-code="` + code + `">
                    <div class="handCheckQuestionDivOverlay" style="width:0%"></div>
                    <div class="handCheckQuestionInfoDiv">
                        <h4>` + codeToString(code) + `</h4>
                        <p>` + type + `</p>
                    </div>
                    <div style="flex:1"></div>
                    <div class="handCheckQuestionInfoDiv handCheckQuestionInfoCheckedDiv">
                        <h4></h4>
                        <p>checked</p>
                    </div>
                </div>`;
    if(type == 'Opened') $(text).appendTo('#handCheckOpenedDashboard');
    if(type == 'Descriptive') $(text).appendTo('#handCheckDescrDashboard');
    updatePercentage(code);
    code = decodeIds(code);
}

function updatePercentage(code){
    var attCount = Object.keys(window.responsesKrisi).length-1;
    var count = allToCheckQuestions[code].length;
    $('#handCheckQuestionDiv' + code).find('.handCheckQuestionDivOverlay').css('width', parseInt((attCount-count)*100/attCount) + '%');
    $('#handCheckQuestionDiv' + code).find('.handCheckQuestionInfoCheckedDiv').find('h4').html((attCount-count) + '|' + attCount)
}

function startDescrCheckForAttendee(){
    var arr = allToCheckQuestions[currChecking.moduleID + '_' + encodeIds(currChecking.indArr)];
    if(arr.length == 0) {endCheckSeshion(); return;}
    if(currChecking.attInArrId>=arr.length) currChecking.attInArrId = 0;
    if(currChecking.attInArrId == -1) currChecking.attInArrId = arr.length-1;
    attendeeID = arr[currChecking.attInArrId];
    $('.handCheckAttP').html('Response of <b>' + window.usersKrisi[attendeeID]['name'] + '<b>');
    currChecking.attendeeID = attendeeID;
    var pageId = currChecking.questionF['page'];
    for(var i = 0; i < currChecking.checkStatus.length; i++){
        currChecking.checkPoints[i] = 0;
        currChecking.checkStatus[i] = 0;
        $('#handCheckDescrCheck' + i).prop('checked', false);
        $('#handCheckDescrCheck' + i).parent().removeClass('completedTask');
    }
    $.ajax({
        url: '',
        type: 'post',
        data: { "getImageURL": window.responsesKrisi[attendeeID]['images'][pageId]['attID'], 
                "pageId": pageId},
        success: function(data) { 
            data = JSON.parse(data);
            var image = document.getElementById('handCheckAttendeePage');
            image.src = data.url;
            image.onload = function() {
                var edges = JSON.parse(JSON.stringify(window.pageInfo[pageId]['edges']));
                var krisi = findRectByGuideEdges(parseRectFromString(currChecking.questionF),edges);
                var width = image.naturalWidth;
                var height = image.naturalHeight;
                var questionCanvas = document.getElementById('handCheckDescrAttCanvas');
                questionCanvas.width = krisi.width*width;
                questionCanvas.height = krisi.height*height;
                var questionCanvasCxt = questionCanvas.getContext("2d");
                questionCanvasCxt.drawImage(image, 
                    krisi.left*width, krisi.top*height, krisi.width*width, krisi.height*height,
                    0,0, krisi.width*width, krisi.height*height);
                updateDescrPoints();
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            toastr.error("Unable to retrieve photo");
        }
    });
}

function startOpenCheckForAttendee(){
    var arr = allToCheckQuestions[currChecking.moduleID + '_' + encodeIds(currChecking.indArr)];
    if(arr.length == 0) {endCheckSeshion(); return;}
    if(currChecking.attInArrId>=arr.length) currChecking.attInArrId = 0;
    if(currChecking.attInArrId == -1) currChecking.attInArrId = arr.length-1;
    attendeeID = arr[currChecking.attInArrId];
    $('.handCheckAttP').html('Response of <b>' + window.usersKrisi[attendeeID]['name'] + '</b>');
    currChecking.attendeeID = attendeeID;
    var pageId = currChecking.questionF['page'];
    $.ajax({
        url: '',
        type: 'post',
        data: { "getImageURL": window.responsesKrisi[attendeeID]['images'][pageId]['attID'], 
        "pageId": pageId},
        success: function(data) { 
            data = JSON.parse(data);
            var image = document.getElementById('handCheckAttendeePage');
            image.src = data.url;
            image.onload = function() {
                var edges = JSON.parse(JSON.stringify(window.pageInfo[pageId]['edges']));
                var krisi = findRectByGuideEdges(parseRectFromString(currChecking.questionF),edges);
                var width = image.naturalWidth;
                var height = image.naturalHeight;
                var questionCanvas = document.getElementById('handCheckOpenAttCanvas');
                questionCanvas.width = krisi.width*width;
                questionCanvas.height = krisi.height*height;
                var questionCanvasCxt = questionCanvas.getContext("2d");
                setTimeout(function () {
                questionCanvasCxt.drawImage(image, 
                    krisi.left*width, krisi.top*height, krisi.width*width, krisi.height*height,
                    0,0, krisi.width*width, krisi.height*height);
                }, 10);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            toastr.error("Unable to retrieve photo");
        }
    });
}

$(document).on('click','.handCheckQuestionDiv', function(e){
    var code = $(this).data('code');
    currChecking.questionF = getQuestion(window.formKrisi,code);
    if(currChecking.questionF == -1){
        toastr.error("Unable to open hand checking","No information in form");
        e.preventDefault();
        return;
    }
    var questionC = getQuestion(window.contentKrisi,code);
    var decoded = decodeIds(code);
    currChecking.moduleID = decoded[0];
    currChecking.indArr = decoded[1];
    currChecking.attInArrId = 0;
    currChecking.seshResults = [0,0,0];
    currChecking.questionC = questionC;
    $('#toBeCheckedPopup').modal('show');
    $('#handCheckingQuesID').html('#' + codeToString(code));
    if(questionC['type'] == 'Opened'){
        currChecking.type = 'Opened';
        $('.handCheckOpened').show();
        $('.handCheckDescr').hide();
        $('.modal-footer').hide();
        $('#handCheckingCorrect').show();
        $('#handCheckingCorrect').html('Correct answer: <b>' + questionC['answer'] + '</b>');
        startOpenCheckForAttendee();
    } 
    if(questionC['type'] == 'Descriptive'){
        currChecking.type = 'Descriptive';
        $('.handCheckOpened').hide();
        $('.handCheckDescr').show();
        $('.modal-footer').show();
        $('#handCheckingCorrect').hide();
        $('#handCheckDescrChecks').html('');
        currChecking.checkPoints = [];
        currChecking.checkStatus = [];
        for(var i = 0; i < currChecking.questionC['subq'].length; i++){
            $(` <div>
                    <div>
                        <img src="${window.srcPath}/img/iconStatus1.png">
                    </div>
                    <input id="handCheckDescrCheck` + i + `" data-checkid="` + i + `" class="handCheckDescrCheck check_box" type="checkbox">
                    <label for="handCheckDescrCheck` + i + `">` + currChecking.questionC['subq'][i]['answer'] + `</label>
                </div>`).appendTo('#handCheckDescrChecks');
                currChecking.checkPoints.push(0);
                currChecking.checkStatus.push(0);
        }
        startDescrCheckForAttendee();
    } 
    
});

$(document).on('change', '.handCheckDescrCheck', function(){
    var checkID = parseInt($(this).data('checkid'));
    if($(this).is(":checked")){
        $(this).parent().addClass('completedTask');
        currChecking.checkPoints[checkID] = parseInt(currChecking.questionC['subq'][checkID]['points']);
        currChecking.checkStatus[checkID] = 1;
    }
    else {
        $(this).parent().removeClass('completedTask');
        currChecking.checkPoints[checkID] = 0;
        currChecking.checkStatus[checkID] = 0;
    }
    updateDescrPoints();
});

$(document).on('click', '#handCheckDescrReady', function(){
    $.ajax({
        url: '',
        type: 'post',
        data: { "callResponseEditFunction": "changeStatusDescriptive", 
        "postID" : window.postID,
        "attendeeID" : attendeeID,
        "moduleID" : currChecking.moduleID,
        "indArr" : currChecking.indArr,
        "statusArr" : currChecking.checkStatus,},
        success: function(data) {
            window.responsesKrisi = JSON.parse(data['responses']);
            currChecking.seshResults[parseInt( $('#handCheckDescrPoints').html())]++; 
            removeCurrCheckingAtt();
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            toastr.error("Unable to upload answer");
        }
    });
});

function removeCurrCheckingAtt(){
    var code = currChecking.moduleID + '_' + encodeIds(currChecking.indArr);
    const index = allToCheckQuestions[code].indexOf(currChecking.attendeeID);
    if (index > -1) {
        allToCheckQuestions[code].splice(index, 1); // 2nd parameter means remove one item only
        updatePercentage(code);
        if(currChecking.type == 'Opened') startOpenCheckForAttendee();
        if(currChecking.type == 'Descriptive') startDescrCheckForAttendee();
    }
}

$(document).on('click', '#handCheckDescrNotFilled', function(){
    $.ajax({
        url: '',
        type: 'post',
        data: { "callResponseEditFunction": "changeStatus", 
        "postID" : window.postID,
        "attendeeID" : attendeeID,
        "moduleID" : currChecking.moduleID,
        "indArr" : currChecking.indArr,
        "newStatus" : 2,},
        success: function(data) {
            window.responsesKrisi = JSON.parse(data['responses']);
            currChecking.seshResults[0]++;
            removeCurrCheckingAtt();
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            toastr.error("Unable to upload answer");
        }
    });
});


function updateDescrPoints(){
    var tmp = 0;
    for(var i = 0 ; i< currChecking.checkPoints.length;i++){
        tmp += currChecking.checkPoints[i];
    }
    $('#handCheckDescrPoints').html(tmp);
}

function initBasketActions(){
    $(document).on('click', '.handCheckArrow', function(){
        if($(this).data('direction') == 'left') currChecking.attInArrId--;
        else currChecking.attInArrId++;
        if(currChecking.type == 'Opened') startOpenCheckForAttendee();
        if(currChecking.type == 'Descriptive') startDescrCheckForAttendee();
    })
    $('.draggable-div').on('dragstart', function(e) {
        e.originalEvent.dataTransfer.setData('text/plain', 'dragging');
    });

    $('.basketAnswerType').on('dragover', function(e) {
        e.preventDefault();
    });

    $('.basketAnswerType').on('drop', function(e) {
        e.preventDefault();
        const draggedData = e.originalEvent.dataTransfer.getData('text/plain');
        if (draggedData === 'dragging') {
            const basketId = $(this).attr('id');
            handleBasketDrop(basketId);
        }
    });
}

function handleBasketDrop(basketId) {
    if(currChecking.attendeeID && currChecking.indArr && currChecking.moduleID){
        $('#' + basketId).effect("bounce");
        var newStatus = 3;
        switch (basketId) {
            case 'basket0':
                newStatus = 0;
            break;
            case 'basket1':
                newStatus = 1;
            break;
            case 'basket2':
                newStatus = 2;
            break;
        }
        $.ajax({
            url: '',
            type: 'post',
            data: { "callResponseEditFunction": "changeStatus", 
            "postID" : window.postID,
            "attendeeID" : currChecking.attendeeID,
            "moduleID" : currChecking.moduleID,
            "indArr" : currChecking.indArr,
            "newStatus" : newStatus,},
            success: function(data) {
                window.responsesKrisi = JSON.parse(data['responses']);
                currChecking.seshResults[newStatus]++;
                console.log(`${window.usersKrisi[attendeeID]['name']}'s answer to ${currChecking.moduleID}.${encodeIds(currChecking.indArr)} is ` + Object.keys(STATUS).find(key => STATUS[key] === newStatus));
                removeCurrCheckingAtt();
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                toastr.error("Unable to upload answer");
            }
        });
    }
}

$(document).on('click', '#handCheckCloseBtn', endCheckSeshion);

function endCheckSeshion(){
    if(currChecking.type == 'Opened'){
        var all = currChecking.seshResults[0]+currChecking.seshResults[1]+currChecking.seshResults[2];
        toastr.info(all + ` answers checked
                    <br>  • ` + currChecking.seshResults[0] + ` were right
                    <br>  • ` + currChecking.seshResults[1] + ` were wrong
                    <br>  • ` + currChecking.seshResults[2] + ` were not filled`,
                    'Open checking finished');
    } else {
        var sum = 0, count = 0;
        for(let pts in currChecking.seshResults){
            sum += currChecking.seshResults[pts]*pts;
            count += currChecking.seshResults[pts];
        }
        if(count!=0){
            toastr.info(`Answers checked: ` + count + `
                    <br>Middle score: ` + (sum/count).toFixed(1) + ` `,
                    'Descriptive checking finished');
        }
        else{
            toastr.info(`No answers checked`,
                    'Descriptive checking finished');
        }

    }
    currChecking = {
        type: undefined,
        attInArrId: undefined,
        attendeeID: undefined,
        moduleID: undefined,
        indArr: undefined,
        questionF: undefined,
        seshResults: undefined,
    };
    $('#toBeCheckedOpenPopup').hide();
    $('#toBeCheckedPopup').modal('hide');

}
function findToCheckQuestions(resp, cont, code){
    var ans = [];
    switch(cont['type']){
        case 'Opened':
            if(resp['status'] == 3){
                ans = [code];
            }
            break;
        case 'Descriptive':
            if(resp['subq'][0]['status'] == 3){
                ans = [code];
            }
            break;
        case 'Module':
        case 'Composite':
            for(var qId in resp['subq']){
                ans = ans.concat(findToCheckQuestions(resp['subq'][qId],cont['subq'][qId],code+'_' +qId));
            }
            break;
    }
    return ans;
}
function addToCheckForAttendee(all, arr, attID){
    var code;
    for(var id in arr){
        code = arr[id];
        if(all[code]){
            all[code].push(attID);
        } else {
            all[code] = [attID];
        }
    }
}

$(document).on('keydown',function(e) {
    if(currChecking.type == 'Opened'){
        console.log(e.which);
        if(e.which == 87) { // btn W
            handleBasketDrop('basket0');
        }
        if(e.which == 67) { // btn C
            handleBasketDrop('basket1');
        }
        if(e.which == 69) { // btn E
            handleBasketDrop('basket2');
        }
    }
    if(currChecking.type == 'Opened' || currChecking.type == 'Descriptive'){
        if(e.which == 37) { // <-
            $('.handCheckArrow').first().click();
        }
        if(e.which == 39) { // ->
            $('.handCheckArrow').last().click();
        }
    }
});