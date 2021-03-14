const functions = require('firebase-functions');
const FBAuth = require('./util/FBAuth');
const config = require('./util/config')
const { db } = require('./util/admin')
const app = require('express')();
const cors = require('cors');
app.use(cors({ origin: true }));

const { 
    getAllItems,
    getAllAvailableItems, 
    postOneItem,
    getItem,
    requestItem,
    unrequestItem,
    getItemRequest,
    deleteItem,
    approveItem,
    getAllUnapprovedItems,
    getAllBallotItems} = require('./handlers/items');

const { 
    signup, 
    login, 
    uploadImage, 
    addUserDetails, 
    getAuthenticatedUser } = require('./handlers/users');

//item routes
app.get('/allItems', getAllItems);
app.get('/items', getAllAvailableItems)
app.get('/unapprovedItems', getAllUnapprovedItems)
app.get('/ballotItems', getAllBallotItems)

app.post('/item', FBAuth, postOneItem);
app.get('/item/:itemId', getItem);
app.delete('/item/:itemId', FBAuth, deleteItem);
app.get('/item/:itemId/request', FBAuth, requestItem);
app.get('/item/:itemId/unrequest', FBAuth, unrequestItem);
app.get('/item/:itemId/getRequest', FBAuth, getItemRequest);
app.get('/item/:itemId/approve', FBAuth, approveItem);

//Sign up route
app.post('/signup', signup);
//login
app.post('/login', login);
app.post('/user/image', FBAuth, uploadImage)
app.post('/user', FBAuth, addUserDetails);
app.get('/user', FBAuth, getAuthenticatedUser);

exports.api = functions.https.onRequest(app);


exports.onAdminApprove = functions.firestore.document('/requests/{requestId}')
    .onUpdate((change) => {
        console.log(change.before.data())
        console.log(change.after.data())

        if(change.before.data().approved != change.after.data().approved){
            return db
                    .collection('items')
                    .where('itemId', '==', change.before.data().itemId)
                    .limit(1)
                    .update({
                        itemStatus : "readyToBallot"
                    })
                    .then(() => {
                        return res.json({ message: 'RTRigger has been found' });
                        })
                    .catch((err)=>{
                        console.error(err);
                        res.status(500).json({ error: err.code });
                        })
        }
    })

// exports.onRequestSuccess = functions.firestore.document('/requests/{requestsId}')
//   .onUpdate((change) => {
//     if(change.before.data().isSuccess !== change.after.data().isSuccess){
//       console.log("A request has been choosen");
//       return db.collection('items')
//       .where('itemId', '==', change.before.data().itemId)
//       .limit(1)
//       .update({
//         itemStatus : "donatedToUser"
//       })
//     }
//     else return true;
//   })