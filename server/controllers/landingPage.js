const User = require('../models').LandingPage;

function isValid(lp){

}

module.exports = {

    //Method to show landing page
    show(req, res){
        let query = LandingPage.findOne({}, {}, {sort: {'created_at' : -1}});

        query.exec((err, lp) => {
            err.status = 404;
            err.description = "There are no landing pages";
             
            if (err) 
                res.send();
            
            res.json(lp);
        });
    },

    //Method used to update landing page
    update(req, res){
        
    }
}