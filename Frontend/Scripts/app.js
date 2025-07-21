// app.js

// Función asíncrona para manejar el inicio de sesión
async function login() {
    // Obtiene el formulario de inicio de sesión del documento
    const form = document.getElementById("loginForm");
    // Crea un objeto FormData con los datos del formulario
    const formData = new FormData(form);
    // Convierte los datos del FormData a un objeto plano
    const data = Object.fromEntries(formData.entries());
    // Obtiene el elemento de mensaje de error del documento
    const errorMessage = document.getElementById("error-message");
  
    try {
      // Realiza una solicitud POST al servidor para iniciar sesión
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      // Verifica si la respuesta no es exitosa
      if (!response.ok) {
        // Si la respuesta no es exitosa, obtiene los datos del error y lanza una excepción
        const errorData = await response.json();
        throw new Error(errorData.error || "Error de inicio de sesión");
      }
  
      // Si la respuesta es exitosa, obtiene los datos de la respuesta
      const result = await response.json();
      // Redirecciona a la página especificada en los datos de la respuesta
      window.location.href = result.redirect;
    } catch (error) {
      // Maneja los errores de inicio de sesión
      console.error("Error de inicio de sesión:", error);
      // Muestra el mensaje de error en la página
      errorMessage.textContent = error.message;
    }
  }
  
  // Agrega un evento de escucha para el envío del formulario de inicio de sesión
  document
    .getElementById("loginForm")
    .addEventListener("submit", function (event) {
      // Evita que el formulario se envíe de manera predeterminada
      event.preventDefault();
      // Llama a la función de inicio de sesión cuando se envía el formulario
      login();
    });
  