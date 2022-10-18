const DBConnection = require('../configs/databaseConfig');
const path = require('path');

let addService = (req, res) => {
    
    let appImg;
    let uploadPath;
    let fileName;

    if (!req.files || Object.keys(req.files).length === 0) {
        const conn = DBConnection()
        let imgPath = '/imgs/placeholder.jpg'
        const {hyperlink, name, hostname, ip_addr, username, password} = req.body;
        conn.query('INSERT INTO apps SET ?', {hyperlink: hyperlink, name: name, hostname: hostname, ip_addr: ip_addr, username: username, password: password, img_path: imgPath}, (err) => {
            if (err) throw err;
            res.redirect('/'),conn.destroy();
            return;
        })
    } else {
        appImg = req.files.appImg;
        fileName = appImg.name;
        const extension = path.extname(fileName)
        const md5 = appImg.md5;
        const hashFileName = md5 + extension;
        
        uploadPath = __dirname + '/../../public/imgs/' + hashFileName;    
        appImg.mv(uploadPath, (err) => {
            if (err) {
                return res.status(500).send(err);
            } else {
                const conn = DBConnection()
                const imgPath = '/imgs/'+hashFileName
                const {hyperlink, name, hostname, ip_addr, username, password} = req.body;
                conn.query('INSERT INTO apps SET ?', {hyperlink: hyperlink, name: name, hostname: hostname, ip_addr: ip_addr, username: username, password: password, img_path: imgPath}, (err) => {
                    if (err) throw err;
                    return res.redirect('/'),conn.destroy();
                })
            }
        })
    }
}
let addDisruption = (req, res) => {
    let conn = DBConnection()
    const {description} = req.body;
    conn.query('INSERT INTO service_disruptions SET ?', {description: description}, (err) => {
        if (err) throw err;
        return res.redirect('/'),conn.destroy();
    })
}

let editData = (req, res) => {
    let conn = DBConnection()
    const {hyperlink, name, hostname, ip_addr, username, password} = req.body
    conn.query(`UPDATE apps SET ? WHERE app_id = ${req.params.app_id}`, {hyperlink: hyperlink, name: name, hostname: hostname, ip_addr: ip_addr, username: username, password: password}, (err) => {
        if (err) throw err;
        return res.redirect('/', 200, conn.destroy())
    })
}

module.exports = {
    addService: addService,
    addDisruption: addDisruption,
    editData: editData
}