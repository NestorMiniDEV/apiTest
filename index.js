const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const app = express();

const User = require("./public/user");

const mongoURL = "mongodb://localhost:27017/usersweb";

app.use(express.json());
//El host va a abrir en una página "estatica" (index) ubicada en la carpeta "public"
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({extends: false}));

//endpoint de registro, mediante los datos del html
app.post("/registrar",(req, res) => {
    console.log(req.body)
    const {name, password} = req.body;
    const user = new User ({name, password});
    user.save()
    .then(() => {
        res.send("Usuario registrado");
    })
    .catch((err) => {
        res.status(500).send("Error en el registro");
    });
});

//endpoint de verificacion de la información del html
app.post("/verificar", async (req, res)  => {
    const {name, password} = req.body
    console.log(req.body);
    
    //busca en la base de datos, un nombre que conisida con el que ingresamos en la web
    const checkUser = await User.findOne({name});

    if(!checkUser)  {
        res.status(400).send("Usuario no existe");
    } else {

        //analiza si la contraseña es la misma que ahí en la base de datos
        //la variable "checkUser" es capaz de utilizar el método de User, ya que este es una instancia de User.
        checkUser.correctPassword(password, function (err, checkPassword) {
            if (err)  {
                res.status(500).send("Error en la conexión");
            }  else if (checkPassword)  {
                res.send(`El usuario: ${name}, ha ingresado con la contraseña: ${password}.`);
            }  else {
                res.status(400).send("Contraseña incorrecta");
            }
        });
    }
});




mongoose.connect(mongoURL, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log(`Conexion exitosa con la base de datos: ${mongoURL}`))
.catch((err) => console.error(err));

const port = process.env.port || 3000;
app.listen(port, () => console.log(`el puerto ${port}\nse encuentra activo`))

module.exports = app;
