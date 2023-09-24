
# Firebase Decorators
[![npm version](https://badge.fury.io/js/firebase-decorators.svg)](https://badge.fury.io/js/firebase-decorators) [![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/dwyl/esta/issues) [![HitCount](https://hits.dwyl.com/anuragmandal0110/firebase-decorators.svg?style=flat-square)](http://hits.dwyl.com/anuragmandal0110/firebase-decorators)

Write cleaner code using decorators in your next firebase project.

**(Work in progress)**

## Usage

### Installation
**Important** Typescript > 5.0.0
This package uses the latest typescript decorator APIs and thus requires typescript version > 5.0
```
$ npm install --save firebase-decorators
```
### Initialize Firebase app
```typescript
import  { initializeApp }  from  'firebase/app';  
  
// TODO: Replace the following with your app's [Firebase project configuration](https://firebase.google.com/docs/web/learn-more#config-object)  
const firebaseConfig =  {  //...  
};  
  
const app = initializeApp(firebaseConfig);
```
#### Admin SDK

```typescript
import {initializeApp} from  "firebase-admin/app";
  
// TODO: Replace the following with your app's [Firebase project configuration](https://firebase.google.com/docs/web/learn-more#config-object)  
const firebaseConfig =  {  //...  
};  
  
const app = initializeApp(firebaseConfig);
```
### Create a model

Create a model which reflects the data on the database.
Let's create a user model which we will use to store user data in Firestore. We will extend the Class with **BaseFirebaseModel**.

```typescript
Class User extends BaseFirebaseModel {

	userId!:  string;

	role!:  "USER"  |  "ADMIN";

	joinDate!:  number;

	constructor(userId:string) {
		super();
		this.userId  =  userId;
		// initialize other fields as required.
	}
}
```
### @PrimaryKey Decorator

The document id to read the document from can be marked as the primary key in the model. Use the PrimaryKey decorator to mark the class field.
This field should be initialized for all the functionalities to work, Otherwise an error will be thrown during runtime.
The field can be initialized either using the constructor or directly.

#### Constructor
```typescript
Class User extends BaseFirebaseModel {

	@PrimaryKey()
	private  userId!:  string;

	role!:  "USER"  |  "ADMIN";

	joinDate!:  number;

	constructor(userId:string) {
		super();
		this.userId  =  userId;
		// initialize other fields as required.
	}
}
```
#### Direct initialization
```typescript
Class User extends BaseFirebaseModel {

	@PrimaryKey()
	userId!:  string = "documentId";

	role!:  "USER"  |  "ADMIN";

	joinDate!:  number;
}
```
### @DataKey Decorator
Mark the fields of the model using DataKey decorator. 
```typescript
Class User extends BaseFirebaseModel {

	@PrimaryKey()
	private  userId!:  string;
	
	@DataKey()
	role!:  "USER"  |  "ADMIN";
	
	@DataKey("join_date")
	joinDate!:  number;

	// since this field is not marked,
	// it will be ignored during any read/write operation.
	thisFieldWillBeIgnored! : string;

	constructor(userId:string) {
		super();
		this.userId  =  userId;
		// initialize other fields as required.
	}
}
```
The Firestore model fields will be mapped to the model fields
**join_date** -> **joinDate** (since we explicitly pass the remote key name)
**role** -> **role** (since no value for the remote key was passed)
**thisFieldWillBeIgnored** -> this field will be ignored since it is not marked as a data field.
### @FirestoreModel Decorator
Finally mark the model with @FirestoreModel and provide the collection name and whether to use the admin SDK or not.
The value for **useAdminSdk** should be set depending on whether the admin app was initialized or not.
```typescript
@FirestoreModel("user",false)
Class User extends BaseFirebaseModel {

	@PrimaryKey()
	private userId!:  string;
	
	@DataKey()
	role!:  "USER"  |  "ADMIN";
	
	@DataKey("join_date")
	joinDate!:  number;
	
	// since this field is not marked,
	// it will be ignored during any read/write operation.
	thisFieldWillBeIgnored! : string;

	constructor(userId:string) {
		super();
		this.userId  =  userId;
		// initialize other fields as required.
	}
}
```

### Use the model
Simply use the model to read, write and sync data to the database.
```typescript
const user = new User("this_is_the_user_id");

// wait for model to get initialized.
// this value resolves when the model has synced
// its data with firestore document
await user.ready;

// set values into the model;;
user.role = "USER"
user.joinDate = 1234

// write the data to the database
// this will create a new document if it doesnt exist
// or overwrtire old document
await user.write()

// sync data from the remote
await user.sync()

// change any value
user.role = "ADMIN"

// update the model
await user.update()
 
```
## New features to come very soon!!
Contributers and feature requests are welcome!!