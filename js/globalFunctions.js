const STATUS_COUNT = 4;

function containsToBeChecked(response){
    if(!response) return false;
    if('status' in response){
        return response['status'] == 3;
    }
    if(!('subq' in response)){
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

function calcPoints(response, content){
    if(!response) return 0;
    if('status' in response){
        if(response['status'] == 1) return content['points'];
        return 0;
    }
    if(!('subq' in response)){
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

function countQuestions(content){
    if(!content) return 0;
    if('answer' in content || 'page' in content || ('type' in content && content.type == 'Descriptive')){
        return 1;
    }
    if(!('subq' in content)){
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
    if(!('subq' in form)){
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
    if(!('subq' in form)){
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
        ans += (indArr[1][0]+1);
        if(indArr[1].length>1){
            ans+= alphabet.charAt(indArr[1][1]%26);
        }
    }
    return ans;
}

const STATUS = {
    WRONG: 0,
    CORRECT: 1,
    NOTFILLED: 2,
    TOBECHECKED: 3
}