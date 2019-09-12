require('dotenv').config();

var LandingPage = require('../server/models').LandingPage;
var models = require('../server/models');

let seed = () => {
    models.connectDB()
    .then(async () => {
        var landingPages = [new LandingPage({
            LogoImgURL: 'https://yt3.ggpht.com/a/AGF-l7-ED38XcwKwiqauuL6Ps7nkQyVlDesbohBfGA=s900-c-k-c0xffffffff-no-rj-mo',
            Sections: [
                {
                    Title: 'La vida de los dioses griegos',
                    Elements: [{
                        IconImgURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Zeus_arte.jpg/220px-Zeus_arte.jpg',
                        ElementTitle: 'El primer dios griego, Zeus',
                        ElementDescription: 'Una mirada a uno de los grandes dioses griegos'
                    }],
                    BackgroundImgURL: 'https://st2.ning.com/topology/rest/1.0/file/get/3001370672?profile=RESIZE_1024x1024',
                    Description: 'Conozcamos más acerca de los dioses'
                }
            ]
            //createdAt: new Date()/*'2019-02-23 20:02:21.55'*/
        })];
    
        let seededLPs = landingPages.map(lp => {
            return new Promise((resolve, reject) => {
                lp.save()
                .then(seededLP => {
                    resolve(seededLP);
                })
                .catch(err => {
                    console.log(`Could not add landing page: ${err.errmsg || err}`);
                    reject(err);
                })
            })
        });
    
        Promise.all(seededLPs)
        .then(() => {
            console.log('Done :3');
            models.disconnectDB();
        })
        .catch(err => {
            console.log(`Something went wrong: ${err}`);
            models.disconnectDB();
        })
    })
    .catch((err) => {
        console.log(`Something broke: ${err}`);
    })
}

module.exports = seed;