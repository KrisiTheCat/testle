var $ = jQuery;
var sumInfo = {};
var editors;

function initNotifCircles(){
    var tasks = 0;
    for(module of window.contentKrisi){
        tasks+=module.subq.length;
    }
    var pages = window.pageInfo.length;

    var students = Object.keys(window.responsesKrisi).length-1;
    
    var [noPhoto, handCheckAll, handCheckToDo] = findNoPhotos();
    handCheckAll*=students;

    setDataInNotif($('#attendeesLink').parent().find('.notifCircle'), noPhoto);
    setDataInNotif($('#handcheckLink').parent().find('.notifCircle'), handCheckToDo);

    sumInfo = {
        students: students,
        tasks: tasks,
        pages: pages,
        questions: 0,
        sectoredQuestions: 0,
        noPhoto: noPhoto,
        handCheckAll: handCheckAll, 
        handCheckToDo: handCheckToDo
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
        $('#describeTasks').find('.additionalData').html(`${sumInfo.tasks} total`);
    }

    if(sumInfo.pages > 0){
        $('#uploadTask').find('.additionalData').html(`${sumInfo.pages} pages`);
    }

    $('#questionSectorsTask').find('.additionalData').html(`${sumInfo.sectoredQuestions} | ${sumInfo.questions}`);
    if(sumInfo.sectoredQuestions < sumInfo.questions && sumInfo.questions != 0){
        $('#questionSectorsTask').find('.progress-bar').css('width', Math.round((sumInfo.sectoredQuestions/sumInfo.questions)*100) + '%');
    }else{$('#questionSectorsTask').find('.progress').hide();}

    if(sumInfo.students > 0){
        $('#listStudentsTask').find('.additionalData').html(`${sumInfo.students} listed`);
    }

    $('#noPhotoTask').find('.additionalData').html(`${sumInfo.students -sumInfo.noPhoto} | ${sumInfo.students}`);
    if(sumInfo.noPhoto != 0 || sumInfo.students != 0){
        $('#noPhotoTask').find('.progress-bar').css('width', Math.round(((sumInfo.students - sumInfo.noPhoto)/sumInfo.students)*100) + '%');
    }else{$('#noPhotoTask').find('.progress').hide();}

    $('#handCheckTask').find('.additionalData').html(`${sumInfo.handCheckAll-sumInfo.handCheckToDo} | ${sumInfo.handCheckAll}`);
    if(sumInfo.handCheckToDo != 0 || sumInfo.students != 0){
        $('#handCheckTask').find('.progress-bar').css('width', Math.round(((sumInfo.handCheckAll-sumInfo.handCheckToDo)/sumInfo.handCheckAll)*100) + '%');
    }
    else{
        $('#handCheckTask').find('.progress').hide();
        $('#sendResultsTask').removeClass('impossibleTask');
        $('#sendResultsTask').find("input").prop('disabled', false);
        $('#sendResultsTask').attr('title', '');
    }
    $.ajax({
        url: '',
        type: 'post',
        data: { "callUsersFunction": "getEditors", 
        "postID" : window.postID},
        success: function(data) {
            editors = JSON.parse(data['editors']);
            displayEditors(editors);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            toastr.error("Unable to retrieve editors");
        }
    });

    $.ajax({
        url: '',
        type: 'post',
        data: { "callUsersFunction": "getShowResultsStatus", 
        "postID" : window.postID},
        success: function(data) {
            if(data['showResults'] == true){
                $('#sendResultsTask').addClass('completedTask');
                $('#sendResultsTask').find('input').prop('checked', true);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            toastr.error("Unable to retrieve editors");
        }
    });
    
}

function findNoPhotos(){
    var noPhoto = 0, handCheckAll = 0, handCheckToDo = 0;
    handCheckAll = amountPotentialToBeChecked(window.contentKrisi);
    for(attID in window.responsesKrisi){
        if(attID!=0){
            if(!window.responsesKrisi[attID]['images'] || window.pageInfo.length != window.responsesKrisi[attID]['images'].length){
                noPhoto++;
            }
            handCheckToDo += amountToBeChecked(window.responsesKrisi[attID],window.contentKrisi);
        }
    }
    return [noPhoto,handCheckAll, handCheckToDo];
}

function displayEditors(editors){
    var editorsId = [];
    var text = '';
    for(editor of editors){
        switch(editor.role){
        case 'editor':
            text += `<li class="editorLi" data-id="${editor.id}">
                        <a href="/my-profile/?uid=${editor.id}">${window.usersKrisi[editor.id].name} (editor)</a>
                    </li>`;
            break;
        case 'creator':
            text = `<li class="creatorLi" data-id="${editor.id}">
                        <a href="/my-profile/?uid=${editor.id}">${window.usersKrisi[editor.id].name} (creator)</a></li>` + text;
            break;
        }
        editorsId.push(editor.id);
    }
    $('#editorsList').html(text);
    $('#editorsList').find(`[data-id='${window.userID}']`).addClass('meLi');
    var isCreator = $('.meLi').hasClass('creatorLi');
    if(isCreator){
        $('#editorsList').html($('#editorsList').html() + `<li>
        	<input type="text" id="newEditorInput" placeholder="Add editor"/>
            <button id="addEditorBtn" class="addNewButton">+</button>
        </li>`);
        var lis = $('#editorsList').find('li');
        for(li of lis){
            if(!$(li).hasClass('meLi') && $(li).hasClass('editorLi')){
                $(li).addClass('removableLi');
            }
        }
        const names = [];
        Object.values(window.usersKrisi).forEach((user) => {
            if(!editorsId.includes(user.id) && !user.roles.includes('student') && user.id!=window.userID){
                names.push(user.name);
            }
        });
        
        setTimeout(() => { 
            $("#newEditorInput").autocomplete({ 
                minLength: 0,
                source: names,
                select:function(event,ui){
                    $("#newEditorInput").val(ui.item.label); 
                    return false;
                },
                change: function(event, ui) {
                    if (ui.item == null) {
                    this.setCustomValidity("You must select an attendee");
                    }
                }
            });
        }, 1000);
        // TODO addEditorBtn
        $(document).on('click', '#addEditorBtn', function(){
            var attendeeID = -1;
            var searchFor = $('#newEditorInput').val().trim();
            for (const stud in window.usersKrisi) {
                if (window.usersKrisi[stud].name == searchFor) {
                    attendeeID = window.usersKrisi[stud].id;
                }
            }
            console.log(editors);
            if(attendeeID != -1){
                if(window.usersKrisi[attendeeID].roles.includes('student')){
                    toastr.error("Unable to make student to editor");
                    $('#newEditorInput').val('');
                }
                else if(editors.some((el)=> parseInt(el.id)==attendeeID)){
                    toastr.error("Already added");
                    $('#newEditorInput').val('');
                }
                else {
                    $.ajax({
                        url: '',
                        type: 'post',
                        data: { "callUsersFunction": "addEditor", 
                        "postID" : window.postID,
                        "editor" : attendeeID},
                        success: function(data) {
                            editors = JSON.parse(data['editors']);
                            displayEditors(editors);
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
                        editors = JSON.parse(data['editors']);
                        displayEditors(editors);
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        toastr.error("Unable to remove editor");
                    }
                });
            }
        });
    }
}


$(document).on('change','#sendResultsSwitch', function(){
    $.ajax({
        url: '',
        type: 'post',
        data: { "callUsersFunction": "changeShowResultsStatus", 
        "postID" : window.postID},
        success: function(data) {
            if(data['showResults'] == true){
                $('#sendResultsTask').addClass('completedTask');
                $('#sendResultsTask').find('input').prop('checked', true);
            } else {
                $('#sendResultsTask').removeClass('completedTask');
                $('#sendResultsTask').find('input').prop('checked', false);

            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            toastr.error("Unable to retrieve editors");
        }
    });
})

$('.taskLink').on('click', function(){
    history.pushState({}, "", this.getAttribute('href'));
    location.reload();
});