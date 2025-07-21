// trabajador.js

// Función asíncrona para cerrar sesión del trabajador
async function logout() {
    try {
      // Realiza una solicitud POST al servidor para cerrar sesión
      const response = await fetch("http://localhost:3000/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      // Verifica si la respuesta no es exitosa
      if (!response.ok) {
        // Lanza una excepción si hay un error al cerrar sesión
        throw new Error("Error al cerrar sesión");
      }
  
      // Redirecciona a la página de inicio después de cerrar sesión exitosamente
      window.location.href = "index.html";
    } catch (error) {
      // Maneja los errores de cierre de sesión
      console.error("Error al cerrar sesión:", error);
    }
  }
  
  // Agrega un evento de escucha al botón de cerrar sesión
  document.getElementById("logoutButton").addEventListener("click", logout);
  
  // Función asíncrona para obtener los turnos del trabajador
  async function getShifts() {
    // Obtiene el parámetro de la URL que indica el rut del trabajador
    const urlParams = new URLSearchParams(window.location.search);
    const rut = urlParams.get("rut");
  
    try {
      // Realiza una solicitud GET al servidor para obtener los datos del usuario por su rut
      const response = await fetch(`http://localhost:3000/api/user/${rut}`);
      // Verifica si la respuesta no es exitosa
      if (!response.ok) {
        // Lanza una excepción si hay un error al obtener los datos del usuario
        throw new Error("Error al obtener los datos del usuario");
      }
      // Convierte la respuesta a formato JSON
      const user = await response.json();
      // Muestra los turnos del usuario en el calendario
      displayShifts(user.Turno, user.Comments);
    } catch (error) {
      // Maneja los errores al obtener los datos del usuario
      console.error("Error al obtener los datos del usuario:", error);
      // Muestra una alerta al usuario sobre el problema
      alert(
        "Hubo un problema al obtener los turnos. Por favor, intenta de nuevo más tarde."
      );
    }
  }
  
  // Función para mostrar los turnos del trabajador en un calendario
  function displayShifts(shifts, comments) {
    const scheduleContainer = document.getElementById("schedule");
  
    // Crea un nuevo calendario utilizando FullCalendar
    const calendar = new FullCalendar.Calendar(scheduleContainer, {
      initialView: "dayGridMonth", // Vista inicial del calendario
      headerToolbar: {
        // Barra de herramientas del encabezado del calendario
        left: "prev,next today", // Botones de navegación
        center: "title", // Título del calendario
        right: "dayGridMonth,timeGridWeek,timeGridDay", // Botones para cambiar de vista
      },
      events: shifts.map((shift) => ({
        // Mapea los turnos del usuario a eventos del calendario
        title: `Turno: ${shift.start} - ${shift.end}`,
        start: shift.startDate,
        end: shift.endDate,
        extendedProps: {
          comments: comments || "No hay comentarios",
          startTime: shift.start,
          endTime: shift.end,
        },
      })),
      // Función que se ejecuta al hacer clic en un evento del calendario
      eventClick: function (info) {
        alert(
          "Detalles del turno:\n" +
            "Inicio: " +
            info.event.extendedProps.startTime +
            "\n" +
            "Fin: " +
            info.event.extendedProps.endTime +
            "\n" +
            "Comentarios: " +
            (info.event.extendedProps.comments || "No hay comentarios")
        );
      },
    });
  
    // Renderiza el calendario en el contenedor especificado
    calendar.render();
  }
  
  // Agrega un evento de escucha para el evento "DOMContentLoaded", que se dispara cuando se carga la página
  document.addEventListener("DOMContentLoaded", getShifts);
  
  