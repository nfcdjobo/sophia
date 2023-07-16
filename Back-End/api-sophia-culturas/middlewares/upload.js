
const path = require(`path`);
const multer = require(`multer`);
let storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "stockage/");
        console.log('uploaded');
    },
    filename: function(req, file, cb){
        let ext = path.extname(file.originalname); //On récupère le nom original de l'image
        const r = al=> al.length==2 ? al[1] : r;
        cb(null, Date.now()+ r(Math.random().toString().split('.')) + ext);
    }
})

let Upload = multer({
    storage: storage, 
    fileFilter: function(req, file, callback){
        if(file.mimetype === `image/png` || file.mimetype === `image/svg` ||  file.mimetype === `image/jpg`
            || file.mimetype === `image/jpeg` || file.mimetype === `image/webp` || file.mimetype === `image/gif`
            ||  file.mimetype === `image/avif`){
            callback(null, true);
        }else{
            console.log(`Seule les image d'extention .png, .svg, .jpg, .gif, .webp, .avif et .jpeg sont recommandés.`);
            callback(null, false)
        }
    },
    limits:{fileSize:1024*1024*2}
});
let Telecharger = Upload.single("photo");
module.exports = Telecharger;
