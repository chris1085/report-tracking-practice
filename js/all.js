function getJSONList(path) {

  let progressJson = {};
  $.getJSON(path, function (data) {
    // console.log(data); //JOSN output
    // console.log(data[0].runid);

    if (path == '../NIPS/nips_progress_tail.json') {
      data.forEach(function (sampleRun, index) {
        // console.log(sampleRun);
        $('#nips-runId' + index).text(sampleRun.runid);
        // console.log(sampleRun);

        if (sampleRun.closed == 0) {

          console.log(sampleRun);

          if (sampleRun.sequenced == 0 && sampleRun.error == 0) {
            $("#nips-progressId" + index).find(".stepbar-progress").attr("data-current-step", "sequenced");
            $("#nips-progressId" + index).find(".stepbar-progress").attr("data-step-status", "pending");

            return;
          }
          if (sampleRun.error == 1) {
            let failStep;
            // console.log(sampleRun.converted);
            Object.keys(sampleRun).some(function (key) {
              if (sampleRun[key] == 0 && key != "error" && key != "closed") {
                failStep = key;
              }
            });
            $("#nips-progressId" + index).find(".stepbar-progress").attr("data-current-step", failStep);
            $("#nips-progressId" + index).find(".stepbar-progress").attr("data-step-status", "fail");
          } else {
            Object.keys(sampleRun).some(function (key) {
              if (sampleRun[key] == 0 && key != "error" && key != "closed") { //active
                // console.log(key + '=' + sampleRun[key]);
                $("#nips-progressId" + index).find(".stepbar-progress").attr("data-current-step", key);
                $("#nips-progressId" + index).find(".stepbar-progress").attr("data-step-status", "active");
              }
            });
          }
        } else {
          // console.log($("#nips-progressId" + index).find(".stepbar-progress"));
          $("#nips-progressId" + index).find(".stepbar-progress").attr("data-current-step", "backtodell");
          $("#nips-progressId" + index).find(".stepbar-progress").attr("data-step-status", "pass");
        }

      });
    } else if (path == '../SG/sg_progress_tail.json') {
      data.forEach(function (sampleRun, index) {
        $('#sg-runId' + index).text(sampleRun.runid);

        Object.keys(sampleRun).forEach(function (key) {
          // console.log(key + '=' + sampleRun[key]);

        });
      });

    } else if (path == '../IONA/iona_progress_tail.json') {
      data.forEach(function (sampleRun, index) {
        $('#sg-runId' + index).text(sampleRun.runid);
        Object.keys(sampleRun).forEach(function (key) {
          // console.log(key + '=' + sampleRun[key]);

        });
      });
    }
  });

  return progressJson;
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

function clickProgressIcon() {
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

      $(this).parents().find('#collapseStepInfo' + id).children().append("<div class='col-6 text-left'>" + collapaseContent + "</div>");
      $(this).parents().find('#collapseStepInfo' + id).children().append("<div class='col-6 text-right' id='contentStatus'>" + currentStatus + "</div>");
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

function getProgressContent(progressJson, productType, arr) {
  // console.log(progressJson);
  // console.log(arr);


}

$(document).ready(function () {
  const JSONListPath = [
    '../NIPS/nips_progress_tail.json',
    '../SG/sg_progress_tail.json',
    '../IONA/iona_progress_tail.json',
  ];

  let progressJson = JSONListPath.forEach(getJSONList);
  clickProgressIcon();

});