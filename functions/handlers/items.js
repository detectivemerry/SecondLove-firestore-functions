const { db } = require('../util/admin');

exports.getAllItems = (req, res) => {
    db
      .collection('items')
      .orderBy('createdAt', 'desc')
      .get()
      .then((data) => {
        let items = [];
        data.forEach((doc) => {
          items.push({
            itemId: doc.id,
            category: doc.category,
            description: doc.data().body,
            userHandle: doc.data().userHandle,
            createdAt: doc.data().createdAt,
            ballotTime : doc.data().ballotTime,
            itemCondition: doc.data().itemCondition,
            itemStatus: doc.data().itemStatus,
            requestCount: doc.data().requestCount,
            approved :  doc.data().approved
          });
        });
        return res.json(items);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: err.code });
      });
  }
//get all items that are approved and ready to ballot
exports.getAllAvailableItems = (req, res) => {
  db
  .collection('items')
  .orderBy('createdAt', 'desc')
  .where('approved', '==', true)
  .where('itemStatus', '==', "readyToBallot")
  .get()
  .then((data) => {
    let items = [];
    data.forEach((doc) => {
      if(doc.data().ballotTime > new Date().toISOString()){
        items.push({
          itemId: doc.id,
          category: doc.category,
          description: doc.data().body,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt,
          ballotTime : doc.data().ballotTime,
          itemCondition: doc.data().itemCondition,
          itemStatus: doc.data().itemStatus,
          requestCount: doc.data().requestCount,
          approved : doc.data().approved
        });
      }
    });
    return res.json(items);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).json({ error: err.code });
  });
}
//get all items that has yet to be approved
exports.getAllUnapprovedItems = (req, res) => {
  db
  .collection('items')
  .orderBy('createdAt', 'desc')
  .where('approved', '==', false)
  .where('itemStatus', '==', "pendingApproval")
  .get()
  .then((data) => {
    let items = [];
    data.forEach((doc) => {
      items.push({
        itemId: doc.id,
        category: doc.category,
        description: doc.data().body,
        userHandle: doc.data().userHandle,
        createdAt: doc.data().createdAt,
        itemCondition: doc.data().itemCondition,
        itemStatus: doc.data().itemStatus,
        requestCount: doc.data().requestCount,
        approved : doc.data().approved
      });
    });
    return res.json(items);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).json({ error: err.code });
  });
}
//get all item ready to ballot
exports.getAllBallotItems = (req, res) => {
  db
  .collection('items')
  .orderBy('createdAt', 'desc')
  .where('approved', '==', true)
  .where('itemStatus', '==', "readyToBallot")
  //add date condition here
  .get()
  .then((data) => {
    let items = [];
    data.forEach((doc) => {
      //console.log(doc.data().ballotTime < new Date().toISOString())
      if(doc.data().ballotTime < new Date().toISOString()){
        items.push({
          itemId: doc.id,
          category: doc.category,
          description: doc.data().body,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt,
          ballotTime: doc.data().ballotTime,
          itemCondition: doc.data().itemCondition,
          itemStatus: doc.data().itemStatus,
          requestCount: doc.data().requestCount,
          approved : doc.data().approved
        });
      }
    });
    return res.json(items);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).json({ error: err.code });
  });
}

exports.postOneItem = (req, res) => {
if (req.body.description.trim() === '') {
    return res.status(400).json({ body: 'Body must not be empty' });
}

const newItem = {
    description: req.body.description,
    category : req.body.category,
    itemCondition : req.body.itemCondition,
    itemStatus : "pendingApproval",
    approved : false,
    imageUrl : req.body.imageUrl,
    userHandle: req.user.handle,
    requestCount : 0,
    createdAt: new Date().toISOString(),
    ballotTime: new Date().toISOString()
};

db
    .collection('items')
    .add(newItem)
    .then((doc) => {
    //res.json({ message: `document ${doc.id} created successfully` });
    const resItem = newItem;
    resItem.itemId = doc.id;
    res.json(resItem);
    })

    .catch((err) => {
    res.status(500).json({ error: 'something went wrong' });
    console.error(err);
    });
}

