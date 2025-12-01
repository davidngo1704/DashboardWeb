import { collection, addDoc, updateDoc, deleteDoc, getDocs, getDoc, doc } from "firebase/firestore";
import { db } from "./firebase";
import { ref, uploadBytes, getDownloadURL, deleteObject, listAll } from "firebase/storage";
import { storage } from "./firebase";

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
        await updateDoc(doc(db, collectionName, id), data);

    } catch (error) {
        console.log(error);
    }
}

export async function deleteDataFromFirebase(id, collectionName) {
    await deleteDoc(doc(db, collectionName, id));
}
//------------------------------------------------------------------------
export const uploadFile = async (file, path) => {
    const storageRef = ref(storage, path);

    let uploadData = file;

    // Nếu là string thì chuyển thành Blob
    if (typeof file === "string") {
        uploadData = new Blob([file], { type: "text/plain" });
    }

    await uploadBytes(storageRef, uploadData);
    return path;
};

export const getFileURL = async (path) => {
    const fileRef = ref(storage, path);
    return await getDownloadURL(fileRef);
};

export const deleteFile = async (path) => {
    const fileRef = ref(storage, path);
    var res = await deleteObject(fileRef);
};

export const listFiles = async (folderPath) => {
    const folderRef = ref(storage, folderPath);
    const res = await listAll(folderRef);

    const items = await Promise.all(
        res.items.map(async (itemRef) => ({
            name: itemRef.name,
            url: await getDownloadURL(itemRef)
        }))
    );

    return items;
};
export const readFileAsString = async (path) => {
    try {
        const url = await getDownloadURL(ref(storage, path));

        const response = await fetch(url);
        const text = await response.text(); 

        return text;
    } catch (error) {
        console.error("Error reading file:", error);
        return null;
    }
};
