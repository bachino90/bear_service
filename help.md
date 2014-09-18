
# ## PASOS PARA ARRANCAR EL PROYECTO

### Actualizo npm y Express.js
```
$ npm update npm -g

$ npm install -g express

$ npm install -g express-generator
```
### Creo el proyecto

Se creara un archivo app.js, un package.json y varias carpetas (routes, view, public y bin).

```
$ express --ejs bear_service
```

### Instalo todos los modulos
```
$ cd bear_service

$ npm install
```

### Inicio el servidor
```
$ npm start
```

### Debug

Para debugear hay que iniciar el servidor de esta forma:
```
$ DEBUG=express:* node ./bin/www
```

o

```
$ DEBUG=bear_service node ./bin/www
```

# ## CODIGO UTIL

### Crea una aplicación

```javascript
var express = require('express');
var app = express();
```

### Definí una route

```javascript
//template
app.GET();
app.POST();

//ejemplo
app.get('/hello.txt', function(req, res){
  res.send('Hello World');
});
```

### Escuchar conexiones

```javascript
var server = app.listen(5000, function() {
    console.log('Listening on port %d', server.address().port);
});
```

### Setear el View Engine (EJS)

```javascript
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
  res.render('index', { title: 'Hey', message: 'Hello there!'});
})
```



# ## OTROS COMANDO DE LINEA

### Clonar desde git

```
$ git clone git@github.com:bachino90/bear_service.git
```

### Obtener version de express
```
> npm info express version
```
