const LandingPage = require('../models').LandingPage;

function isValid(lp){

}

module.exports = {

    // Method to show landing page
    show(req, res){

        var query;
        
        query = LandingPage.findOne();

        /*//If requesting for a particular ID
        if (req.body._id)
            query = LandingPage.findById(req.body._id);
        else //if no id specified, return latest
            query = LandingPage.findOne({}, {}, {sort: {'created_at' : -1}});*/

        query.exec((err, lp) => {
            
            if (err)
            { 
                err.status = 404;
                err.description = "No landing page was found";
                err.code = 1;
                res.send(err);
            }
            else
            {
                res.status = 200;
                res.json(lp);
            }
        });
    },

    // Method used to update landing page
    update(req, res){
        let landingPage = req.body;
        // TO DO: Validate payload landing page

        LandingPage.findOne()
        .then((page) => {
            if(!page) {
                // Can't update non-existent page
                return res.status(404).send({
                    error: {
                        status: 404,
                        description: 'Requested landing page does not exist.',
                        code: 1
                    }
                });
            } else {
                // Landing page exists, update
                page.LogoImgURL = landingPage.LogoImgURL || page.LogoImgURL;
                page.ShowcasedTopicsIDs = landingPage.ShowcasedTopicsIDs || page.ShowcasedTopicsIDs;
                page.Sections = landingPage.Sections || page.Sections || [];

                //run validators on fields, return if error occurs
                var err = page.validateSync();
                if (err)
                    return res.status(400).send({
                        error: {
                            status: 400,
                            description: err.message || err,
                            code: 2
                        }
                    });

                page.save()
                .then((updatedPage) => res.status(200).send(updatedPage))
                .catch((err) => {
                    res.status(500).send({
                        error: {
                            status: 500,
                            description: `Database error: ${err.errmsg || err}`,
                            code: 0
                        }
                    });
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                error: {
                    status: 500,
                    description: `Database error: ${err.errmsg}`,
                    code: 2
                }
            });
        });
    }
}