var $ = jQuery;
var allToCheckQuestions = {};

function initHandCheck(){
    allToCheckQuestions = {};
    for(var attendeeID in window.responsesKrisi){
        if(attendeeID == 0) continue;
        attendeeID = parseInt(attendeeID);
        for(var moduleID = 0; window.responsesKrisi[attendeeID][moduleID]; moduleID++){
            var arr = findToCheckQuestions(
                window.responsesKrisi[attendeeID][moduleID], 
                window.contentKrisi[moduleID], 
                moduleID,
                window.responsesKrisi[attendeeID].images,
                window.formKrisi[moduleID]);
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
    var count = 0;
    for(var arr of allToCheckQuestions[code]){
        if(arr[1] === ATTENDEE_STATUS.FINISHED) count++;
    }
    $('#handCheckQuestionDiv' + code).find('.handCheckQuestionDivOverlay').css('width', parseInt((count)*100/attCount) + '%');
    $('#handCheckQuestionDiv' + code).find('.handCheckQuestionInfoCheckedDiv').find('h4').html((count) + '|' + attCount)
}

function startDescrCheckForAttendee(){
    var arr = allToCheckQuestions[currChecking.moduleID + '_' + encodeIds(currChecking.indArr)];
    if(arr.length == 0) {endCheckSeshion(); return;}
    if(currChecking.attInArrId>=arr.length) currChecking.attInArrId = 0;
    if(currChecking.attInArrId == -1) currChecking.attInArrId = arr.length-1;
    attendeeID = arr[currChecking.attInArrId][0];
    currChecking.status = arr[currChecking.attInArrId][1];
    currChecking.attendeeID = attendeeID;
    var pageId = currChecking.questionF['page'];
    
    var resp = getQuestion(window.responsesKrisi[currChecking.attendeeID], currChecking.code);
    console.log(resp.subq);
    for(var i = 0; i < currChecking.checkStatus.length; i++){
        if(resp['subq'][i].status == STATUS.CORRECT){
            $('#handCheckDescrCheck'+i).prop("checked", true);
            currChecking.checkPoints[i] = currChecking.questionC.subq[i].points;
            currChecking.checkStatus[i] = 1;
            $('#handCheckDescrCheck' + i).prop('checked', true);
            $('#handCheckDescrCheck' + i).parent().addClass('completedTask');
        }
        else {
            currChecking.checkPoints[i] = 0;
            currChecking.checkStatus[i] = 0;
            $('#handCheckDescrCheck' + i).prop('checked', false);
            $('#handCheckDescrCheck' + i).parent().removeClass('completedTask');
        }
    }
    if(currChecking.status == ATTENDEE_STATUS.NO_PHOTO){
        $('.handCheckDescrNoPhoto').show();
        $('#handCheckDescrAttCanvas').hide();
        if(typeof pageId == 'undefined'){
            $('.handCheckDescrNoPhoto').html(
                `Missing location of question. Fix <b><a href='../form'>here</a></b>`);
        }
        else {
            $('.handCheckDescrNoPhoto').html(
                `No image of page ${pageId+1} upload. Fix <b><a href='../check/?attendee=${attendeeID}'>here</a></b>`);
        }
    }
    else {
        $('.handCheckDescrNoPhoto').hide();
        $('#handCheckDescrAttCanvas').show();
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
}

function startOpenCheckForAttendee(){
    var arr = allToCheckQuestions[currChecking.moduleID + '_' + encodeIds(currChecking.indArr)];
    if(arr.length == 0) {endCheckSeshion(); return;}
    if(currChecking.attInArrId>=arr.length) currChecking.attInArrId = 0;
    if(currChecking.attInArrId == -1) currChecking.attInArrId = arr.length-1;
    attendeeID = arr[currChecking.attInArrId][0];
    currChecking.status = arr[currChecking.attInArrId][1];
    currChecking.attendeeID = attendeeID;
    var pageId = currChecking.questionF['page'];
    for(var i in STATUS_HANDCHECK_DATA)
        $('.handCheckOpenTop').removeClass(STATUS_HANDCHECK_DATA[i].class);
    if(currChecking.status == ATTENDEE_STATUS.NO_PHOTO){
        $('.handCheckOpenTop').find('img').first().hide();
        $('.handCheckOpenTop').find('small').first().hide();
        $('#handCheckOpenAttCanvas').hide();
        $('.handCheckOpenTop').find('p').first().show();
        if(typeof pageId == 'undefined'){
            $('.handCheckOpenTop').html(
                `<p>Missing location of question. Fix <b><a href='../form'>here</a></b></p>`);
        }
        else {
            $('.handCheckOpenTop').html(
                `No image of page ${pageId+1} upload. Fix <b><a href='../check/?attendee=${attendeeID}'>here</a></b>`);
        }
    }
    else {
        $('#handCheckOpenAttCanvas').show();
        $('.handCheckOpenTop').find('img').first().show();
        $('.handCheckOpenTop').find('small').first().show();
        $('.handCheckOpenTop').find('p').first().hide();
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
        if(currChecking.status == ATTENDEE_STATUS.FINISHED){
            var st = getQuestion(window.responsesKrisi[attendeeID][currChecking.moduleID],encodeIds(currChecking.indArr));
            $('.handCheckOpenTop').addClass(STATUS_HANDCHECK_DATA[st.status].class);
            $('.handCheckOpenTop').find('h6').html(STATUS_HANDCHECK_DATA[st.status].label);
        }
    }
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
    currChecking.status = -1;
    currChecking.code = code;
    $('#toBeCheckedPopup').modal('show');
    $('#handCheckingQuesID').html('#' + codeToString(code));
    
    var text = '';
    for(arr of allToCheckQuestions[code]){
        text += `<option value="${arr[0]}">
                    ${ATTENDEE_STATUS_DATA[arr[1]].icon}&nbsp;${window.usersKrisi[arr[0]].name}
                </option>`;
    }
    $('#responseOfId').html(text);
    $(document).on('change', '#responseOfId', function(){
        var attid = $('#responseOfId').val();
        currChecking.attInArrId = allToCheckQuestions[code].findIndex((el)=>el[0] == attid);
        
        if(currChecking.type == 'Opened') startOpenCheckForAttendee();
        if(currChecking.type == 'Descriptive') startDescrCheckForAttendee();
    })

    if(questionC['type'] == 'Opened'){
        currChecking.type = 'Opened';
        $('.handCheckOpened').show();
        $('.handCheckDescr').hide();
        $('.modal-footer').hide();
        $('#handCheckingCorrect').show();
        $('#handCheckingCorrect').html('Correct answer: <b>' + questionC['answer'] + '</b>');
      //  startOpenCheckForAttendee();
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
        //startDescrCheckForAttendee();
    } 
    
    $("#responseOfId").val(allToCheckQuestions[code][currChecking.attInArrId][0]).change();
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
    if(currChecking.type==ATTENDEE_STATUS.NO_PHOTO){
        toastr.error("Please upload image first!");
    }
    else{
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
                continueNextAtt();
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                toastr.error("Unable to upload answer");
            }
        });
    }
});

