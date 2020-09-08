function convertFormat(productType, runInfo) {
  // console.log(runInfo);
  const stepArr = {
    nips: [
      "sequenced",
      "analyzed",
      "ondell",
      "converted",
      "incloud",
      "downloaded",
      "jobsubmitted",
      "jobcompleted",
      "backtodell",
    ],
    iona: [
      "sequenced",
      "ondell",
      "converted",
      "incloud",
      "downloaded",
      "jobsubmitted",
      "jobcompleted",
      "backtodell",
    ]
  };
  let stepInterval = [];

  let totalTime = runInfo.totalTime;
  let sequencedTime = runInfo.sequencedTime;
  let analyzedTime = runInfo.analyzedTime;
  let ondellTime = runInfo.ondellTime;
  let convertedTime = runInfo.convertedTime;
  let incloudTime = runInfo.incloudTime;
  let downloadedTime = runInfo.downloadedTime;
  let jobsubmittedTime = runInfo.jobsubmittedTime;
  let jobcompletedTime = runInfo.jobcompletedTime;
  let backtodellTime = runInfo.backtodellTime;

  let analyzedStart = runInfo.analyzedStart;
  let analyzedEnd = runInfo.analyzedEnd;
  let sequencedStart = runInfo.sequencedStart;
  let sequencedEnd = runInfo.sequencedEnd;

  let downloadStart = runInfo.downloadedStart;
  let downloadEnd = runInfo.downloadedEnd;

  let onDellStart = runInfo.ondellStart;
  let onDellEnd = runInfo.ondellEnd;

  let convertedStart = runInfo.convertedStart;
  let convertedEnd = runInfo.convertedEnd;

  let incloudStart = runInfo.incloudStart;
  let incloudEnd = runInfo.incloudEnd;

  let jobsubmittedStart = runInfo.jobsubmittedStart;
  let jobsubmittedEnd = runInfo.jobsubmittedEnd;

  let jobcompletedStart = runInfo.jobcompletedStart;
  let jobcompletedEnd = runInfo.jobcompletedEnd;

  let backtodellStart = runInfo.backtodellStart;
  let backtodellEnd = runInfo.backtodellEnd;

  stepArr[productType].forEach((step, i, arr) => {
    const stepEndName = step + "End";
    let interval = "Incorrect Format";

    if (i < stepArr[productType].length - 1 && runInfo[stepEndName] !== "00:00:30") {
      const stepStartName = arr[i + 1] + "Start";
      // console.log(stepStartName);
      // console.log(stepEndName, stepStartName, runInfo[stepEndName], runInfo[stepStartName]);
      if (runInfo[stepStartName] !== "00:00:30" && typeof (runInfo[stepStartName]) !== "undefined") {
        interval = getSeconds(runInfo[stepStartName]) - getSeconds(runInfo[stepEndName]);
      }
      // console.log(stepStartName, stepEndName, runInfo[stepStartName], runInfo[stepEndName]);
    }
    stepInterval.push(interval);
  });

  // console.log(stepInterval);

  if (productType === "nips") {
    console.log(
      `${runInfo.runid}\t${runInfo.totalTime}\t${runInfo.sequencedStart}\t${runInfo.sequencedEnd}\t${runInfo.sequencedTime}\t${stepInterval[0]}\t${runInfo.analyzedStart}\t${runInfo.analyzedEnd}\t${runInfo.analyzedTime}\t${stepInterval[1]}\t${runInfo.ondellStart}\t${runInfo.ondellEnd}\t${runInfo.ondellTime}\t${stepInterval[2]}\t${runInfo.convertedStart}\t${runInfo.convertedEnd}\t${runInfo.convertedTime}\t${stepInterval[3]}\t${runInfo.incloudStart}\t${runInfo.incloudEnd}\t${runInfo.incloudTime}\t${stepInterval[4]}\t${runInfo.downloadedStart}\t${runInfo.downloadedEnd}\t${runInfo.downloadedTime}\t${stepInterval[5]}\t${runInfo.jobsubmittedStart}\t${runInfo.jobsubmittedEnd}\t${runInfo.jobsubmittedTime}\t${stepInterval[6]}\t${runInfo.jobcompletedStart}\t${runInfo.jobcompletedEnd}\t${runInfo.jobcompletedTime}\t${stepInterval[7]}\t${runInfo.backtodellStart}\t${runInfo.backtodellEnd}\t${runInfo.backtodellTime}`
    );
  } else {
    console.log(
      `${runInfo.runid}\t${runInfo.totalTime}\t${runInfo.sequencedStart}\t${runInfo.sequencedEnd}\t${runInfo.sequencedTime}\t${stepInterval[0]}\t${runInfo.ondellStart}\t${runInfo.ondellEnd}\t${runInfo.ondellTime}\t${stepInterval[1]}\t${runInfo.convertedStart}\t${runInfo.convertedEnd}\t${runInfo.convertedTime}\t${stepInterval[2]}\t${runInfo.incloudStart}\t${runInfo.incloudEnd}\t${runInfo.incloudTime}\t${stepInterval[3]}\t${runInfo.downloadedStart}\t${runInfo.downloadedEnd}\t${runInfo.downloadedTime}\t${stepInterval[4]}\t${runInfo.jobsubmittedStart}\t${runInfo.jobsubmittedEnd}\t${runInfo.jobsubmittedTime}\t${stepInterval[5]}\t${runInfo.jobcompletedStart}\t${runInfo.jobcompletedEnd}\t${runInfo.jobcompletedTime}\t${stepInterval[6]}\t${runInfo.backtodellStart}\t${runInfo.backtodellEnd}\t${runInfo.backtodellTime}`
    );
  }

}

