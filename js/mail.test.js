#!/usr/bin/env node

/**
 * Sending email if we have some data status processed longer than expected.
 * Setting nodemailer module and sending info.
 *
 * @param {*} content html content for nodemailer's html(key)
 * @param {*} productType product of report-tracking system
 * @param {*} flag to determin whether table content is empty. If it's true, it represents that data details need to send mail to related person.
 * @returns
 */
function sendMail(content, productType, flag) {
  if (flag == false) {
    return;
  }

  let subjectTitle = 'Report-Tracking System Notify - ' + productType.toUpperCase();

  //引用 nodemailer
  let nodemailer = require('nodemailer');

  let maillist = {
    nips: [
      // 'bmi.hcy@sofivagenomics.com.tw',
      'bmi.cfc@sofivagenomics.com.tw'
      // 'tklin@sofivagenomics.com.tw',
      // 'yichu@sofivagenomics.com.tw',
      // 'tsuling@sofivagenomics.com.tw',
      // 'nips@sofivagenomics.com.tw',
      // 'ying@sofivagenomics.com.tw',
      // 'tehyang.hwa@sofivagenomics.com.tw'
    ],
    sg: [
      // 'bmi.hcy@sofivagenomics.com.tw',
      'bmi.cfc@sofivagenomics.com.tw'
      // 'tklin@sofivagenomics.com.tw',
      // 'yichu@sofivagenomics.com.tw',
      // 'tsuling@sofivagenomics.com.tw',
      // 'nips@sofivagenomics.com.tw',
      // 'ying@sofivagenomics.com.tw',
      // 'tehyang.hwa@sofivagenomics.com.tw'
    ],
    iona: [
      // 'bmi.hcy@sofivagenomics.com.tw',
      'bmi.cfc@sofivagenomics.com.tw'
      // 'tklin@sofivagenomics.com.tw',
      // 'yichu@sofivagenomics.com.tw',
      // 'tsuling@sofivagenomics.com.tw',
      // 'iona@sofivagenomics.com.tw',
      // 'yuchen@phoebusgenetics.com.tw',
      // 'tehyang.hwa@sofivagenomics.com.tw'
    ]
  };

  let sendList = maillist[productType];

  //宣告發信物件
  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'sofiva.bmi@gmail.com',
      pass: 'zabvtgxrhahvjjqh'
    }
  });

  let options = {
    //寄件者
    from: 'sofiva.bmi@gmail.com',
    //收件者
    to: sendList,
    //副本
    // cc: 'bmi.cfc@sofivagenomics.com.tw',
    //密件副本
    bcc: 'bmi.cfc@sofivagenomics.com.tw',
    //主旨
    subject: subjectTitle, // Subject line
    //純文字
    text: 'Hello world!', // plaintext body
    //嵌入 html 的內文
    html: content

    // '<h2>Why and How</h2> <p>The <a href="http://en.wikipedia.org/wiki/Lorem_ipsum" title="Lorem ipsum - Wikipedia, the free encyclopedia">Lorem ipsum</a> text is typically composed of pseudo-Latin words. It is commonly used as placeholder text to examine or demonstrate the visual effects of various graphic design. Since the text itself is meaningless, the viewers are therefore able to focus on the overall layout without being attracted to the text.</p>',
    //附件檔案
    // attachments: [ {
    //     filename: 'text01.txt',
    //     content: '聯候家上去工的調她者壓工，我笑它外有現，血有到同，民由快的重觀在保導然安作但。護見中城備長結現給都看面家銷先然非會生東一無中；內他的下來最書的從人聲觀說的用去生我，生節他活古視心放十壓心急我我們朋吃，毒素一要溫市歷很爾的房用聽調就層樹院少了紀苦客查標地主務所轉，職計急印形。團著先參那害沒造下至算活現興質美是為使！色社影；得良灣......克卻人過朋天點招？不族落過空出著樣家男，去細大如心發有出離問歡馬找事'
    // }, {
    //     filename: 'unnamed.jpg',
    //     path: '/Users/Weiju/Pictures/unnamed.jpg'
    // }]
    // attachments: [{
    //   filename: 'unnamed.gif',
    //   path: '../images/unnamed.gif',
    //   cid: 'unique@kreata.ee' //same cid value as in the html img src
    // }]
  };

  //發送信件方法
  transporter.sendMail(options, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('訊息發送: ' + info.response);
    }
  });
}

