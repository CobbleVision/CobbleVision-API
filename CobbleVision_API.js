var async_request = require("./lib/async_request_handler.js");
var mongoose = require("mongoose");
var isURL = require("is-url");
var fs = require("fs");

var environmentType = false;
var dirname = __dirname.replace("/CobbleVision-API", "")

if(fs.existsSync(dirname + "/environment_setup.js")){
    environmentType = require("../environment_setup.js").getEnvironmentType();
    var serverAdress = require("../environment_setup.js").getServerAdress();
} 

var valid_price_categories = ["high", "medium", "low"]
var valid_job_types = ["QueuedJob"];


//Debugging Level is set by user or false by default
var debugging = false;

/* Set the base url for communication with the api of CobbleVision (Default: https://www.cobblevision.com/api/)*/
if(environmentType == false || environmentType === "demo") exports.BaseURL = "https://www.cobblevision.com/api/";
else exports.BaseURL = serverAdress + "/api/";

/* Set your API Username. Find it at https://www.cobblevision.com/account/details */
var apiUserName = "";

/* Set your API Token. Find it at https://www.cobblevision.com/account/details */
var apiToken = "";

/** 
*  This function sets your API Username and API Token for the SDK to use! It does not verify your auth!
*  @async
*  @function setApiAuth()
*  @param {string} apiusername - Username of API
*  @param {string} apitoken - Token of API
*  @returns {boolean} Indicating Success of setting Auth Information
*/
exports.setApiAuth = function(apiusername, apitoken){
    apiUserName = apiusername;
    apiToken = apitoken;
    return true;
};

/** 
*  This function sets your API Username and API Token for the SDK to use! It does not verify your auth!
*  @param {boolean} debugBool - Boolean to trigger debuggging
*  @returns {boolean} Indicating Success of setting Debug Information
*/
exports.setDebugging = function(debugBool){
    debugging = debugBool;
    return true;
};

/**
 * Promise containing the request response from your API Request
 * @typedef {object} Response
 * @property {object} response Resolve: This is the response from the request npm module.
 * @property {object} body Resolve: This is the body of the request npm module.
 * @property {object} headers Resolve: This are the headers from the request npm module.
 * @property {string} error Error: Message of Error
 * @property {number} code Error: Code of Error
 */

/** 
*  This function uploads a media file to CobbleVision. You can find it after login in your media storage. Returns a response object with body, response and headers properties, deducted from npm request module
*  @async
*  @function uploadMediaFile()  
*  @param {string} price_category - Either high, medium, low
*  @param {boolean} publicBool - Make Media available publicly or not?
*  @param {string} name - Name of Media (Non Unique)
*  @param {array} tags - Tag Names for Media - Array of Strings
*  @param {buffer} file - File Buffer from fs.readFile() - instance of UInt8Array;
*  @returns {Response} This return the Upload Media Response. The body is in JSON format.
*/
exports.uploadMediaFile = async function(price_category, publicBool, name, tags, file){
    return new Promise(async function(resolve, reject){
        try{
            var endpoint = "media";
            if(exports.BaseURL.charAt(exports.BaseURL.length-1) != "/") throw new Error("Cobble Base Path must end with a slash '/'"); 

            var keyArray = ["price_category", "publicBool", "name", "tags", "Your API User Key", "Your API Token"];
            var valueArray = [price_category, publicBool, name, tags, apiUserName, apiToken];
            var typeArray = ["string","boolean","string", "array", "string", "string"];
            
            await checkTypeOfParameter(valueArray, typeArray).catch((err) => {
                err.message = parseInt(err.message);
                if(typeof(err.message) === "number") throw new Error("The provided data is not valid: " + keyArray[err.message] + " is not of type " + typeArray[err.message]);
                else throw new Error(err);
            });

            if(valid_price_categories.indexOf(price_category) == -1) throw new Error("Price Category is in wrong format!")
            if(!Buffer.isBuffer(file)) throw new Error("File Object is not of type Buffer!");           
            if(!(file instanceof Uint8Array)) throw new Error("File Object is not of type ArrayBuffer!");
     
            var jsonObject = {
                "price_category": price_category,
                "public": publicBool,
                "name": name,
                "tags": tags,
                "file": file.toString("binary"),
            }
            
            var urlOptions = {
                "url": exports.BaseURL + endpoint,
                "method": "POST",                  
                "body": jsonObject,
                "headers": {
                    "Content-Type": "application/json",
                },
                "auth":{
                    "user": apiUserName,
                    "pass": apiToken
                },
                "json":true
            }

            var response = await async_request.request(urlOptions).catch((err) => {throw new Error(err)});
            if(debugging) console.log("Response from Media Upload " + JSON.stringify(response.body));

            resolve(response);
        }catch(err){
            if(debugging) console.log(err);
            reject(err);
        }                 
    });
}

