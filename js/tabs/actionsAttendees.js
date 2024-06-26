var $ = jQuery;
var attendeesFormated=[];

function initAttendees(){

    refreshAttendees();
    initTableActions();
    uploadPdfForAll();
    answerTemplateInit();
    batchImport();
}

function refreshAttendees(){
    sortAttInGroups();
    if(attendeesFormated.length == 0){
      $('#attendees').find('.noSuchText').show();
    }
    else {
      $('#attendees').find('.noSuchText').hide();
    }
    [...attendeesFormated].sort(function (a, b) {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    })
    console.log(attendeesFormated);
    importToTable();
}

function sortAttInGroups(){
    
    attendeesFormated = [];
    for(attID in window.responsesKrisi){
        if(attID!=0){
            attendeesFormated.push({
                "id":attID,
                "name":window.usersKrisi[attID].name,
                "status":getStatus(window.responsesKrisi[attID]),
                "result":calcPoints(window.responsesKrisi[attID], window.contentKrisi),
                "actions": attID
            });
        }
    }
    var temp;
    for(var i = 0; i < attendeesFormated.length; i ++){
      for(var j = i+1; j < attendeesFormated.length; j ++){
        if((window.usersKrisi[attendeesFormated[i].id].name).localeCompare((window.usersKrisi[attendeesFormated[j].id].name))>0){
          temp = attendeesFormated[i];
          attendeesFormated[i] = attendeesFormated[j];
          attendeesFormated[j] = temp;
        }
      }
    }
}

function getStatus(response){
  /* return Object.values(ATTENDEE_STATUS)[Math.floor(Object.keys(ATTENDEE_STATUS).length * Math.random())]; */
  if(!response['images'] || window.pageInfo.length != Object.keys(response['images']).length){
      return ATTENDEE_STATUS.NO_PHOTO;
  }
  console.log(containsToBeChecked(response));
  if(containsToBeChecked(response)){
      return ATTENDEE_STATUS.CHECKING;
  }
  return ATTENDEE_STATUS.FINISHED;
}

$(document).on('click','#exportAttBtn', function(){
    var data = [["Name"]];
    for(var m = 0; m < window.contentKrisi.length; m++){
      data[0].push(`Module ${m+1}`);
    }
    data[0].push("Total");
    for(user of attendeesFormated){
      var arr = [user.name];
      for(var m = 0; m < window.contentKrisi.length; m++){
        arr.push(calcPoints(window.responsesKrisi[user.id][m], window.contentKrisi[m]));
      }
      arr.push(user.result);
      data.push(arr);
    }

    var wb = XLSX.utils.book_new();
    wb.SheetNames.push("results");
    wb.Sheets["results"] = XLSX.utils.aoa_to_sheet(data);
    XLSX.writeFile(wb, "results.xlsx");
});

