var $ = jQuery;
var attendeeID;

function initAttendeeResult(){

    
    $.ajax({
        url: '',
        type: 'post',
        data: { "callUsersFunction": "getShowResultsStatus", 
        "postID" : window.postID},
        success: function(data) {
            if(data['showResults'] == true){
                $('#pleaseWait').hide();
                $('#actualResults').show();
                displayResult()
            }
            else {
                $('#pleaseWait').show();
                $('#actualResults').hide();
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            toastr.error("Unable to retrieve editors");
        }
    });
}

function displayResult(){
    text = $('#summaryDiv').html();
    for(var moduleID = 0; moduleID < window.contentKrisi.length; moduleID++){
        text +=     `<div class="moduleSummery">
                        <label><b>Module</b> #${moduleID+1}</label>
                        <div class="checkTd">
                            <div class="progress" style="flex:1">
                                <div class="progress-bar correctAnswers" role="progressbar" style="width: 0%" aria-valuenow="15" aria-valuemin="0" aria-valuemax="100"></div>
                                <div class="progress-bar wrongAnswers" role="progressbar" style="width: 0%" aria-valuenow="30" aria-valuemin="0" aria-valuemax="100"></div>
                                <div class="progress-bar notfilledAnswers" role="progressbar" style="width: 0%" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100"></div>
                                <div class="progress-bar toCheckAnswers" role="progressbar" style="width: 0%" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100"></div>
                            </div>
                        </div>
                        <div class="checkTd scoreTd">
                            <p class="pointsField${moduleID}_-1_-1_-1">65/100</p>
                        </div>
                    </div>`;

    }
    $('#summaryDiv').html(text);

    attendeeID = parseInt($('#attendeeIDp').html());
    content['stats'] = [];
    content['stats'][0] = 0;
    content['stats'][1] = 0;
    content['stats'][2] = 0;
    content['stats'][3] = 0;
    var contentMaxPoints = 0;
    var pointsAll = 0;
    for(var moduleID = 0; moduleID < window.contentKrisi.length; moduleID++){
        var modulePoints = 0, maxModulePoints = 0;
        content[moduleID] = [];
        content[moduleID]['stats'] = [];
        content[moduleID]['stats'][0] = 0;
        content[moduleID]['stats'][1] = 0;
        content[moduleID]['stats'][2] = 0;
        content[moduleID]['stats'][3] = 0;
        for(var questionID = 0; questionID < window.contentKrisi[moduleID]['subq'].length; questionID++){
            var questionInfo = handleQuestion(
                attendeeID,
                (questionID+1),
                window.responsesKrisi[attendeeID][moduleID]['subq'][questionID],
                window.contentKrisi[moduleID]['subq'][questionID],
                moduleID+'_'+questionID, false);
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
    
    $('.pointsField-1_-1_-1_-1').eq(0).html( pointsAll + ' | ' + contentMaxPoints);
}
