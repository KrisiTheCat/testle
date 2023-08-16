var $ = jQuery;
function initAttendeeResult(){
    var attendeeID = parseInt($('#attendeeIDp').html());
    var contentMaxPoints = 0;
    for(var moduleID = 0; moduleID < window.contentKrisi.length; moduleID++){
        var modulePoints = 0, maxModulePoints = 0;
        for(var questionID = 0; questionID < window.contentKrisi[moduleID].length; questionID++){
            var questionPoints = 0, questionText = "", questionStatus = '2';
            if(window.contentKrisi[moduleID][questionID]['type'] == 'Descriptive'){
                for(var checkID = 0; checkID < window.contentKrisi[moduleID][questionID]['checks'].length; checkID++){
                    var checkPoints = 0;
                    if(window.responsesKrisi[attendeeID][moduleID][questionID][checkID]['status'] == '0'){
                        checkPoints = parseInt(window.contentKrisi[moduleID][questionID]['checks'][checkID]['points']);
                        questionPoints += checkPoints;
                    }
                }
            } else if(window.contentKrisi[moduleID][questionID]['type'] == 'Composite'){
                for(var subID = 0; subID < window.contentKrisi[moduleID][questionID]['subq'].length; subID++){
                    var subPoints = 0;
                    if(window.contentKrisi[moduleID][questionID]['subq'][subID]['type'] == 'SubDescriptive'){
                        for(var checkID = 0; checkID < window.contentKrisi[moduleID][questionID]['subq'][subID]['checks'].length; checkID++){
                        if(window.responsesKrisi[attendeeID][moduleID][questionID][subID][checkID]['status'] == '0'){
                            checkPoints = parseInt(window.contentKrisi[moduleID][questionID]['subq'][subID]['checks'][checkID]['points']);
                            subPoints += checkPoints;
                        }
                    }
                } else {
                    subPoints = 0;
                    var squestionStatus = window.responsesKrisi[attendeeID][moduleID][questionID][subID]['status'];
                    if(squestionStatus == '0'){
                        subPoints = parseInt(window.contentKrisi[moduleID][questionID]['subq'][subID]['points']);
                    }
                }
                questionPoints += subPoints;
            }
        } else { 
            questionPoints = 0;
            questionStatus = window.responsesKrisi[attendeeID][moduleID][questionID]['status'];
            if(questionStatus == '0'){
                questionPoints = parseInt(window.contentKrisi[moduleID][questionID]['points']);
            }
        }
        modulePoints += questionPoints;
        maxModulePoints += parseInt(window.contentKrisi[moduleID][questionID]['points']);
    }
    contentMaxPoints += maxModulePoints;
    $('.pointsField' + moduleID + '_-1_-1_-1').eq(0).html(modulePoints + '/' + maxModulePoints);
}
$('.pointsField-1_-1_-1_-1').eq(0).html(
    window.responsesKrisi[attendeeID]['pointsAll'] + '/' + contentMaxPoints);
    
}
