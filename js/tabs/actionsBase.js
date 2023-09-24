var $ = jQuery;
function initBase(){
    var tempPath;
    tempPath = $('.showDescrButton').eq(0).attr('src');
    tempPath = tempPath.substring(0,tempPath.lastIndexOf('/'));

    refreshContentTable();
    initFunctions();

    // function refreshContentTable(){
    //     var allModulesDiv = $('#allModulesDiv');
    //     allModulesDiv.empty();
    //     var copyModule = $('#copyModule');
    //     for(var moduleID = 0; moduleID < window.contentKrisi.length; moduleID++){
    //         var table = '<div class="moduleDiv">' + copyModule.html() + '</div>';
    //         table = table.replace(/KrIsI/g, moduleID);
    //         table = table.replace(/KrISI/g, (moduleID+1));
    //         allModulesDiv.append(table);
    //         table = allModulesDiv.children('.moduleDiv').last();
    //         var tbody = table.find('tbody').first();
    //         var id = 1;
    //         closedRow = tbody.find('.closedQuestion').first().clone();
    //         openedRow = tbody.find('.openedQuestion').first().clone();
    //         descriptiveRow = tbody.find('.descriptiveQuestion').first().clone();
    //         compositeRow = tbody.find('.compositeQuestion').first().clone();
    //         checkRow = tbody.find('.check').first().clone();
    //         for(var questionID = 0; questionID < window.contentKrisi[moduleID]['subq'].length; questionID++){
    //             switch(window.contentKrisi[moduleID]['subq'][questionID]['type']){
    //                 case 'Closed':
    //                     createClosedQuestion(moduleID + '_' + questionID,
    //                         tbody, 
    //                         id, 
    //                         window.contentKrisi[moduleID]['subq'][questionID]['answer'], 
    //                         window.contentKrisi[moduleID]['subq'][questionID]['points']);
    //                     break;
    //                 case 'Opened':
    //                     createOpenedQuestion(moduleID + '_' + questionID ,
    //                         tbody, 
    //                         id, 
    //                         window.contentKrisi[moduleID]['subq'][questionID]['answer'], 
    //                         window.contentKrisi[moduleID]['subq'][questionID]['points']);
    //                     break;
    //                 case 'Descriptive':
    //                     createDescriptiveQuestion(moduleID + '_' + questionID ,
    //                         tbody, 
    //                         id, 
    //                         window.contentKrisi[moduleID]['subq'][questionID]['answer'], 
    //                         window.contentKrisi[moduleID]['subq'][questionID]['points']);
    //                     var descTBody = tbody.find('tbody').last();
    //                     descTBody.empty();
    //                     for(var checkID = 0; checkID < window.contentKrisi[moduleID]['subq'][questionID]['subq'].length; checkID++){
    //                         createCheckQuestion(moduleID + '_' + questionID + '_' + checkID,
    //                             descTBody, 
    //                             window.contentKrisi[moduleID]['subq'][questionID]['subq'][checkID]['answer'], 
    //                             window.contentKrisi[moduleID]['subq'][questionID]['subq'][checkID]['points']);
    //                     }
    //                     break;
    //                 case 'Composite':
    //                     createCompositeQuestion(moduleID + '_' + questionID ,
    //                         tbody, 
    //                         id, 
    //                         window.contentKrisi[moduleID]['subq'][questionID]['answer'], 
    //                         window.contentKrisi[moduleID]['subq'][questionID]['points']);
    //                     var index = 'A';
    //                     var compTBody = tbody.find('tbody').last();
    //                     for(var subID = 0; subID < window.contentKrisi[moduleID]['subq'][questionID]['subq'].length; subID++){
    //                         switch(window.contentKrisi[moduleID]['subq'][questionID]['subq'][subID]['type']){
    //                             case 'Closed':
    //                                 createClosedQuestion(moduleID + '_' + questionID + '_' + subID ,
    //                                     compTBody, 
    //                                     index, 
    //                                     window.contentKrisi[moduleID]['subq'][questionID]['subq'][subID]['answer'], 
    //                                     window.contentKrisi[moduleID]['subq'][questionID]['subq'][subID]['points']);
    //                                 break;
    //                             case 'Opened':
    //                                 createOpenedQuestion(moduleID + '_' + questionID + '_' + subID ,
    //                                     compTBody, 
    //                                     index, 
    //                                     window.contentKrisi[moduleID]['subq'][questionID]['subq'][subID]['answer'], 
    //                                     window.contentKrisi[moduleID]['subq'][questionID]['subq'][subID]['points']);
    //                                 break;
    //                             case 'Descriptive':
    //                                 createDescriptiveQuestion(moduleID + '_' + questionID + '_' + subID ,
    //                                     compTBody, 
    //                                     index, 
    //                                     window.contentKrisi[moduleID]['subq'][questionID]['subq'][subID]['answer'], 
    //                                     window.contentKrisi[moduleID]['subq'][questionID]['subq'][subID]['points']);
    //                                 var descTBody = tbody.find('tbody').last();
    //                                 for(var checkID = 0; checkID < window.contentKrisi[moduleID]['subq'][questionID]['subq'][subID]['subq'].length; checkID++){
    //                                     createCheckQuestion(moduleID + '_' + questionID + '_' + subID + '_' + checkID,
    //                                         descTBody, 
    //                                         window.contentKrisi[moduleID]['subq'][questionID]['subq'][subID]['subq'][checkID]['answer'], 
    //                                         window.contentKrisi[moduleID]['subq'][questionID]['subq'][subID]['subq'][checkID]['points']);
    //                                 }
    //                                 break;
    //                         }
    //                         index = String.fromCharCode(index.charCodeAt(0) + 1);
    //                     }
    //                     break;
    //             }
    //             id++;
    //         }
    //         var lastTr = tbody.find('.lastTr').last().detach();
    //         tbody.append(lastTr);
    //     }
    // }
    function refreshContentTable(){
        var allModulesDiv = $('#allModulesDiv');
        allModulesDiv.empty();
        copyModule = $('#copyModule');
        for(var moduleID = 0; moduleID < window.contentKrisi.length; moduleID++){
            baseHandleQuestion(allModulesDiv, window.contentKrisi[moduleID],moduleID,false);
        }
    }
    var copyModule;
    var closedRow;
    var openedRow;
    var descriptiveRow;
    var compositeRow;
    var checkRow;
    function baseHandleQuestion(tbody, questionCont, code, subq){
        switch(questionCont.type){
        case 'Module':
            var table = '<div class="moduleDiv">' + copyModule.html() + '</div>';
            table = table.replace(/KrIsI/g, code);
            table = table.replace(/KrISI/g, (code+1));
            tbody.append(table);
            table = tbody.children('.moduleDiv').last();
            var newTbody = table.find('tbody').first();
            closedRow = newTbody.find('.closedQuestion').first().clone();
            openedRow = newTbody.find('.openedQuestion').first().clone();
            descriptiveRow = newTbody.find('.descriptiveQuestion').first().clone();
            compositeRow = newTbody.find('.compositeQuestion').first().clone();
            checkRow = newTbody.find('.check').first().clone();
            for(var id = 0; id < questionCont.subq.length; id++){
                baseHandleQuestion(newTbody, questionCont.subq[id], code + '_' + id, false);
            }
            var lastTr = newTbody.find('.lastTr').last().detach();
            newTbody.append(lastTr);
            break;
        case 'Composite':
            createCompositeQuestion(code,
                        tbody, 
                        questionCont['points']);
            var newTbody = tbody.find('tbody').last();
            for(var id = 0; id < questionCont.subq.length; id++){
                baseHandleQuestion(newTbody, questionCont.subq[id], code + '_' + id, true);
            }
            break;
        case 'Closed':
            createClosedQuestion(code,
                tbody, 
                questionCont['answer'], 
                questionCont['points'],
                subq);
            break;
        case 'Opened':
            createOpenedQuestion(code,
                tbody, 
                questionCont['answer'], 
                questionCont['points'],
                subq);
            break;
        case 'Check':
            createCheckQuestion(code,
                tbody, 
                questionCont['answer'], 
                questionCont['points']);
            break;
        case 'Descriptive':
            createDescriptiveQuestion(code,
                tbody, 
                questionCont['points'],
                subq);
            var newTBody = tbody.find('tbody').last();
            newTBody.empty();
            for(var id = 0; id < questionCont['subq'].length; id++){
                baseHandleQuestion(newTBody, questionCont.subq[id], code + '_' + id, false);
            }
            break;
        }
    }

    function createClosedQuestion(code,tbody,answer,points,subq){
        var copyRow = closedRow.clone();
        copyRow.removeClass('invisible');
        copyRow.attr("data-code",code);
        if(subq){
            copyRow.addClass('subQ');
            copyRow.find('.type').val('Sub' + copyRow.find('.type').val());
        }
        copyRow.find('.questionID').first().html(codeToString(code));
        copyRow.find('.radioA').removeClass('radioChecked');
        copyRow.find('.radioB').removeClass('radioChecked');
        copyRow.find('.radioC').removeClass('radioChecked');
        copyRow.find('.radioD').removeClass('radioChecked');
        copyRow.find('.radio' + answer).addClass('radioChecked');
        copyRow.find('.points').first().val(points);
        tbody.append(copyRow);
    }

    function createOpenedQuestion(code,tbody,answer,points,subq){
        var copyRow = openedRow.clone();
        copyRow.removeClass('invisible');
        copyRow.attr("data-code",code);
        if(subq){
            copyRow.addClass('subQ');
            copyRow.find('.type').val('Sub' + copyRow.find('.type').val());
        }
        copyRow.find('.questionID').first().html(codeToString(code));
        copyRow.find('.openedAnswer').first().val(answer);
        copyRow.find('.points').first().val(points);
        tbody.append(copyRow);
    }

    function createDescriptiveQuestion(code,tbody,points, subq){
        var copyRow = descriptiveRow.clone();
        copyRow.removeClass('invisible');
        copyRow.attr("data-code",code);
        if(subq){
            copyRow.addClass('subQ');
            copyRow.find('.type').val('Sub' + copyRow.find('.type').val());
        }
        copyRow.find('.questionID').first().html(codeToString(code));
        copyRow.find('.descriptiveTable').find('tbody').html('');
        copyRow.find('.points').first().val(points);
        copyRow.find('.points').first().addClass('no-spinners');
        tbody.append(copyRow);
    }

    function createCheckQuestion(code,tbody,answer,points){
        var copyRow = checkRow.clone();
        copyRow.attr("data-code",code);
        copyRow.find('.conditionCheck').first().val(answer);
        copyRow.find('.points').first().val(points);
        tbody.append(copyRow);
    }

    function createCompositeQuestion(code, tbody, points){
        var copyRow = compositeRow.clone();
        copyRow.attr("data-code",code);
        copyRow.removeClass('invisible');
        copyRow.find('.questionID').first().html(codeToString(code));
        copyRow.find('.points').first().val(points);
        copyRow.find('.points').first().addClass('no-spinners');
        //copyRow.find('tbody').children().eq(1).remove();
        tbody.append(copyRow);
    }

    function initFunctions() {

        $(document).on('click','#noYouSureButton', function(e){
            $('#popupForm').hide();
        });

        $(document).on('click','#closeEmptyOButton', function(e){
            $('#popupEmptyOpForm').hide();
        });

        $(document).on('click', '.addModule', function(e){
            $.ajax({
                url: '',
                type: 'post',
                data: { "callTestEditFunction": "createModule", 
                "postID" : window.postID},
                success: function(data) {
                    window.contentKrisi = JSON.parse(data['content']);
                    window.responsesKrisi = JSON.parse(data['responses']);
                    refreshContentTable();
                }
            });
        });

        $(document).on('click','.addQuestionButton', function(e){
            $this = $(this);
            var type = -1;
            if($this.hasClass('addClosed')) type="Closed";
            if($this.hasClass('addOpened')) type="Opened";
            if($this.hasClass('addDesciptive')) type="Descriptive";
            if($this.hasClass('addComposite')) type="Composite";
            var table = $this.closest('.questionTable');
            $.ajax({
                url: '',
                type: 'post',
                data: { "callTestEditFunction": "addQuestion", 
                "moduleID": table.data('moduleid'),
                "indArr": '[]',
                "questionType" : type,
                "postID" : window.postID},
                success: function(data) {
                    window.contentKrisi = JSON.parse(data['content']);
                    window.responsesKrisi = JSON.parse(data['responses']);
                    refreshContentTable();
                }
            });
        });

        $(document).on('click','.addSubQButton', function(e){
            $this = $(this);
            var type = -1;
            if($this.hasClass('addClosed')) type="Closed";
            if($this.hasClass('addOpened')) type="Opened";
            if($this.hasClass('addDesciptive')) type="Descriptive";
            if($this.hasClass('addComposite')) type="Composite";
            var code = decodeIds($this.closest('.questionOrCheck').data('code'));
            $.ajax({
                url: '',
                type: 'post',
                data: { "callTestEditFunction": "addQuestion", 
                "moduleID": code[0],
                "indArr": JSON.stringify(code[1]),
                "questionType" : type,
                "postID" : window.postID},
                success: function(data) {
                    window.contentKrisi = JSON.parse(data['content']);
                    window.responsesKrisi = JSON.parse(data['responses']);
                    refreshContentTable();
                }
            });
        });
        
        $(document).on('click','.addCheck', function(e){
            $this = $(this);
            var code = decodeIds($this.closest('.questionOrCheck').data('code'));
            $.ajax({
                url: '',
                type: 'post',
                data: { "callTestEditFunction": "addQuestion", 
                "moduleID": code[0],
                "indArr": JSON.stringify(code[1]),
                "questionType" : 'Check',
                "postID" : window.postID},
                success: function(data) {
                    window.contentKrisi = JSON.parse(data['content']);
                    window.responsesKrisi = JSON.parse(data['responses']);
                    refreshContentTable();
                }
            });
        });
        var deleteButtonCode;
        $(document).on('click','.deleteButton', function(e){
            var $this = $(this);
            if($this.hasClass('deleteModule')){
                var moduleID = $this.data('moduleid');
                $('#popupForm').show();
                $(document).on('click','#yesYouSureButton', function(e){
                    $.ajax({
                        url: '',
                        type: 'post',
                        data: { "callTestEditFunction": "deleteQuestion", 
                        "moduleID": moduleID,
                        "indArr": '[]',
                        "postID" : window.postID},
                        success: function(data) {
                            window.contentKrisi = JSON.parse(data['content']);
                            window.responsesKrisi = JSON.parse(data['responses']);
                            refreshContentTable();
                        }
                    });
                    $('#popupForm').hide();
                });
            }
            else {
                deleteButtonCode = decodeIds($this.closest('.questionOrCheck').data('code'));
                $('#popupForm').show();
                $(document).on('click','#yesYouSureButton', function(e){
                    $.ajax({
                        url: '',
                        type: 'post',
                        data: { "callTestEditFunction": "deleteQuestion", 
                        "moduleID": deleteButtonCode[0],
                        "indArr": JSON.stringify(deleteButtonCode[1]),
                        "postID" : window.postID},
                        success: function(data) {
                            window.contentKrisi = JSON.parse(data['content']);
                            window.responsesKrisi = JSON.parse(data['responses']);
                            console.log(window.contentKrisi);
                            console.log(window.responsesKrisi);
                            refreshContentTable();
                        }
                    });
                    $('#popupForm').hide();
                });
            }
        });

        $(document).on('click','.radio', function(e){
            var $this = $(this);
            var code = decodeIds($this.closest('.questionOrCheck').data('code'));
            $.ajax({
                url: '',
                type: 'post',
                data: { "callTestEditFunction": "changeAnswer", 
                "moduleID": code[0],
                "indArr": JSON.stringify(code[1]),
                "answer": $this.data('answer'),
                "postID" : window.postID},
                success: function(data) {
                    window.contentKrisi = JSON.parse(data['content']);
                    window.responsesKrisi = JSON.parse(data['responses']);
                    refreshContentTable();
                }
            });
        });
        
        $(document).on('keypress', '.openedAnswer', function(event){
            var keycode = (event.keyCode ? event.keyCode : event.which);
            if(keycode == '13'){ //enter
                $(this).trigger( "blur" );
            }
        });
        $(document).on('blur', '.openedAnswer', function() {
            var $this = $(this);
            var newVal = $this.val();
            var code = decodeIds($this.closest('.questionOrCheck').data('code'));
            if(newVal.length==0){
                toastr.error("The answer cannot be empty");
                $this.val(getQuestion(window.contentKrisi, $this.closest('.questionOrCheck').data('code')).answer);
            }
            else{
                $.ajax({
                    url: '',
                    type: 'post',
                    data: { "callTestEditFunction": "changeAnswer", 
                    "moduleID": code[0],
                    "indArr": JSON.stringify(code[1]),
                    "answer": $(this).val(),
                    "postID" : window.postID},
                    success: function(data) {
                        window.contentKrisi = JSON.parse(data['content']);
                        window.responsesKrisi = JSON.parse(data['responses']);
                        refreshContentTable();
                    }
                });
            }
        });
        
        $(document).on('keypress', '.conditionCheck', function(event){
            var keycode = (event.keyCode ? event.keyCode : event.which);
            if(keycode == '13'){ //enter
                $(this).trigger( "blur" );
            }
        });
        $(document).on('click', '.conditionCheck', function() {
            if($(this).val() == DEFAULT_CONDITION){
                $(this).select();
            }
        });
        $(document).on('blur', '.conditionCheck', function() {
            var $this = $(this);
            var newVal = $this.val();
            var code = decodeIds($this.closest('.questionOrCheck').data('code'));
            if(newVal.length==0){
                toastr.error("The condition cannot be empty");
                $this.val(getQuestion(window.contentKrisi, $this.closest('.questionOrCheck').data('code')).answer);
            }
            else{
                $.ajax({
                    url: '',
                    type: 'post',
                    data: { "callTestEditFunction": "changeAnswer", 
                    "moduleID": code[0],
                    "indArr": JSON.stringify(code[1]),
                    "answer": newVal,
                    "postID" : window.postID},
                    success: function(data) {
                        window.contentKrisi = JSON.parse(data['content']);
                        window.responsesKrisi = JSON.parse(data['responses']);
                        refreshContentTable();
                    }
                });
            }
        });
        
        $(document).on('input','.points', function(e){
            var $this = $(this);
            var newVal = $this.val();
            var code = decodeIds($this.closest('.questionOrCheck').data('code'));
            if(newVal==0){
                toastr.error("The points cannot be zero");
                $this.val(getQuestion(window.contentKrisi, $this.closest('.questionOrCheck').data('code')).points);
            }
            else{
                $.ajax({
                    url: '',
                    type: 'post',
                    data: { "callTestEditFunction": "changePoints", 
                    "moduleID": code[0],
                    "indArr": JSON.stringify(code[1]),
                    "points": $this.val(),
                    "postID" : window.postID},
                    success: function(data) {
                        window.contentKrisi = JSON.parse(data['content']);
                        window.responsesKrisi = JSON.parse(data['responses']);
                        refreshContentTable();
                    }
                });
            }
        });
        
    }
}  