// import {FirebaseInstance} from "../src/decorators/firebaseInstance";
// import DependencyStore from "../src/dependencyStore";


// describe('testing firebase instance decorator', () => {

//   test('test singleton instance is created', () => {
//     class Instances {

//       @FirebaseInstance("firestore")
//       firestore!: any;


//       constructor() {
//         this.firestore = "test";
//       }
//     }
//     const ins = new Instances();
//     expect(DependencyStore.store.firestore).toEqual("test");
//   });

//   test('test that the initial value is stored in the store', () => {
//     class Instances {

//       @FirebaseInstance("firestore")
//       firestore: any = "test1"

//     }
//     const ins = new Instances();
//     expect(DependencyStore.store.firestore).toEqual("test1");
//   });


//   test('test that the last value is stored in the store', () => {
//     class Instances {

//       @FirebaseInstance("firestore")
//       firestore: any = "test1"

//       constructor() {
//         this.firestore = "test2";
//       }

//       updateValue() {
//         this.firestore = "random"
//       }

//     }
//     const ins = new Instances();
//     ins.updateValue();
//     expect(DependencyStore.store.firestore).toEqual("random");
//   });


// });