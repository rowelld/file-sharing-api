import _ from 'lodash'
class File {
    
    constructor(app, object) {
        this.app = app;        

        this.model = {
            name: null, 
            originalName: null,
            mimeType: null,
            size: null, 
            created: Date.now(),            
        }
    }

    initWithObject(object) {
        this.model.name = _.get(object, 'filename');
        this.model.originalName = _.get(object, 'originalname');
        this.model.mimeType = _.get(object, 'mimetype' );
        this.model.size = _.get(object, 'size');
        this.model.created = Date.now();

        return this;
    }

    toJson() {
        return this.model
    }

    save(cb) {
        const db = this.app.get('db')
        db.collection('file').insertOne(this.model, (err, result) => {
            return cb(err, result);
        });


    }
}

export default File