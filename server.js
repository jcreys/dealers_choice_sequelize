//Data Layer - to be moved to db.js
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
//express
const express = require('express');
const app = express();

app.get('/', (req,res) => res.redirect('/albums'));

app.get('/albums', async(req,res,next) => {
    try {
        const albums = await Album.findAll({
            include: [ Artist ]
        });
        const html = albums.map( album => {
            return `
                <div>
                    ${ album.name }
                    <a href='/artists/${ album.artistId }'>${ album.artist.name } </a>
                </div>
            `;
        }).join('');
        res.send(`
        <html>
            <head>
                <title> Discography </title>
            </head>
            <body>
            <h1> Discography </h1>
            ${ html }
            </body>
        </html>
        `);
    }
    catch(ex){
        next(ex);
    }
});

const start = async()=> {
    try{
        await sequelize. sync( {force: true} );
        console.log('starting');
        const drake = await Artist.create({name: 'Drake'});
        const theWeeknd = await Artist.create({name: 'The Weeknd'});
        const taylorSwift = await Artist.create({name: 'Taylor Swift'});
        const red = await Album.create({name: 'Red', artistId: taylorSwift.id});
        const dawnFm = await Album.create({name: 'Dawn FM', artistId: theWeeknd.id});
        const nwts = await Album.create({name: 'Nothing was the Same', artistId: drake.id});
        const port = process.env.PORT || 3000;
        app.listen(port, ()=> console.log(`listening on port ${port}`));
        console.log(drake);
    }
    catch(ex) {
        console.log(ex);
    }
}

start();