var request = require("request");

/** This is the data structure of a field
/*  @constructor
/*  @property {Object} options Communication as collection
/*  @property {String} options.url 
/*  @property {String} options.method 
/*  @property {Object} options.headers 
/*  @property {Object} options.auth Communication as collection
/*  @property {String} options.auth.user 
/*  @property {String} options.auth.pass 
*/
exports.request = async function(options){
    return new Promise(async function(resolve, reject){
        try{
            request(options, function(err, response){   
                if(err) reject(err);
                else{
                    var responseJSON = {
                        "body": response.body,
                        "response":response,
                        "headers":response.headers
                    }
                    resolve(responseJSON);
                }
            });
        }catch(err){
            console.log(err);
            reject(err);
        }
    });
}