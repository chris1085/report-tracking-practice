function sendMail() {
  let subjectTitle = 'Report-Tracking System Notify - Permission denied';

  //引用 nodemailer
  let nodemailer = require('nodemailer');

  let maillist = {
    "nips": [
      // 'bmi.hcy@sofivagenomics.com.tw',
      'bmi.cfc@sofivagenomics.com.tw',
      'tklin@sofivagenomics.com.tw',
      'yichu@sofivagenomics.com.tw',
      'tsuling@sofivagenomics.com.tw',
      // 'nips@sofivagenomics.com.tw',
      'ying@sofivagenomics.com.tw',
      'tehyang.hwa@sofivagenomics.com.tw',
    ],
    "sg": [
      // 'bmi.hcy@sofivagenomics.com.tw',
      'bmi.cfc@sofivagenomics.com.tw',
      'tklin@sofivagenomics.com.tw',
      'yichu@sofivagenomics.com.tw',
      'tsuling@sofivagenomics.com.tw',
      // 'nips@sofivagenomics.com.tw',
      'ying@sofivagenomics.com.tw',
      'tehyang.hwa@sofivagenomics.com.tw',
    ],
    "iona": [
      // 'bmi.hcy@sofivagenomics.com.tw',
      'bmi.cfc@sofivagenomics.com.tw',
      'tklin@sofivagenomics.com.tw',
      'yichu@sofivagenomics.com.tw',
      'tsuling@sofivagenomics.com.tw',
      // 'iona@sofivagenomics.com.tw',
      'yuchen@sofivagenomics.com.tw',
      'tehyang.hwa@sofivagenomics.com.tw',
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
    text: 'Please confirm the status between the transferred log files', // plaintext body
    //嵌入 html 的內文
    // html: content,


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
  transporter.sendMail(options, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('訊息發送: ' + info.response);
    }
  });
}



let delPath = "/data1/CFC/sofiva/del";

fs = require('fs');
let delContent = fs.readFileSync(delPath).toString();

if (delContent.match("Permission denied")) {
  sendMail();
  // console.log(typeof (delContent));
}