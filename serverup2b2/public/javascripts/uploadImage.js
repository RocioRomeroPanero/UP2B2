// Importamos el modulo para subir ficheros
var fs = require('fs');

exports.uploadQuestionPhoto = function(req, res) {
    /*console.log(req.file);
    var tmp_path = req.file.path;
    console.log(tmp_path);
    var tipo = req.file.mimetype;
    if (tipo == 'image/png' || tipo == 'image/jpeg' || tipo == 'image/jpg') {
        fs.createReadStream('./uploads/' + req.file.filename).pipe(fs.createWriteStream('./public/images/question-images/' + req.file.originalname));
        //borramos el archivo temporal creado
        fs.unlink('./uploads/' + req.file.filename, function(err) {
            if (err) throw err;
            res.send("Upload success");
        });

    } else {
        res.send("File not supported");
    }*/
    
   
}
