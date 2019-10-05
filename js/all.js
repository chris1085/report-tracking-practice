function getJSONList(path) {

  let statusDetail;

  // var xhr = new XMLHttpRequest();
  // xhr.open(path, false);
  // xhr.send(null);
  // console.log(xhr);


  var test = $.getJSON(path, function (data) {
    // console.log(data); //JOSN output
    // console.log(data[0].runid);

    if (path == '../NIPS/nips_progress_tail.json') {
      getProgressStatus(data, 0);
      statusDetail = getStatusDetail(data, 0);
      doit(statusDetail);
    } else if (path == '../SG/sg_progress_tail.json') {
      getProgressStatus(data, 1);
      statusDetail = getStatusDetail(data, 1);

    } else if (path == '../IONA/iona_progress_tail.json') {
      getProgressStatus(data, 2);
      statusDetail = getStatusDetail(data, 2);
    }
    return statusDetail;
  });
  // console.log(test);
  return test;

}

function doit(statusDetail) {
  clickProgressIcon(statusDetail);
  // console.log(statusDetail);

  // return statusDetail;
}

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
  };

  return productStep[iconInfo.productType][iconInfo.iconStepId];
}

function clickProgressIcon(statusDetail) {
  console.log(statusDetail);

  $('.step-body').click(function (event) {
    let id = $(this).parents('div').attr('id').split('-progressId')[1];
    let productType = $(this).parents('div').attr('id').split('-progressId')[0];


    if (typeof $(this).attr('id') == 'undefined') {
      console.log('Please check id again');
    } else {
      $(this).parents().find('#collapseStepInfo' + id).children().empty();

      let iconStepId = $(this).attr('id').split('icon-')[1];
      let iconInfo = {
        productType: productType,
        id: id,
        iconStepId: iconStepId,
      };

      let selectedID = selectStepID(iconInfo);
      let collapaseContent = 'Indicated Step: ' + selectedID;
      let currentStatus = "Status: " + $(this).parents("table").attr('data-step-status');
      let sampleRunNumber = $(this).parents('.div-progress').find('.row-sampleRun').length;

      $(this).parents().find('#collapseStepInfo' + id).children().append("<div class='col-6 text-left'><h6>" + collapaseContent + "</h6></div>");
      $(this).parents().find('#collapseStepInfo' + id).children().append("<div class='col-6 text-right' id='contentStatus'><h6>" + currentStatus + "</h6><h6> " + currentStatus + "</h6></div>");
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
    }

  });
}

function getProgressStatus(progressContent = data, productTypeIndex = 1) {

  const productType = ["#nips", "#sg", "#iona"];
  // console.log(progressContent);
  // console.log(productTypeIndex);
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
        Object.keys(sampleRun).some(function (key) { //loop to find progress key and value
          if (sampleRun[key] == 0 && key != "error" && key != "closed") {
            failStep = key;
          }
        });
        $(productType[productTypeIndex] + "-progressId" + index).find(".stepbar-progress").attr("data-current-step", failStep);
        $(productType[productTypeIndex] + "-progressId" + index).find(".stepbar-progress").attr("data-step-status", "fail");
      } else { //active progress info added
        Object.keys(sampleRun).some(function (key) {
          if (sampleRun[key] == 0 && key != "error" && key != "closed") { //active
            // console.log(key + '=' + sampleRun[key]);
            $(productType[productTypeIndex] + "-progressId" + index).find(".stepbar-progress").attr("data-current-step", key);
            $(productType[productTypeIndex] + "-progressId" + index).find(".stepbar-progress").attr("data-step-status", "active");
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

function getStatusDetail(progressContent = data, productTypeIndex = 1) {
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

    if (sampleRun.incloud.match(regexp) && sampleRun.incloud.match(regexp)[1] == sampleRun.incloud.match(regexp)[2]) {
      // console.log(sampleRun.incloud.match(regexp));
      incloudNumber = sampleRun.incloud.match(regexp)[0];
    }

    if (sampleRun.downloaded.match(regexp) && sampleRun.downloaded.match(regexp)[1] == sampleRun.downloaded.match(regexp)[2]) {
      // console.log(sampleRun.downloaded.match(regexp));
      downloadedNumber = sampleRun.downloaded.match(regexp)[0];
      // console.log(downloadedNumber);

    }

    if (sampleRun.jobsubmitted.match(regexp) && sampleRun.jobsubmitted.match(regexp)[1] == sampleRun.jobsubmitted.match(regexp)[2]) {
      // console.log(sampleRun.jobsubmitted.match(regexp));
      jobsubmittedNumber = sampleRun.jobsubmitted.match(regexp)[0];
    }

    if (sampleRun.jobcompleted.match(regexp) && sampleRun.jobcompleted.match(regexp)[1] == sampleRun.jobcompleted.match(regexp)[2]) {
      // console.log(sampleRun.jobcompleted.match(regexp));
      jobcompletedNumber = sampleRun.jobcompleted.match(regexp)[0];
    }

    statusDetail.push({
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

$(document).ready(function () {
  const JSONListPath = [
    '../NIPS/nips_progress_tail.json',
    '../SG/sg_progress_tail.json',
    '../IONA/iona_progress_tail.json',
  ];
  let statusDetail = JSONListPath.forEach(getJSONList);
  // console.log(statusDetail);

  // clickProgressIcon();

});