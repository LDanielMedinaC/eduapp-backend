const seeders = [
    require('./user-seeder'),
    require('./landingpage-seeder')
]

seeders.forEach((seeder) => {
    seeder();
})