var $ = jQuery;
var selectedFormId = undefined;
var form;
var visiblePageId = -1, canvasWidth=600, canvasHeight=1000;

function initForm(){
    form = window.formKrisi;
    initQuestionTabs();

    console.log(window.pageInfo);
    if(window.pageInfo.length == 0){
        $('#noPDFselected').show();
        $('#formViewRibbon').hide();
        $("#uploadPdfBtn").on('click', function() {
            $("#file-to-upload").trigger('click');
        });
        
        $("#file-to-upload").on('change', function() {
            if(['application/pdf'].indexOf($("#file-to-upload").get(0).files[0].type) == -1) {
                alert('Error : Not a PDF');
                return;
            }
            pdf_url = URL.createObjectURL($("#file-to-upload").get(0).files[0]);
            showPDF();
        });
    } else {
        $('#noPDFselected').hide();
        $('#formViewRibbon').show();
        if(window.pageInfo.length==1){
            $('#formPagesLeft').hide();
            $('#formPagesRight').hide();
        }
        $(document).on('click',"#changePdfBtn", function() {
            $('#formInfoSaveDelete').modal('show');
            $(document).on('click', '#formInfoDelete', function(){
                $.ajax({
                    url: '',
                    type: 'post',
                    data: { "callFormEditFunction": "deleteFormImages", 
                            "postID" : window.postID,},
                    success: function(data) {
                        location.reload();
                    }
                });
            });
            $(document).on('click', '#formInfoCancel', function(){
                $('#formInfoSaveDelete').modal('hide');
            });
        });

        var text = '<div>' + $('#formPagesDiv').children().first().html() + '</div>';
        visiblePageId = 0;
        for(i = 0; i < window.pageInfo.length; i++){
            text += `<div data-id=` + i + ` id="formPage` + i + `" class="formPage" style="display:none; position:relative">
                        <img id="formPageImg` + i + `" class="formPageElement" src="` + window.pageInfo[i]['url'] + `" width="600"/>
                        <canvas id="formPageCanvas` + i + `" class="formPageElement formPageCanvas" width="600" height="1000"></canvas>
                    </div>`;
        }
        
        $('#formPagesDiv').html(text);
        $('#formPagesDiv').show();
        $('#formPage' + visiblePageId).show();
        document.getElementById('formPageImg' + visiblePageId).onload = function() {
            canvasWidth = this.width;
            canvasHeight = this.height;
            for(i = 0; i < window.pageInfo.length; i++){
                $('#formPageCanvas' + i).attr('width', this.width);
                $('#formPageCanvas' + i).attr('height', this.height);
            }
            drawRectsOnPage();
        }

        $(document).on('click', '#formPagesLeft', function(){
            $('#formPage' + visiblePageId).hide();
            visiblePageId --;
            if(visiblePageId == -1) visiblePageId += window.pageInfo.length;
            $('#formPage' + visiblePageId).show();
            drawRectsOnPage();
        });
        $(document).on('click', '#formPagesRight', function(){
            $('#formPage' + visiblePageId).hide();
            visiblePageId++;
            if(visiblePageId == window.pageInfo.length) visiblePageId = 0;
            $('#formPage' + visiblePageId).show();
            drawRectsOnPage();
        });
    }
    

    var thePDF, numPages, currPage = 1, pdf_url;
    function showPDF() {
        $('#pdf-main-container').modal('show');
        $("#pdf-loader").show();
        $("#pdf-contents").hide();
        $('#analysingLoader').hide();
        PDFJS.getDocument(pdf_url).then(function(pdf) {
            thePDF = pdf;
            numPages = pdf.numPages;
            currPage = 1;
            $('#canvasDiv').html('');
            pdf.getPage( 1 ).then( handlePages );
        }).catch(function(error) {
            $("#pdf-loader").hide();
            $("#uploadPdfBtn").show();
            alert(error.message);
        });
    
        function handlePages(page){
            jQuery(`<div data-id=` + currPage + ` style="position:relative">
                        <img class="pickedPageImg" id="pickedPage` + currPage + `" src="` + window.srcPath + `/img/pickedPage.png"/>
                        <canvas id="canvasPage` + currPage + `" class="canvasPage" height="150"></canvas>
                    </div>`).appendTo('#canvasDiv');
            var canvas = $('#canvasPage' + currPage).get(0);
            drawPageInCanvas(page,canvas, true);
            var img = $('#pickedPage' + currPage).get(0);
            img.width = canvas.width;
            currPage++;
            if ( thePDF !== null && currPage <= numPages ){
                thePDF.getPage( currPage ).then( handlePages );
            }
            if(currPage-1 == numPages){
                $("#pdf-loader").hide();
                $("#pdf-contents").show();
            }
        }

        var pagesArray = [], freshlyPicked = false;

        $(document).on('click', '.canvasPage', function(){
            $this = $(this);
            var parent = $this.parent();
            var id = parent.data('id');
            var img = parent.children('.pickedPageImg').first();
            if(pagesArray.includes(id)){
                pagesArray.splice(pagesArray.indexOf(id), 1);
                img.hide();
            } else {
                pagesArray.push(id);
                img.show();
            }
            if(pagesArray.length == 0){
                $('#atLeast1').show();
                $('#formPdfPickedSave').addClass('disabledBtn');
            }
            else{
                $('#atLeast1').hide();
                $('#formPdfPickedSave').removeClass('disabledBtn');
            }
        });
        
        $(document).on('click', '#formPdfPickedSave', function(){
            if(!$(this).hasClass('disabledBtn')){

                currPage = 0;
                $('#analysingLoader').show();
                thePDF.getPage( pagesArray[currPage] ).then( handlePickedPages );
                freshlyPicked = true;
            }
        });
    
        function handlePickedPages(page){
            var width = $('#formPagesDiv').width();
            jQuery(`<div>
                        <canvas id="pdf-canvas-` + currPage + `" class="canvasForm" width="` + width + `"></canvas>
                        <canvas id="temp-canvas-` + currPage + `" class="canvasForm" width="` + width + `"></canvas>
                    </div>`).appendTo('#formPagesDiv');
            var canvas = $('#pdf-canvas-' + currPage).get(0);
            drawPageInCanvas(page,canvas, false);
            $('#pdf-canvas-' + currPage).parent().height(canvas.height);
            
            currPage++;
            if ( thePDF !== null && currPage < pagesArray.length ){
                thePDF.getPage( pagesArray[currPage] ).then( handlePickedPages );
            }
            if(currPage == pagesArray.length && freshlyPicked){
                 setTimeout(function(){
                    var dataURLs = [];
                    for(page = 0; page < pagesArray.length; page++){
                        $('#analysingLoader').children().first().html(`<strong>Analysing</strong> page #${page+1}`);
                        let image = cv.imread(document.getElementById('pdf-canvas-' + page));
                        cv.imshow('imageCanvas', image);
                        image.delete();
                        dataURLs.push({imgURL:document.getElementById('pdf-canvas-' + page).toDataURL("image/png"),
                                        edges: find4Edges3(document.getElementById("imageCanvas"))});
                    }
                    $('#pdf-main-container').modal('hide');
                    $('#analysingLoader').hide();
                    $.ajax({
                        url: '',
                        type: 'post',
                        data: { "callFormEditFunction": "saveFormImages", 
                                "postID" : window.postID,
                                "imgBase64": dataURLs,},
                        success: function(data) { 
                            //location.reload();
                        },
                        error: function(XMLHttpRequest, textStatus, errorThrown) {
                            toastr.error("Unable to save images");
                        }
                    });
                    
                 }, 10);
            }
        }

    }
    $(document).on('click', '.questionFormDiv', function(){
        if(visiblePageId!=-1){
            if (typeof selectedFormId === 'undefined') {  
                var $this = $(this);
                $this.addClass('questionFormDivSelected');
                selectedFormId = decodeIds($this.data('code'));
                if(getValueQuestionRectCoords(form[selectedFormId[0]], selectedFormId[1])){
                    form[selectedFormId[0]] = setValueQuestionRectCoords(form[selectedFormId[0]], selectedFormId[1],null);
                    drawRectsOnPage();
                }
            } 
            else {
                console.log(JSON.stringify(selectedFormId));
                console.log(JSON.stringify(decodeIds($(this).data('code'))));
                if(JSON.stringify(selectedFormId) == JSON.stringify(decodeIds($(this).data('code')))){
                    $.ajax({
                        url: '',
                        type: 'post',
                        data: { "callFormEditFunction": "updateFormQuestion", 
                        "postID" : window.postID,
                        "moduleID" : selectedFormId[0],
                        "indArr" : selectedFormId[1],
                        "value" : null},
                        success: function(data) {
                            window.formKrisi = JSON.parse(data['form']);
                            form = window.formKrisi;
                            initQuestionTabs();
                            initFormCircle();
                        },
                        error: function(XMLHttpRequest, textStatus, errorThrown) {
                            toastr.error("Unable to update form");
                        }
                    });
                    selectedFormId = undefined;
                }
                else {
                    // var code = selectedFormId[0] + '_' + encodeIds(selectedFormId[1]);
                    // selectedFormId = undefined;
                    // $(document).find('[data-code=' + code + ']').eq(0).removeClass('questionFormDivSelected');
                    // $(document).find('[data-code=' + code + ']').eq(0).addClass('questionFormDivFenced');
                    // $.ajax({
                    //     url: '',
                    //     type: 'post',
                    //     data: { "callFormEditFunction": "getFormData", 
                    //     "postID" : window.postID,},
                    //     success: function(data) {
                    //         form = JSON.parse(data['form']);
                    //         initQuestionTabs();
                    //     },
                    //     error: function(XMLHttpRequest, textStatus, errorThrown) {
                    //         toastr.error("Unable to get form data");
                    //     }
                    // });
                }
            }
        }
    });
    function mouseInRect(mouse, rect){
        return mouse.x/canvasWidth >= rect.left && mouse.x/canvasWidth <= rect.left+rect.width &&
                mouse.y/canvasHeight >= rect.top && mouse.y/canvasHeight <= rect.top+rect.height;
    }

    initQuestionFormHover();
    initCanvasActions();
    answerTemplateInit();
}

