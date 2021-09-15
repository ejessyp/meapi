# Me Api
[![Build Status](https://app.travis-ci.com/ejessyp/meapi.svg?branch=main)](https://app.travis-ci.com/ejessyp/meapi)

## Run testsuite
Clone the repo and run the testsuite using a local environment(a local mongodb:  mongodb://localhost:27017/test)

## Local development environment
Install the development tools and execute the validation tools and the testsuite.
´´´´
npm install
npm test
´´´´
## Get all files

GET /data

## Get one file with filename

GET /data/:filename

## Create a new file

POST /data with bodyParser

{filename:"file1",
"content", "this is a test"}

## Delete a file

DELETE /data wtih bodyParser
{filename:"file1"}

## Update a file

PUT /data  wtih bodyParser
{"content", "this is a test"}