/**
 * Subject: To determin sample's time of status which is higher than cut-off
 * Method: Using for-loop to find which uncompleted status we should compare
 *         with default cut-off time. If it's longer than default, assign
 *         the key-value to new JSON stringtify string.
 *
 * @param {*} sample
 * @param {*} productType
 * @returns
 */
function filterSampleRun(sample, productType) {
  let newSampleRun;
  let newSampleRunArr = [];
  // console.log(sample);

  //default cut-off
  const cutOffSetttings = {
    nips: {
      totalTime: 34797,
      sequencedTime: 22717,
      analyzedTime: 7691,
      ondellTime: 0,
      convertedTime: 0,
      incloudTime: 7559,
      downloadedTime: 3658,
      jobsubmittedTime: 122,
      jobcompletedTime: 1154,
      backtodellTime: 1992
    },
    iona: {
      totalTime: 58815,
      sequencedTime: 57322,
      analyzedTime: 0,
      ondellTime: 504,
      convertedTime: 1092,
      incloudTime: 2993,
      downloadedTime: 739,
      jobsubmittedTime: 60,
      jobcompletedTime: 1056,
      backtodellTime: 991
    },
    sg: {
      totalTime: 58145,
      sequencedTime: 55810,
      analyzedTime: 0,
      ondellTime: 432,
      convertedTime: 0,
      incloudTime: 82,
      downloadedTime: 384,
      jobsubmittedTime: 61,
      jobcompletedTime: 2237,
      backtodellTime: 232
    }
  };
  // console.log(sample);

  for (const key in sample) {
    let durationName = key + 'Time';

    //To find without step name. If its not match with step, ignore it.
    if (key == 'runid' || key == 'closed' || key == 'error' || key == 'timeUsed') {
      continue;
    } else if (key.match(/(.*)Time$/)) {
      // console.log(sample[key], key);

      let sampleHours = parseInt(sample[key].split(':')[0]);
      let sampleMins = parseInt(sample[key].split(':')[1]);
      let sampleSecs = parseInt(sample[key].split(':')[2]);
      let totalSecs = sampleHours * 60 * 60 + sampleMins * 60 + sampleSecs;
      // console.log(sampleHours, sampleMins, sampleSecs, totalSecs);

      // let totalSecs = 100;
      // console.log(sampleHours, sampleMins, sampleSecs, totalSecs, cutOffSetttings[productType][key]);
      // console.log(productType, totalSecs, cutOffSetttings[productType][key]);

      let cutOffTime = new Date(cutOffSetttings[productType][key] * 1000).toISOString().substr(11, 8);

      if (sample.closed != '1' && totalSecs > cutOffSetttings[productType][key]) {
        let runid = sample.runid;
        let temp = {
          [productType]: {
            runid: runid,
            node: key,
            nodeTime: sample[key],
            totalTime: sample.totalTime,
            alarmTime: cutOffTime,
            count: 1
          }
        };
        // console.log(temp);

        newSampleRun = JSON.stringify(temp);
        newSampleRunArr.push(newSampleRun);
      }
    }
  }
  return newSampleRunArr;
}

/**
 *  Subject: To write total mail content in a variable
 *  Method: Useing += to contiue the html content string. If flag is
 *          true represents uncompleted data exists and need to send
 *          to related person. we also have template like ./test.html
 *          to test the mail content style is what we want.
 *
 * @param {*} data
 * @param {*} productType
 * @returns
 */
