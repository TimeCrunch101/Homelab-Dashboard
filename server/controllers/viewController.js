require('dotenv').config();
const mysql = require('mysql');
const DBConnection = require('../configs/databaseConfig');

exports.homeView = (req, res) => {
    conn = DBConnection();
    conn.query("SELECT * FROM apps ORDER BY app_id ASC", (err, data) => {
        if (err) throw err;
        conn.query('SELECT * FROM service_disruptions', (err, disruption) => {
            if (err) throw err;
            res.render('home', {
                data: data,
                disruption: disruption                
            }),conn.destroy();
        })
    })
}

exports.deleteDisruption = (req, res) => {
    conn = DBConnection();
    conn.query('DELETE FROM service_disruptions WHERE disID = ?', [req.params.disID], (err) => {
        if (err) throw err;
        res.redirect('/', 200, conn.destroy())
    })
}

exports.getData = (req, res) => {
    conn = DBConnection();
    conn.query('SELECT * FROM apps WHERE app_id = ?', [req.params.app_id], (err, editData) => {
        if (err) throw err;
        res.json(editData[0])
    })
}

exports.deleteService = (req, res) => {
    conn = DBConnection()
    conn.query('DELETE FROM apps WHERE app_id = ?', [req.params.app_id], (err) => {
        if (err) throw err;
        return res.sendStatus(200, conn.destroy())
    })
}