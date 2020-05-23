const fs = require("fs");
const sendMiSeqLogPath = "/mnt/d/NGS_DATA/MiseqOutput/resultlog.csv";
const sendNextSeqLogPath = "/mnt/d/NGS_DATA/NextSeqOutput/NextSeqResultlog.csv";
const jobStatusLogPath = {
  array: {
    v2: "/mnt/d/TemperatureMonitoringSystem/report-trackingLog/array/v2/jobStatus.log",
    v3: "/mnt/d/TemperatureMonitoringSystem/report-trackingLog/array/v3/jobStatus.log"
  },
  carrierscan: {
    v1: "/mnt/d/TemperatureMonitoringSystem/report-trackingLog/carrierscan/v1/jobStatus.log",
    v2: "/mnt/d/TemperatureMonitoringSystem/report-trackingLog/carrierscan/v2/jobStatus.log",
    v3: "/mnt/d/TemperatureMonitoringSystem/report-trackingLog/carrierscan/v3/jobStatus.log"
  },
  babyscan: {
    v1: "/mnt/d/TemperatureMonitoringSystem/report-trackingLog/babyscan/v1/jobStatus.log",
    v2: "/mnt/d/TemperatureMonitoringSystem/report-trackingLog/babyscan/v2/jobStatus.log",
    v3: "/mnt/d/TemperatureMonitoringSystem/report-trackingLog/babyscan/v3/jobStatus.log"
  }
};
let newStatus = {};

// let today = new Date();
// let dd = String(today.getDate()).padStart(2, "0");
// let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
// let yyyy = today.getFullYear();
checkSendStatus(sendMiSeqLogPath, newStatus).then(console.log(newStatus));

function checkSendStatus(path, newStatus) {
  let readline = require("readline");
  let inputStream = fs.createReadStream(path);
  let lineReader = readline.createInterface({ input: inputStream });
  let group = {};

  return new Promise((resolve, reject) => {
    lineReader.on("line", function(line) {
      // 取得一行行結果
      let id = line.split(/,/)[0];
      let date = line.split(/,/)[3];
      newStatus[id] = date;
      // console.log("NEW LINE", line);
    });
  });
}
