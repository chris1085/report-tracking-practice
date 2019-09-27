function getJSONList(path) {
  $.getJSON(path, function(data) {
    // console.log(data); //json output
    for (
      let prorgressIndex = 0;
      prorgressIndex < data.length;
      prorgressIndex++
    ) {
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

      if (path == "../NIPS/nips_progress_tail.json") {
        $("#nips-runId" + prorgressIndex).text(runid);
      } else if (path == "../SG/sg_progress_tail.json") {
        $("#sg-runId" + prorgressIndex).text(runid);
      } else if (path == "../IONA/iona_progress_tail.json") {
        $("#iona-runId" + prorgressIndex).text(runid);
      }
    }
  });
}
var JSONListPath = [
  "../NIPS/nips_progress_tail.json",
  "../SG/sg_progress_tail.json",
  "../IONA/iona_progress_tail.json"
];

JSONListPath.forEach(getJSONList);

$(".step-body").hover(
  function() {
    $(".collapse").collapse("show");
  },
  function() {
    $(".collapse").collapse("hide");
  }
);
