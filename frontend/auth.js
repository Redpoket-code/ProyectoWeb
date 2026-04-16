const registroForm = document.getElementById("registroForm");
const loginForm = document.getElementById("loginForm");

// Obtener usuarios guardados
function obtenerUsuarios() {
  return JSON.parse(localStorage.getItem("usuarios")) || [];
}

// Guardar usuarios
function guardarUsuarios(usuarios) {
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

/*REGISTRO*/

if (registroForm) {
  registroForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const nombre = document.getElementById("regNombre").value.trim();
    const correo = document.getElementById("regCorreo").value.trim();
    const password = document.getElementById("regPassword").value.trim();
    const tipo = document.getElementById("regTipo").value;

    try {
      const respuesta = await fetch("http://localhost:5000/api/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nombre,
          correo,
          tipoUsuario: tipo,
          password
        })
      });

      const data = await respuesta.json();

      if (!respuesta.ok) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.mensaje
        });
        return;
      }

      Swal.fire({
        icon: "success",
        title: "Cuenta creada",
        text: "Registro exitoso"
      }).then(() => {
        window.location.href = "login.html";
      });

    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error del servidor"
      });
    }
  });
}

/*LOGIN*/

if (loginForm) {
  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const correo = document.getElementById("loginCorreo").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    try {
      const respuesta = await fetch("http://localhost:5000/api/usuarios/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ correo, password })
      });

      const data = await respuesta.json();

      if (!respuesta.ok) {
        Swal.fire({
          icon: "error",
          title: "Error de acceso",
          text: data.mensaje
        });
        return;
      }

      // Guardamos el token ahora, no el usuario completo
      localStorage.setItem("token", data.token);

      Swal.fire({
        icon: "success",
        title: "Bienvenido 👋"
      }).then(() => {
        window.location.href = "index.html";
      });

    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error del servidor"
      });
    }
  });
}

/*RECUPERACION CONTRASENA */

const forgotLink = document.getElementById("forgotPassword");
const forgotContainer = document.getElementById("forgotContainer");
const forgotSubmit = document.getElementById("forgotSubmit");

if (forgotLink) {

  forgotLink.addEventListener("click", function (e) {
    e.preventDefault();

    // Toggle mostrar / ocultar
    if (forgotContainer.style.display === "none" || 
        forgotContainer.style.display === "") {
      forgotContainer.style.display = "block";
    } else {
      forgotContainer.style.display = "none";
    }
  });

  forgotSubmit.addEventListener("click", function () {

    const email = document.getElementById("forgotEmail").value.trim();

    if (!email) {
      Swal.fire({
        icon: "warning",
        title: "Correo requerido",
        text: "Debes ingresar un correo",
        confirmButtonColor: "#4e7a8c"
      });
      return;
    }

    Swal.fire({
      icon: "success",
      title: "Correo enviado",
      text: "Se enviaron indicaciones para restablecer tu contraseña",
      confirmButtonColor: "#4e7a8c"
    });

    // Limpiar y ocultar
    document.getElementById("forgotEmail").value = "";
    forgotContainer.style.display = "none";

  });
}