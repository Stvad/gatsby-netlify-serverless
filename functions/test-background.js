const https = require('https');

exports.handler = function(event, context, callback) {
    const {identity, user} = context.clientContext;
    console.log("all the creds!")
    console.log(identity, user)

    var id = event.queryStringParameters.id;
    var token = process.env.netlify_access_token;
    let siteId = process.env.site_id

}
