var express = require("express");
var path = require("path");
var fs = require("fs");

var app = express();

var PORT = process.env.PORT || 3000 ;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

let savedNotes;

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
  });
  
app.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/api/notes", function(req, res) {
  fs.readFile("./db/db.json", "utf8", function(err, data) {
    if (err) throw err;
    savedNotes = JSON.parse(data);
    res.json(savedNotes);
  });
});

app.post("/api/notes", function(req, res) {
  console.log(req.body);
;   var title = req.body.title;
    var noteText = req.body.text;

  fs.readFile("./db/db.json", "utf8", function(err, data) {
    if (err) throw err;

    var savedNotes = JSON.parse(data);
    var noteID = savedNotes[savedNotes.length - 1].id;
    console.log("is something wrong with id?");
 
    savedNotes.push({
     id: noteID + 1,
     title: title,
     text: noteText
  })

  fs.writeFile("./db/db.json", JSON.stringify(savedNotes), "utf8", function(err) {
     if (err) throw err;
     console.log("hello");
    })
   })
   res.end();
});

app.delete("/api/notes/:id", function(req, res) {
   var deleteID = req.params.id;
   console.log("am i working?");

   fs.readFile("./db/db.json", "utf8", function(err, data) {
    if (err) throw err;
    var savedNotes = JSON.parse(data);
    const result = savedNotes.filter(note => note.id != deleteID);
   
   fs.writeFile("./db/db.json", JSON.stringify(result), "utf8", function(err) {
       if (err) throw err;
   })
  })
  res.end();
});


app.listen(PORT, function() {
  console.log(`Listening at: http://localhost:${PORT}`);
});