jQuery(function($) { //jQuery passed in as first param, so you can use $ inside
    $(document).ready(function(){
        $.ajax({
            url: '',
            type: 'post',
            data: { "callUsersFunction": "listUserTests", 
            "userID" : window.attID},
            success: function(data) {
                //console.log(data);
                displayTests(JSON.parse(data['roles']));
            }
        });
    });
});

function displayTests(tests){
    text = ``;
    for(test of tests){
        var addclass = ''
        switch(test.role[0]){
            case 'c': addclass = 'testDivCreator'; break;
            case 'e': addclass = 'testDivEditor'; break;
            case 'a': addclass = 'testDivAttendee'; break;
        }
        text += `<div class="testDiv ${addclass}" onclick="window.location.href = '${test.link}'">
                    <div class="gradientOverlay"></div>
                    <p class="testTitle">${test.postName}</p>
                    <p class="testDate">${test.date}</p>
                    <p class="testRole">Role: ${test.role}</p>
                </div>`;
    }
    $.ajax({
        url: '',
        type: 'post',
        data: { "callUsersFunction": "canCreateTests", 
        "userID" : window.attID},
        success: function(data) {
            //console.log(data);
            if(data == 1){
                text += `<div class="testDiv" id="createTest">
                            <div class="gradientOverlay"></div>
                            <p>+</p>
                        </div>`;
            }
            $('#myTests').html(text);
        }
    });
}
function displayGroups(groups){
    text = '';
    for(group of groups){
        var addclass = ''
        switch(group.role[0]){
            case 'c': addclass = 'testDivCreator'; break;
            case 'e': addclass = 'testDivEditor'; break;
            case 'a': addclass = 'testDivAttendee'; break;
        }
        text += `<div class="testDiv ${addclass}" onclick="window.location.href = '${group.link}'">
                    <div class="gradientOverlay"></div>
                    <p class="testTitle">${group.postName}</p>
                    <p class="testDate">${group.date}</p>
                    <p class="testRole">Role: ${group.role}</p>
                </div>`;
    }
    $('#myTests').html(text);
}

$(document).on('click', '#createTest', ()=>{
    $.ajax({
        url: '',
        type: 'post',
        data: { "callUsersFunction": "createPost", 
        "userID" : window.attID,
        "title" : 'Krisi'},
        success: function(data) {
            //console.log(data);
            if(data['id'] == 0){
                toastr.error("Unable to create test");
            }
            else {
                displayTests(JSON.parse(data['roles']));
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            toastr.error("Unable to create test");
        }
    });

});