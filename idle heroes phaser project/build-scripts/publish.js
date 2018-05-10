const replace = require('replace-in-file');
const exec = require('child_process').exec;
const fs = require('fs');
const execSync = require('child_process').execSync;
const kebabCase = require('kebab-case');
const pjson = require('../package.json');

var iecSettings = JSON.parse(fs.readFileSync('./iec-settings.json', 'utf8'));
var localisation = JSON.parse(fs.readFileSync('./localisation.json', 'utf8'));


var path = 'dist';

var label, fileString;

var logThis = convertToArray(iecSettings);

// console.log(logThis);

var settingCombinations = getCombinations(logThis, logThis.length);

var labels = getLabels(iecSettings);

var name, value, token, replaceText, replaceValue;

var options = {};

var index;

exec('rm -r ' + path, function(err, stdout, stderr) {

    exec('mkdir dist', function(err, stdout, stderr) {

        for (var key in localisation) {
            if (localisation.hasOwnProperty(key)) {


                settingCombinations.forEach(function(specificCombination) {
                    label = pjson.name + '-' + key + '-';

                    index = 0;

                    fileString = '';

                    specificCombination.forEach(function(option) {

                        fileString += "PiecSettings." + labels[index] + " = ";

                        console.log("LABELS ------ " + labels[index]);

                        if (Number.isInteger(option)) {
                            fileString += option + ";\n";
                        } else {
                            fileString += "'" + option + "';\n";
                        }

                        label += kebabCase(labels[index]) + "-" + option + "-";

                        index++;
                    }, this);

                    label = label.slice(0, -1);

                    execSync('cp -R build dist/' + label);

                    fs.appendFileSync('dist/' + label + '/settings.js', fileString);

                    // fs.copyFileSync(specificCombination[0],'dist/' + label + '/settings.js');
                    // fs.createReadStream(specificCombination[0]).pipe(fs.createWriteStream('dist/' + label + '/settings.js'));

                    replaceText = [];
                    replaceValue = [];

                    localisation[key].forEach(function(item, i) {

                        name = Object.keys(item)[0];
                        token = "\{\{" + Object.keys(item)[0] + "\}\}";
                        value = item[name];
                        replaceText.push(new RegExp(token, "g"));
                        replaceValue.push(value);

                    }, this);

                    console.log('dist/' + label + '/*.html');
                    console.log(replaceText);
                    console.log(replaceValue);

                    replace.sync({
                        files: 'dist/' + label + '/*.html',
                        replace: replaceText,
                        with: replaceValue
                    });

                }, this);
            }
        }
    });
});


function convertToArray(obj) {
    var arr = [];

    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (Array.isArray(obj[key])) {
                arr.push(obj[key]);

            } else {
                arr.push([obj[key]]);
            }
        }
    }

    return arr;
}

function getCombinations(arr, n) {
    var i, j, k, elem, l = arr.length,
        childperm, ret = [];
    if (n == 1) {
        for (var i = 0; i < arr.length; i++) {
            for (var j = 0; j < arr[i].length; j++) {
                ret.push([arr[i][j]]);
            }
        }
        return ret;
    } else {
        for (i = 0; i < l; i++) {
            elem = arr.shift();
            for (j = 0; j < elem.length; j++) {
                childperm = getCombinations(arr.slice(), n - 1);
                for (k = 0; k < childperm.length; k++) {
                    ret.push([elem[j]].concat(childperm[k]));
                }
            }
        }
        return ret;
    }
    i = j = k = elem = l = childperm = ret = [] = null;
}

function getLabels(iecSettings) {
    var arr = [];


    for (var key in iecSettings) {
        if (iecSettings.hasOwnProperty(key)) {
            arr.push(key);
        }
    }


    return arr;
}
