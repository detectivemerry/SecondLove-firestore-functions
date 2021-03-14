const { admin } = require('./admin')
const { db } = require('./admin');

module.exports = (request, response, next) => {
    let idToken;
    if(request.headers.authorization && 
        request.headers.authorization.startsWith('Bearer ')){
        //split it by bearer, gives you back 2 string
        // [0] = bearer space
        // [1] = actual token
        idToken = request.headers.authorization.split('Bearer ')[1];
    }
    else{
        console.error('No token found')
       return response.status(403).json({error : 'Unauthorized'});
    }

    //ensure the token is authorized by ONLY SecondLove app
    admin
        .auth()
        .verifyIdToken(idToken)
        .then(decodedToken => {
            //extra data from middleware, (userdata)
            request.user = decodedToken
            console.log(decodedToken);
            //get the handle from firebase collection (db)
            return db.collection('users')
                .where('userId', '==', request.user.uid)
                .limit(1)
                .get();
        })

        .then(data => {
            //data() extracts data 
            request.user.handle = data.docs[0].data().handle
            request.user.imageUrl = data.docs[0].data().imageUrl
            //allow request to proceed
            return next();
        })

        .catch(err => {
            console.error('Error while verifying token', err)
            return response.status(403).json({err})
        })
}