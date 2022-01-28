const http = require("http");
const fs = require("fs");
var requests = require("requests");

const homeFile = fs.readFileSync("index.html", "utf-8");
const replaceVal = (tempVal, orgVal) => {
  let temporary = tempVal.replace("{%tempval%}", orgVal.main.temp);
  temporary = temporary.replace("{%tempmin%}", orgVal.main.temp_min);
  temporary = temporary.replace("{%tempmax%}", orgVal.main.temp_max);
  temporary = temporary.replace("{%location%}", orgVal.name);
  temporary = temporary.replace("{%country%}", orgVal.sys.country);
  temporary = temporary.replace("{%tempStatus%}", orgVal.weather[0].main);
  return temporary;
};
const server = http.createServer((req, res) => {
  if ((req.url = "/")) {
    requests(
      "https://api.openweathermap.org/data/2.5/weather?q=Jabalpur&appid=f951210dd1bbc3097e9d9516f74e1b9a"
    )
      .on("data", (chunk) => {
        const objdata = JSON.parse(chunk);
        const arrData = [objdata];
        const realtimeval = arrData
          .map((val) => replaceVal(homeFile, val))
          .join("");
        res.write(realtimeval);
        // console.log(arrData[0].main.temp);
      })
      .on("end", (err) => {
        if (err) return console.log("connection closed due to errors", err);
        res.end();
      });
  } else {
    res.end("File not found");
  }
});

server.listen(8000, "127.0.0.1");
