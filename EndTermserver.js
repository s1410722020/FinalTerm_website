// var JQuery = require("jquery");

var express = require("express");
var formidable = require("formidable");
var fs = require("fs");
server = express();
var bodyParser = require("body-parser");
var sizeOf = require("image-size")
var Datastore = require('nedb');
var Announcement = new Datastore({ filename: __dirname + '/FinalTermdata/update.db', autoload: true });
var Users = new Datastore({ filename: __dirname + '/FinalTermdata/usersresponse.db', autoload: true });

  // var userData = [
// {"title":"試看看布告欄底下功能","date":"2020/12/22","img":"test","content":"內容測試測試，希望能成功"}];
//  {"title":"測試分頁1","date":"2021/1/7","img":"test","content":"分頁加油啊1"},
//  {"title":"測試分頁2","date":"2021/1/7","img":"test","content":"分頁加油啊2"},
//  {"title":"測試分頁3","date":"2021/1/7","img":"test","content":"分頁加油啊3"},
//  {"title":"測試分頁4","date":"2021/1/7","img":"test","content":"分頁加油啊4"},
//  {"title":"測試分頁5","date":"2021/1/7","img":"test","content":"分頁加油啊5"},
//  {"title":"測試分頁6","date":"2021/1/7","img":"test","content":"分頁加油啊6"}];


// Announcement.insert(userData);

// var userData2 = [
//   {"name":"蛋包飯","content2":"訪客回饋專區測試"}

// ];
// Users.insert(userData2);

server.use(express.static('FinalTerm_web'));
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

server.set("view engine", "ejs");
server.set("views", __dirname + "/FinalTermviews")

// server.get("/", function(req, res){
//     res.send("Hello World!");
//   });
server.post("/submitForm", function (req, res) {

});
server.post("/response", function (req, res) {
  var form = formidable.IncomingForm();
  form.maxFileSize = 500 * 1024;
  form.parse(req, function (err, fields, files) {
    if (err) {
      console.log("File size too large!");
      res.render("error", { error: err.message, next: "javascript:history.back()" })
      //res.redirect("/error.html");
    } else {
      var gotFields = fields;
      var fileExt = files.poster.name.split(".")[1];
      gotFields.poster = gotFields.id + "." + fileExt;
      var posterPath = "FinalTerm_web/uploads/" + gotFields.poster;
      fs.renameSync(files.poster.path, posterPath);
      //check image size
      sizeOf(posterPath, function (err, dim) {
        if (err) {
          res.render("error", { error: "Cannot read uploaded image file.", next: "javascript:history.back()" })
        } else {
          //res.render("game", { id: gotFields.id })
          res.render("success", { success: "Success uploaded.", next: "javascript:history.back()" });

        }
      })
    }
  });
});

// server.post("/add", function (req, res) {
//   var form = formidable.IncomingForm();
//   form.maxFileSize = 200 * 1024;
//   form.parse(req, function (err, fields, files) {
//     if (err) {
//       console.log("File size too large!");
//       res.render("error", { error: err.message, next: "javascript:history.back()" })
//       //res.redirect("/error.html");
//     } else {
//       var gotFields = fields;
//       var fileExt = files.poster.name.split(".")[1];
//       gotFields.poster = gotFields.id + "." + fileExt;
//       var posterPath = "FinalTerm_web/uploads/" + gotFields.poster;
//       fs.renameSync(files.poster.path, posterPath);
//       //check image size
//       sizeOf(posterPath, function (err, dim) {
//         if (err) {
//           res.render("error", { error: "Cannot read uploaded image file.", next: "javascript:history.back()" })
//         } else {
//           if (dim.width != 800 || dim.height != 400) {
//             res.render("error", { error: "Image size require 800*400.", next: "javascript:history.back()" })
//             fs.unlinkSync(posterPath);
//           } else {//上傳成功
//             //record to database
//             res.render("game", { id: gotFields.id })
//           }
//         }
//       })
//     }
//   })
// });

var count = Users.count;
// <%! int cnt = 0; %>;

server.post("/visitormessage", function (req, res) {
  // Users.find({}, function (err, res) {
  //   if (err == null) {
  count++;
  console.log(count);
  Users.insert(req.body);
  res.render("success", { success: "Success Send", next: "VisitorMessagePage.html" });
  //   }
  // });
});

server.post("/Manegerupdate", function (req, res) {
    // var fileExt = req.body.img.split(".")[1];
   req.body.img = req.body.img.split(".")[0];
    Announcement.insert(req.body);
    res.render("success", { success: "Success Send", next: "ManagerUpdate.html" });

  });


// var AdmZip = require('adm-zip');
// const { response } = require("express");
// const { name } = require("ejs");

// server.post("/addgamefile", function (req, res) {
//   var form = formidable.IncomingForm();
//   form.maxFileSize = 4000 * 1024;
//   form.parse(req, function (err, fields, files) {
//     if (err) {
//       console.log("File size too large!");
//       res.render("error", { error: err.message, next: "javascript:history.back()" })
//     } else {
//       var gamepath = "FinalTerm_web/game/" + fields.id;
//       var ext = files.gamezip.name.split(".")[1];
//       try {
//         if (ext == "zip") {
//           var zip = new AdmZip(files.gamezip.path);
//           zip.extractAllTo(gamepath, true);
//           res.render("success", { success: "Success uploaded." });
//         }
//       } catch (err) {
//         res.render("error", { error: "cannot unzip uploaded file" })
//       }
//       fs.unlinkSync(files.gamezip.path);

//     }
//   })
// })

server.get("/announcement", function (req, res) {

  Announcement.find({}).sort({ date: -1 }).exec(function (err, result) {
    if (err == null) {
       res.render("announcement", { list: result });
      // res.send({list:result});
    }
  });
});

server.get("/update", function (req, res) {
  // var form = formidable.IncomingForm();
  // Announcement.find({}).sort({date:-1}).exec(function (err, result){
  //   if (err == null) {
  if (req.query.content == "undefined")
    req.query.content = "暫無設定內容";
  res.render("update", { "date": req.query.date, "img": req.query.img, "title": req.query.title, "content": req.query.content, next: "javascript:history.back()" });

  // }

  // Announcement.find({},function(err,res){
  //   if (err == null) {
  //     res.render("update", { list: result });
  //   }
  // });
});

server.get("/forum", function (req, res) {
  Users.find({}, function (err, result) {
    if (err == null) {
      res.render("Forum", { response: result });
    }
  });
});

server.get("/", function (req, res) {
  //res.send("Hello World!");
  res.redirect("/HomePage.html");

});

server.get("*", function (req, res) {
  res.send("Page not found", 404);
});



server.listen(8080);
console.log("Server running on port: 8080")