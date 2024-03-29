const {pool} = require('../configs/DB')

exports.addService = (req, res) => {
    pool.query("INSERT INTO dbo_services SET ?", {
        title: req.body.title,
        homepage: req.body.homepage,
        service_username: req.body.service_username,
        service_password: req.body.service_password
    }, (err) => {
        if (err) throw err;
        res.json({
            status: 'Success',
            message: 'Service added successfully'
        })
    })
}

exports.addHardware = (req, res) => {
    const {
        make_model,
        hostname,
        IPMI,
        RAM,
        storage,
        NICS,
        cost,
        SN,
        related_service
    } = req.body

    pool.query("INSERT INTO dbo_hardware SET ?", {
        make_model: make_model,
        hostname: hostname,
        ipmi: IPMI,
        ram: RAM,
        storage: storage,
        nics: NICS,
        cost: cost,
        serial_number: SN,
        related_service: related_service
    }, (err) => {
        if (err) throw err;
        res.json({
            status: 'success',
            message: 'Hardware added'
        })
    })

}

exports.createCredential = (req, res) => {
    const {
        title,
        username,
        password,
        link,
        related_service
    } = req.body
    pool.query("INSERT INTO dbo_creds SET ?", {
        title: title,
        username: username,
        password: password,
        link: link,
        related_service: related_service,
    }, (err) => {
        if (err) throw err;
        res.json({
            status: 'success',
            message: 'Credential Added'
        })
    })
}

exports.createDocumentDraft = (req, res) => {
        try {
            if (req.body.related_service === null) throw "No related service was selected"
            const parsedID = parseInt(req.body.related_service)
            pool.query("INSERT INTO dbo_document_drafts SET ?", {
                draft_title: req.body.title,
                draft_html: req.body.text,
                timestamp: req.body.timestamp,
                related_service: parsedID
            }, (err) => {
                if (err) throw err;
                res.json({
                    status: 'success',
                    message: 'Draft saved successfully'
                })
            })
        } catch (err) {
            res.json({
                status: 'failed',
                message: err
            })
        }
}

exports.publishDraft = (req, res) => {
    try {
        pool.query("SELECT * FROM dbo_document_drafts WHERE draft_id = ?", [req.params.draft_id], (err, draft) => {
            if (err) throw err;
            const draftToPublish = {
                doc_title: draft[0].draft_title,
                doc_html: draft[0].draft_html,
                doc_timestamp: draft[0].timestamp,
                related_service: draft[0].related_service,
            }
            pool.query("DELETE FROM dbo_document_drafts WHERE draft_id = ?", [draft[0].draft_id], (err) => {
                if (err) throw 'Error removing draft';
            })
            pool.query("INSERT INTO dbo_documents SET ?", {
                doc_title: draftToPublish.doc_title,
                doc_html: draftToPublish.doc_html,
                doc_timestamp: draftToPublish.doc_timestamp,
                related_service: draftToPublish.related_service,
            }, (err) => {
                if (err) throw err;
                res.json({
                    status: "success",
                    message: "Draft was successfully published"
                })
            })
            
        })
    } catch (error) {
        res.json({
            status: 'failed',
            message: error
        })        
    }

}

exports.deleteDraft = (req, res) => {
    try {
        pool.query("DELETE FROM dbo_document_drafts WHERE draft_id = ?", [req.params.draft_id], (err) => {
            if (err) throw "Internal Server Error"
            res.json({
                status: 'success',
                message: 'Draft Deleted Successfully'
            })
        })
    } catch (error) {
        res.json({
            status: 'failed',
            message: error
        })        
    }
}
exports.deleteDocument = (req, res) => {
    try {
        pool.query("DELETE FROM dbo_documents WHERE doc_id = ?", [req.params.doc_id], (err) => {
            if (err) throw "Internal Server Error"
            res.json({
                status: 'success',
                message: 'Draft Deleted Successfully'
            })
        })
    } catch (error) {
        res.json({
            status: 'failed',
            message: error
        })        
    }
}
exports.deleteService = (req,res) => {
    pool.query("DELETE FROM dbo_services WHERE service_id = ?",[req.params.service_id], (err) => {
        try {
            if (err) throw new Error('Could not delete service', {cause: err.message})
            res.status(201).json({
                message: "Service Deleted"
            })
        } catch (error) {
            res.status(500).json({
                error: error.message,
                cause: error.cause
            })
        }
    })
}
exports.deleteHardware = (req, res) => {
    pool.query("DELETE FROM dbo_hardware WHERE hardware_id = ?",[req.params.hardware_id], (err) => {
        try {
            if (err) throw new Error('Could not delete hardware', {cause: err.message})
            res.status(201).json({
                message: "Hardware Deleted"
            })
        } catch (error) {
            res.status(500).json({
                error: error.message,
                cause: error.cause
            })
        }
    })
}

exports.deleteCred = (req, res) => {
    pool.query("DELETE FROM dbo_creds WHERE cred_id = ?", [req.params.cred_id],(err) => {
        try {
            if (err) throw new Error("Could not delete cred",{cause: err.message})
            res.status(201).json({
                message: "Cred Deleted"
            })
        } catch (error) {
            res.status(500).json({
                error: error.message,
                cause: error.cause
            })
        }
    })
}