function getSeconds(time) {
  if (typeof (time) === "undefined") {
    return 0;
  }
  let clockArray = time.split(/[-:]/);
  // console.log(time);
  // let seconds = parseInt(clockArray[0] * 3600) + parseInt(clockArray[1] * 60) + parseInt(clockArray[2]);
  let seconds = new Date(
    clockArray[0],
    clockArray[1],
    clockArray[2],
    clockArray[3],
    clockArray[4],
    clockArray[5]
  ).getTime();
  seconds = seconds / 1000;
  // console.log(seconds);
  return seconds;
}

function convertSeconds(time) {
  let clockArray = time.split(/:/);
  let seconds = parseInt(clockArray[0] * 3600) + parseInt(clockArray[1] * 60) + parseInt(clockArray[2]);
  return seconds;
}

const logJSONListPath = {
  nips: "./nips.json.log",
  //  sg: '/data1/lampp/htdocs/report-tracking/log/sg_progress.log',
  //  iona: '/data1/lampp/htdocs/report-tracking/log/iona_progress.log'
};

const convertJSONListPath = {
  nips: "./nips.json.log",
  //  sg: '../log_convert/sg_progress.log',
  //  iona: '../log_convert/iona_progress.log'
};

const fs = require("fs");
let data = [];
let logTime = {
  nips: [],
  sg: [],
  iona: [],
};

const writeFile = (filename, content) => {
  fs.writeFile(filename, content, () => {});
};

if (process.argv[2] === "nips") {
  console.log(
    "\ttotalTime\tsequencedStart\tsequencedEnd\tsequencedTime\tinterval\tanalyzedStart\tanalyzedEnd\tanalyzedTime\tinterval\tondellStartTime\tondellEndTime\tondellTime\tinterval\tconvertedStartTime\tconvertedEndTime\tconvertedTime\tinterval\tincloudStartTime\tincloudEndTime\tincloudTime\tinterval\tdownloadStartTime\tdownloadEndTime\tdownloadedTime\tinterval\tjobsubmittedStart\tjobsubmittedEnd\tjobsubmittedTime\tinterval\tjobcompletedStartTime\tjobcompletedEndTime\tjobcompletedTime\tinterval\tbacktodellStartTime\tbacktodellEndTime\tbacktodellTime"
  );
} else {
  console.log(
    "\ttotalTime\tsequencedStart\tsequencedEnd\tsequencedTime\tinterval\tondellStartTime\tondellEndTime\tondellTime\tinterval\tconvertedStartTime\tconvertedEndTime\tconvertedTime\tinterval\tincloudStartTime\tincloudEndTime\tincloudTime\tinterval\tdownloadStartTime\tdownloadEndTime\tdownloadedTime\tinterval\tjobsubmittedStart\tjobsubmittedEnd\tjobsubmittedTime\tinterval\tjobcompletedStartTime\tjobcompletedEndTime\tjobcompletedTime\tinterval\tbacktodellStartTime\tbacktodellEndTime\tbacktodellTime"
  );
}

const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://192.168.228.18:27017/";
MongoClient.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, function (err, db) {
  if (err) throw err;
  let dbo = db.db("sofiva");
  let data = dbo.collection(process.argv[2]).find().sort({
    runid: -1
  }).limit(parseInt(process.argv[3]));

  data.toArray().then((result) => {
    //    console.log(result);
    result.reverse().forEach((el) => convertFormat(process.argv[2], el));
    //    result.reverse().forEach((element) => console.log(element));
    //
    db.close();
  });
});

//Object.keys(logJSONListPath).forEach(productType => {
// console.log(productType + ' - ' + logJSONListPath[productType]); // key - value
//  if (fs.existsSync(logJSONListPath[productType])) {
//    data = JSON.parse(fs.readFileSync(logJSONListPath[productType], 'utf8'));
//    data.forEach(el => convertFormat(productType, el));
//  }
//});