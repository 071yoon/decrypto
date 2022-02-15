import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  connectFirestoreEmulator,
  onSnapshot,
  setDoc,
  updateDoc,
  getDoc,
  query,
  where,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// firebase 프로젝트 환경 정보
const firebaseConfig = {
  apiKey: import.meta.env.REACT_APP_API_KEY,
  authDomain: import.meta.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: import.meta.env.REACT_APP_DATABASE_URL,
  projectId: import.meta.env.REACT_APP_PROJECT_ID,
  storageBucket: import.meta.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: import.meta.env.REACT_APP_APP_ID,
  measurementId: import.meta.env.REACT_APP_MEASUREMENT_ID,
};

// Firebase initialize
const app = initializeApp(firebaseConfig);

// Firestore 연결
const firestore = getFirestore();

// Auth 연결
const fireAuth = getAuth();

// Collection 은 Document 들의 집합이라 생각하면 이해가 쉬울 것 같다.
// Collection: 폴더, Document: 파일
// 그렇기에 Document 하나를 특정하기 위해선 Collection 과 Document 를 둘 다 명시해야하며
// Document 여러개를 얻기 위해선 Query 문이나 Collection 을 명시해야한다.

const createDoc = async (name: string) => {
  // addDoc: collection 만 지정하면 랜덤한 id 로 document 를 생성함, 생성 후 return 으로 promise 반환
  const newDoc = await addDoc(collection(firestore, 'users'), {
    name,
  });
  console.log(newDoc.id);
};

const createSpecialDoc = async (userId: string, userName: string) => {
  // setDoc: addDoc 과 다르게 setDoc 은 특정 id 를 기준으로 생성
  // 해당 document 가 없다면 생성하지만, document 가 있다면 해당 document 를 대체시킴
  // 다만 옵션 중 merge 옵션을 활성화 시킨다면 해당 document 덮어씌움 (병합) === updateUser
  try {
    await setDoc(doc(firestore, `users/${userId}`), {
      name: userName,
    });
  } catch (error) {
    console.log(error);
  }
};

const updateUser = (userId: string) => {
  // updateDoc: 특정 레퍼런스 즉, 해당 document 을 수정
  updateDoc(doc(firestore, `users/${userId}`), {
    name: 'yeah',
    favColor: 'black',
  });
};

const getDocument = async (userId: string) => {
  // getDoc: 특정 도큐먼트의 정보를 가져온다.
  const user = await getDoc(doc(firestore, `users/${userId}`));
  user.data(); // 가져온 정보
  user.exists(); // 해당 정보의 유무
  user.get('name'); // 정보 중 특정 프로퍼티 가져오기
  console.log(user.id);
  console.log(user.metadata);
};

const getDocuments = async (userId: string) => {
  // getDocs: 특정 Collection 에 속한 데이터들을 모두 가져온다.
  // query 를 적용하여 조건부로 가져올 수 있으며 promise 를 반환한다.
  const docs = await getDocs(collection(firestore, 'users'));
};

let unSubscribe: () => void;
const listenToADocument = () => {
  // 특정 Document 가 변경되는지 관찰하며 변경이 감지되었을 때 (서버측에서) 변경됨을 알려주어 업데이트 해준다.
  // onSnapshot 은 unSubscribe 함수를 return 해 주는데 해당 함수를 실행시키면 더이상 변경을 감지하지 않는다.
  // 반환하는 unSubscribe 함수가 중요한 이유는
  // 특정 컴포넌트가 렌더링 되었을 때만 서버와 통신, 언마운트 될 때부턴 서버와 통신을 제한하여 불필요한 서버 접근 및 이벤트를 줄일 수 있다.
  unSubscribe = onSnapshot(doc(firestore, 'users/394998'), (snap) => {
    console.log(snap.data());
  });
};

const queryForDocuments = async () => {
  // 새로운 query 를 생성한 후 해당 query 를 이용해 getDocs 함수 실행
  // getDocs 함수는 collection 을 사용해 해당 collection 전체를 가져올 수도 있으며 이처럼 query 를 지정해 가져올 수도 있다.
  const userQuery = query(collection(firestore, 'users'), where('name', '==', '감자'));
  const querySnapshot = await getDocs(userQuery);
  const allDocs = querySnapshot.docs;
  console.log(allDocs.map((e) => e.data()));

  // query 에 onSnapshot 을 사용해 query 가 적용된 document 들이 변경되었을 때 값을 자동으로 받을 수 있다.
  onSnapshot(userQuery, (querySnap) => {
    console.log(querySnap.docs.map((snap) => snap.data()));
  });
};

const test = () => {
  createUser('감자');
  queryForDocuments();
  setTimeout(() => {
    createSpecialUser('394998', 'Junhwan');
  }, 3000);
  setTimeout(() => {
    createSpecialUser('394998', 'guma');
  }, 7000);
  setTimeout(() => {
    updateUser('394998');
  }, 5000);
  getUser('394998');
  listenToADocument();
  setTimeout(() => {
    unSubscribe();
  }, 10000);
};

// test();
