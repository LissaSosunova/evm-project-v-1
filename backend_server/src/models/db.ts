import * as mongoose from 'mongoose';
import {settings} from '../config';
mongoose.set('useCreateIndex', true);
const db_url = process.env.MONGODB_URL || process.env.MONGOLAB_URI || settings.mongodb;
mongoose.connect(db_url, { useNewUrlParser: true });

export default mongoose;
