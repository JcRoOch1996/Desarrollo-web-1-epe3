// supervisor.js

// Función asíncrona para cerrar sesión del supervisor
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
  
  // Función asíncrona para obtener la lista de empleados
  async function getEmployees() {
    try {
      // Realiza una solicitud GET al servidor para obtener la lista de empleados
      const response = await fetch("http://localhost:3000/api/employees");
      // Verifica si la respuesta no es exitosa
      if (!response.ok) {
        // Lanza una excepción si hay un error al obtener la lista de empleados
        throw new Error("Error al obtener la lista de empleados");
      }
      // Convierte la respuesta a formato JSON
      const employees = await response.json();
      // Muestra la lista de empleados en la página
      displayEmployees(employees);
    } catch (error) {
      // Maneja los errores al obtener la lista de empleados
      console.error("Error al obtener la lista de empleados:", error);
      // Muestra una alerta al usuario sobre el problema
      alert(
        "Hubo un problema al obtener la lista de empleados. Por favor, intenta de nuevo más tarde."
      );
    }
  }
  
  // Función para mostrar la lista de empleados en una tabla
  function displayEmployees(employees) {
    const tableBody = document.getElementById("employeeTableBody");
    tableBody.innerHTML = "";
    // Itera sobre la lista de empleados y crea filas para cada uno en la tabla
    employees.forEach((employee) => {
      const row = document.createElement("tr");
      row.innerHTML = `
              <td>${employee.nombre}</td>
              <td>${employee.Apellidos}</td>
              <td>${employee.Rut}</td>
              <td>${employee.Rol}</td>
              <td>${
                // Muestra la información de los turnos del empleado
                employee.Turno.map(
                  (shift) => `
                      Fechas: ${shift.startDate} - ${shift.endDate}<br>
                      Horario: ${shift.start} - ${shift.end}
                  `
                ).join("<br>") || "No asignado"
              }</td>
              <td>${employee.Comments || ""}</td>
          `;
      tableBody.appendChild(row);
    });
  }
  
  // Función asíncrona para asignar un turno a un empleado
  async function assignShift(event) {
    event.preventDefault();
  
    // Obtiene los valores del formulario de asignación de turno
    const rut = document.getElementById("employeeRut").value;
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;
    const start = document.getElementById("start").value;
    const end = document.getElementById("end").value;
    const comments = document.getElementById("comments").value;
  
    const messageElement = document.getElementById("message");
  
    try {
      // Realiza una solicitud POST al servidor para asignar/modificar el turno del empleado
      const response = await fetch("http://localhost:3000/api/assign-shift", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Envía los datos del turno en formato JSON en el cuerpo de la solicitud
        body: JSON.stringify({ rut, startDate, endDate, start, end, comments }),
      });
  
      // Verifica si la respuesta no es exitosa
      if (!response.ok) {
        // Obtiene los datos del error y lanza una excepción
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al asignar/modificar el turno");
      }
  
      // Si la solicitud es exitosa, muestra un mensaje de éxito y actualiza la lista de empleados
      const result = await response.json();
      messageElement.style.color = "green";
      messageElement.textContent = "Turno asignado/modificado exitosamente";
      getEmployees();
    } catch (error) {
      // Maneja los errores al asignar/modificar el turno del empleado
      console.error("Error al asignar/modificar el turno:", error);
      // Muestra un mensaje de error en la página
      messageElement.style.color = "red";
      messageElement.textContent = error.message;
    }
  }
  
  // Agrega un evento de escucha para el evento "DOMContentLoaded", que se dispara cuando se carga la página
  document.addEventListener("DOMContentLoaded", getEmployees);
  
  // Agrega un evento de escucha para el envío del formulario de asignación de turno
  document.getElementById("shiftForm").addEventListener("submit", assignShift);
  