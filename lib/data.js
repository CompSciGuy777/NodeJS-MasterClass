/* This file is for storing and editing Data */

// Node Modules
const fs = require('fs');
const path = require('path');

//Create a container for this module
const lib = {};

// Base directory of the data folder
lib.baseDir = path.join(__dirname, '/../data/');

// Writing to the file
lib.create = (dir, filename, data, callback) => {
    //open the file for writing
    fs.open(lib.baseDir + dir + '/' + filename + '.json', 'wx' , (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            // Convert Data to string
            let stringData = JSON.stringify(data);
        }else {
            callback('Could not create new file, it already exists');
        }
    });
}




//export the module
module.exports = lib;