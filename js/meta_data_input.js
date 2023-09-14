
var tempPath;
toastr.options = {"icon": false,"closeButton": true, "newestOnTop": true, "progressBar": true, "positionClass": "toast-bottom-right"};

jQuery(function($) { //jQuery passed in as first param, so you can use $ inside
    $(document).ready(function(){
        tempPath = window.tempPath;
        console.log(tempPath);
        if(window.userRole == 'editor'){
            window.contentKrisi = JSON.parse(window.contentKrisi);
            window.usersKrisi = JSON.parse(window.usersKrisi);
            window.responsesKrisi = JSON.parse(window.responsesKrisi);
            window.pageInfo = JSON.parse(window.pageInfo);
            window.formKrisi = JSON.parse(window.formKrisi);
            console.log('Content:');
            console.log(window.contentKrisi);
            console.log('Responses:');
            console.log(window.responsesKrisi);
            console.log('Form:');
            console.log(window.formKrisi);
            console.log('Pageinfo:');
            console.log(window.pageInfo);
            console.log('Users:');
            console.log(window.usersKrisi);
            window.userID = parseInt(window.userID);
            for(var i = 0; i < window.pageInfo.length;i++){
                for(var j = 0; j < 4;j++){
                    window.pageInfo[i]['edges'][j] = parsePointFromString(window.pageInfo[i]['edges'][j]);
                }
            }
            if(window.responsesKrisi.length == 0) window.responsesKrisi = [];
            initNotifCircles();

            switch(window.openedTab){
                case 'summary':   {initSummary();       break;}
                case 'stats':     {initStats();         break;}
                case 'attendees': {initAttendees();     break;}
                case 'modules':   {initBase();          break;}
                case 'check':     {initCheck();         break;}
                case 'handcheck': {initHandCheck();     break;}
                case 'form':      {initForm();          break;}
            }
            $('#'+window.openedTab+'Link').parent().addClass('current');
            if(window.openedTab!='check') $('#checkLink').parent().hide();

        } else if(window.userRole == 'attendee'){
            window.contentKrisi = JSON.parse(window.contentKrisi);
            window.responsesKrisi = JSON.parse(window.responsesKrisi);
            initAttendeeResult();
        }

        $(document).on('click','.showHideTable',function(e){
            var $this = $(this);
            var showed = $this.data('showed');
            var table;
            if($this.hasClass('showSubQButton'))
                table = $this.closest(".compositeQuestion").find(".compositeTable").eq(0);
            if($this.hasClass('showDescrButton'))
                table = $this.closest(".descriptiveQuestion").find(".descriptiveTable").eq(0);
            if($this.hasClass('showModuleButton'))
                table = $this.closest(".moduleDiv").find(".questionTable").eq(0);
            // table.toggle( "fold" );
            table.toggle( "slide" );
            if(showed == '0'){
                // table.show();
                //table.slideDown();
                $this.data('showed','1');
                $this.attr('src', tempPath + '/arrowUp.png');
            } else {
                // table.hide();
                //table.slideUp();
                $this.data('showed','0');
                $this.attr('src', tempPath + '/arrowDown.png');
            }
        });
        
    });

    $(document).on('click','#nullBtn',function(){
        $.ajax({
            url: '',
            type: 'post',
            data: { "nullifyTest": "blob", 
            "postID" : window.postID},
            success: function(data) {
                location.reload();
            }
        });
    });
    $(document).on('click', '.popupCloseBtn', function(){
        $(this).parent().hide();
    });

    $(document).on('click','.closeButton', function(){
        $(this).closest('.modal').modal('hide');
    });
    $('.closeButton').on('mouseenter', function(e) {
        $(this).attr('src',window.srcPath + '/img/close.png');
    });
    $('.closeButton').on('mouseleave', function(e) {
        $(this).attr('src',window.srcPath + '/img/closeD.png');
    });
    
    $(document).on('mouseenter','.deleteButton', function(e){
        $(this).attr('src',window.srcPath + '/img/close.png');
    });
    $(document).on('mouseleave','.deleteButton', function(e){
        $(this).attr('src',window.srcPath + '/img/closeD.png');
    });

});


function isInArray(el, arr){
    return arr!=null && el!=null && el in arr;
}