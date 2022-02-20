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
  // TODO: Add more sources
  // TODO: Write subdomains to a file after enumeration
  // TODO: Slice strings to make output look better and more readable to be used in conjuction with fileprobe
  wbUrl = `http://archive.org/wayback/available?url=${subdomain}`;
  axios.get(wbUrl, {}).then((response) => {
    let arr = [];
    let waybackUrl = response.data.archived_snapshots.closest.url;
    arr.push(JSON.stringify(waybackUrl));
    // console.log(arr);
    let htApi = `https://api.hackertarget.com/hostsearch/?q=${subdomain}`;

    axios.get(htApi, {}).then((response) => {
      console.log(response.data);

      let stUrl = `https://api.securitytrails.com/v1/domain/${subdomain}/subdomains`;
      axios
        .get(stUrl, {})
        .then((response) => {
          // console.log(response);
        })
        .catch(function (err) {
          if (err.response) {
            console.log(err.response.status);
          } else if (err.request) {
            console.log(err.request.status);
          }
        })
        .then(function () {
          process.exit();
        });
    });

    //let scanUrl = `https://urlscan.io/api/v1/search?q=${subdomain}&size=100`;
  });
} else if (fileprobe) {
  // TODO: Make it so that the process exits after the last line is executed may have to use a do while loop
  // TODO: Make proof of concept for readme
  let w = process.argv[3];
  lineReader.eachLine(fileprobe, function (line) {
    let l = [];
    if (w) {
      l.push(`${line}:${w}`);
    } else {
      l.push(`${line}`);
    }
    // console.log(l);
    for (let i = 0; i < l.length; i++) {
      // console.log(l[i]);
      axios
        .get(l[i], {})
        .then((response) => {
          // console.log(response);
          if (
            response.status == 200 ||
            response.status >= 300 ||
            response.status <= 399
          ) {
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
