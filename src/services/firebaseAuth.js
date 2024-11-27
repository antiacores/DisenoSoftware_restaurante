import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut 
  } from 'firebase/auth';
  import { 
    doc, 
    getDoc, 
    setDoc, 
    getFirestore, 
    Timestamp 
  } from 'firebase/firestore';
  import { app } from "./firebaseConfig";
  
  const auth = getAuth(app);
  const db = getFirestore(app);
  
  // Registrar usuario
  const registerUser = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const username = email.split('@')[0];
  
      // Guardar datos en Firestore
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        created: Timestamp.fromDate(new Date()),
        username: username,
        role: 'cliente', // Rol por defecto
      });
  
      console.log('Usuario registrado y datos guardados en Firestore');
      return { user, error: null };
    } catch (error) {
      console.error('Error al registrar el usuario en Firestore:', error);
      return { user: null, error: error.message };
    }
  };
  
  // Iniciar sesión
  const loginUser = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Verificar si el usuario existe en Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
  
      if (!userDoc.exists()) {
        console.error("Usuario no registrado en Firestore");
        throw new Error("El usuario no está registrado correctamente en el sistema.");
      }
  
      const userData = userDoc.data();
      console.log("Usuario autenticado:", user.uid, "Rol:", userData.role);
  
      return { user, userData, isAdmin: userData.role === 'admin', error: null };
    } catch (error) {
      console.error("Error al iniciar sesión:", error.message);
  
      let errorMessage = error.message;
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'Usuario no encontrado';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Contraseña incorrecta';
      }
  
      return { user: null, error: errorMessage };
    }
  };
  
  // Cerrar sesión
  const logoutUser = async () => {
    try {
      await signOut(auth);
      console.log("Sesión cerrada correctamente");
      return { error: null };
    } catch (error) {
      console.error("Error al cerrar sesión:", error.message);
      return { error: "Error al cerrar sesión" };
    }
  };
  
  export { registerUser, loginUser, logoutUser };  