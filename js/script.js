const MENU = document.querySelector('#menu')
const ROUTER = document.querySelector('#router')
const HOME = document.querySelector('#home-content')
const LOGIN = document.querySelector('#login-content')
const REGISTROU = document.querySelector('#registroU-content')
const REGISTROC = document.querySelector('#registroC-content')
const LISTADOC = document.querySelector('#listadoC-content')
const INFORME = document.querySelector('#informe-content')
const MAPA = document.querySelector('#mapa-content')

const BTNHOME = document.querySelector('#btnHome')
const BTNLOGIN = document.querySelector('#btnLogin')
const BTNREGISTRARU = document.querySelector('#btnRegistrarU')
const BTNREGISTRARC = document.querySelector('#btnRegistrarC')
const BTNLISTARC = document.querySelector('#btnListarC')
const BTNINFORME = document.querySelector('#btnInforme')
const BTNMAPA = document.querySelector('#btnMapa')
const BTNCERRARSESION = document.querySelector('#btnCerrarSesion')

const URLBASE = 'https://calcount.develotion.com/'

inicio()

function cerrarMenu() {
  MENU.close()
}

function inicio() {
  chequearSesion()
  eventos()
}

function eventos() {
  ROUTER.addEventListener("ionRouteDidChange", navegar)
  BTNREGISTRARU.addEventListener('click', getPaises)
  BTNREGISTRARC.addEventListener('click', getAlimentos)
}

function navegar(event) {
  ocultarPantallas()
  let to = event.detail.to

  switch (to) {
    case "/":
      HOME.style.display = "block"
      break;
    case "/login":
      LOGIN.style.display = "block"
      break;
    case "/registrousuario":
      REGISTROU.style.display = "block"
      break;
    case "/registrocomida":
      REGISTROC.style.display = "block"
      break;
    case "/listarcomida":
      LISTADOC.style.display = "block"
      break;
    case "/informe":
      INFORME.style.display = "block"
      break;
    case "/mapa":
      MAPA.style.display = "block"
      break;

    default:
      break;
  }
}

function ocultarPantallas() {
  HOME.style.display = "none"
  LOGIN.style.display = "none"
  REGISTROU.style.display = "none"
  REGISTROC.style.display = "none"
  LISTADOC.style.display = "none"
  INFORME.style.display = "none"
  MAPA.style.display = "none"
}

function chequearSesion() {
  ocultarBotones()
  if (localStorage.getItem("apiKey") != null) {
    mostrarMenuUsuario()
  } else {
    mostrarMenuAnon()
  }
}

function ocultarBotones() {
  BTNHOME.style.display = "none"
  BTNLOGIN.style.display = "none"
  BTNREGISTRARU.style.display = "none"
  BTNREGISTRARC.style.display = "none"
  BTNLISTARC.style.display = "none"
  BTNINFORME.style.display = "none"
  BTNMAPA.style.display = "none"
  BTNCERRARSESION.style.display = "none"
}

function mostrarMenuUsuario() {
  BTNHOME.style.display = "block"
  BTNREGISTRARC.style.display = "block"
  BTNLISTARC.style.display = "block"
  BTNINFORME.style.display = "block"
  BTNMAPA.style.display = "block"
  BTNCERRARSESION.style.display = "block"
}

function mostrarMenuAnon() {
  BTNHOME.style.display = "block"
  BTNLOGIN.style.display = "block"
  BTNREGISTRARU.style.display = "block"
}

function previaLogin() {
  let usuario = document.querySelector('#loginUsuario')
  let password = document.querySelector('#loginPassword')

  let nuevoUsuario = {}
  nuevoUsuario.usuario = usuario
  nuevoUsuario.password = password
  login(nuevoUsuario)
}

function login(nuevoUsuario) {
  fetch(`${URLBASE}/login.php`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(nuevoUsuario)
  })
    .then(response => {
      return response.json()
    })
    .then(data => {
      iniciarSesion(data)
    })
    .catch(function (error) {
      console.log(error)
    })
}

function cerrarSesion() {
  localStorage.removeItem('apiKey')
  cerrarMenu()
  chequearSesion()
}

function getPaises() {
  fetch(`${URLBASE}/paises.php`)
    .then(response => {
      return response.json()
    })
    .then(data => {
      cargarListaPaises(data.paises)
    })
    .catch(function (error) {
      console.log(error)
    })
}

function cargarListaPaises(paises) {
  result = ''
  for (let pais of paises) {
    result += `<ion-select-option ${pais.id}>${pais.name}</ion-select-option>`
  }
  document.querySelector('#registroPais').innerHTML = result
}

function previaRegistroU() {
  let usuario = document.querySelector('#registroUsuario').value
  let pass = document.querySelector('#registroPassword').value
  let calorias = document.querySelector('#caloriasDiarias').value
  let pais = document.querySelector('#registroPais').value

  let nuevoUsuario = {}
  nuevoUsuario.usuario = usuario
  nuevoUsuario.password = pass
  nuevoUsuario.caloriasDiarias = calorias
  nuevoUsuario.idPais = pais

  registroUsuario(nuevoUsuario)
}

function registroUsuario(nuevoUsuario) {
  fetch(`${URLBASE}/usuarios.php`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(nuevoUsuario)
  })
    .then(response => {
      return response.json()
    })
    .then(data => {
      if (data.mensaje == null) {
        iniciarSesion(data)
      } else {
        alert(data.mensaje)
      }
    })
    .catch(function (error) {
      console.log(error)
    })
}

function iniciarSesion(data) {
  localStorage.setItem('apiKey', data.apiKey)
  localStorage.setItem('idUsuario', data.id)
  chequearSesion()
  ocultarPantallas()
  HOME.style.display = "block"
}

function getAlimentos() {
  fetch(`${URLBASE}/alimentos.php`,{
    headers: {
      'Content-Type': 'application/json',
      'apikey': localStorage.getItem('apiKey'),
      'iduser': localStorage.getItem('idUsuario')
    }
  }
  )
    .then(response => {
      return response.json()
    })
    .then(data => {
      const listaAlimentos = data.alimentos
      cargarListaAlimentos(data.alimentos)
    })
    .catch(function (error) {
      console.log(error)
    })
}

function cargarListaAlimentos(alimentos) {
  result = ''
  for (let alimento of alimentos) {
    result += `<ion-select-option ${alimento.id}>${alimento.nombre}</ion-select-option>`
  }
  document.querySelector('#registroAlimento').innerHTML = result
}
