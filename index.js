const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const app = express();

const User = require("./public/user");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({extends: false}));

const mongoURL = "mongodb://localhost:27017/usersweb";

mongoose.connect(mongoURL, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log(`Conexion exitosa con la base de datos: ${mongoURL}`))
.catch((err) => console.error(err));

//endpoint de verificacion de la información del html
app.post("/verificar",async function (req, res) {
    const {name, password} = req.body
    console.log(req.body);
    const passUser = await User.findOne({name});
    if(passUser){
        res.send("Usuario correcto");
    }else{
        return res.status(404).send("Usuario inexistente")
    }


});

//endpoint de registro, mediante los datos del html
app.post("/registrar",(req, res) => {
    console.log(req.body)
    const user = new User ({name, password});
    user.save()
    .then(() => {
        res.send("Usuario registrado");
    })
    .catch((err) => {
        return res.status(404).send("Error en el registro");
    });
});

const port = process.env.port || 3000;
app.listen(port, () => console.log(`el puerto ${port}\nse encuentra activo`))

module.exports = app;
