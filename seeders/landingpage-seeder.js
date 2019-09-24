require('dotenv').config();

const LandingPage = require('../server/models').LandingPage;

const landingPages = [new LandingPage({
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
})];

let seed = () => {
    console.log('>>> Seeding Landing Pages');

    return new Promise(async (resolve) => {
        let seedingLPs = landingPages.map((lp) => {
            return new Promise((resolve, reject) => {
                lp.save()
                .then(resolve)
                .catch(err => {
                    console.log(`Could not add landing page: ${err.errmsg || err}`);
                    reject(err);
                });
            });
        });

        Promise.all(seedingLPs)
        .then(() => {
            // All LPs successfully seeded
            console.log('All landing pages seeded!');
            resolve();
        })
        .catch((err) => {
            console.log(`Failed while seeding landing pages: ${err}`);
            reject();
        });
    });
}

module.exports = {
    seed
};
