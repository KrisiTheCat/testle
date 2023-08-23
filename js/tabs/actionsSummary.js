var $ = jQuery;
var sumInfo = {};

function initNotifCircles(){
    var tasks = 0;
    for(module of window.contentKrisi){
        tasks+=module.subq.length;
    }
    var pages = window.pageInfo.length;

    var students = Object.keys(window.responsesKrisi).length-1;
    sortAttInGroups();
    setDataInNotif($('#attendeesLink').parent().find('.notifCircle'), Object.keys(attendeesByGroups[0]).length);
    setDataInNotif($('#handcheckLink').parent().find('.notifCircle'), students - Object.keys(attendeesByGroups[2]).length);

    sumInfo = {
        students: students,
        tasks: tasks,
        pages: pages,
        questions: 0,
        sectoredQuestions: 0
    }
    initFormCircle();
}

function initFormCircle(){

    var questions = countQuestions(window.contentKrisi);
    var sectoredQuestions = countQuestions(window.formKrisi);
    setDataInNotif($('#formLink').parent().find('.notifCircle'), questions - sectoredQuestions);
    sumInfo.questions = questions;
    sumInfo.sectoredQuestions = sectoredQuestions;
    
}

function setDataInNotif(notif, data){
    if(data > 100) data = '99+';
    else if(data != 0){
        notif.html(data);
        notif.show();
    }
    else {
        notif.hide();
    }
}

function initSummary(){
    
    if(sumInfo.tasks > 0){
        $('#describeTasks').addClass('completedTask');
        $('#describeTasks').find('.additionalData').html(`(${sumInfo.tasks} total)`);
    }

    if(sumInfo.pages > 0){
        $('#uploadTask').addClass('completedTask');
        $('#uploadTask').find('.additionalData').html(`(${sumInfo.pages} pages)`);
    }

    $('#questionSectorsTask').find('.additionalData').html(`(${sumInfo.sectoredQuestions} | ${sumInfo.questions})`);
    if(sumInfo.sectoredQuestions == sumInfo.questions && sumInfo.questions != 0){
        $('#questionSectorsTask').addClass('completedTask');
    }

    if(sumInfo.students > 0){
        $('#listStudentsTask').addClass('completedTask');
        $('#listStudentsTask').find('.additionalData').html(`(${sumInfo.students} listed)`);
    }

    if(Object.keys(attendeesByGroups[0]).length == 0){
        $('#noPhotoTask').addClass('completedTask');
    }
    $('#noPhotoTask').find('.additionalData').html(`(${sumInfo.students - Object.keys(attendeesByGroups[0]).length} | ${sumInfo.students})`);

    if(Object.keys(attendeesByGroups[2]).length == sumInfo.students){
        $('#handCheckTask').addClass('completedTask');
    }
    $('#handCheckTask').find('.additionalData').html(`(${Object.keys(attendeesByGroups[2]).length} | ${sumInfo.students})`);

    $.ajax({
        url: '',
        type: 'post',
        data: { "callUsersFunction": "getEditors", 
        "postID" : window.postID},
        success: function(data) {
            var roles = JSON.parse(data['roles']);
            displayEditors(roles);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            toastr.error("Unable to retrieve editors");
        }
    });
    
}

function displayEditors(roles){
    var rolesId = [];
    var text = '';
    for(editor of roles){
        switch(editor.role){
        case 'editor':
            text += `<li class="editorLi" data-id="${editor.id}">${window.usersKrisi[editor.id].name} (editor)</li>`;
            break;
        case 'creator':
            text = `<li class="creatorLi" data-id="${editor.id}">${window.usersKrisi[editor.id].name} (creator)</li>` + text;
            break;
        case 'creator':
            text += `<li data-id="${editor.id}">${window.usersKrisi[editor.id].name} (${editor.role})</li>`;
            break;
        }
        rolesId.push(editor.id);
    }
    $('#editorsList').html(text);
    $('#editorsList').find(`[data-id='${window.userID}']`).addClass('meLi');
    var isCreator = $('.meLi').hasClass('creatorLi');
    if(isCreator){
        $('#editorsList').html($('#editorsList').html() + '<li><input type="text" id="newEditorInput" placeholder="Add editor"/></li>');
        var lis = $('#editorsList').find('li');
        for(li of lis){
            if(!$(li).hasClass('meLi') && !$(li).hasClass('creatorLi')){
                $(li).addClass('removableLi');
            }
        }
        const names = [];
        Object.values(window.usersKrisi).forEach((user) => {
            if(!rolesId.includes(user.id) && !user.roles.includes('student')){
                names.push(user.name);
            }
        });
        $("#newEditorInput").autocomplete({ source: names });
        $(document).on('blur','#newEditorInput',function(){
            let editor = $(this).val();
            let id = -1, role;
            Object.values(window.usersKrisi).forEach((user) => {
                if(user.name == editor){
                    id = user.id;
                    role = user.roles;
                    return;
                }
            });
            if(id!=-1){
                if(role.includes('student')){
                    toastr.error("Unable to make student to editor");
                    $(this).val('');
                }
                else {
                    $.ajax({
                        url: '',
                        type: 'post',
                        data: { "callUsersFunction": "addEditor", 
                        "postID" : window.postID,
                        "editor" : id},
                        success: function(data) {
                            var roles = JSON.parse(data['roles']);
                            console.log(roles);
                            displayEditors(roles);
                        },
                        error: function(XMLHttpRequest, textStatus, errorThrown) {
                            toastr.error("Unable to add editor");
                        }
                    });
                }
            }
        });
        $(document).on('click', '.removableLi', function(){
            var id = parseInt($(this).data('id'));
            if($(this).hasClass('creatorLi')){
                toastr.error("Unable to remove creator");
            }
            else if(id == window.userID || $(this).hasClass('meLi')){
                toastr.error("Unable to remove self");
            }
            else {
                $.ajax({
                    url: '',
                    type: 'post',
                    data: { "callUsersFunction": "removeEditor", 
                    "postID" : window.postID,
                    "editor" : id},
                    success: function(data) {
                        var roles = JSON.parse(data['roles']);
                        displayEditors(roles);
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        toastr.error("Unable to remove editor");
                    }
                });
            }
        });
    }
}


$('.taskLink').on('click', function(){
    console.log(this.getAttribute('href'));
    history.pushState({}, "", this.getAttribute('href'));
    location.reload();
});