function writeMailContent(data, productType) {
  let flag = false;
  let product = productType.toUpperCase();
  let content = `
    <h2>Report-Tracking System Notify</h2>
    <p>Some data processed longer than expected. Please confirm progress step and data status <a href="http://192.168.0.199/report-tracking/${product}/index.html">here</a>.</p>
    <p>The information is summerized below:</p>
    <h4>PRODUCT: ${product}</h4>
    <table style = "border-collapse: collapse; width:800px;">
      <col width = "40%">
      <col width = "30%">
      <col width = "10%">
      <col width = "10%">
      <col width = "10%">
        <tr>
          <th style = "border-bottom: 1px solid #ddd; padding:10px 0px; background-color: #6bc541;"> Run ID </th>
          <th style = "border-bottom: 1px solid #ddd; background-color: #6bc541;"> Step </th>
          <th style = "border-bottom: 1px solid #ddd; background-color: #6bc541;"> Duration </th>
          <th style = "border-bottom: 1px solid #ddd; background-color: #6bc541;"> Alarm Time </th> 
          <th style = "border-bottom: 1px solid #ddd; background-color: #6bc541;"> Elapsed Time </th>
        </tr>`;

  for (let index = 0; index < data.length; index++) {
    // console.log(data[index]);
    for (let stepIndex = 0; stepIndex < data[index].length; stepIndex++) {
      // console.log(data[index][stepIndex]);
      let mailInfo = JSON.parse(data[index][stepIndex]);
      if (typeof mailInfo[productType] != 'undefined') {
        content += `\n<tr>\n`;
        content += `<td align='center' style='border-bottom: 1px solid #ddd; padding:10px 0px;'>${mailInfo[productType].runid}</td>\n`;
        content += `<td align='center' style='border-bottom: 1px solid #ddd;'>${mailInfo[productType].node}</td>\n`;
        content += `<td align='center' style='border-bottom: 1px solid #ddd;'>${mailInfo[productType].nodeTime}</td>\n`;
        content += `<td align='center' style='border-bottom: 1px solid #ddd;'>${mailInfo[productType].alarmTime}</td>\n`;
        content += `<td align='center' style='border-bottom: 1px solid #ddd;'>${mailInfo[productType].totalTime}</td>\n`;
        content += `</tr>\n`;
        flag = true;
      }
    }
  }

  content += `\n</table>`;
  content += `<div  style="padding-top: 100px; display:block">
  <a class="navbar-brand"><img src="../images/unnamed.gif" width="240" height="80" alt=""></a>
  <br>
  <span>慧智基因</span>
  <br>
  <span>姜權芳 Chuan-Fang Chiang</span>
  <br>
  <span>生物資訊分析師</span>
  <br>
  <span>地址:台北市中正區寶慶路27號5樓</span>
  <br>
  <span>電話:(02)2382-6615 EXT.6503</span>
</div>`;
  sendMail(content, productType, flag);
  // console.log(data);
}

function compareMailContent(alertData, writeContent, productType, checkCount) {
  let finalArray = [];
  let writeContentCount = 0;
  let matchConut = 0;
  // console.log(writeContent);

  if (typeof writeContent.length == 'undefined') {
    return false;
  } else {
    let simpleAlert = [];
    let simpleAlertJSON = {};
    let simpleContent = [];
    for (let index = 0; index < alertData.length; index++) {
      for (let stepIndex = 0; stepIndex < alertData[index].length; stepIndex++) {
        let alertDataJSON = JSON.parse(alertData[index][stepIndex]);
        simpleAlert.push(alertDataJSON[productType].runid + '_' + alertDataJSON[productType].node);
        simpleAlertJSON[alertDataJSON[productType].runid + '_' + alertDataJSON[productType].node] =
          alertDataJSON[productType].runid + '_' + alertDataJSON[productType].node;
      }
    }

    for (let index = 0; index < writeContent.length; index++) {
      let temp = [];

      for (let stepIndex = 0; stepIndex < writeContent[index].length; stepIndex++) {
        let writeContentJSON = JSON.parse(writeContent[index][stepIndex]);

        let simpleKeyName = writeContentJSON[productType].runid + '_' + writeContentJSON[productType].node;
        // console.log(writeContentJSON);

        if (simpleKeyName === simpleAlertJSON[simpleKeyName]) {
          let alertDataJSON = JSON.parse(alertData[index][stepIndex]);
          alertDataJSON[productType].count = writeContentJSON[productType].count + 1;
          writeContentJSON[productType].count = writeContentJSON[productType].count + 1;

          alertData[index][stepIndex] = JSON.stringify(alertDataJSON);
          writeContent[index][stepIndex] = JSON.stringify(writeContentJSON);

          // console.log(simpleKeyName, alertData[index][stepIndex]);
        } else {
          writeContentJSON[productType].count += 1;
          writeContent[index][stepIndex] = JSON.stringify(writeContentJSON);

          if (alertDataJSON[productType].count < 4) {
            temp.push(JSON.stringify(writeContentJSON));
          }
        }
      }
      if (temp.length > 0) {
        finalArray.push(temp);
      }
    }
    // console.log(alertData);

    for (let index = 0; index < alertData.length; index++) {
      let temp = [];
      for (let stepIndex = 0; stepIndex < alertData[index].length; stepIndex++) {
        let alertDataJSON = JSON.parse(alertData[index][stepIndex]);
        if (alertDataJSON[productType].count < 4) {
          temp.push(JSON.stringify(alertDataJSON));
        }
      }
      if (temp.length > 0) {
        finalArray.push(temp);
      }
    }
    console.log(finalArray);

    return finalArray;
    // for (let index = 0; index < alertData.length; index++) {
    //   for (let stepIndex = 0; stepIndex < alertData[index].length; stepIndex++) {
    //     for (let writeIndex = 0; writeIndex < writeContent.length; writeIndex++) {
    //       for (let writeStepIndex = 0; writeStepIndex < writeContent[writeIndex].length; writeStepIndex++) {
    //         let alertDataJSON = JSON.parse(alertData[index][stepIndex]);
    //         let writeContentJSON = JSON.parse(writeContent[writeIndex][writeStepIndex]);
    //         // console.log(alertDataJSON, writeContentJSON);
    //         if (
    //           alertDataJSON[productType].runid == writeContentJSON[productType].runid &&
    //           alertDataJSON[productType].node == writeContentJSON[productType].node
    //         ) {
    //           finalArray.push(alertData[index][stepIndex]);
    //           matchConut += 1;
    //           continue;
    //         }
    //       }
    //     }
    //   }
    // }
    // for (let writeIndex = 0; writeIndex < writeContent.length; writeIndex++) {
    //   for (let writeStepIndex = 0; writeStepIndex < writeContent[writeIndex].length; writeStepIndex++) {
    //     writeContentCount += 1;
    //   }
    // }
    // // console.log(writeContent, alertData);
    // if (writeContentCount == matchConut) {
    //   console.log('match');
    //   return true;
    // } else {
    //   console.log('not match');
    //   return false;
    // }
  }
}

