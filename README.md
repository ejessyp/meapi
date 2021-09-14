# Me Api
===================


## Get all files

GET /data

##Get one file with filename

GET /data/:filename

## Create a new file

POST /data with bodyParser

{filename:"file1",
"content", "this is a test"}

## Delete a file

DELETE /data wtih bodyParser
{filename:"file1"}
-------------------
## Update a file

PUT /data  wtih bodyParser
{"content", "this is a test"}
-------------------
