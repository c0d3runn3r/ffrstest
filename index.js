var express= require("express");
var app = express();
var log=require("bunyan").createLogger({"name":"ffrs-test"});
//var xml=require("xml");
var jstoxml=require("jstoxml");


// Data to return



// HTTP GET requests
app.get("/ValidateLogin/", function(req, res){

	var response={
	  "UserAuthenticationDTO": {
	    "-xmlns": "http://schemas.datacontract.org/2004/07/FFRS.Shared.Data",
	    "-xmlns:i": "http://www.w3.org/2001/XMLSchema-instance",
	    // "StnName": { "i:nil": "true" },
	    // "client_Exp_date": "2017-08-18T00:00:00-07:00",
	    // "currentstatus": "Unavailable",
	    // "dateformat": "dd.MM.yy",
	    // "demo": "true",
	    // "demo_status": "true",
	    // "dep_code": "",
	    // "dep_id": "",
	    // "email": "",
	    // "ffi_id": "",
	    // "first_name": "Jason",
	    "isAuthenticated": false,
	    // "last_name": "",
	    // "neverExpires": "",
	    // "password": "jason",
	    // "sta_id": "0",
	    // "status": "false",
	    // "stnFeature": "false",
	    // "tabIndex": "-1",
	    // "uty_code": "USR"
	  }
	};

	if(req.query.useremail=="some_email" && req.query.password=="some_password") {

		response.UserAuthenticationDTO.email=req.query.useremail;
		response.UserAuthenticationDTO.isAuthenticated=true;
		log.info("Successful login for "+req.query.useremail);

	} else {
//
		log.warn("User attempted login with invalid credentials "+req.query.useremail);
	}

	res.set('Content-Type', 'text/xml');
	res.send(xml_with_attributes(response));
    //res.send(jstoxml.toXML(response, {"indent" : "\t"}));

});


app.listen(3000, function(){

	log.info("Listening on %s",3000);
});



// === Functions below this line


/**
 * xml_with_attributes
 * 
 * @param object 
 * @returns a string representing this object in XML.  Keys of the object that have a name beginning with "-" are converted into XML attributes instead of children
 */
function xml_with_attributes(obj) {

    var retval=[];

    for(a in obj){

        // Look at all children of obj, and see if any grandchildren start with '-'
        var attributes={};
        var children={};
        for(b in obj[a]) {

            if(b.charAt(0)=="-") {

                attributes[b.substring(1)]=obj[a][b];

            } else {

                children[b]=obj[a][b];
            }
        }

        // We found some
        if(Object.keys(attributes).length) {

            // Create a new object that converts nicely to XML
            var new_object={

                "_attrs"    : attributes,
                "_name"     : a,
                "_content"  : children
            };

            // Replace it
            retval.push(new_object);

        } else {

            // Save the old one, no change necessary
            var o={};
            o[a]=obj[a];
            retval.push(o);
        }

    }


    return jstoxml.toXML(retval, {"indent" : "\t"});
}