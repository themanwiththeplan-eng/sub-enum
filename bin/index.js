#!/usr/bin/env node
const yargs = require("yargs");
const axios = require("axios").default;
const fs = require("fs");
const readline = require("readline");
const lineReader = require("line-reader");
const { error } = require("console");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let args = yargs.argv;

let path = args.p;
let subdomain = args.d;
let key = args.k;
let fileprobe = args.fp;
let defaultport = "443";
let probe = args.probe;
let specport = args.sp;
let asn = args.asn;
let help = args.h;

//TODO: Work on Logo

if (path) {
  lineReader.eachLine(path, function (line) {
    console.log(`Line from file: ${line}`);
  });
} else if (subdomain) {
  // TODO: Finish working on subdomain enumeration
  // TODO: Write subdomains to a file after enumeration
  let initialSearch = `https://subdomains.whoisxmlapi.com/api/v1?apiKey=${key}&domainName=${subdomain}`;
  console.log(initialSearch);
  axios.get(initialSearch, {}).then((response) => {
    for (let i = 0; i < response.data.result.records.length; i++) {
      console.log(response.data.result.records[i].domain);
    }
  });
} else if (fileprobe) {
  // TODO: Continue to work on making the filtering mechanism better
  // TODO: Work or probing specport for an entire file
  lineReader.eachLine(fileprobe, function (line, last) {
    let l = [];
    l.push(line);
    // console.log(l);
    for (let i = 0; i < l.length; i++) {
      // console.log(l[i]);
      axios
        .get(l[i], {})
        .then((response) => {
          if (response.status == 200) {
            console.log(l[i]);
            let arr = [l[i]];
            fs.appendFile("reconfile", arr + "\n", (err) => {
              if (err) {
                console.log(err);
              }
            });
          }
        })
        .catch(function (error) {
          if (error.response) {
            console.log(error.response.status);
          } else if (error.request) {
            console.log(error.request.status);
          }
        })
        .then(function () {
          if (last) {
            process.exit();
          }
        });
    }
  });
} else if (probe) {
  axios
    .get(probe + `:${defaultport}`, {})
    .then((response) => {
      if (response.status == 200) {
        console.log(probe);
      }
    })
    .catch(function (error) {
      if (error.response) {
        console.log(error.response.status);
      } else if (error.request) {
        console.log(`Not a 200`);
      }
    });
} else if (specport) {
  rl.question(`URL:`, function (url) {
    rl.close();
    let x = url + ":" + specport;
    axios
      .get(x, {})
      .then((response) => {
        if (response.status == 200) {
          console.log(x);
        }
      })
      .catch(function (error) {
        if (error.response) {
          console.log(error.response.status);
        } else if (error.request) {
          console.log(`Not a 200`);
        }
      });
  });
} else if (asn) {
  let asnurl = `https://api.hackertarget.com/aslookup?q=${asn}`;
  axios
    .get(asnurl, {})
    .then((response) => {
      console.log(response.data);
    })
    .then(function () {
      process.exit();
    });
} else if (help) {
  console.log(`The flags that you can use are: 
    
    --p : Use this with a file path to print the file line by line
    --d : Use this for subdomain enumeration
    --fp : Similar to httprobe, use this to scan a file for endpoints with status code of 200 on default port of 443
    --probe : Use this to scan a single endpoint for status 200 using default port 443
    --sp : Use this to scan single endpoint with any port that you will like, wizard setup... prompts for url
    --asn: Use this to find autonomous system numbers`);
  process.exit();
} else {
  console.log(`The flags that you can use are: 
    
    --p : Use this with a file path to print the file line by line
    --d : Use this for subdomain enumeration
    --fp : Similar to httprobe, use this to scan a file for endpoints with status code of 200 on default port of 443
    --probe : Use this to scan a single endpoint for status 200 using default port 443
    --sp : Use this to scan single endpoint with any port that you will like, wizard setup... prompts for url
    --asn: Use this to find autonomous system numbers`);
  process.exit();
}
