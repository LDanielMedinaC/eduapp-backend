const LandingPage = require('../models').LandingPage;

function isValid(lp){

}

module.exports = {

    //Method to show landing page
    show(req, res){

        var query;
        
        //If requesting for a particular ID
        if (req.body._id)
            query = LandingPage.findById(req.body._id);
        else //if no id specified, return latest
            query = LandingPage.findOne({}, {}, {sort: {'created_at' : -1}});

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

    //Method used to update landing page
    update(req, res){
        
    }
}