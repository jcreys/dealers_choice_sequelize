const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/music_db');
const STRING = Sequelize.DataTypes.STRING;

const Artist = sequelize.define('artist', {
    name: {
        type: STRING,
        unique: true,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }
}); //build Artist model
const Album = sequelize.define('album', {
    name: {
        type: STRING,
        unique: true,
        allowNull: false,
        validate: {
            notEmpty: true
        }       
    }
}); //build Album model

Album.belongsTo(Artist);
const start = async()=> {
    try{
        await sequelize. sync( {force: true} );
        console.log('starting');
        const drake = await Artist.create({name: 'Drake'});
        const theWeeknd = await Artist.create({name: 'The Weeknd'});
        const taylorSwift = await Artist.create({name: 'Taylor Swift'});
        const red = await Album.create({name: 'Red', artistId: taylorSwift.id});
        const dawnFm = await Album.create({name: 'Dawn FM', artistId: theWeeknd.id});
        const ntws = await Album.create({name: 'Nothing was the Same', artistId: drake.id});
        console.log(drake);
    }
    catch(ex) {
        console.log(ex);
    }
}

start();