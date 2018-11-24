var data
var values = []
var scoreFinal = []

class PersonaGlobal {
  constructor (nombre, puntos = 0, ejercicios = 0, penalizacion = 0) {
    this.nombre = nombre
    this.puntos = parseInt(puntos)
    this.ejercicios = parseInt(ejercicios)
    this.penalizacion = parseInt(penalizacion)
  }
}

class PersonaContest {
  constructor (nombre, problemas, penalizacion, adicional) {
    this.nombre = nombre
    this.problemas = parseInt(problemas)
    this.penalizacion = parseInt(penalizacion)
    this.adicional = parseInt(adicional)
  }
}

function desplegar () {
  var padre = document.getElementById('score')
  for (var i = 0; i < scoreFinal.length; i++) {
    var item = document.createElement('tr')
    var posicion = document.createElement('td')
    posicion.innerText = (i + 1)
    item.appendChild(posicion)
    var nombre = document.createElement('td')
    nombre.innerText = scoreFinal[i].nombre
    item.appendChild(nombre)
    var puntaje = document.createElement('td')
    puntaje.innerText = scoreFinal[i].puntos
    item.appendChild(puntaje)
    var ejercicios = document.createElement('td')
    ejercicios.innerText = scoreFinal[i].ejercicios
    item.appendChild(ejercicios)
    var penalizacion = document.createElement('td')
    penalizacion.innerText = scoreFinal[i].penalizacion
    item.appendChild(penalizacion)
    padre.appendChild(item)
  }
}

function agregarPuntaje (persona, puntaje) {
  for (var i = 0; i < scoreFinal.length; i++) {
    if (scoreFinal[i].nombre === persona.nombre) {
      scoreFinal[i].puntos += puntaje + persona.adicional
      scoreFinal[i].ejercicios += persona.problemas
      scoreFinal[i].penalizacion += persona.penalizacion
      break
    }
  }
}

function calcularCuartil (n, val) {
  var tam = n / 4
  if (val >= 0 && val <= Math.ceil(tam)) return 1
  else if (val <= Math.ceil(tam * 2)) return 2
  else if (val <= Math.ceil(tam * 3)) return 3
  else return 4
}

function calcularContests () {
  for (var i = 1; i < values[0].length; i += 3) {
    var contest = []
    var cont = 0
    for (var j = 0; j < values.length; j++) {
      if (parseInt(values[j][i]) !== -1) cont++
      contest.push(new PersonaContest(values[j][0], values[j][i], values[j][i + 1], values[j][i + 2]))
    }
    contest.sort(function (p1, p2) {
      if (p1.problemas !== p2.problemas) return p2.problemas - p1.problemas
      else if (p1.penalizacion !== p2.penalizacion) return p1.penalizacion - p2.penalizacion
      else return 0
    })
    for (var k = 0; k < contest.length; k++) {
      var cuartil = calcularCuartil(cont, k + 1)
      if (contest[k].problemas === -1) continue
      else if (k === 0) agregarPuntaje(contest[k], 8)
      else if (k === 1) agregarPuntaje(contest[k], 6)
      else if (k === 2) agregarPuntaje(contest[k], 5)
      else if (cuartil === 1) agregarPuntaje(contest[k], 4)
      else if (cuartil === 2) agregarPuntaje(contest[k], 3)
      else if (cuartil === 3) agregarPuntaje(contest[k], 2)
      else if (cuartil === 4) agregarPuntaje(contest[k], 1)
    }
  }

  scoreFinal.sort(function (p1, p2) {
    if (p1.puntos !== p2.puntos) return p2.puntos - p1.puntos
    else if (p1.ejercicios !== p2.ejercicios) return p2.ejercicios - p1.ejercicios
    else if (p1.penalizacion !== p2.penalizacion) return p1.penalizacion - p2.penalizacion
    else return 0
  })
  console.log(scoreFinal)
  desplegar()
}

function inicializarDatos () {
  for (var i = 1; i < data.length; i++) {
    values.push(data[i].split(','))
    scoreFinal.push(new PersonaGlobal(values[i - 1][0]))
  }
  // console.log(scoreFinal)
  calcularContests()
}


function leerCSV () {
  var request = new window.XMLHttpRequest()
  request.open('GET', 'score.csv', true)
  request.onload = function () {
    if (request.status >= 200 && request.status < 400) {
      // console.log(request.responseText)
      data = request.responseText.split('\r\n')
      inicializarDatos()
    } else {
      // TODO: Manejar error devuelto por el servidor
    }
  }

  request.onerror = function () {
    // TODO: Manejar error en la peticion
  }
  request.send()
}

window.onload = function () {
  leerCSV()
}
