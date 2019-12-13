import {version} from '../package.json'
import path from 'path'
import _ from 'lodash'
import File from './models/file';
import {ObjectID} from 'mongodb'

class AppRouter {

    constructor(app) {
        this.app = app;
        this.setUpRouter();
    }

    setUpRouter() {
        const app = this.app;
        const upload = app.get("upload");
        const uploadDir = app.get("storageDir");
        const db = app.get('db');

        app.get('/', (req, res, next) => {
            return res.status(200).json({
                version: version
            });
        });
        
        app.post("/api/upload", upload.array('files'), (req, res, next) => {
            const files = _.get(req, 'files', []);

            let models = [];

            _.forEach(files, (file) => {
                const newFile = new File(app).initWithObject(file).toJson();
                models.push(newFile);
            });

            if (models.length) {
                db.collection('files').insertMany(models, (err, result) => {
                    if (err) {
                        return res.status(503).json({
                            error: {message: "Unable to saved your files."}
                        });
                    }

                    return res.json({
                        files: models
                    });
                });
            } else {
                return res.status(503).json({
                    error: {message: "Files upload is required."}
                })
            }

            return res.json( {
                files: models,
            } )
        });

        //Download routing
        app.get('/api/download/:id', (req, res, next) => {
            const fileid = req.params.id;

            console.log(fileid);            

            db.collection('files').find({_id: ObjectID(fileid)}).toArray((err, result) => {
                
                // console.log("Found!", err, result);
                const fileName = _.get(result, '[0].name')
                if (err || !fileName) {
                    return res.status(404).json({
                        error: {
                            message: "File not found."
                        }
                    })
                }

                const filepath = path.join(uploadDir, fileName);

                return res.download(filepath, fileName, (err) => {
                    if(err) {
                        return res.status(404).json({
                            error: {
                                message: "File not Found"
                            }
                        });
                    } else {
                        console.log("File Downloaded!");
                    }
                });

            });
           
        });
    }
}

export default AppRouter