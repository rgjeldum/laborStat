// Read in sa.state file 
var fs = require('fs');
var file = fs.readFileSync('sa.state').toString().split("\n");
var map = {};
count = 0
for(i in file) {
    // Skip the first two lines
    if (count > 1 && file[i]) {
        var line = file[i].trim('\r').split('\t');
        map[line[0]] = line[1]
    }
    count++
}

// Read in the file of state abbrev
var file = fs.readFileSync('us_states.csv').toString().split("\n");
var stateCode = {};
for(i in file) {
    var line = file[i].split(',');
    stateCode[line[1]] = line[2]
}

// Read in Labor-output.txt
file = fs.readFileSync('Labor-output.txt').toString().split("\n");
var LaborData; 
LaborData = {};
for(i in file) {
    if (!file[i]) continue;
    var line = file[i].trim(':').split(/ |\t/);
    // Year
    var year = line[6]
    if (!LaborData[year]) {
        LaborData[year] = {}
    }
    // Month
    var month = line[9]
    month =  month.substring(0,month.length - 1)    
    if (!LaborData[year][month]) {
        LaborData[year][month] = {}
    }
    // State
    var state =  stateCode[map[line[1]]]
    if (!LaborData[year][month][state]) {
        LaborData[year][month][state] = {}
    }
    // average wage
    if (line[2] == 'average') {
        var avg =  line[10]
        LaborData[year][month][state].average = avg
    }
    // median wage
    if (line[2] == 'median') {
        var med =  line[10]
        LaborData[year][month][state].median = med
    }
}

var output = JSON.stringify(LaborData, null, "  ");
fs.writeFile('jsonOUtput.json', output, function (err,data) {
  if (err) {
    return console.log(err);
  }
});