const webJSONListPath = {
  nips: '../NIPS/nips_progress_tail.json',
  sg: '../SG/sg_progress_tail.json',
  iona: '../IONA/iona_progress_tail.json'
};

let cron = require('node-cron');
let data = [];
let alertData = [];
let alertCompareData = {};
let sampleRun;
const fs = require('fs');
const writeFile = (filename, content) => {
  fs.writeFile(filename, content, () => {});
};
// let datetime = new Date();
// console.log('Before running a task every minute - ' + datetime);

// cron.schedule('0 */1 * * *', function() {
let datetime = new Date();
console.log('running a task every minute - ' + datetime);
data.nips = JSON.parse(fs.readFileSync(webJSONListPath.nips).toString());
data.sg = JSON.parse(fs.readFileSync(webJSONListPath.sg).toString());
data.iona = JSON.parse(fs.readFileSync(webJSONListPath.iona).toString());

for (let productType in data) {
  alertData = [];

  for (let index = 0; index < data[productType].length; index++) {
    if (data[productType][index].closed == '0' || data[productType][index].closed == '') {
      let sample = data[productType][index];
      sampleRun = filterSampleRun(sample, productType);

      if (typeof sampleRun != 'undefined' && sampleRun.length > 0) {
        // console.log(sampleRun, 'aaa', sampleRun.length);
        alertData.push(sampleRun);
      }
    }
  }

  let writeContentPath = '../mailCheckBox/' + productType + '_mailContent.txt';
  let writeCheckPath = '../mailCheckBox/' + productType + '_mailCheck.txt';
  console.log(productType, alertData);
  console.log('################');

  let flag = 0;
  if (fs.existsSync(writeContentPath) && fs.existsSync(writeCheckPath) && alertData.length > 0) {
    let count = parseInt(fs.readFileSync(writeCheckPath).toString());
    let writeContent = JSON.parse(fs.readFileSync(writeContentPath).toString());
    console.log('WriteContent');

    console.log(writeContent);

    let compareResult = compareMailContent(alertData, writeContent, productType, count);
    writeMailContent(compareResult, productType);
    writeFile(writeContentPath, JSON.stringify(writeContent));

    // console.log(compareResult);
    // console.log(alertData);

    // if (compareResult == true && count <= 2) {
    //   writeMailContent(alertData, productType);
    //   count += 1;
    //   writeFile(writeContentPath, JSON.stringify(alertData));
    //   writeFile(writeCheckPath, count);
    // } else if (compareResult == true && count > 2) {
    //   count += 1;
    //   writeFile(writeCheckPath, count);
    // } else if (compareResult == false) {
    //   writeMailContent(alertData, productType);
    //   writeFile(writeContentPath, JSON.stringify(alertData));
    //   writeFile(writeCheckPath, 1);
    // }
  } else {
    if (alertData != '' && alertData.length > 0) {
      writeFile(writeContentPath, JSON.stringify(alertData));
      writeFile(writeCheckPath, 1);
      writeMailContent(alertData, productType);
    }
  }
}
// });