exports.getItem = (req, res) => {
    let itemData = {};
    db.doc(`/items/${req.params.itemId}`)
      .get()
      .then((doc) => {
        if (!doc.exists) {
          return res.status(404).json({ error: 'Item not found' });
        }
        itemData = doc.data();
        itemData.itemId = doc.id;
        return db
          .collection('comments')
          .orderBy('createdAt', 'desc')
          .where('itemId', '==', req.params.itemId)
          .get();
      })
      .then((data) => {
        itemData.comments = [];
        data.forEach((doc) => {
          itemData.comments.push(doc.data());
        });
        return res.json(itemData);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: err.code });
      });
  };
  
exports.getItemRequest = (req, res) => {
    let itemData = {};
    db.doc(`/items/${req.params.itemId}`)
      .get()
      .then((doc) => {
        if (!doc.exists) {
          return res.status(404).json({ error: 'Item not found' });
        }
        //itemData = doc.data();
        itemData.itemId = doc.id;
        return db
          .collection('requests')
          .orderBy('createdAt', 'desc')
          .where('itemId', '==', req.params.itemId)
          .get();
      })
      .then((data) => {
        itemData.requests = [];
        data.forEach((doc) => {
          itemData.requests.push(doc.data());
        });
        return res.json(itemData);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: err.code });
      });
  };

exports.requestItem = (req, res) => {
  console.log(req.user.handle)
  console.log(req.params.itemId)
  const requestDocument = db
    .collection('requests')
    .where('recipient', '==', req.user.handle)
    .where('itemId', '==', req.params.itemId)
    .limit(1);

  const itemDocument = db.doc(`/items/${req.params.itemId}`);

  let itemData;

  itemDocument
    .get()
    .then((doc) => {
      if (doc.exists) {
        itemData = doc.data();
        itemData.itemId = doc.id;
        return requestDocument.get();
      } else {
        return res.status(404).json({ error: 'Item not found' });
      }
    })
    .then((data) => {
      if (data.empty) {
        return db
          .collection('requests')
          .add({
            itemId: req.params.itemId,
            recipient : req.user.handle,
            createdAt : new Date().toISOString()
          })
          .then(() => {
            itemData.requestCount++;
            return itemDocument.update({ requestCount: itemData.requestCount });
          })
          .then(() => {
            return res.json(itemData);
          });
      } else {
        return res.status(400).json({ error: 'Item already requested' });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

exports.unrequestItem = (req, res) => {
  const requestDocument = db
    .collection('requests')
    .where('userHandle', '==', req.user.handle)
    .where('itemId', '==', req.params.itemId)
    .limit(1);

  const itemDocument = db.doc(`/items/${req.params.itemId}`);

  let itemData;

  itemDocument
    .get()
    .then((doc) => {
      if (doc.exists) {
        itemData = doc.data();
        itemData.itemId = doc.id;
        return requestDocument.get();
      } else {
        return res.status(404).json({ error: 'Item not found' });
      }
    })
    .then((data) => {
      if (data.empty) {
        return res.status(400).json({ error: 'Item not liked' });
      } else {
        return db
          .doc(`/requests/${data.docs[0].id}`)
          .delete()
          .then(() => {
            itemData.requestCount--;
            return itemDocument.update({ requestCount: itemData.requestCount });
          })
          .then(() => {
            res.json(itemData);
          });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

exports.deleteItem = (req, res) => {
  const document = db.doc(`/items/${req.params.itemId}`);
  document
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Item not found' });
      }
      if (doc.data().userHandle !== req.user.handle) {
        return res.status(403).json({ error: 'Unauthorized' });
      } else {
        return document.delete();
      }
    })
    .then(() => {
      res.json({ message: 'Item deleted successfully' });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

exports.approveItem = (req, res) => {

  let newBallotDate = new Date();
  newBallotDate.setDate(newBallotDate.getDate() + 7)

  db
  .doc(`/items/${req.params.itemId}`)
  .update({
    approved : true,
    ballotTime : newBallotDate.toISOString()
  })
  .then(() => {
    return res.json({ message: 'Item has been approved successfully.' });
    })
  .catch((err)=>{
    console.error(err);
    res.status(500).json({ error: err.code });
  })

  };

exports.updateRequestSuccess = (req, res) => {
  const document =  db.doc(`/requests/${req.params.requestId}`)

  document
  .update({
    success : true
  })
  .then(() => {
    return res.json({ message: 'Request has been updated.' });
    })
  .catch((err)=>{
    console.error(err);
    res.status(500).json({ error: err.code });
  })

  };


