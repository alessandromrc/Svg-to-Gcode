#!/usr/bin/env node

var fs = require('fs'),
    program = require('commander'),
    GCanvas = require('gcanvas'),
    canvg = require("canvg");

program
    .usage('[options] <file ...>')
    .option('-s, --speed <number>', 'spindle speed', eval)
    .option('-f, --feed <number>', 'feed rate', eval)
    .option('-d, --depth <number>', 'z of final cut depth', eval)
    .option('-c, --depthofcut <number>', 'z offset of layered cuts', eval)
    .option('-t, --top <number>', 'z of top of work surface', eval)
    .option('-a, --above <number>', 'z of safe area above the work', eval)
    .option('-D, --tooldiameter <number>', 'diameter of tool', eval)
    .option('-p, --positive', 'Treat fill as positive, cutting only around the outside')

program.parse(process.argv);

var gctx = new GCanvas();

if (program.speed) gctx.speed = program.speed;
if (program.feed) gctx.feed = program.feed;
if (program.depth) gctx.depth = program.depth;
if (program.depthofcut) gctx.depthOfCut = program.depthofcut;
if (program.top) gctx.top = program.top;
if (program.above) gctx.aboveTop = program.above;
if (program.tooldiameter) gctx.toolDiameter = program.tooldiameter;

if (program.positive) {

    gctx.fill = function(windingRule, depth) {
        gctx.save();
        gctx.strokeStyle = gctx.fillStyle;
        gctx.stroke('outer', depth);
        gctx.restore();
    }
}


async function run(file) {
    var svg = '' + fs.readFileSync(file);
    canvg(gctx.canvas, svg)
    console.log('M30');
}
if (program.args.length === 0 && process.stdin.isTTY) {
    program.outputHelp();
    process.exit(0);
}
if (!process.stdin.isTTY) {
    run('/dev/stdin');
}

program.args.forEach(function(file) {
    run(file)
});

if (program.top > 0) {
    gctx.motion.rapid({ z: 0 });
} else {
    gctx.motion.retract();
}


process.exit(0);