/** This function deletes Media from CobbleVision
*  @async
*  @function deleteMediaFile()  
*  @param {array} IDArray Array of ID's as Strings
*  @returns {Response} This return the Delete Media Response. The body is in JSON format.
*/
exports.deleteMediaFile = async function(IDArray){
    return new Promise(async function(resolve, reject){
        try{
            var endpoint = "media";
            if(exports.BaseURL.charAt(exports.BaseURL.length-1) != "/") throw new Error("Cobble Base Path must end with a slash '/'"); 

            var keyArray = ["IDArray", "Your API User Key", "Your API Token"];
            var valueArray = [IDArray, apiUserName, apiToken];
            var typeArray = ["array","string", "string"];
            
            await checkTypeOfParameter(valueArray, typeArray).catch((err) => {
                err.message = parseInt(err.message);
                if(typeof(err.message) === "number") throw new Error("The provided data is not valid: " + keyArray[err.message] + " is not of type " + typeArray[err.message]);
                else throw new Error(err);
            });

            var urlOptions = {
                "url": exports.BaseURL + endpoint + "?id=" + JSON.stringify(IDArray),
                "method": "DELETE", 
                "headers": {
                    "Content-Type": "application/json",
                },                 
                "auth":{
                    "user": apiUserName,
                    "pass": apiToken
                },
                "json":true
            }

            var response = await async_request.request(urlOptions).catch((err) => {throw new Error(err)});

            if(debugging) console.log("Response from Media Delete: " + response.response.statusCode)

            resolve(response);
        }catch(err){
            if(debugging) console.log(err);
            reject(err);
        }                 
    });
}

/** Launch a calculation with CobbleVision's Web API. Returns a response object with body, response and headers properties, deducted from npm request module;
*  @async
*  @function launchCalculation() 
*  @param {array} algorithms Array of Algorithm Names
*  @param {array} media Array of Media ID's  
*  @param {string} type Type of Job - Currently Always "QueuedJob"
*  @param {string} [notificationURL] Optional - Notify user upon finishing calculation!
*  @returns {Response} This returns the Launch Calculation Response. The body is in JSON format.
*/  
exports.launchCalculation = async function(algorithms, media, type, notificationURL){
    return new Promise(async function(resolve, reject){
        try{
            var endpoint = "calculation";
            if(exports.BaseURL.charAt(exports.BaseURL.length-1) != "/") throw new Error("Cobble Base Path must end with a slash '/'"); 
            var jsonObject = {};
            
            var keyArray = ["algorithms", "media", "type", "Your API User Key", "Your API Token"];
            var valueArray = [algorithms, media, type, apiUserName, apiToken];
            var typeArray = ["array","array","string", "string", "string"];
            
            await checkTypeOfParameter(valueArray, typeArray).catch((err) => {
                err.message = parseInt(err.message);
                if(typeof(err.message) === "number") throw new Error("The provided data is not valid: " + keyArray[err.message] + " is not of type " + typeArray[err.message]);
                else throw new Error(err);
            });

            if(valid_job_types.indexOf(type) == -1) throw new Error("Calculation Type is not valid! Please recheck with our API!");
            
	    //var invalidAlgorithms = algorithms.filter(algorithmID => !mongoose.Types.ObjectId.isValid(algorithmID))
            //if(invalidAlgorithms.length > 0) throw new Error("You supplied an algorithm ID, that is invalid in format.")

            var invalidMedia = media.filter(mediaID => !mongoose.Types.ObjectId.isValid(mediaID))
            if(invalidMedia.length > 0) throw new Error("You supplied a Media ID, that is invalid in format.")        
            
            if(notificationURL != null && !isURL(notificationURL)) throw new Error("The notification URL does not seem like a valid URL.")        
            
            jsonObject.algorithms = algorithms;
            jsonObject.media = media;
            jsonObject.type = type;
            if(notificationURL != null) jsonObject.notificationURL = notificationURL

            var urlOptions = {
                "url": exports.BaseURL + endpoint,
                "method": "POST",                  
                "body": jsonObject,
                "json":true,
                "headers": {
                    "Content-Type": "application/json",
                },
                "auth":{
                    "user": apiUserName,
                    "pass": apiToken
                }
            }

            var response = await async_request.request(urlOptions).catch((err) => {throw new Error(err)});
            if(debugging) console.log("Return from Create Calc: " + response.body);
            resolve(response);
        }catch(err){
            if(debugging) console.log(err);
            reject(err);
        }   
    });
};

