const STATUS_COUNT = 4;

function containsToBeChecked(response){
    if(!response) return false;
    if('status' in response && response.status != null){
        return response['status'] == 3;
    }
    if(!('subq' in response && response.subq != null)){
        for(var module in response){
            if(module == Number(module)){
                if(containsToBeChecked(response[module])){
                    return true;
                } 
            }
        }
        return false;
    }
    return containsToBeChecked(response['subq']);
}
function amountPotentialToBeChecked(response){
    if(!response) return 0;
    if('type' in response){
        switch(response.type){
            case 'Opened': case 'Descriptive':
                return 1;
            case 'Closed':
                return 0;
            default:
                return amountPotentialToBeChecked(response.subq);
        }
    }
    var ans = 0;
    for(var module in response){
        if(module == Number(module)){
            ans += amountPotentialToBeChecked(response[module]);
        }
    }
    return ans;
}
function amountToBeChecked(response, content){
    if(!response) return 0;
    if('type' in content){
        switch(content.type){
            case 'Opened': 
                if(response['status'] == 3) return 1;
                return 0;
            case 'Descriptive':
                if(response.subq[0]['status'] == 3) return 1;
                return 0;
            case 'Closed':
                return 0;
            default:
                return amountToBeChecked(response.subq, content.subq);
        }
    }
    var ans = 0;
    for(var module in response){
        if(module == Number(module)){
            ans += amountToBeChecked(response[module], content[module]);
        }
    }
    return ans;
}

function calcPoints(response, content){
    if(!response) return 0;
    if('status' in response && response.status != null){
        if(response['status'] == 1) return content['points'];
        return 0;
    }
    if(!('subq' in response && response.subq != null)){
        var ans = 0;
        for(var module in response){
            if(module == Number(module)){
                ans += calcPoints(response[module], content[module]);
            }
        }
        return ans;
    }
    return calcPoints(response['subq'], content['subq']);
}

function maxPoints(content){
    if(!content) return 0;
    if('points' in content){
        return content['points'];
    }
    if(!('subq' in content && form.subq != null)){
        var ans = 0;
        for(var module in content){
            ans += maxPoints(content[module]);
        }
        return ans;
    }
    return calcPoints(content['subq']);
}

function countQuestions(content){
    if(!content) return 0;
    if('answer' in content || 'page' in content || ('type' in content && content.type == 'Descriptive')){
        return 1;
    }
    if(!('subq' in content && form.subq != null)){
        var ans = 0;
        for(var module in content){
            if(module == Number(module)){
                ans += countQuestions(content[module]);
            }
        }
        return ans;
    }
    return countQuestions(content['subq']);
}

function getQuestion(form, code){
    if(!form) return -1;
    if(code.length == 0) return form;
    var ind = decodeIds(code);
    if(!('subq' in form && form.subq != null)){
        if(!form[ind[0]]) return -1;
        return getQuestion(form[ind[0]], encodeIds(ind[1]));
    }
    if(!form['subq'][ind[0]]) return -1;
    return getQuestion(form['subq'][ind[0]], encodeIds(ind[1]));
}
function getQuestionPage(form, code){
    if(!form) return -1;
    if(code.length == 0) return form['page'];
    var ind = decodeIds(code);
    if(!('subq' in form && form.subq != null)){
        if(!form[ind[0]]) return -1;
        return getQuestionPage(form[ind[0]], encodeIds(ind[1]));
    }
    if(!form['subq'][ind[0]]) return -1;
    return getQuestionPage(form['subq'][ind[0]], encodeIds(ind[1]));
}

function decodeIds(code){
    code = code.split('_');
    var arr = [];
    for(i = 1; i < code.length; i++){
        if(code[i]!=-1) arr.push(parseInt(code[i]));
    }
    return [code[0],arr];
}
function encodeIds(indArr){
    var code = '';
    for(i = 0; i < indArr.length; i++){
        if(i!=0) code +='_'
        code += indArr[i];
    }
    return code;
}
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVXYZ";
function codeToString(code){
    var indArr = decodeIds(code);
    var ans = '';
    if(indArr[1].length>0){
        ans = 0;
        for(var moduleID = 0; moduleID < parseInt(indArr[0]); moduleID++){
            ans += window.contentKrisi[moduleID].subq.length;
        }
        ans += (indArr[1][0]+1);
        if(indArr[1].length>1){
            ans+= alphabet.charAt(indArr[1][1]%26);
        }
    }
    return ans;
}

function codeToLongText(code){
    var indArr = decodeIds(code);
    var ans = '';
    if(indArr[1].length>0){
        ans = 0;
        for(var moduleID = 0; moduleID < parseInt(indArr[0]); moduleID++){
            ans += window.contentKrisi[moduleID].subq.length;
        }
        ans += (indArr[1][0]+1);
        if(indArr[1].length>1){
            ans+= alphabet.charAt(indArr[1][1]%26);
        }
        return 'Q' + ans + ' in module ' + (parseInt(indArr[0])+1);
    }
    else {
        return 'Module ' + (indArr[0]+1);
    }
}

function saveImageToMedia(canvas, edges, pageId, attendeeID){
    var imgURL = {imgURL:canvas.toDataURL("image/png"),
                    edges: edges};
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
function cutPDFPage(canvas, pageId, edges, attendeeID, callFunc){
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
        saveImageToMedia(canvas, edges, pageId-1, attendeeID);
        if(callFunc){
            img.src = canvas.toDataURL("image/png");
            img.onload = function() {
            callFunc(img);
            };
        }
    };
}


function extractFromPage(attendeeID, image, pageId, refresh){
    console.log(attendeeID);
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
                if(refresh){
                    toastr.success('</br>' + ans[1] + ' right answers</br>' + ans[0] + ' wrong answers</br>' + ans[2] + ' not filled questions</br>' + ans[3] + ' questions to check', 
                                    queries.length + ' answers extracted');
                    refreshResponseTable();
                window.responsesKrisi = JSON.parse(data['responses']);
                }  
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                toastr.error("Unable to upload result");
            }
        });
    }
}


const DEFAULT_CONDITION = 'Condition';
const STATUS = {
    WRONG: 0,
    CORRECT: 1,
    NOTFILLED: 2,
    TOBECHECKED: 3
}
const STATUS_HANDCHECK_DATA = {
    0: {
        class: 'handCheckOpenTopWrong',
        label: 'WRONG',
    },
    1: {
        class: 'handCheckOpenTopCorrect',
        label: 'CORRECT',
    },
    2: {
        class: 'handCheckOpenTopNotFilled',
        label: 'EMPTY',
    }
}
const ATTENDEE_STATUS = {
    NO_PHOTO: 0,
    CHECKING: 1,
    FINISHED: 2
}
const ATTENDEE_STATUS_DATA = {
    0: {
        class: 'attendeeStatus0',
        label: 'Capturing',
        icon: '&#9866;'
    },
    1: {
        class: 'attendeeStatus1',
        label: 'Prossesing',
        icon: ''
    },
    2: {
        class: 'attendeeStatus2',
        label: 'Finished',
        icon: '&#10003;'
    }
}