function recheckQuestion(formQ, contentQ, code){
    if(contentQ.type == 'Closed'){
        $.ajax({
            url: '',
            type: 'post',
            data: { "callTestEditFunction": 'getImageURLs',
                    "postID": window.postID,
                    "attArr": Object.keys(window.responsesKrisi),
                    "pageID": formQ.page},
            success: function(data) { 
                checkQuestionRecursive(data, 0, formQ, contentQ, code, []);
            }
        });
    }
}

function checkQuestionRecursive(resps, ind, formQ, contentQ, code, ans){
    if(ind >= resps.length){
        code = decodeIds(code);
        $.ajax({
            url: '',
            type: 'post',
            data: { "callResponseEditFunction": 'changeAnswerChDiff',
                    "postID": window.postID,
                    "reqArr": ans,
                    "moduleID": code[0],
                    "indArr": code[1]},
            success: function(data) { 
                console.log(data);
            }
        });
        return;
    }
    var image = document.getElementById('imageImg');
    image.onload = function() {
        var currAns = checkQuestion(formQ.page, formQ, contentQ, image, code);
        console.log(resps[ind].attID);
        ans.push({attID: resps[ind].attID, ans: currAns[0].answer});
        checkQuestionRecursive(resps, ind+1, formQ, contentQ, code, ans);
    }
    image.src = resps[ind].url;
}

    
function drawQuestion(form, canvas, visiblePageId){
    if(form == null) return;
    if('subq' in form && form.subq != null){
        Object.values(form['subq']).forEach(sub => 
            drawQuestion(sub,canvas, visiblePageId)
        );
    } else {
        if(form.page == visiblePageId){
            strokeRect(canvas, form);
        }
    }
}
function drawEdgesOnPage(){
    var canvas = document.getElementById('formPageCanvas' + visiblePageId);
    var edgePoints = $('#formPagesDiv').find('.edgePoint');
    for(i = 0; i< 4;i++){
        edgePoints[i].style.left = window.pageInfo[visiblePageId]['edges'][i].x*canvas.width+'px';
        edgePoints[i].style.top = window.pageInfo[visiblePageId]['edges'][i].y*canvas.height+'px';
    }
}
function drawRectsOnPage(){
    var canvas = document.getElementById('formPageCanvas' + visiblePageId);
    clearCanvas(canvas);
    form.forEach((module) => {
        drawQuestion(module,canvas, visiblePageId);
    });
    drawEdgesOnPage();
}

