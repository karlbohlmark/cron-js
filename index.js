#!/usr/bin/env node

var fs = require('fs')
var exec = require('child_process').exec

var withTimeout = require("with-timeout")

var args = process.argv.slice(1)

fs.readdir('/job', function (err, jobs) {
    var jobSpecs = jobs.map(function (j) {
        var interval = parseInt(fs.readFileSync("/job/" + j + "/interval").toString())
        return {
            name: j,
            interval: interval * 1000
        }
    })

    runJobs(jobSpecs)
})


function runJob(job) {
    var timeout = job.interval
    var timedExec = withTimeout(exec, timeout)
    timedExec("/job/" + job.name + "/run", function (err, stdout, stderr) {
        stdout && process.stdout.write(stdout)
        stderr && process.stderr.write(stderr)
        setTimeout(runJob.bind(null, job), job.interval)
    })
}

function runJobs(jobs) {
    jobs.forEach(runJob)
}