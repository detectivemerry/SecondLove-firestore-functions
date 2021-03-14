let db = {
    users: [
      {
        userId: 'dh23ggj5h32g543j5gf43',
        email: 'user@email.com',
        handle: 'user',
        createdAt: '2019-03-15T10:59:52.798Z',
        imageUrl: 'image/dsfsdkfghskdfgs/dgfdhfgdh',
        bio: 'Hello, my name is user, nice to meet you'
      }
    ],
    Items: [
      {
        userHandle: 'user',
        description: 'This item is blah blah blah',
        itemCondition: 'new | slightly used | well used',
        itemStatus: 'pendingApproval | readyToBallot | donatedToUser | donatedToCollectionPoint',
        category : 'home and living | fashion | mobile electronics',
        createdAt: '2019-03-15T10:59:52.798Z',
        approved: 'true | false',
        requestCount: 5
      }
    ],
    notifications: [
      {
        recipient: 'user',
        sender: 'john',
        read: 'true | false',
        productId: 'kdjsfgdksuufhgkdsufky',
        type: 'request | ballot ',
        createdAt: '2019-03-15T10:59:52.798Z'
      }
    ],
    requests: [
        {
            recipient: 'user',
            sender: 'john',
            productId: 'kdjsfgdksuufhgkdsufky',
            createdAt: '2019-03-15T10:59:52.798Z'
        }
    ]
  };
  
  const userDetails = {
    // Redux data
    credentials: {
      userId: 'N43KJ5H43KJHREW4J5H3JWMERHB',
      email: 'user@email.com',
      handle: 'user',
      createdAt: '2019-03-15T10:59:52.798Z',
      imageUrl: 'image/dsfsdkfghskdfgs/dgfdhfgdh',
      bio: 'Hello, my name is user, nice to meet you',
      website: 'https://user.com',
      location: 'Lonodn, UK'
    },
    likes: [
      {
        userHandle: 'user',
        screamId: 'hh7O5oWfWucVzGbHH2pa'
      },
      {
        userHandle: 'user',
        screamId: '3IOnFoQexRcofs5OhBXO'
      }
    ]
  };