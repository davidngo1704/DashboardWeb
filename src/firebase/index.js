import { collection, addDoc, updateDoc, deleteDoc, getDocs, getDoc, doc } from "firebase/firestore";
import { db } from "./firebase";

export async function addDataToFirebase(data, collectionName) {
    const ref = await addDoc(collection(db, collectionName), data);
    return ref.id; // trả id cho client
}


export async function getDataFromFirebase(collectionName) {
    const data = await getDocs(collection(db, collectionName));
    return data.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
    }));
}

export async function getDataToFirebase(id, collectionName) {
    const user = await getDoc(doc(db, collectionName, id));
    return user.data();
}

export async function updateDataToFirebase(id, data, collectionName) {
    try {
        console.log(id, data, collectionName);
        await updateDoc(doc(db, collectionName, id), data);
        
    } catch (error) {
        console.log(error);
    }
}

export async function deleteDataFromFirebase(id, collectionName) {
    await deleteDoc(doc(db, collectionName, id));
}