function initCanvasActions(){
    let lastX, lastY,x,y;
    let draggingEdge = undefined;
    let draggingQuestion = false;
    const canvasPadding = 10;
    const minX = canvasPadding;
    const minY = canvasPadding;
    const maxX = $('#formPagesDiv').width() - canvasPadding;
    var maxY = $('#formPagesDiv').height() - canvasPadding;

    $(document).on('mousedown', '.edgePoint', function(e){
        draggingEdge = this;
        e.preventDefault();
        lastX = e.clientX - draggingEdge.offsetLeft;
        lastY = e.clientY - draggingEdge.offsetTop;
        maxY = $('#formPagesDiv').height(); - canvasPadding;
    });


    $(".edgePoint").on("mousemove", function(e) {
        if (typeof draggingEdge !== 'undefined') {  
            x = e.clientX - lastX;
            y = e.clientY - lastY;
            x = Math.min(Math.max(x, minX), maxX);
            y = Math.min(Math.max(y, minY), maxY);
            draggingEdge.style.left = x + 'px';
            draggingEdge.style.top = y + 'px';
        }
    });
    $(".edgePoint").on("mouseup", function(e) {
        if(typeof draggingEdge !== 'undefined'){
            var ind = $(this).data('id');
            var canvas = document.getElementById('formPageCanvas' + visiblePageId);
            $.ajax({
                url: '',
                type: 'post',
                data: { "callFormEditFunction": "editEdge", 
                "postID" : window.postID,
                "pageID" : visiblePageId,
                "edgeID" : ind,
                "left" : draggingEdge.offsetLeft/canvas.width,
                "top" : draggingEdge.offsetTop/canvas.height,},
                success: function(data) {
                    window.pageInfo = JSON.parse(data['pageInfo']);
                    draggingEdge = undefined;
                    drawEdgesOnPage();
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    toastr.error("Unable to update edge position");
                }
            });
        }
    });

    $(".formPageCanvas").on("mousemove", function(e) {
        if (typeof draggingEdge !== 'undefined') {  
            x = e.clientX - lastX;
            y = e.clientY - lastY;
            x = Math.min(Math.max(x, minX), maxX);
            y = Math.min(Math.max(y, minY), maxY);
            draggingEdge.style.left = x + 'px';
            draggingEdge.style.top = y + 'px';
        }
        if(selectedFormId != undefined && draggingQuestion) {
            if(sPosX != -1){
                var pos = $(this).offset();
                pos.left = parseInt(pos.left);
                pos.top = parseInt(pos.top);
                ePosX = parseInt(e.pageX);
                ePosY = parseInt(e.pageY);
                var val = {
                    left: Math.min(sPosX,ePosX)-pos.left,
                    top: Math.min(sPosY,ePosY)-pos.top,
                    width: Math.abs(sPosX-ePosX),
                    height: Math.abs(sPosY-ePosY),
                    page: visiblePageId
                };
                form[selectedFormId[0]] = setValueQuestionRectCoords(form[selectedFormId[0]], selectedFormId[1], val);
                drawRectsOnPage();
            }
        }
    });
    $(document).on('mousedown', '.formPageCanvas', function(e){
        if(visiblePageId!=-1){
            if(selectedFormId != undefined){
                sPosX = e.pageX;
                sPosY = e.pageY;
                var val = {
                    page: visiblePageId,
                    left: parseInt(sPosX),
                    top: parseInt(sPosY),
                    width: parseInt(0),
                    height: parseInt(0)};
                form[selectedFormId[0]] = setValueQuestionRectCoords(form[selectedFormId[0]], selectedFormId[1], val);
                draggingQuestion = true;
            }
        }
    });

    $(".formPageCanvas").on("mouseup", function(e) {
        if(visiblePageId!=-1 && selectedFormId!=undefined){
            console.log(getValueQuestionRectCoords(form[selectedFormId[0]], selectedFormId[1]));
            $.ajax({
                url: '',
                type: 'post',
                data: { "callFormEditFunction": "updateFormQuestion", 
                "postID" : window.postID,
                "moduleID" : selectedFormId[0],
                "indArr" : selectedFormId[1],
                "value" : getValueQuestionRectCoords(form[selectedFormId[0]], selectedFormId[1]),},
                success: function(data) {
                    window.formKrisi = JSON.parse(data['form']);
                    form = window.formKrisi;
                    var code = selectedFormId[0] + '_' + encodeIds(selectedFormId[1]);
                    console.log(code);
                    formQ = getQuestion(form, code);
                    recheckQuestion(getQuestion(form, code), getQuestion(window.contentKrisi, code), code);
                    $(document).find('[data-code=' + code + ']').eq(0).removeClass('questionFormDivSelected');
                    $(document).find('[data-code=' + code + ']').eq(0).addClass('questionFormDivFenced');
                    selectedFormId = undefined;
                    sPosX = -1; sPosY = -1;
                    initQuestionTabs();
                    initFormCircle();
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    toastr.error("Unable to update form");
                }
            });
        }
        draggingQuestion = false;
    });
}
function initQuestionFormHover(){
    $(document).on('mouseenter', '.questionFormDiv', function(){
        if(visiblePageId!=-1){
            var $this = $(this);
            var indArr = decodeIds($this.data('code'));
            var rect = getValueQuestionRectCoords(form[indArr[0]], indArr[1]);
            if(rect!=undefined && rect.page == visiblePageId){
                fillRect(document.getElementById('formPageCanvas' + visiblePageId),rect,"#415a8076");
            }
        }
    });
    $(document).on('mouseleave', '.questionFormDiv', function(){
        if(visiblePageId!=-1){
            drawRectsOnPage();
        }
    });
}
function initQuestionTabs(){
    var upperDiv = $('#listQuestForForm');
    var text = '<p class="formTabTitle"><b>Question</b> view:</p>';
    for(var moduleID = 0; moduleID < window.contentKrisi.length; moduleID++){
        text += '<div class = "upperDiv">';
        text += `<div class = "upperDivModule">
                    <p class="moduleIDT">Module</p>
                    <p class="moduleID">#` + (moduleID+1) + `</p></div>`;
        for(var questionID = 0; questionID < window.contentKrisi[moduleID]['subq'].length; questionID++){
            if(window.contentKrisi[moduleID]['subq'][questionID]['type'] == 'Composite'){
                for(var subID = 0; subID < window.contentKrisi[moduleID]['subq'][questionID]['subq'].length; subID++){
                    text += addQuestionTab(moduleID, [questionID, subID], codeToString(`${moduleID}_${questionID}_${subID}`));
                }
            } else {
                text += addQuestionTab(moduleID, [questionID], codeToString(`${moduleID}_${questionID}`));
            }
        } 
        text += '</div>';
    }
    upperDiv.html(text);
}
function addQuestionTab(moduleID, indArr, id){
    var newTab = "<div class=\"questionFormDiv";
    var result = getValueQuestionRectCoords(form[moduleID], indArr);
    if(result != undefined && Object.keys(result).length > 0){
        newTab+= ' questionFormDivFenced';
    }
    newTab += "\" data-code=\"" + moduleID + '_' + encodeIds(indArr) + "\"><p>" + id + "</p><div></div></div>";
    return newTab;
}

