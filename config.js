/* 
*  Create and export configuration variables
*
*/

// Container for all the environments
const environments = {};

// Staging (default) environment
environments.staging = {
    'port': 3000,
    'envName': 'Stage'
}

// Production environment
environments.production = {
    'port': 5000,
    'envName': 'Production'
}

// Determine which environment was passed as a command line argument
 const currentEnvironment = typeof(process.env.NODE_ENV)  == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current environment is set to one of the keys on the environments object
const evironmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

//export the module
module.exports = evironmentToExport;