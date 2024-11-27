import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, getFirestore, Timestamp } from 'firebase/firestore'; // Añadido getFirestore
import { app } from "./firebaseConfig"; // Importamos app en lugar de db

// Inicializamos auth y db
const auth = getAuth(app);
const db = getFirestore(app);

// Register
const registerUser = async (email, password) => {
  try {
    // Crear el usuario en Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;  // El usuario autenticado

    // Crear el nombre de usuario (extraído antes del @ en el correo)
    const username = email.split('@')[0];

    // Crear un documento en la colección "users"
    const userRef = doc(db, 'users', user.uid);
    
    // Establecer los datos del usuario en Firestore
    await setDoc(userRef, {
      created: Timestamp.fromDate(new Date()),  // Timestamp actual
      username: username,
      role: 'cliente',  // Rol por defecto
    });

    console.log('Usuario registrado y datos guardados en Firestore');
  } catch (error) {
    console.error('Error al registrar el usuario en Firestore:', error);
    throw error;  // Relanzamos el error para que lo maneje la función llamada
  }
};

// Login
const loginUser = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(getAuth(app), email, password);
        const userDocRef = doc(db, "Users", userCredential.user.uid);  
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
            const userData = userDoc.data();
            const isAdmin = userData.role === 'admin';  // Verificar si es admin o no
            console.log("User logged con éxito:", userCredential.user.uid, "Role:", userData.role);
            
            // Retornamos los datos del usuario junto con su rol
            return { user: userCredential.user, userData, isAdmin, error: null };
        } else {
            console.error("User document not found");
            return { user: null, error: "Error al cargar los datos del usuario" };
        }
    } catch (error) {
        console.error("Error logging in:", error.message);
        let errorMessage = error.message;
        
        if (error.code === 'auth/user-not-found') {
            errorMessage = 'Usuario no encontrado';
        } else if (error.code === 'auth/wrong-password') {
            errorMessage = 'Contraseña incorrecta';
        }
        
        return { user: null, error: errorMessage };
    }
}

// Logout
const logoutUser = async () => {
    try {
        await signOut(auth);
        console.log("User logged out successfully");
        return { error: null };
    } catch (error) {
        console.error("Error logging out:", error.message);
        return { error: "Error al cerrar sesión" };
    }
}

export { registerUser, loginUser, logoutUser };