function continueNextAtt(){
    currChecking.attInArrId++;
    if(currChecking.attInArrId == allToCheckQuestions[currChecking.code].length) currChecking.attInArrId = 0;
    $("#responseOfId").val(allToCheckQuestions[currChecking.code][currChecking.attInArrId][0]).change();
}
function continuePrevAtt(){
    currChecking.attInArrId--;
    if(currChecking.attInArrId == -1) currChecking.attInArrId = allToCheckQuestions[currChecking.code].length-1;
    $("#responseOfId").val(allToCheckQuestions[currChecking.code][currChecking.attInArrId][0]).change();
}

$(document).on('click', '#handCheckDescrNotFilled', function(){
    if(currChecking.type==ATTENDEE_STATUS.NO_PHOTO){
        toastr.error("Please upload image first!");
    }
    else{
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
    }
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
        if($(this).data('direction') == 'left') continuePrevAtt();
        else continueNextAtt();
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
    if(currChecking.status==ATTENDEE_STATUS.NO_PHOTO){
        toastr.error("Please upload image first!");
    }
    else if(currChecking.attendeeID && currChecking.indArr && currChecking.moduleID){
        doBounce($('#' + basketId), 4, '20px', 100);   
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
                continueNextAtt();
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                toastr.error("Unable to upload answer");
            }
        });
    }
}

$(document).on('click', '#handCheckCloseBtn', endCheckSeshion);

function endCheckSeshion(){
    if(JSON.stringify(currChecking.seshResults) != JSON.stringify([0,0,0])){
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
function findToCheckQuestions(resp, cont, code, photos, form){
    var ans = [];
    switch(cont['type']){
        case 'Opened':
            if(typeof photos =='undefined' || !(form.page in photos)){
                ans = [[code,ATTENDEE_STATUS.NO_PHOTO]];
            }
            else if(resp['status'] == 3){
                ans = [[code,ATTENDEE_STATUS.CHECKING]];
            }
            else {
                ans = [[code,ATTENDEE_STATUS.FINISHED]];
            }
            break;
        case 'Descriptive':
            if(typeof photos =='undefined' || !form.page in photos || typeof photos[form.page] =='undefined'){
                console.log(ATTENDEE_STATUS.NO_PHOTO);
                ans = [[code,ATTENDEE_STATUS.NO_PHOTO]];
            }
            else if(resp['subq'][0]['status'] == 3){
                ans = [[code,ATTENDEE_STATUS.CHECKING]];
            }
            else {
                ans = [[code,ATTENDEE_STATUS.FINISHED]];
            }
            break;
        case 'Module':
        case 'Composite':
            for(var qId in resp['subq']){
                ans = ans.concat(findToCheckQuestions(resp['subq'][qId],cont['subq'][qId],code+'_' +qId, photos, form['subq'][qId]));
            }
            break;
    }
    return ans;
}
function addToCheckForAttendee(all, arr, attID){
    var code;
    for(var id in arr){
        code = arr[id][0];
        if(all[code]){
            all[code].push([attID,arr[id][1]]);
        } else {
            all[code] = [[attID,arr[id][1]]];
        }
    }
}

$(document).on('keydown',function(e) {
    if(currChecking.type == 'Opened'){
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

function doBounce(element, times, distance, speed) {
    for(var i = 0; i < times; i++) {
        element.animate({marginTop: '-='+distance}, speed)
            .animate({marginTop: '+='+distance}, speed);
    }        
}