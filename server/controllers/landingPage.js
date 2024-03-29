const LandingPage = require('../models').LandingPage;

function isValid(lp){

}

module.exports = {

    // Method to show landing page
    show(req, res){
        
        LandingPage.findOne()
            .populate('showcasedTopicsIds')
            .exec((err, lp) => {
            
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
                page.logoImgURL = landingPage.logoImgURL || page.logoImgURL;
                page.showcasedTopicsIds = landingPage.showcasedTopicsIds || page.showcasedTopicsIds;
                page.carrousel = landingPage.carrousel || page.carrousel;
                page.sections = landingPage.sections || page.sections || [];

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