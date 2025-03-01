const colors = require('colors/safe');
const path = require('path');
const jsdiff = require('diff');
const fs = require('fs');
const mkdirp = require('mkdirp');

function normalizeESLintReport(eslintOutputFile) {
    const isWindows = path.sep === '\\' || process.platform === 'win32';

    // Clean up environment depended pwd
    let pwd = path.resolve('.') + path.sep;
    if (isWindows) {
        pwd = pwd.replace(/\\+/g, '\\\\');
    }

    let newLibsLintReport = eslintOutputFile
        .replace(new RegExp(pwd, 'g'), '') // remove pwd
        .replace(/\n.*\n.*$/, ''); // remove totals

    if (isWindows) {
        newLibsLintReport = newLibsLintReport
            .replace(/\\(?=.+: line)/gm, '/')   // normalizing path
            .replace(/\r?\n/g, "\r\n");  // add proper line brakes
    }

    return newLibsLintReport;
}

function updateESLintReport() {
    const pathToReport = process.env.LIBS_LINT_REPORT_NAME;
    const eslintOutputFile = fs.readFileSync(pathToReport, {encoding: 'utf8'});
    const normalizedLibsLintReport = normalizeESLintReport(eslintOutputFile);
    fs.writeFileSync(pathToReport, normalizedLibsLintReport);
    return normalizedLibsLintReport;
}

function createDiffReport(prevLibsLintReport, newLibsLintReport) {
    let diff = jsdiff.diffLines(prevLibsLintReport, newLibsLintReport, {ignoreWhitespace: true});

    return diff.reduce(function (memo, part) {
        if (part.added || part.removed) {
            let color = part.added ? 'red' : 'green';
            let mark = part.added ? '! ' : '- ';
            let diffLine = mark + part.value;
            let colorFunc = colors[color];

            console.log(colorFunc.call(colorFunc, diffLine));

            if (memo) {
                memo += "\n";
            }

            memo += diffLine;
        }

        return memo;
    }, "");
}

function processReport(eslintOutputFile) {
    const masterLibsLintReportPath = process.env.MASTER_LIBS_LINT_REPORT_NAME;

    if (fs.existsSync(masterLibsLintReportPath)) {
        const prevLibsLintReport = fs.readFileSync(masterLibsLintReportPath, {encoding: 'utf8'});

        let diffReport = createDiffReport(prevLibsLintReport, eslintOutputFile);

        if (diffReport) {
            console.log("[Error]: We found a difference between existing list of linter errors, and the new ones.");
            console.log("[Error]: List of existing errors can be found in a file: " + process.env.MASTER_LIBS_LINT_REPORT_NAME);
            console.log("[Error]: List of new errors can be found in a file: " + process.env.LIBS_LINT_NEW_REPORT_NAME);
            console.log("[Error]: The difference between new and existing can be found in a file: " + process.env.LINT_DIFF_REPORT_NAME);

            let filePath = process.env.LIBS_LINT_NEW_REPORT_NAME;
            let dirPath = path.dirname(filePath);
            mkdirp(dirPath);
            fs.writeFileSync(filePath, eslintOutputFile);

            filePath = process.env.LINT_DIFF_REPORT_NAME;
            dirPath = path.dirname(filePath);
            mkdirp(dirPath);
            fs.writeFileSync(filePath, diffReport);

            process.exit(1);
        }
    } else {
        fs.writeFileSync(masterLibsLintReportPath, eslintOutputFile);
    }
}

const normalizedLibsLintReport = updateESLintReport();
processReport(normalizedLibsLintReport);
