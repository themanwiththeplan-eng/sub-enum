#!/usr/bin/env node
const yargs = require('yargs');
const axios = require('axios').default;
const fs = require('fs');
const readline = require('readline');
const lineReader = require('line-reader');

let args = yargs.argv;

let path = args.p;
let subdomain = args.d;
let key = args.k;
let probe = args.probe;
let port = args.port;

if(path){
    lineReader.eachLine(path, function(line){
        console.log(`Line from file: ${line}`);
    })
}else if(subdomain){
    let initialSearch = `https://subdomains.whoisxmlapi.com/api/v1?apiKey=${key}&domainName=${subdomain}`;
    console.log(initialSearch);
    axios.get(initialSearch, {

    }).then((response) =>{
        for(let i = 0; i < response.data.result.records.length; i++){
            console.log(response.data.result.records[i].domain);
        }
    })
    
}else if(probe){
    lineReader.eachLine(probe, function(line) {
        console.log(`${line}`);
        axios.get(line),{

        }.then((response) =>{
            console.log(response);
        })
      });
    
}else{
    console.log(`Please use a flag`);
}
