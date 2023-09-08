var $ = jQuery;
var attendeesByGroups=[[],[],[]];

function initAttendees(){

    refreshAttendees();
    
    $('#newAttendeeBtn').on('click',function(e){
        $('#popupFormUsers').modal('show');
        initAllAttPopup();
    });
    
}

function initAllAttPopup(){
    var attendeeDiv = $('#attendeeChoiceDiv');
    var selectGroupFilter = $('#selectGroupFilter');
    var text = "", groups = [];
    $.each(window.usersKrisi, function(key, user){
        if(user['roles'].includes('student')){
            for(var i = 0; i < user['groups'].length; i++){
                user['groups'][i] = user['groups'][i].trim();
                if(!groups.includes(user['groups'][i])){
                    groups.push(user['groups'][i]);
                }
            }
            text += `<div class="containerUserCB containerUserCB` + user['id'] + `">
                        <input type="checkbox" id="checkBoxUsers` + user['id'] + `" class="checkBoxUsers check_box" name="addedAttendees[]" value="` + user['id'] + `"`;
            if(user['id'] in window.responsesKrisi) text += " checked";
            text += `><label for="checkBoxUsers` + user['id'] + `">` + user['name'] + `</label>
            </div>`;
        }
    });
    attendeeDiv.html(text);
    var filterGroup = -1, filterText = "";
    filterAttendees();
    text = "";
    for(var i = 0; i < groups.length; i++){
        text += "<option value=\"" + i + "\">" + groups[i] + "</option>";
    }
    selectGroupFilter.html(text);
    
    $('#selectGroupFilter').on('change',function(e){
        filterGroup = $(this).val();
        filterAttendees();
    });
    $('#searchUserOption').on('input', function(e){
        filterText = $(this).val().toLowerCase();
        filterAttendees();
    });
    
    var lastClickedUser;
    $('.checkBoxUsers').on('click', function(){
        lastClickedUser = $(this);
        if(!lastClickedUser.is(":checked")){
            var userId = lastClickedUser.val();
            if(window.responsesKrisi[userId]){
                $('#userCheckedForm').show();
                $('#yesUserCheckedButton').on('click', function(){
                    $('#userCheckedForm').hide();
                });
                $('#cancelUserCheckedButton').on('click', function(){
                    $('#userCheckedForm').hide();
                    lastClickedUser.prop( "checked", true );
                });
            }
        }
    });
    
    function filterAttendees(){
        $.each(window.usersKrisi, function(key, user){
            if((filterGroup == -1 || user['groups'].includes(groups[filterGroup])) &&
            (filterText == "" || user['name'].toLowerCase().includes(filterText))){
                $('.containerUserCB' + user['id']).eq(0).show();
            } else {
                $('.containerUserCB' + user['id']).eq(0).hide();
            }
        });
    }
    $('#popupFormUsers').show();
    
}

function refreshAttendees(){
    sortAttInGroups();
    pushAllAttendeesInTables();
}

function sortAttInGroups(){
    
    attendeesByGroups = [[],[],[]];
    for(attID in window.responsesKrisi){
        if(attID!=0){
            attendeesByGroups[whichGroup(window.responsesKrisi[attID])].push({
                user:window.usersKrisi[attID],
                pts:calcPoints(window.responsesKrisi[attID], window.contentKrisi)});
        }
    }
}

function whichGroup(response){
    if(!response['images'] || window.pageInfo.length != response['images'].length){
        return 0;
    }
    if(containsToBeChecked(response)){
        return 1;
    }
    return 2;
}

function pushAllAttendeesInTables(){
    pushAttendeesInTable(attendeesByGroups[0], $('#noPhotoGroup'));
    pushAttendeesInTable(attendeesByGroups[1], $('#notCheckedGroup'));
    pushAttendeesInTable(attendeesByGroups[2], $('#allFineGroup'));
}
function pushAttendeesInTable(attendees, div){
    var table = div.find('.testAttendeedDiv');
    var text = '<tr>' + table.find('tr').first().html() + '</tr>';
    var count = 0;
    for(att of attendees){
        text += '<tr><td>' + att.user.name + '</td>';
        if(att.pts !== undefined) text += '<td>' + att.pts + '</td>';
        else text += '<td>unchecked</td>';
        text += '<td class="attendeeCheckBtn"><a href="../check/?attendee=' + att.user.id + '" class="checkResponse" >Check</a></td></tr>';
        count++;
    }
    if(count == 0) {
        table.addClass('invisible');
        div.find('.noSuchText').removeClass('invisible');
    } else {
        table.removeClass('invisible');
        div.find('.noSuchText').addClass('invisible');
        console.log(div.find('.noSuchText'));
    }
    table.html(text);
}

$(document).on('click','#sortNameBtn', function(){
    for(var g = 0; g < 3; g++){
        attendeesByGroups[g].sort((a,b)=>{a.user.name.localeCompare(b.user.name)});
    }
    pushAllAttendeesInTables();
});
$(document).on('click','#sortPtsBtn', function(){
    for(var g = 0; g < 3; g++){
        attendeesByGroups[g].sort((a,b)=>{
            return b.pts - a.pts;
        });
    }
    pushAllAttendeesInTables();
});

$(document).on('click','#exportAttBtn', function(){
    var data = [["Name"]];
    data[0].push("All");
    for(var g = 0; g < 3; g++){
        for(i = 0; i < attendeesByGroups[g].length; i++){
            var arr = [attendeesByGroups[g][i].user.name];
            for(var m = 0; m < window.contentKrisi.length; m++){
                arr.push(calcPoints(window.responsesKrisi[attendeesByGroups[g][i].user.id][m], window.contentKrisi[m]));
            }
            arr.push(attendeesByGroups[g][i].pts);
            data.push(arr);
        }
    }

    var wb = XLSX.utils.book_new();
    wb.SheetNames.push("demo");
    wb.Sheets["demo"] = XLSX.utils.aoa_to_sheet(data);
    XLSX.writeFile(wb, "demo.xlsx");
});

