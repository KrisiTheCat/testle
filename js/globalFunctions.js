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