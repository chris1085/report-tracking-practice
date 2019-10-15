/**
 * Getting JSON List and Progress Status Info function
 * The info of Clicking Progress Bar Event from JSON List
 * @param {*} path //JSON List Path
 * @returns
 */
function getJSONList(path) {

  let statusDetail;

  /* Asynchronous ajax */
  $.getJSON(path, function (data) {
    // console.log(data); //JOSN output
    // console.log(data[0].runid);
    if (path == '../NIPS/nips_progress_tail.json') {
      getProgressStatus(data, 0);
      statusDetail = getStatusDetail(data, 0);
      transferDetail2clickEvent(statusDetail);
    } else if (path == '../SG/sg_progress_tail.json') {
      getProgressStatus(data, 1);
      statusDetail = getStatusDetail(data, 1);
      transferDetail2clickEvent(statusDetail);
    } else if (path == '../IONA/iona_progress_tail.json') {
      getProgressStatus(data, 2);
      statusDetail = getStatusDetail(data, 2);
      transferDetail2clickEvent(statusDetail);
      // console.log(statusDetail);
    }

  });
}


/**
 * Getting Time-Used or Init Used-Time function
 *
 * @param {*} path
 */
function getModifyTime(path) {


  /* Asynchronous ajax */
  var xhr = $.ajax({
    url: path,
    success: function (response) { // If response of path succeed, Cal Last-Updated and Duration time
      var fileTime = String(new Date(xhr.getResponseHeader("Last-Modified")));
      var res = fileTime.split(" ");
      // console.log(res);
      var numberMonth = ("JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(res[1]) / 3 + 1);
      // console.log(numberMonth);

      let updatedTime = res[3] + "/" + numberMonth + "/" + res[2] + " " + res[4];

      if (path == '../NIPS/nips_progress_tail.json') {
        // modifyUpdatedTime(updatedTime, "nips");
        $(".nips-updatedTime").append(updatedTime);
        modifyDurationTime(response, "nips-");

      } else if (path == '../SG/sg_progress_tail.json') {
        // modifyUpdatedTime(updatedTime, "sg");
        $(".sg-updatedTime").append(updatedTime);
        modifyDurationTime(response, "sg-");

      } else if (path == '../IONA/iona_progress_tail.json') {
        // modifyUpdatedTime(updatedTime, "iona");
        $(".iona-updatedTime").append(updatedTime);
        modifyDurationTime(response, "iona-");

      }
    }
  });
}


/**
 * Function of modifing sample run duration time or initing it
 *
 * @param {Array of JSON} JSONList
 * @param {Product} productType
 */
function modifyDurationTime(JSONList, productType) {
  // console.log(JSONList);
  let temp = JSONList;
  temp = JSON.parse(JSONList);
  // console.log(temp);

  Object.keys(temp).forEach(function (sampleRun, index) {
    // console.log(sampleRun);
    // console.log(temp[sampleRun].timeUsed);
    // console.log(temp[sampleRun].timeUsed.split(":")[0]);

    if (typeof (temp[sampleRun].timeUsed) == "undefined") { //adding time-used class and text if its type is undefined!
      $("#" + productType + "timeUsed" + index).find("span").removeClass("badge-dark").addClass("badge-warning");
      $("#" + productType + "timeUsed" + index).find("span").text("00:00");
    } else {
      let durationHour = temp[sampleRun].timeUsed.split(":")[0];

      if (durationHour >= 12) { //adding warning class if its duration time over half a day
        $("#" + productType + "timeUsed" + index).find("span").removeClass("badge-dark").addClass("badge-danger");
      }
      $("#" + productType + "timeUsed" + index).find("span").text(temp[sampleRun].timeUsed);
    }
  });

}


/**
 * Just transfer data cause of async JSON
 *
 * @param {*} statusDetail
 */
function transferDetail2clickEvent(statusDetail) {
  clickProgressIcon(statusDetail);
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
function clickProgressIcon(statusDetail) {
  // console.log(statusDetail);

  $('.step-body').click(function (event) {
    let id = $(this).parents('div').attr('id').split('-progressId')[1];
    let productType = $(this).parents('div').attr('id').split('-progressId')[0];

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
    let collapseStatusDetail = "";
    let sampleRunNumber = $(this).parents('.div-progress').find('.row-sampleRun').length;

    // if (statusDetail[id].productType.match(productType)) {
    //   console.log(productType);
    // }

    Object.keys(statusDetail[id]).some(function (key) { //loop to find progress key and value
      // console.log(id);
      // console.log(key);
      if (key == currentStatusDetail && statusDetail[id].productType.match(productType)) {
        // console.log(statusDetail[id][key]);
        collapseStatusDetail = "Data Info: " + statusDetail[id][key];
      }
    });


    /* NOTE adding collapsed Content and changing class*/
    $(this).parents().find('#collapseStepInfo' + id).children().append("<div class='col-6 text-left'><h6>" + collapaseContent + "</h6></div>");
    $(this).parents().find('#collapseStepInfo' + id).children().append("<div class='col-6 text-right' id='contentStatus'><h6>" + collapseStatusDetail + "</h6><h6> " + currentStatus + "</h6></div>");
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

  // console.log(progressContent);
  // console.log(productTypeIndex);

  //NOTE To determine which run-stauts was Pending, Pass, Fail and Active and show in the collapsed content
  progressContent.forEach(function (sampleRun, index) {
    // console.log(sampleRun);
    $(productType[productTypeIndex] + '-runId' + index).text(sampleRun.runid);
    // console.log(sampleRun);

    if (sampleRun.closed == 0) { //fail, active or pending progress info added

      // console.log(sampleRun);

      if (sampleRun.sequenced == 0 && sampleRun.error == 0) { //pending progress info added
        $(productType[productTypeIndex] + "-progressId" + index).find(".stepbar-progress").attr("data-current-step", "sequenced");
        $(productType[productTypeIndex] + "-progressId" + index).find(".stepbar-progress").attr("data-step-status", "pending");

        return;
      }
      if (sampleRun.error == 1) { //fail progress info added
        let failStep;
        // console.log(sampleRun.converted);
        Object.keys(sampleRun).some(function (key) { //loop to find "fail" progress key and value
          if (sampleRun[key] == 0 && key != "error" && key != "closed") {
            failStep = key;
          }
        });
        $(productType[productTypeIndex] + "-progressId" + index).find(".stepbar-progress").attr("data-current-step", failStep);
        $(productType[productTypeIndex] + "-progressId" + index).find(".stepbar-progress").attr("data-step-status", "fail");
      } else { //active progress info added
        let flag = 0;
        Object.keys(sampleRun).some(function (key) {
          if (sampleRun[key] == 0 && key != "error" && key != "closed" && flag != 1) { //active
            // console.log(key + '=' + sampleRun[key]);
            $(productType[productTypeIndex] + "-progressId" + index).find(".stepbar-progress").attr("data-current-step", key);
            $(productType[productTypeIndex] + "-progressId" + index).find(".stepbar-progress").attr("data-step-status", "active");
          } else if (sampleRun[key].match(regexp) != null) {
            if (sampleRun[key].match(regexp)[1] != sampleRun[key].match(regexp)[2]) {
              // console.log(key);

              $(productType[productTypeIndex] + "-progressId" + index).find(".stepbar-progress").attr("data-current-step", key);
              $(productType[productTypeIndex] + "-progressId" + index).find(".stepbar-progress").attr("data-step-status", "active");
            }
            flag = 1;
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
  // console.log(progressContent);

  const productType = ["#nips", "#sg", "#iona"];
  let statusDetail = [];

  let regexp = /(\d+)\/(\d+)/;
  // console.log(progressContent);

  progressContent.forEach(function (sampleRun, index) {
    let incloudNumber = 0;
    let downloadedNumber = 0;
    let jobsubmittedNumber = 0;
    let jobcompletedNumber = 0;

    // console.log(sampleRun);

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

  // console.log(statusDetail);
  return statusDetail;
}

$(document).ready(function () {
  const JSONListPath = [
    '../NIPS/nips_progress_tail.json',
    '../SG/sg_progress_tail.json',
    '../IONA/iona_progress_tail.json',
  ];
  JSONListPath.forEach(getJSONList); //get Json List and changing their status
  JSONListPath.forEach(getModifyTime); //get Json List and Modify Updated and Duration Time 

});