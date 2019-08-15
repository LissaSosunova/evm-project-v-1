const mongoose = require('mongoose');
const config = require('../config');
mongoose.set('useCreateIndex', true);
const db_url = process.env.MONGODB_URL || process.env.MONGOLAB_URI || config.mongodb;
mongoose.connect(db_url, { useNewUrlParser: true });

module.exports = mongoose;
