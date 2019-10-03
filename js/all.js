function getJSONList(path) {
  $.getJSON(path, function (data) {
    // console.log(data); //json output
    for (let prorgressIndex = 0; prorgressIndex < data.length; prorgressIndex++) {
      const runid = data[prorgressIndex].runid;
      const sequenced = data[prorgressIndex].sequenced;
      const analyzed = data[prorgressIndex].analyzed;
      const onDell = data[prorgressIndex].ondell;
      const converted = data[prorgressIndex].converted;
      const inCloud = data[prorgressIndex].incloud;
      const downloaded = data[prorgressIndex].downloaded;
      const jobSubmitted = data[prorgressIndex].jobsubmitted;
      const jobCompleted = data[prorgressIndex].jobcompleted;
      const backToDell = data[prorgressIndex].backtodell;

      if (path == '../NIPS/nips_progress_tail.json') {
        $('#nips-runId' + prorgressIndex).text(runid);
      } else if (path == '../SG/sg_progress_tail.json') {
        $('#sg-runId' + prorgressIndex).text(runid);
      } else if (path == '../IONA/iona_progress_tail.json') {
        $('#iona-runId' + prorgressIndex).text(runid);
      }
    }
  });
}

function selectStepID(iconInfo) {
  // console.log(iconInfo);

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

function modifyCollapseContent(sampleRunId = 0, stepId = 0) {}

$(document).ready(function () {
  var JSONListPath = [
    '../NIPS/nips_progress_tail.json',
    '../SG/sg_progress_tail.json',
    '../IONA/iona_progress_tail.json',
  ];

  JSONListPath.forEach(getJSONList);

  $('.step-body').click(function (event) {
    var id = $(this).parents('div').attr('id').split('-progressId')[1];
    var productType = $(this).parents('div').attr('id').split('-progressId')[0];

    if (typeof $(this).attr('id') == 'undefined') {
      console.log('Please check id again');
    } else {
      $(this).parents().find('#collapseStepInfo' + id).children().empty();

      var iconStepId = $(this).attr('id').split('icon-')[1];
      var iconInfo = {
        productType: productType,
        id: id,
        iconStepId: iconStepId,
      };

      var selectedID = selectStepID(iconInfo);
      var collapaseContent = 'Indicated Step: ' + selectedID;
      var currentStatus = "Status: " + $(this).parents("table").attr('data-step-status');

      $(this).parents().find('#collapseStepInfo' + id).children().append("<div class='col-6 text-left'>" + collapaseContent + "</div>");
      $(this).parents().find('#collapseStepInfo' + id).children().append("<div class='col-6 text-right'>" + currentStatus + "</div>");



      // $(this).parents().find('#collapseStepInfo' + id).children().text(collapaseContent);

      var sampleRunNumber = $(this).parents('.div-progress').find('.row-sampleRun').length;

      for (let i = 0; i < sampleRunNumber; i++) {
        if (id != i) {
          $(this).parents().find('#collapseStepInfo' + i).removeClass('show');
        }
      }
      // console.log(sampleRunNumber);

      if (
        $(this).parents().find('#collapseStepInfo' + id).val() != '' && $(this).parents().find('#collapseStepInfo' + id).val() != $(this).attr('id')) {

        $(this).parents().find('#collapseStepInfo' + id).val($(this).attr('id'));
        // $(this).parents().find('#collapseStepInfo' + id).addClass('show');
        $(this).parents().find('#collapseStepInfo' + id).removeClass('show');

        // console.log($(this).parents("div").attr('id') + " " + $(this).parents().find("#collapseStepInfo" + id).val());
        // } else if ($(this).parents().find('#collapseStepInfo' + id).val() == '') {
        //   $(this).parents().find('#collapseStepInfo' + id).val($(this).attr('id'));
        // }
      } else {
        $(this).parents().find('#collapseStepInfo' + id).val($(this).attr('id'));
        console.log($(this).parents().find('#collapseStepInfo' + id).val());
      }


    }

  });
  // $(".step-body").hover(
  //   function () {
  //     $(".collapse").collapse("show");
  //   },
  //   function () {
  //     $(".collapse").collapse("hide");
  //   }
  // );
});