var $ = jQuery;
var attendeesFormated=[];

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
    if(attendeesFormated.length == 0){
      $('#attendees').find('.noSuchText').show();
      $('#attendees').find('.attendeesTable').hide();
    }
    else {
      importToTable();
    }
}

function sortAttInGroups(){
    
    attendeesFormated = [];
    for(attID in window.responsesKrisi){
        if(attID!=0){
            attendeesFormated.push({
                "name":window.usersKrisi[attID].name,
                "status":getStatus(window.responsesKrisi[attID]),
                "result":calcPoints(window.responsesKrisi[attID], window.contentKrisi),
                "actions": attID
            });
        }
    }
}

function getStatus(response){
  /* return Object.values(ATTENDEE_STATUS)[Math.floor(Object.keys(ATTENDEE_STATUS).length * Math.random())]; */
  if(!response['images'] || window.pageInfo.length != response['images'].length){
      return ATTENDEE_STATUS.NO_PHOTO;
  }
  if(containsToBeChecked(response)){
      return ATTENDEE_STATUS.CHECKING;
  }
  return ATTENDEE_STATUS.FINISHED;
}

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

function importToTable(){
     
     const tableContent = document.getElementById("table-content")
     const tableButtons = document.querySelectorAll("th button");
     
     const createRow = (obj) => {
        const row = document.createElement("tr");
        const objKeys = Object.keys(obj);
        objKeys.map((key) => {
          const cell = document.createElement("td");
          cell.setAttribute("data-attr", key);
          if(key == 'actions'){
            cell.innerHTML = `<a href="../check/?attendee=${obj[key]}" class="checkResponse" ></a>`;
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
       data.map((obj) => {
         const row = createRow(obj);
         tableContent.appendChild(row);
       });
     };
     
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
     
     window.addEventListener("load", () => {
       getTableContent(attendeesFormated);
     
       [...tableButtons].map((button) => {
         button.addEventListener("click", (e) => {
           resetButtons(e);
           if (e.target.getAttribute("data-dir") == "desc") {
             sortData(attendeesFormated, e.target.id, "desc");
             e.target.setAttribute("data-dir", "asc");
           } else {
             sortData(attendeesFormated, e.target.id, "asc");
             e.target.setAttribute("data-dir", "desc");
           }
         });
       });
     });
     
}

