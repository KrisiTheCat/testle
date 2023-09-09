var $ = jQuery;
var style;
var colorsArr = [];
var currModules;
var currAtts;

function initStats(){
  style = getComputedStyle(document.body);
  colorsArr.push(style.getPropertyValue('--colorComposite'));
  colorsArr.push(style.getPropertyValue('--colorDarkText'));

  if(Object.keys(window.responsesKrisi).length <= 1){
    $('#stats').hide();
    $('#statsNoStud').removeClass('invisible');
    return;
  }

  initDataSource();

  currAtts = Object.keys(window.responsesKrisi);
  currModules = Object.keys(window.contentKrisi);
  currAtts.shift();
  initStatsWithTarget(currAtts, currModules);
}


function initStatsWithTarget(atts, modules){
  var [results,data] = getDataForTargetGroup(atts,modules);
  
  var statusC = Array(STATUS_COUNT). fill(0);
  var statusT = [{times:Array(STATUS_COUNT). fill(0),code:''},{times:Array(STATUS_COUNT). fill(0),code:''},{times:Array(STATUS_COUNT). fill(0),code:''},{times:Array(STATUS_COUNT). fill(0),code:''}];

  for(modID of modules){
    analiseData(data[modID], statusC, statusT, modID);
  }
  initWCNchart(statusC);
  bestWorstQuestion(statusT);
  initRankings(results, modules);

  $('.statsSummaryBox').first().find('p').first().html(atts.length);
  $('.statsSummaryBox').first().find('p').eq(1).html(`of ${Object.keys(window.responsesKrisi).length-1}`);
}

function initDataSource(){
  $(".ui.dropdown").dropdown();
  var text = "", groups = [];
  $.each(window.responsesKrisi, function(user, test){
    if(user != 0){
      for(var i = 0; i < window.usersKrisi[user]['groups'].length; i++){
        window.usersKrisi[user]['groups'][i] = window.usersKrisi[user]['groups'][i].trim();
          if(!groups.includes(window.usersKrisi[user]['groups'][i])){
              groups.push(window.usersKrisi[user]['groups'][i]);
          }
      }
    }
  });
  text ='';
  for(var i = 0; i < groups.length; i++){
    text += `<option value="${groups[i]}">${groups[i]}</option>`;
  }
  $('#statsGroup').html(text);
  text = `<option value="-1">All modules</option>`;
  for(var i = 0; i < window.contentKrisi.length; i++){
    text += `<option value="${i}">Module ${i+1}</option>`;
  }
  $('#statsModules').html(text);

  $('#statsGroup').on('change', function() {
    currAtts = convertValueGroups(this.value);
    initStatsWithTarget(currAtts, currModules);
  });
  $('#statsModules').on('change', function() {
    currModules = convertValueModules(this.value);
    initStatsWithTarget(currAtts, currModules);
  });
}

function convertValueGroups(target){
  var ans = [];
  $.each(window.responsesKrisi, function(user, test){
    if(user != 0){
      for(var i = 0; i < window.usersKrisi[user]['groups'].length; i++){
        if(window.usersKrisi[user]['groups'][i].trim() == target){
          ans.push(user);
        }
      }
    }
  });
  return ans;
}
function convertValueModules(target){
  if(target == -1){
    return Object.keys(window.contentKrisi);
  }
  return [target];
}

