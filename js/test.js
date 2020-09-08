const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://192.168.228.18:27017/";
MongoClient.connect(url, function (err, db) {
  if (err) throw err;
  let dbo = db.db("sofiva");
  let data = dbo.collection("nips").find().sort({ runid: -1 }).limit(10);

  data.toArray().then((result) => {
    result.reverse().forEach((element) => console.log(element.runid));

    db.close();
  });
});
