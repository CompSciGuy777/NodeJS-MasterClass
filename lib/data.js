/* This file is for storing and editing Data */

// Node Modules
const fs = require('fs');
const path = require('path');

//Create a container for this module
const lib = {};

// Base directory of the data folder
lib.baseDir = path.join(__dirname, '/../.data/');

// Writing to the file
lib.create = (dir, filename, data, callback) => {
    //open the file for writing
    fs.open(lib.baseDir + dir + '/' + filename + '.json', 'wx' , (err, fileDescriptor) => {
        if (!err && fileDescriptor) {

            // Convert Data to string
            let stringData = JSON.stringify(data);

            // write to file and close it
            fs.writeFile(fileDescriptor, stringData, (err) => {
                if (!err) {
                    fs.close(fileDescriptor, (err) => {
                        if (!err) {
                            callback(false);
                        } else {
                            callback('error closing new file');
                        }
                    })
                } else {
                    callback('error writing to new file');
                }

            });
        }else {
            callback('Could not create new file, it already exists');
        }
    });
};

lib.read = (dir, filename, callback) => {
    fs.readFile(lib.baseDir + dir + '/' + filename + '.json', 'utf-8', (err, data) => {
       callback(err, data);
    });
};


//Update the data inside a file
lib.update = (dir, filename, data, callback) => {
    //use FS to open
    fs.open(lib.baseDir+dir+'/'+filename+'.json','r+',function(err,filedescriptor){
        if(!err && filedescriptor) {
            const stringData = JSON.stringify(data);

            //truncate file
            fs.truncate(filedescriptor, function(err){
                if(!err) {
                    //write file and close
                    fs.writeFile(filedescriptor, stringData, function(err){
                        if(!err) {
                            fs.close(filedescriptor, (err) => {
                                if(!err) {
                                    callback(false);
                                } else {
                                    callback('failed to close the file');
                                }
                            })
                        } else {
                            callback('Error writing to existing file');
                        }
                    });
                } else {
                    callback("There was an error truncating the file");
                }
            });

        } else {
            callback('Could not open the file for updating, it may not exist yet')
        }
    });
};


lib.delete = (dir, filename, callback) => {
    fs.unlink(lib.baseDir+dir+'/'+filename+'.json', (err) => {
        if(!err) {
            callback(false)
        }else{
            callback('There was an error deleting the file');
        }
    });
};


//export the module
module.exports = lib;