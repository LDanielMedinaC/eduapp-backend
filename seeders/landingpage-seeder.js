require('dotenv').config();

const LandingPage = require('../server/models').LandingPage;

const Topic = require('../server/models').Topic;

const lp = new LandingPage({
    logoImgURL: 'https://yt3.ggpht.com/a/AGF-l7-ED38XcwKwiqauuL6Ps7nkQyVlDesbohBfGA=s900-c-k-c0xffffffff-no-rj-mo',
    carrousel: ['https://smiletutor.sg/wp-content/uploads/2018/10/6-advantages-of-online-tutoring.jpeg', 'https://images.ctfassets.net/p0qf7j048i0q/599C41259E6A4444BB7E1CBB24D1BB81/cd75bc40999bf5a1dca2fae66cc8c144/i609086966.jpg?w=1000&fm=webp'],
    sections: [
        {
            title: 'La vida de los dioses griegos',
            elements: [{
                iconImgURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Zeus_arte.jpg/220px-Zeus_arte.jpg',
                elementTitle: 'El primer dios griego, Zeus',
                elementDescription: 'Una mirada a uno de los grandes dioses griegos'
            }],
            backgroundImgURL: 'https://st2.ning.com/topology/rest/1.0/file/get/3001370672?profile=RESIZE_1024x1024',
            description: 'Conozcamos más acerca de los dioses'
        }
    ]
});

let seed = () => {
    console.log('>>> Seeding Landing Pages');

    return new Promise(async (resolve, reject) => {

        //Add showcased topics into LP
        let topic = await Topic.findOne({'name': 'Álgebra Lineal'}).exec();
        let idTopic1 = topic._id;

        topic = await Topic.findOne({'name': 'Cálculo Vectorial'}).exec();
        let idTopic2 = topic._id;

        topic = await Topic.findOne({'name': 'Ecuaciones Diferenciales'}).exec();
        let idTopic3 = topic._id;

        lp.showcasedTopicsIds = [idTopic1, idTopic2, idTopic3];

        let seedingLPs = [new Promise((resolve, reject) => {
            lp.save()
            .then(resolve)
            .catch(err => {
                console.log(`Could not add landing page: ${err.errmsg || err}`);
                reject(err);
            });
        })];

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