function initRankings(results, modules){
  results = (results).sort((x, y) => y.allPoints - x.allPoints);
  $('.statsGeneralBox').first().find('p').first().html(results.length);
  var maxAmountPoss = maxPoints(window.contentKrisi);
  var average = 0;

  const data = {
    labels: [],
    datasets: []
  };

  for(moduleArrID in results[0].points){
    data.datasets.push({
      label: `Module ${parseInt(modules[moduleArrID])+1}`,
      data: [],
      backgroundColor: colorsArr[moduleArrID % colorsArr.length],
      borderRadius: 3,
    });
  }
  for(query of results){
    for(moduleArrID in query.points){
      data.datasets[moduleArrID].data.push(query.points[moduleArrID]);
    }
    data.labels.push(window.usersKrisi[query.attID].name);
    average += query.allPoints;
  }

  const graficData = {
    type: 'bar',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      tooltips: {
          callbacks: {
             label: function(tooltipItem) {
                    return tooltipItem.yLabel;
             }
          }
      },
      scales: {
        x: {
          display: false,
          stacked: true,
        },
        y: {
          min: 0,
          max: maxAmountPoss,
          stacked: true,
        }
      }
    },
  };
  $('#allAttendeesResults').html('<canvas></canvas>')
  new Chart(document.getElementById('allAttendeesResults').getElementsByTagName('canvas')[0], graficData);

  
  $('.statsSummaryBox').last().find('p').first().html((average/results.length).toFixed(2));
  $('.statsSummaryBox').last().find('p').eq(1).html(`of ${maxAmountPoss}`);
  
  var percentPassed = 0;
  text = `<tr>
            <th>#</th>
            <th>Name</th>
            <th>Success rate</th>
            <th>Points</th>
          </tr>`;
  for(var i = 0; i < Math.min(results.length,5); i++){
    text += `<tr>
        <td>${i+1}</td>
        <td>${window.usersKrisi[results[i].attID].name}</td>
        <td>
          <div class="progress">
            <div class="progress-bar" style="width:${Math.round(results[i].allPoints*100/maxAmountPoss)}%" role="progressbar" aria-valuenow="15" aria-valuemin="0" aria-valuemax="100"></div>
          </div>
        </td>
        <td><p>${results[i].allPoints} pts</p></td>
      </tr>`;
      if(results[i].allPoints >= maxAmountPoss*0.6) percentPassed++;
  }
  $('.rankingStats').first().find('tbody').first().html(text);
  $('#percentPassed').find('h4').html(Math.round(percentPassed*100/results.length) + '%');

  text = `<tr>
            <th>#</th>
            <th>Name</th>
            <th>Success rate</th>
            <th>Points</th>
          </tr>`;
  var startId = results.length-1;
  for(var i = startId; i >= Math.max(0, startId-5); i--){
    text += `<tr>
        <td>${i+1}</td>
        <td>${window.usersKrisi[results[i].attID].name}</td>
        <td>
          <div class="progress">
            <div class="progress-bar" style="width:${Math.round(results[i].allPoints*100/maxAmountPoss)}%" role="progressbar" aria-valuenow="15" aria-valuemin="0" aria-valuemax="100"></div>
          </div>
        </td>
        <td><p>${results[i].allPoints} pts</p></td>
      </tr>`;
  }
  $('.rankingStats').last().find('tbody').first().html(text);
}

