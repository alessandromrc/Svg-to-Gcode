var img2gcode = require("./img2gcode/src/");
var ProgressBar = require("progress");
var bar = new ProgressBar("Analyze: [:bar] :percent :etas", { total: 100 });
img2gcode
/*Options

- `toolDiameter` (number) Tool diameter. **default:** 1
- `sensitivity` (number) Intensity sensitivity. 0 to 1. **default:** 0.95
- `scaleAxes` (number) Image height in mm. **default:** image.height equal mm
- `deepStep` (number) Depth per pass. **default:** -1
- `invest` { x: (boolean), y: (boolean) } **default:** {x: false, y: true}.
- `dirImg` (string) Image path, accepts JPEG JPG PNG GIF formats.
- `whiteZ` (number) White pixels. **default:** 0
- `blackZ` (number) Maximum depth (Black pixels).
- `safeZ` (number) Safe distance.
- `info` (string) Displays information. ["none" | "console" | "emitter"] **default:** none
- `feedrate` { work: (number), idle: (number) } Only the corresponding line is added. **default:** ''
- `laser` { commandPowerOn: (string), commandPowerOff: (string) } Is you set this options, Z command is will be ignore
*/
    .start({
        toolDiameter: 0.00045,
        sensitivity: 1,
        scaleAxes: 128,
        feedrate: { work: 1200, idle: 3000 },
        deepStep: 0,
        laser: {
            commandPowerOn: "M04",
            commandPowerOff: "M05",
        },
        whiteZ: 0,
        blackZ: -3,
        safeZ: 1,
        info: "emitter",
        dirImg: __dirname + "/test.png",
    })
    .on("log", (str) => {
        console.log(str);
    })
    .on("tick", (perc) => {
        bar.update(perc);
    })
    .then((data) => {
        console.log(data.dirgcode);
        process.exit();
    });