function getValueQuestionRectCoords(form, indArr){
    if(indArr.length == 0){
        if(form.page == null) return undefined;
        return form;
    }
    var indArr2 = JSON.parse(JSON.stringify(indArr));
    var id = indArr2.shift();
    if(form!=undefined && form.subq != null && id in form['subq'] ) return getValueQuestionRectCoords(form['subq'][id], indArr2);
    else return undefined;
}
function setValueQuestionRectCoords(form, indArr, val){
    if(indArr.length == 0){
        if(val!=null){
            val.left /= canvasWidth;
            val.width /= canvasWidth;
            val.top /= canvasHeight;
            val.height /= canvasHeight;
        }
        return val;
    }
    var indArr2 = JSON.parse(JSON.stringify(indArr));
    var id = indArr2.shift();
    if(form === undefined) form = {};
    if(!('subq' in form && form.subq != null)) form['subq'] = {};
    if(!(id in form['subq'])) form['subq'][id] = {};
    form['subq'][id] = setValueQuestionRectCoords(form['subq'][id], indArr2, val);
    return form;
}


function drawPageInCanvas(page, canvas, hei){
    var viewport = page.getViewport( 1 );
    var context = canvas.getContext('2d');
    var scale_required;
    if(hei) scale_required = canvas.height / page.getViewport(1).height;
    else scale_required = canvas.width / page.getViewport(1).width;
    var viewport = page.getViewport(scale_required);
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    return page.render({canvasContext: context, viewport: viewport});
}