function initWCNchart(data){
  var sum = data[0]+data[1]+data[2];
  console.log(data);
  const graficData = {
    type: 'bar',
    data: {
      labels: ["Correct","Wrong", "Not filled"],
      datasets: [{
        label: "",
        data: [data[1]*100/sum,data[0]*100/sum,data[2]*100/sum],
        backgroundColor: [
          style.getPropertyValue('--colorWrong'),
          style.getPropertyValue('--colorCorrect'),
          style.getPropertyValue('--colorNotFilled'),
        ],
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis:'y',
      scales: {
        x: {
          min: 0,
          max: 100,
          beginAtZero: true
        },
        y: {
          min: 0,
          max: 100,
          beginAtZero: true
        }
      },
      plugins: {
        legend: {
            display: false,
        }
      }
    },
  };
  $('.questionGeneral').find('div').first().html('<canvas></canvas>')
  new Chart(document.getElementsByClassName('questionGeneral')[0].getElementsByTagName('canvas')[0], graficData);
}

function bestWorstQuestion(dataG){
    bestWorstQuestionEinzel(dataG[1], 1, 'Correct', '--colorCorrect', document.getElementById('easiestQuestion'));
    bestWorstQuestionEinzel(dataG[0], 0, 'Wrong', '--colorWrong', document.getElementById('hardestQuestion'));
    bestWorstQuestionEinzel(dataG[2], 2, 'Empty', '--colorNotFilled', document.getElementById('skippedQuestion'));
}
function bestWorstQuestionEinzel(dataG, index, label, color, div){
  if(dataG.code.length < 1){
    $(div).hide();
    return;
  }
  dataG.sum = dataG.times[0] + dataG.times[1] + dataG.times[2];
  const doughnutLabel = {
    id: 'doughnutLabet' ,
    beforeDatasetsDraw(chart, args ,pluginOptions) {
      const { ctx, data } = chart;
      ctx.save();
      const xCoor = chart.getDatasetMeta(0).data[0].x;
      const yCoor = chart.getDatasetMeta(0).data[0].y;
      ctx.font = 'bold 16px sans-serif';
      ctx. fillStyle = style.getPropertyValue('--colorGrayText');
      ctx. textAlign = 'center';
      ctx. textBasetine = 'middle';
      ctx. fillText( Math.round(dataG.times[index]*100/dataG.sum)+"%", xCoor, yCoor);
    }
  }
  const questionData = {
    type: 'doughnut',
    data: {
      labels: [label, 'Other'],
      datasets: [{
        label: 'times',
        data: [dataG.times[index], dataG.sum-dataG.times[index]],
        backgroundColor: [
          style.getPropertyValue(color),
          style.getPropertyValue('--colorGrayText'),
        ],
        borderWidth: 1,
        cutout:'70%',
        circumference: 180,
        rotation: 270,
      }],
    },
    options: {
      aspectRatio: 2,
      plugins: {
        legend: {
            display: false,
            position: 'left',
        }
      }
    },
    plugins:[doughnutLabel]
  };
  $(div).find('div').first().html('<canvas></canvas>');
  new Chart(div.getElementsByTagName('canvas')[0], questionData);
  $(div).find('p').first().html(codeToString(dataG.code));
  $(div).find('p').last().html(`${dataG.times[index]} of ${dataG.sum} ${label.toLowerCase()}`);
}

function getDataForTargetGroup(atts, modules){
    var data = {};
    var results = [];
    var temp;
    for(attID of atts){
      temp = {attID: attID, points: [], allPoints: 0}
      for(modID of modules){
        var [sum, result] = collectWCN(window.responsesKrisi[attID][modID], window.contentKrisi[modID]);  
        temp.points.push(sum);
        temp.allPoints += sum;
        if(typeof data[modID] == 'undefined') data[modID] = result;
        else data[modID] = sumRecursive(data[modID], result);
      }
      results.push(temp)
    }
    return [results,data];
}

function collectWCN(respQ, contQ){
    var results = [];
    var sum = 0, sumT;
    for(var i = 0; i < contQ.subq.length; i++){
        switch(contQ.subq[i].type){
        case 'Composite':
            [sumT, results[i]] = collectWCN(respQ.subq[i], contQ.subq[i]);
            sum += sumT;
            break;
        case 'Descriptive':
            results[i] = Array(STATUS_COUNT). fill(0);
            var temp = Array(STATUS_COUNT). fill(0);
            // console.log(contQ.subq[i]);
            for(var j = 0; j < contQ.subq[i].subq.length; j++){
                temp[respQ.subq[i].subq[j].status]++;
                if(respQ.subq[i].subq[j].status == 1) sum += contQ.subq[i].subq[j].points;
            }
            if(temp[0] > temp[1] && temp[0] > temp[2]){ results[i][0]++; }
            else if(temp[1] > temp[0] && temp[1] > temp[2]){ results[i][1]++; }
            else{ results[i][2]++; }
            break;
        default:
            results[i] = Array(STATUS_COUNT). fill(0);
            results[i][respQ.subq[i].status]++;
            if(respQ.subq[i].status == 1) sum += contQ.subq[i].points;
        }
    }
    return [sum, results];
}

function analiseData(data, statusC, statusT, code){
    if(data.some((element) => Array.isArray(element))){
        for(var i = 0; i < data.length; i++){
            analiseData(data[i], statusC, statusT, code + '_' + i);
        }
    }
    else{
      for(var i = 0; i < STATUS_COUNT; i++){
        if(statusT[i].times[i] < data[i]){
          statusT[i].times = data;
          statusT[i].code = code;
        }
        statusC[i] += data[i];
      }
    }
}

function sumRecursive(a, b){
    if(Array.isArray(a)){
        for(var i = 0; i < a.length; i++){
            a[i] = sumRecursive(a[i], b[i]);
        }
        return a;
    }
    else{
        return a+b;
    }
}