function importToTable(){
    const tableContent = document.getElementById("table-content");
    const tableButtons = document.querySelectorAll("th button");
    $(tableContent).html('');
     
    const createRow = (obj) => {
      const row = document.createElement("tr");
      const objKeys = Object.keys(obj);
      objKeys.map((key) => {
        if(key == 'id'){
          	return;
        }
        const cell = document.createElement("td");
        cell.setAttribute("data-attr", key);
        if(key == 'name'){
          cell.innerHTML = `<a href="/my-profile/?uid=${obj.id}">${obj[key]}</a>`;
        } 
        else if(key == 'actions'){
          cell.innerHTML = `<a href="../check/?attendee=${obj[key]}">
              <img class="checkResponse" src="${window.srcPath}/img/checkIcon.png" /></a>
            <img src="${window.srcPath}/img/iconStatus0.png" class="deleteButton deleteAttendee" data-attid="${obj.id}"/>`;
        } 
        else if(key == 'status'){
          cell.innerHTML = `<p class="${ATTENDEE_STATUS_DATA[obj[key]].class} attendeeStatus" >${ATTENDEE_STATUS_DATA[obj[key]].label}</a>`;
        } 
        else{
          cell.innerHTML = obj[key];
        }
        row.appendChild(cell);
      });
      return row;
    };
     
    const getTableContent = (data) => {
      $(`<tr>
        <td colspan="4" style="display:table-cell;">
          <div style="display: flex; gap: 10px;">
            <input type="text" placeholder="Start typing a name" id="newAttendeeInput" class="ui-autocomplete-input" autocomplete="off">
            <p id="addAttendeeBtn" class="addNewButton">+</p>
          </div>
        </td>
      </tr>`).appendTo($(tableContent));
      data.map((obj) => {
        const row = createRow(obj);
        tableContent.appendChild(row);
      });
    };

     
    setTimeout(() => {
      const names = [];
      Object.values(window.usersKrisi).forEach((user) => {
        if(user.roles.includes('student') && !(user.id in window.responsesKrisi)){
          names.push(user.name);
        }
      });
      $("#newAttendeeInput").unbind().autocomplete({
        minLength: 0,
        source: names,
        select:function(event,ui){
          $("#newAttendeeInput").val(ui.item.label); 
          return false;
        },
        change: function(event, ui) {
          if (ui.item == null) {
            this.setCustomValidity("You must select an attendee");
          }
        }});
    },1000);
     
    const sortData = (data, param, direction = "asc") => {
      tableContent.innerHTML = '';
      const sortedData =
        direction == "asc"
          ? [...data].sort(function (a, b) {
              if (a[param] < b[param]) {
                return -1;
              }
              if (a[param] > b[param]) {
                return 1;
              }
              return 0;
            })
          : [...data].sort(function (a, b) {
              if (b[param] < a[param]) {
                return -1;
              }
              if (b[param] > a[param]) {
                return 1;
              }
              return 0;
            });
    
      getTableContent(sortedData);
    };
     
    const resetButtons = (event) => {
      [...tableButtons].map((button) => {
        if (button !== event.target) {
          button.removeAttribute("data-dir");
        }
      });
    };
     
    getTableContent(attendeesFormated);
  
    [...tableButtons].map((button) => {
      button.addEventListener("click", (e) => {
        resetButtons(e);
        if(e.target.id!='actions')
        if (e.target.getAttribute("data-dir") == "desc") {
          sortData(attendeesFormated, e.target.id, "desc");
          e.target.setAttribute("data-dir", "asc");
        } else {
          sortData(attendeesFormated, e.target.id, "asc");
          e.target.setAttribute("data-dir", "desc");
        }
      });
    });
     
}

function initTableActions(){
  $(document).on('click', '.deleteAttendee', function(){
    $('#youSureDeleteAtt').modal('show');
    var attendeeID = $(this).data('attid');
    $(document).on('click', '#deleteAttendeeConfirm', function(){
      $.ajax({
        url: '',
        type: 'post',
        data: {"callResponseEditFunction": "removeAttendee", 
                "postID" : window.postID,
                "attendeeID" : attendeeID},
        success: function(data) {
            window.responsesKrisi = JSON.parse(data['responses']);
            console.log(window.responsesKrisi);
            $('#youSureDeleteAtt').modal('hide');
            refreshAttendees();
        }
      });
    });
  });
  $(document).on('click', '#addAttendeeBtn', function(){
    var attendeeID = -1;
    var searchFor = $('#newAttendeeInput').val().trim();
    for (const stud in window.usersKrisi) {
      if (window.usersKrisi[stud].name == searchFor) {
        attendeeID = window.usersKrisi[stud].id;
      }
    }
    if(attendeeID != -1){
      if(attendeeID in window.responsesKrisi){
        toastr.error("Already added");
      }
      else if(!window.usersKrisi[attendeeID].roles.includes('student')){
        toastr.error("Not a student");
      }
      else {
        $.ajax({
          url: '',
          type: 'post',
          data: {"callResponseEditFunction": "addAttendee", 
                  "postID" : window.postID,
                  "attendeeID" : attendeeID},
          success: function(data) {
              window.responsesKrisi = JSON.parse(data['responses']);
              refreshAttendees();
          }
        });
      }
    }
  });
}


