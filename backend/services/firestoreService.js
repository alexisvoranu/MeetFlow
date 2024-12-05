import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase.js';

export const addDocument = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    console.log("Document adăugat cu ID-ul: ", docRef.id);
  } catch (e) {
    console.error("Eroare la adăugarea documentului: ", e);
  }
};

export const getDocuments = async (collectionName) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const documents = [];
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });
    return documents;
  } catch (e) {
    console.error("Eroare la obținerea documentelor: ", e);
    return [];
  }
};
