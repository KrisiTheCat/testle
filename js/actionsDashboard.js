var $ = jQuery;
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
toastr.options = {"icon": false,"closeButton": true, "newestOnTop": true, "progressBar": true, "positionClass": "toast-bottom-right"};

function containsOnlyAllowedCharacters(inputString) {
    const pattern = /^[a-zA-Zа-яА-Я0-9\s\-_]*$/;
    return pattern.test(inputString);
}
function displayTests(tests){
    text = ``;
    for(test of tests){
        var addclass = ''
        switch(test.role[0]){
            case 'c': addclass = 'testDivCreator'; break;
            case 'e': addclass = 'testDivEditor'; break;
            case 'a': addclass = 'testDivAttendee'; break;
        }
        text += `<div class="testDiv ${addclass}" data-link="${test.link}" data-id="${test.postID}">
                    <textarea  class="testTitle" maxlength="20" data-original="${test.postName}" readonly>${test.postName}</textarea >
                    <p class="testRole">Role: ${test.role}</p>`
        if(test.role[0] == 'c' || test.role[0] == 'e'){
        text +=     `<img class="editTestName" src="${window.tempPath + '/edit.png'}"/>`;
        text +=     `<p class="deleteTest deleteButton">X</p>`;
        }
        text +=     `<div>
                        <button class="createTestCr">Save</button>
                        <button class="createTestCa">Cancel</button>
                    </div>
                    <div class="gradientOverlay"></div>
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
                text += `<div class="testDiv createTest">
                            <p>+</p>
                            <textarea type="text" placeholder="Test title" maxlength="20"></textarea>
                            <div>
                                <button class="createTestCr">Create</button>
                                <button class="createTestCa">Cancel</button>
                            </div>
                            <div class="gradientOverlay"></div>
                        </div>`;
            }
            $('#myTests').html(text);
        }
    });
}

$(document).on('click', '.deleteTest', function (e){
    e.stopPropagation();
    var parent = $(this).parent();
    var postID = parseInt(parent.data('id'));
    console.log($('#youSureDeleteTest'));
    $('#youSureDeleteTest').modal('show');
    console.log(postID);
    $(document).on('click', '#deleteTestConfirm', function(){
      $.ajax({
        url: '',
        type: 'post',
        data: {"callTestEditFunction": "deleteTest", 
                "postID" : postID},
        success: function(data) {
            //console.log(data);
            $('#youSureDeleteTest').modal('hide');
            parent.hide();
        }
      });
    });
});
$(document).on('click', '.editTestName', function (e){
    e.stopPropagation();
    this.parentElement.getElementsByTagName('textarea')[0].removeAttribute("readonly");
    $(this).parent().addClass('activeCreate');
});
$(document).on('click', '.testTitle', (e)=>{
    e.preventDefault();
    e.stopPropagation();
});
$(document).on('click', '.testDiv', function (){
    if($(this).hasClass('createTest') || $(this).hasClass('activeCreate')) return;
    window.location.href = $(this).data('link');
});
$(document).on('click', '.createTest', function (e){
    e.stopPropagation();
    $('.createTest').addClass('activeCreate');
});

$(document).on('click','.createTestCa',function(e){
    e.stopPropagation();
    $(this).parent().parent().removeClass('activeCreate');
    if(!$(this).parent().parent().hasClass('createTest')){
        var tarea = this.parentElement.parentElement.getElementsByTagName('textarea')[0];
        tarea.setAttribute("readonly", "true");
        $(tarea).val($(tarea).data('original'));
    }
});

$(document).on('click','.createTestCr',function(e){
    e.stopPropagation();
    var title = $(this).parent().parent().find('textarea').first().val();
    if(title.length < 5){
        toastr.error("Must be at least 5 symbols.","Title too short");
    } 
    else if(title.length > 20){
        toastr.error("Must be at most 20 symbols.","Title too long");
    }
    else if(!containsOnlyAllowedCharacters(title)){
        toastr.error("Allowed: letters, space, dash","Forbidden symbols used");
    }
    else {
        if($(this).parent().parent().hasClass('createTest')){
            $.ajax({
                url: '',
                type: 'post',
                data: { "callTestEditFunction": "createPost", 
                "userID" : window.attID,
                "title" : title},
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
        }
        else {
            var postID = parseInt($(this).parent().parent().data('id'));
            var parent = $(this).parent().parent();
            var tarea = this.parentElement.parentElement.getElementsByTagName('textarea')[0];
            $.ajax({
                url: '',
                type: 'post',
                data: { "callTestEditFunction": "changeTitle", 
                "postID" : postID,
                "title" : title},
                success: function(data) {
                    tarea.setAttribute("readonly", "true");
                    parent.removeClass('activeCreate');
                    $(tarea).attr('data-original',title);
                    $(tarea).val(data['title']);
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    toastr.error("Unable to change name");
                }
            });
        }
    }
    });