/** This function waits until the given calculation ID's are ready to be downloaded!
*  @async
*  @function waitForCalculationCompletion() 
*  @param {array} calculationIDArray Array of Calculation ID's
*  @returns {Response} This returns the Wait For Calculation Response. The body is in JSON format.
*/  
exports.waitForCalculationCompletion = async function(calculationIDArray){
    return new Promise(async function(resolve, reject){
        try{
            var endpoint = "calculation";
            if(exports.BaseURL.charAt(exports.BaseURL.length-1) != "/") throw new Error("Cobble Base Path must end with a slash '/'"); 

            var keyArray = ["IDArray", "Your API User Key", "Your API Token"];
            var valueArray = [calculationIDArray, apiUserName, apiToken];
            var typeArray = ["array", "string", "string"];

            await checkTypeOfParameter(valueArray, typeArray).catch((err) => {
                err.message = parseInt(err.message);
                if(typeof(err.message) === "number") throw new Error("The provided data is not valid: " + keyArray[err.message] + " is not of type " + typeArray[err.message]);
                else throw new Error(err);
            });

            var invalidCalc = calculationIDArray.filter(calcID => !mongoose.Types.ObjectId.isValid(calcID))
            if(invalidCalc.length > 0) throw new Error("You supplied a Calculation ID, that is invalid in format.")        

            var urlOptions = {
                "url": exports.BaseURL + endpoint + "?id=" + JSON.stringify(calculationIDArray) + "&returnOnlyStatusBool=true",
                "method": "GET", 
                "headers": {
                    "Content-Type": "application/json",
                },                 
                "auth":{
                    "user": apiUserName,
                    "pass": apiToken
                },
                "json":true
            }

            var calculationFinishedBool = false;

            while(calculationFinishedBool == false){
                var response = await async_request.request(urlOptions).catch((err) => {throw new Error(err)});
                if(Array.isArray(response.body)){
                        for(var i = 0; i < response.body.length; i++){
                            if("status" in response.body[i]){
                                if(response.body[i].status != "finished") calculationFinishedBool = false;
                                else calculationFinishedBool = true;
                            }else calculationFinishedBool = false;
                        }
                        if(!calculationFinishedBool) await wait(3000);
                }else if("error" in response.body) calculationFinishedBool = true;
            }
            resolve(response);
        }catch(err){
            if(debugging) console.log(err);
            reject(err);
        }                 
    });
};

/** This function deletes Result Files or calculations in status "waiting" from CobbleVision. You cannot delete finished jobs beyond their result files, as we keep them for billing purposes.
*  @async
*  @function deleteCalculation()
*  @param {array} IDArray Array of ID's as Strings
*  @returns {Response} This returns the Delete Calculation Response. The body is in JSON format.
*/
exports.deleteCalculation = async function(IDArray){
    return new Promise(async function(resolve, reject){
        try{
            var endpoint = "calculation";
            if(exports.BaseURL.charAt(exports.BaseURL.length-1) != "/") throw new Error("Cobble Base Path must end with a slash '/'"); 

            var keyArray = ["IDArray", "Your API User Key", "Your API Token"];
            var valueArray = [IDArray, apiUserName, apiToken];
            var typeArray = ["array", "string", "string"];
            
            await checkTypeOfParameter(valueArray, typeArray).catch((err) => {
                err.message = parseInt(err.message);
                if(typeof(err.message) === "number") throw new Error("The provided data is not valid: " + keyArray[err.message] + " is not of type " + typeArray[err.message]);
                else throw new Error(err);
            });
            
            var urlOptions = {
                "url": exports.BaseURL + endpoint + "?id=" + JSON.stringify(IDArray),
                "method": "DELETE",
                "headers": {
                    "Content-Type": "application/json",
                },                   
                "auth":{
                    "user": apiUserName,
                    "pass": apiToken
                },
                "json":true
            }

            var response = await async_request.request(urlOptions).catch((err) => {throw new Error(err)});
            resolve(response);
        }catch(err){
            if(debugging) console.log(err);
            reject(err);
        }                 
    });
}

