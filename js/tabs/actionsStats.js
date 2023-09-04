var $ = jQuery;

function initStats(){


  var modules = [0];
  var pointsArr = {};
  var data = getDataForTargetGroup([2,4],modules);
  
  var statusC = Array(STATUS_COUNT). fill(0);
  var statusT = [{times:Array(STATUS_COUNT). fill(0),code:''},{times:Array(STATUS_COUNT). fill(0),code:''},{times:Array(STATUS_COUNT). fill(0),code:''},{times:Array(STATUS_COUNT). fill(0),code:''}];

  for(modID of modules){
    analiseData(data[modID], statusC, statusT, modID);
  }
  console.log(statusC, statusT);
  initWCNchart(statusC);
  bestWorstQuestion(statusT);
    
}

function initWCNchart(data){
    var style = getComputedStyle(document.body);
    const dataDoughnut = {
      type: 'doughnut',
      data: {
        labels: ['Correct', 'Wrong', 'Not Filled'],
        datasets: [
          {
            label: 'percent',
            data: [data[1], data[0], data[2]],
            backgroundColor: [
              style.getPropertyValue('--colorCorrect'),
              style.getPropertyValue('--colorWrong'),
              style.getPropertyValue('--colorNotFilled'),
            ],
          },
        ],
      },
      options: {
          aspectRatio:1.7,
          plugins: {
              legend: {
                  display: true,
                  position: 'left',
              }
          }
      },
    };
    new Chart(document.getElementById('doughnutWCN'), dataDoughnut);
}

function bestWorstQuestion(data){
    //TODO
    var style = getComputedStyle(document.body);

    const easiestQuestionData = {
        type: 'doughnut',
        data: {
          labels: ['Correct', 'Wrong', 'Not Filled'],
          datasets: [
            {
              label: 'times',
              data: [data[1].times[1], data[1].times[0], data[1].times[2]],
              backgroundColor: [
                style.getPropertyValue('--colorCorrect'),
                style.getPropertyValue('--colorGrayText'),
                style.getPropertyValue('--colorGrayText'),
              ],
            },
          ],
        },
        options: {
            aspectRatio:2.3,
            plugins: {
                legend: {
                    display: true,
                    position: 'right',
                }
            }
        },
    };
    new Chart(document.getElementById('easiestQuestion'), easiestQuestionData);

    const hardestQuestionData = {
        type: 'doughnut',
        data: {
          labels: ['Correct', 'Wrong', 'Not Filled'],
          datasets: [
            {
              label: 'times',
              data: [data[0].times[1], data[0].times[0], data[0].times[2]],
              backgroundColor: [
                style.getPropertyValue('--colorGrayText'),
                style.getPropertyValue('--colorWrong'),
                style.getPropertyValue('--colorGrayText'),
              ],
            },
          ],
        },
        options: {
            aspectRatio:2.3,
            plugins: {
                legend: {
                    display: true,
                    position: 'right',
                }
            }
        },
    };
    new Chart(document.getElementById('hardestQuestion'), hardestQuestionData);

    const skippedQuestionData = {
        type: 'doughnut',
        data: {
          labels: ['Correct', 'Wrong', 'Not Filled'],
          datasets: [
            {
              label: 'times',
              data: [data[2].times[1], data[2].times[0], data[2].times[2]],
              backgroundColor: [
                style.getPropertyValue('--colorGrayText'),
                style.getPropertyValue('--colorGrayText'),
                style.getPropertyValue('--colorNotFilled'),
              ],
            },
          ],
        },
        options: {
            aspectRatio:2.3,
            plugins: {
                legend: {
                    display: true,
                    position: 'right',
                }
            }
        },
    };
    new Chart(document.getElementById('skippedQuestion'), skippedQuestionData);
}

function getDataForTargetGroup(atts, modules){
    var data = {};
    var results = {};
    for(attID of atts){
      results[attID] = {'-1':0};
      for(modID of modules){
        var [sum, result] = collectWCN(window.responsesKrisi[attID][modID], window.contentKrisi[modID]);  
        results[attID][modID] = sum;
        results[attID][-1] += sum;
        if(typeof data[modID] == 'undefined') data[modID] = result;
        else data[modID] = sumRecursive(data[modID], result);
      }
    }
    console.log(results);
    console.log(data);
    return data;
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
