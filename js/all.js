/**
 * Getting JSON List and Progress Status Info function
 * The info of Clicking Progress Bar Event from JSON List
 * @param {*} path //JSON List Path
 * @returns
 */
function getJSONList(path, productTypeIndex = 0) {

  const productType = ["nips", "sg", "iona"];
  let statusDetail;
  let productCount = 3;
  /* Asynchronous ajax */
  let xhr = $.getJSON(path, function (data) {
    let fileTime = String(new Date(xhr.getResponseHeader("Last-Modified")));
    let res = fileTime.split(" ");
    let numberMonth = ("JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(res[1]) / 3 + 1);
    let updatedTime = res[3] + "/" + numberMonth + "/" + res[2] + " " + res[4];

    let dataStringty = JSON.stringify(data);

    localStorage.setItem(productType[productTypeIndex], dataStringty);

    getProgressStatus(data, productTypeIndex);
    statusDetail = getStatusDetail(data, productTypeIndex);
    // clickProgressIcon(statusDetail, data);
    $("." + productType[productTypeIndex] + "-updatedTime").html("Last Updated Time: " + updatedTime);

    modifyDurationTime(data, productType[productTypeIndex] + "-");
    setTimeout(function () {
      getJSONList(path, productTypeIndex);
    }, 60000);
    console.log("getJSONList running");

  });
}

/**
 * Function of modifing sample run duration time or initing it
 *
 * @param {Array of JSON} JSONList
 * @param {Product} productType
 */
function modifyDurationTime(JSONList, productType) {
  // console.log("test2");
  let temp = JSONList;
  // temp = JSON.parse(JSONList);
  let newDate = new Date();
  let second = ("0" + newDate.getSeconds()).slice(-2);

  Object.keys(temp).forEach(function (sampleRun, index) {

    if (typeof (temp[sampleRun].timeUsed) == "undefined") { //adding time-used class and text if its type is undefined!
      $("#" + productType + "timeUsed" + index).find("span").removeClass("badge-dark").addClass("badge-warning");
      $("#" + productType + "timeUsed" + index).find("span").text("00:00:00");
    } else {
      let durationHour = temp[sampleRun].totalTime.split(":")[0];

      if (durationHour >= 12) { //adding warning class if its duration time over half a day
        $("#" + productType + "timeUsed" + index).find("span").removeClass("badge-dark").addClass("badge-danger");
      }

      // $("#" + productType + "timeUsed" + index).find("span").text(temp[sampleRun].totalTime);
    }
  });
}

function movePseudoClock(productType, objectName) {

  setTimeout(function () {
    movePseudoClock(productType, objectName);
  }, 1050);

  let dataStorage = JSON.parse(localStorage.getItem(productType), objectName);
  let dataStorageString = [];
  let count = 0;

  for (let index = dataStorage.length - 12; index < dataStorage.length; index++) {
    let timeClock = dataStorage[index][objectName];
    // console.log(dataStorage[index][objectName]);

    // console.log(timeClock);
    if (dataStorage[index].closed == 0 || dataStorage[index].closed == "") {
      let hours = parseInt(("0" + timeClock.split(":")[0]).slice(-2));
      let mins = parseInt(("0" + timeClock.split(":")[1]).slice(-2));
      let seconds = parseInt(("0" + timeClock.split(":")[2]).slice(-2));
      let newPseudoClock;
      console.log(timeClock);
      seconds += 1;

      if (seconds >= 60) {
        seconds = seconds - 60;
        mins += 1;
      }

      if (mins >= 60) {
        mins = mins - 60;
        hours += 1;
      }
      mins = ("0" + mins).slice(-2);
      seconds = ("0" + seconds).slice(-2);
      hours = ("0" + hours).slice(-2);
      newPseudoClock = hours + ":" + mins + ":" + seconds;

      $("#" + productType + "-timeUsed" + index).find("span").text(newPseudoClock);

      dataStorage[index].totalTime = newPseudoClock;
    } else {
      $("#" + productType + "-timeUsed" + index).find("span").text(timeClock);

    }

    dataStorageString[count] = dataStorage[index];
    count += 1;
  }

  localStorage.setItem(productType, JSON.stringify(dataStorageString));
}


/**
 * select the description in every step
 *
 * @param {*} iconInfo
 * @returns product and its step description
 */
function selectStepID(iconInfo) {

  const productStep = {
    nips: {
      step1: 'Sequenced',
      step2: 'Analyzed',
      step3: 'Transferred to Dell',
      step4: 'Converted to Fastq',
      step5: 'Transferred to Cloud',
      step6: 'Transferred to Comp.Node',
      step7: 'Job submitted',
      step8: 'Job completed',
      step9: 'Report Transferred to Dell',
    },
    sg: {
      step1: 'Sequenced',
      step2: 'Analyzed',
      step3: 'Transferred to Dell',
      step4: 'Converted to Fastq',
      step5: 'Transferred to Cloud',
      step6: 'Transferred to Comp.Node',
      step7: 'Job submitted',
      step8: 'Job completed',
      step9: 'Report Transferred to Dell',
    },
    iona: {
      step1: 'Sequenced',
      step2: 'Analyzed',
      step3: 'Transferred to Dell',
      step4: 'Converted to Fastq',
      step5: 'Transferred to Cloud',
      step6: 'Transferred to Comp.Node',
      step7: 'Job submitted',
      step8: 'Job completed',
      step9: 'Report Transferred to Dell',
    }
  };

  return productStep[iconInfo.productType][iconInfo.iconStepId];
}

/**
 * click progress icon and adding collapsed class and changing their info
 *
 * @param {*} statusDetail
 */
function clickProgressIcon(product) {
  // console.log(statusDetail);

  $('.step-body').click(function (event) {
    let data = JSON.parse(localStorage.getItem(product));
    // console.log(data);

    let id = $(this).parents('div').attr('id').split('-progressId')[1];
    let productType = $(this).parents('div').attr('id').split('-progressId')[0];
    // console.log(productType);


    $(this).parents().find('#collapseStepInfo' + id).children().empty(); //empty their class and content

    let iconStepId = $(this).attr('id').split('icon-')[1];
    let iconInfo = {
      productType: productType,
      id: id,
      iconStepId: iconStepId,
    };

    let selectedID = selectStepID(iconInfo);
    let collapaseContent = 'Indicated Step: ' + selectedID;
    let currentStatus = "Status: " + $(this).parents("table").attr('data-step-status');
    let currentStatusDetail = $(this).parents("td").attr('data-step');
    let currentStatusTimeName = currentStatusDetail + "Time";
    let collapseStatusDetail = "";
    let currentStatusTime = data[id][currentStatusTimeName];
    let sampleRunNumber = $(this).parents('.div-progress').find('.row-sampleRun').length;

    Object.keys(data[id]).some(function (key) { //loop to find progress key and value
      // console.log(id);
      // console.log(key);
      if (key == currentStatusDetail && data[id][key].match(/\d+\/\d+/)) {
        // console.log(statusDetail[id][key]);
        collapseStatusDetail = "Data Info: " + data[id][key];
        return;
      }
    });


    /* NOTE adding collapsed Content and changing class*/
    $(this).parents().find('#collapseStepInfo' + id).children().html("<div class='col-6 text-left'><h6>" + collapaseContent + "</h6></div>");
    $(this).parents().find('#collapseStepInfo' + id).children().append("<div class='col-6 text-right' id='contentStatus'><h6 class='step-duration'>Step Duration: " + currentStatusTime + "</h6><h6>" + collapseStatusDetail + "</h6><h6> " + currentStatus + "</h6></div>");
    // $(this).parents().find('#collapseStepInfo' + id).children().text(collapaseContent);

    for (let i = 0; i < sampleRunNumber; i++) {
      if (id != i) {
        $(this).parents().find('#collapseStepInfo' + i).removeClass('show');
      }
    }

    if (
      $(this).parents().find('#collapseStepInfo' + id).val() != '' && $(this).parents().find('#collapseStepInfo' + id).val() != $(this).attr('id')) {

      $(this).parents().find('#collapseStepInfo' + id).val($(this).attr('id'));
      $(this).parents().find('#collapseStepInfo' + id).removeClass('show');

      // console.log($(this).parents("div").attr('id') + " " + $(this).parents().find("#collapseStepInfo" + id).val());
    } else {
      $(this).parents().find('#collapseStepInfo' + id).val($(this).attr('id'));
      // console.log($(this).parents().find('#collapseStepInfo' + id).val());
    }


  });
}

/**
 * Changing Progress Status
 *
 * @param {*} [progressContent=data]
 * @param {number} [productTypeIndex=1]
 */
function getProgressStatus(progressContent = data, productTypeIndex = 1) {

  const productType = ["#nips", "#sg", "#iona"];
  let regexp = /(\d+)\/(\d+)/;

  //NOTE To determine which run-stauts was Pending, Pass, Fail and Active and show in the collapsed content
  progressContent.forEach(function (sampleRun, index) {
    $(productType[productTypeIndex] + '-runId' + index).text(sampleRun.runid);

    if (sampleRun.closed == 0) { //fail, active or pending progress info added

      if (sampleRun.sequenced == 0 && sampleRun.error == 0) { //pending progress info added
        $(productType[productTypeIndex] + "-progressId" + index).find(".stepbar-progress").attr("data-current-step", "sequenced");
        $(productType[productTypeIndex] + "-progressId" + index).find(".stepbar-progress").attr("data-step-status", "pending");

        // movePseudoStepClock(productType[productTypeIndex].split("#")[1], "sequencedTime");
        return;
      }
      if (sampleRun.error == 1) { //fail progress info added
        let failStep;
        Object.keys(sampleRun).some(function (key) { //loop to find "fail" progress key and value
          if (sampleRun[key] == 0 && key != "error" && key != "closed") {
            failStep = key;
          }
        });
        $(productType[productTypeIndex] + "-progressId" + index).find(".stepbar-progress").attr("data-current-step", failStep);
        $(productType[productTypeIndex] + "-progressId" + index).find(".stepbar-progress").attr("data-step-status", "fail");
      } else { //active progress info added
        let flag = 0;
        // console.log(sampleRun);

        Object.keys(sampleRun).some(function (key) {
          if (sampleRun[key] == 0 && key != "error" && key != "closed" && flag != 1) { //active
            // console.log(key + '=' + sampleRun[key]);
            $(productType[productTypeIndex] + "-progressId" + index).find(".stepbar-progress").attr("data-current-step", key);
            $(productType[productTypeIndex] + "-progressId" + index).find(".stepbar-progress").attr("data-step-status", "active");
            // console.log("null\t" + key + "\t" + sampleRun[key]);
            flag = 1;

          } else if (sampleRun[key].match(regexp) != null) {
            // console.log(sampleRun[key]);

            if (sampleRun[key].match(regexp)[1] != sampleRun[key].match(regexp)[2]) {
              // console.log(key);
              $(productType[productTypeIndex] + "-progressId" + index).find(".stepbar-progress").attr("data-current-step", key);
              $(productType[productTypeIndex] + "-progressId" + index).find(".stepbar-progress").attr("data-step-status", "active");

              flag = 1;
            }
          }
        });
      }
    } else { //pass progress info added
      // console.log($("#nips-progressId" + index).find(".stepbar-progress"));
      $(productType[productTypeIndex] + "-progressId" + index).find(".stepbar-progress").attr("data-current-step", "backtodell");
      $(productType[productTypeIndex] + "-progressId" + index).find(".stepbar-progress").attr("data-step-status", "pass");
    }
  });
}

/**
 * Getting Something Status Detail which showed the run numbers in Json List
 *
 * @param {*} [progressContent=data]
 * @param {number} [productTypeIndex=1]
 * @returns
 */
function getStatusDetail(progressContent = data, productTypeIndex = 1) {

  const productType = ["#nips", "#sg", "#iona"];
  let statusDetail = [];

  let regexp = /(\d+)\/(\d+)/;

  progressContent.forEach(function (sampleRun, index) {
    let incloudNumber = 0;
    let downloadedNumber = 0;
    let jobsubmittedNumber = 0;
    let jobcompletedNumber = 0;

    if (sampleRun.incloud.match(regexp)) { //if incloud matched the run numbers
      // console.log(sampleRun.incloud.match(regexp));
      incloudNumber = sampleRun.incloud.match(regexp)[0];
    }

    if (sampleRun.downloaded.match(regexp)) { //if downloaded matched the run numbers
      // console.log(sampleRun.downloaded.match(regexp));
      downloadedNumber = sampleRun.downloaded.match(regexp)[0];
      // console.log(downloadedNumber);
    }

    if (sampleRun.jobsubmitted.match(regexp)) { //if jobsubmitted matched the run numbers
      // console.log(sampleRun.jobsubmitted.match(regexp));
      jobsubmittedNumber = sampleRun.jobsubmitted.match(regexp)[0];
    }

    if (sampleRun.jobcompleted.match(regexp)) { //if jobcompleted matched the run numbers
      // console.log(sampleRun.jobcompleted.match(regexp));
      jobcompletedNumber = sampleRun.jobcompleted.match(regexp)[0];
    }

    statusDetail.push({ //push the JSON List
      "productType": productType[productTypeIndex],
      "index": index,
      "incloud": incloudNumber,
      "downloaded": downloadedNumber,
      "jobsubmitted": jobsubmittedNumber,
      "jobcompleted": jobcompletedNumber
    });
  });
  // console.log(statusDetail);
  return statusDetail;
}

// function startRefresh(path, productTypeIndex = 0) {
//   setTimeout(startRefresh, 1000);
//   // console.log("test");
//   let newDate = new Date();
//   let second = ("0" + newDate.getSeconds()).slice(-2);
//   // $(".duration-time").children()[0];
//   let children = Array.from($(".duration-time").children());
//   // console.log(children);


//   children.forEach(function (sampleRun, index) {
//     if (sampleRun.innerText != "00:00:00") {
//       let hour = sampleRun.innerText.split(":")[0];
//       let min = sampleRun.innerText.split(":")[1];
//       let content = hour + ":" + min + ":" + second;

//       $(sampleRun).find("span").html(content);
//     }

//   });
// }

$(document).ready(function myfunction() {

  let product = $(document)[0].title.split(" ")[0];

  const JSONListPath = [
    '../NIPS/nips_progress_tail.json',
    '../SG/sg_progress_tail.json',
    '../IONA/iona_progress_tail.json',
  ];

  if (product == "NIPS") {
    getJSONList(JSONListPath[0], 0);
  } else if (product == "SG") {
    getJSONList(JSONListPath[1], 1);
  } else if (product == "IONA") {
    getJSONList(JSONListPath[2], 2);
  }

  clickProgressIcon(product.toLowerCase());
  movePseudoClock(product.toLowerCase(), "totalTime");


  // startRefresh(JSONListPath[0], 0);

});