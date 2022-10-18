const express = require('express');
const viewController = require('../controllers/viewController')
const databaseController = require('../controllers/databaseController')
const router = express.Router();


let initWebRoutes = (app) => {
    router.get('/', viewController.homeView);
    router.get('/deleteDisruption:disID', viewController.deleteDisruption);
    router.get('/getData:app_id', viewController.getData)
    router.get('/deleteService:app_id', viewController.deleteService)
    return app.use('/', router)
};

router.post('/addService', databaseController.addService)
router.post('/addDisruption', databaseController.addDisruption)
router.post('/editService:app_id', databaseController.editData)

module.exports = router;
module.exports = initWebRoutes;