import { collection, addDoc, updateDoc, deleteDoc, getDocs, getDoc, doc } from "firebase/firestore";
import { db } from "./firebase";

export async function addDataToFirebase(data, collectionName) {
    await addDoc(collection(db, collectionName), data);
}

export async function getDataFromFirebase(collectionName) {
    const users = await getDocs(collection(db, collectionName));
    return users.docs.map((doc) => doc.data());
}

export async function getDataToFirebase(id, collectionName) {
    const user = await getDoc(doc(db, collectionName, id));
    return user.data();
}

export async function updateDataToFirebase(id, data, collectionName) {
    await updateDoc(doc(db, collectionName, id), data);
}

export async function deleteDataFromFirebase(id, collectionName) {
    await deleteDoc(doc(db, collectionName, id));
}