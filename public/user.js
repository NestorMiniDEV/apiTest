const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const characters = 10;

//generamos el "esquema" o clase de usuario
const userClass = new mongoose.Schema(
    {
        name: {type: String, require: true},
        password: {type: String, require: true, unique: true} 
    }
)

//función que se ejecunta antes para guardar la contraseña encriptada
userClass.pre("save", function(next){ //antes de que guarde 
    if(this.isNew || this.isModified("password")){
        const document = this; //cuando usuario sea nuevo o contraseña sea modificada, es asignada a document

        //encriptación de la contraseña
        bcrypt.hash(document.password, characters, (err, hashedPassword)=>{ 
            if(err){
                next(err);
            }else {
                document.password = hashedPassword; 
                next();
            }
        })
    }else{
        next();
    }
});

userClass.methods.correctPassword = function(password, callback){
    return bcrypt.compare(password, this.password, function(err, same){
        if(err){
            callback(err);
        }else{
            callback(err, same);
        }
    });
}

module.exports = mongoose.model("User", userClass);