/** Launch a calculation with CobbleVision's Web API. Returns a response object with body, response and headers properties, deducted from npm request module;
*  @async
*  @function getCalculationResult()
*  @param {array} idArray ID of calculation to return result Array 
*  @param {boolean} returnOnlyStatusBool Return full result or only status? See Doc for more detailed description!
*  @returns {Response} This returns the Get Calculation Result. The body is in json format.
*/
exports.getCalculationResult = async function(idArray, returnOnlyStatusBool){
    return new Promise(async function(resolve, reject){
        try{
            var endpoint = "calculation";
            if(exports.BaseURL.charAt(exports.BaseURL.length-1) != "/") throw new Error("Cobble Base Path must end with a slash '/'"); 

            var keyArray = ["idArray", "returnOnlyStatusBool", "Your API User Key", "Your API Token"];
            var valueArray = [idArray, returnOnlyStatusBool, apiUserName, apiToken];
            var typeArray = ["array", "boolean", "string", "string"];
            
            await checkTypeOfParameter(valueArray, typeArray).catch((err) => {
                err.message = parseInt(err.message);
                if(typeof(err.message) === "number") throw new Error("The provided data is not valid: " + keyArray[err.message] + " is not of type " + typeArray[err.message]);
                else throw new Error(err);
            });

            var invalidCalculationIDs = idArray.filter(idArray => !mongoose.Types.ObjectId.isValid(idArray))
            if(invalidCalculationIDs.length > 0) throw new Error("You supplied an algorithm ID, which is invalid in format.")

            var urlOptions = {
                "url": exports.BaseURL + endpoint + "?id=" + JSON.stringify(idArray) + "&returnOnlyStatusBool=" + JSON.stringify(returnOnlyStatusBool),
                "method": "GET", 
                "headers": {
                    "Content-Type": "application/json",
                },"auth":{
                    "user": apiUserName,
                    "pass": apiToken
                },
                "json":true
            }

            var response = await async_request.request(urlOptions).catch((err) => {throw new Error(err)});
            resolve(response);
        }catch(err){
            if(debugging) console.log(err);
            reject(err);
        }   
    });
}

/** Request your calculation result by ID with the CobbleVision API. Returns a response object with body, response and headers properties, deducted from npm request module;
*  @async
*  @function getCalculationVisualization()
*  @param {array} id ID of calculation to return result/check String
*  @param {boolean} returnBase64Bool Return Base64 String or image buffer as string?
*  @param {number} width target width of visualization file
*  @param {number} height target height of visualization file
*  @returns {Response} This returns the Get Calculation Visualization Result. The body is in binary format.
*/
exports.getCalculationVisualization = async function(id, returnBase64Bool, width, height){
    return new Promise(async function(resolve, reject){
        try{
            var endpoint = "calculation/visualization";
            if(exports.BaseURL.charAt(exports.BaseURL.length-1) != "/") throw new Error("Cobble Base Path must end with a slash '/'"); 

            var keyArray = ["id", "returnBase64Bool", "width", "height", "Your API User Key", "Your API Token"];
            var targetArray = [id, returnBase64Bool, width, height, apiUserName, apiToken]  
            var typeArray = ["string", "boolean", "number", "number", "string", "string"];

            await checkTypeOfParameter(targetArray, typeArray).catch((err) => {
                err.message = parseInt(err.message);
                if(typeof(err.message) === "number") throw new Error("The provided data is not valid: " + keyArray[err.message] + " is not of type " + typeArray[err.message]);
                else throw new Error(err);
            });

            if(width == 0) throw new Error("Width cannot be zero!")
            if(height == 0) throw new Error("Height cannot be zero!")

            if(!mongoose.Types.ObjectId.isValid(id)) throw new Error("You supplied a calculation id, which is invalid in format.")
            
            var url = exports.BaseURL + endpoint + "?id=" + id;
            url = url + "&returnBase64Bool=" + JSON.stringify(returnBase64Bool);
            url = url + "&width=" + width.toString();
            url = url + "&height=" + height.toString();

            var urlOptions = {
                "url": url,
                "method": "GET",
                "auth":{
                    "user": apiUserName,
                    "pass": apiToken
                },
                "encoding": null
            }   

            var response = await async_request.request(urlOptions).catch((err) => {throw new Error(err)});

            await wait(3000);
            resolve(response);
        }catch(err){
            if(debugging) console.log(err);
            reject(err);
        }   
    });
}

var checkTypeOfParameter = async function(targetArray, assertTypeArray){
    return new Promise(async function(resolve, reject){
        try{
            for(var i = 0; i < targetArray.length; i++){
                if(typeof(targetArray[i]) != assertTypeArray[i]){
                    if(assertTypeArray[i] === "array"){
                        if(!Array.isArray(targetArray[i])) throw new Error(i);
                    }else{
                        throw new Error(i);
                    }
                } 
            }
            resolve(true);
        }catch(err){
            reject(err);
        }  
    });
}

var wait = async function(ms){
    return new Promise(async function(resolve, reject){
      setTimeout(resolve, ms)
    })
}
