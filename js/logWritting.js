const webJSONListPath = {
  nips: "/data1/lampp/htdocs/report-tracking/NIPS/nips_progress_tail.json",
  sg: "/data1/lampp/htdocs/report-tracking/SG/sg_progress_tail.json",
  iona: "/data1/lampp/htdocs/report-tracking/IONA/iona_progress_tail.json",
  ctdna: "/data1/lampp/htdocs/report-tracking/ctDNA/ctdna_progress_tail.json",
};

const logJSONListPath = {
  nips: "/data1/lampp/htdocs/report-tracking/log/nips_progress.log",
  sg: "/data1/lampp/htdocs/report-tracking/log/sg_progress.log",
  iona: "/data1/lampp/htdocs/report-tracking/log/iona_progress.log",
  ctdna: "/data1/lampp/htdocs/report-tracking/log/ctdna_progress.log",
};

function checkCompleted(productType, runInfo) {
  // console.log(el);

  if (runInfo.closed === "1") {
    // prodyctArray.push(runInfo);
    webDataPass[productType].push(runInfo);
    webRunIdPass[runInfo.runid] = runInfo.closed;
  }
}

const fs = require("fs");
let webDataPass = {
  nips: [],
  sg: [],
  iona: [],
  ctdna: [],
};

let webDataPass2 = {
  nips: [],
  sg: [],
  iona: [],
  ctdna: [],
};
let webRunIdPass = {};
let data = [];
const writeFile = (filename, content) => {
  fs.writeFile(filename, content, () => {});
};

Object.keys(logJSONListPath).forEach((productType) => {
  // console.log(productType + ' - ' + logJSONListPath[productType]); // key - value
  if (fs.existsSync(logJSONListPath[productType])) {
    data = JSON.parse(fs.readFileSync(logJSONListPath[productType], "utf8"));
    data.forEach((el) => checkCompleted(productType, el));
  }
});

Object.keys(webJSONListPath).forEach((productType) => {
  if (fs.existsSync(webJSONListPath[productType])) {
    let flag = 0;

    // let stream = fs.createWriteStream(webJSONListPath[productType], {
    //   flags: 'a'
    // });
    data = JSON.parse(fs.readFileSync(webJSONListPath[productType], "utf8"));

    data.forEach((el) => {
      if (webRunIdPass.hasOwnProperty(el.runid)) {
        console.log(el.runid + " is duplicated in log");
      } else {
        console.log(el.runid);

        if (el.closed == "1") {
          console.log(el.runid + " No duplicates in log.");
          webDataPass[productType].push(el);
          flag = 1;
        }
        // stream.write(JSON.stringify(el) + "\n");
      }
    });

    // stream.end();\
    if (flag == 1) {
      writeFile(logJSONListPath[productType], JSON.stringify(webDataPass[productType]));
    } else {
      console.log("nothing to push in " + productType);
    }
  } else {
    console.log(webJSONListPath[productType] + "does not exist in log.");
  }
});