function batchImport(){

  $(document).on('click', '#batchImportBtn', function(){
    var names = $('#batchImportInput').val().split('\n');
    console.log(names);
    for(var name of names){
      var attendeeIDa = -1;
      for(var userID in window.usersKrisi){
        if(window.usersKrisi[userID].name == name){
          attendeeIDa = window.usersKrisi[userID].id;
          break;
        }
      }
      console.log(attendeeIDa);
        $.ajax({
          url: '',
          type: 'post',
          data: {"callResponseEditFunction": "addAttendee", 
                  "postID" : window.postID,
                  "attendeeID" : attendeeIDa},
          success: function(data) {
              window.responsesKrisi = JSON.parse(data['responses']);
              //refreshAttendees();
            }
          });
        }
        console.log(window.responsesKrisi);
        refreshAttendees();
  });
}


function uploadPdfForAll(){

  var thePDF, numPages, pdf_url, dataURLs;

  $(document).on('click', '#uploadAllAttBtn', function(){
    $('#uploadAllAttInput').click();
  });

  $(document).on('change', '#uploadAllAttInput', function(){
    if(['application/pdf'].indexOf($("#uploadAllAttInput").get(0).files[0].type) == -1) {
        toastr.error("Not a PDF");
        return;
    }
    if($("#uploadAllAttInput")[0].files.length != 1) {
        toastr.error("Too many files");
        return;
    }
    pdf_url = URL.createObjectURL($("#uploadAllAttInput").get(0).files[0]);
    PDFJS.getDocument(pdf_url).then(function(pdf) {
        thePDF = pdf;
        numPages = pdf.numPages;
        if(numPages != (Object.keys(window.responsesKrisi).length-1)*window.pageInfo.length) {
            toastr.error("Not correct number of pages!");
            return;
        }
        currPage = 1;
        dataURLs = [];
        thePDF.getPage(currPage).then( handlePDFforAllPages );
        $('#popupBatchUpload').modal('show');
        //showLoader();
    }).catch(function(error) {
        alert(error.message);
    });
  });

  var batchTasksDone = 0, percent;
  function batchUploadTaskDone(){
    batchTasksDone++;
    percent = Math.ceil(batchTasksDone/(numPages*2)*100);
    $('#batchProgressNumber').html(percent+"%");
    $('#popupBatchUpload').find('.progress-bar').width(percent+"%");
  }

  function handlePDFforAllPages(page){
    var canvas = $('#imageCanvas').get(0);
    var pageRendering = drawPageInCanvas(page,canvas, false);
    pageRendering.promise.then(function(){
        var targetCanvas = document.getElementById('imageCanvas2');
        var targetCtx = targetCanvas.getContext("2d");

        targetCanvas.height = canvas.height;
        targetCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height);
        var attendeeID = attendeesFormated[(currPage-1)/window.pageInfo.length].id;
        $('#batchCurrentTask').html('Currently: uploading PDF for '+window.usersKrisi[attendeeID].name);
        batchUploadTaskDone();
        cutPDFPage(canvas, 1, find4Edges3(targetCanvas), attendeeID, (image)=>{
          batchUploadTaskDone();
          $('#batchCurrentTask').html('Currently: checking '+window.usersKrisi[attendeeID].name + '\'s work');
          extractFromPage(attendeeID,image, (currPage-1)%window.pageInfo.length, false);
        });
        
        currPage++;
        if ( thePDF !== null && currPage <= numPages ){
            thePDF.getPage( currPage ).then( handlePDFforAllPages );
        }
        if(currPage == numPages+1){  
           // location.reload();
        }
    });
  }
}