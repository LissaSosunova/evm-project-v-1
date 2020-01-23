import {Model} from 'mongoose';
import { MongoActions } from '../interfaces/mongo-actions';
import { DbQuery } from '../interfaces/types';

export function datareader(collection: Model<any>, params: DbQuery | any, action: MongoActions): Promise <any> {
    return new Promise ((resolve, reject) => {
        if (action === MongoActions.FIND_ONE) {
            collection.findOne(params,  (e, d) => {
              if (e) {
                reject(e);
              } else {
                resolve(d);
              }
            });
          } else if (action === MongoActions.UPDATE_ONE) {
            collection.updateOne(params.query, params.objNew,  (e, d) => {
              if (e) {
                reject(e);
              } else {
                resolve(d);
              }
            });
          } else if (action === MongoActions.UPDATE) {
            collection.update(params.query, params.objNew, params.multi,  (e, d) => {
              if (e) {
                reject(e);
              } else { resolve(d); }
            });
          } else if (action === MongoActions.UPDATE_MANY) {
            collection.updateMany(params.query, params.objNew,  (e, d) => {
              if (e) {
                reject(e);
              } else {
                resolve(d);
              }
            });
          } else if (action === MongoActions.FIND) {
            collection.find(params,  (e, d) => {
              if (e) {
                reject(e);
              } else {
                resolve(d);
              }
            });
          } else if (action === MongoActions.FIND_BY_ID) {
            collection.findById(params, (e, d) => {
              if (e) {
                reject(e);
              } else {
                resolve(d);
              }
            });
          } else if (action === MongoActions.FIND_ELEMENT_MATCH) {
            collection.find(params.query, params.elementMatch, (e, d) => {
              if (e) {
                reject(e);
              } else {
                resolve(d);
              }
            });
          } else if (action === MongoActions.FIND_ONE_ELEMENT_MATCH) {
            collection.findOne(params.query, params.elementMatch, (e, d) => {
              if (e) {
                reject(e);
              } else {
                resolve(d);
              }
            });
          } else if (action === MongoActions.SAVE) {
            // @ts-ignore
            collection.save((e, d) => {
              if (e) {reject(e);
              } else {
                resolve(d);
              }
            });
          } else if (action === MongoActions.ARRAY_FILTER) {
            collection.aggregate([
              {$match: params.query},
              {$project:
                {query:
                  {$filter:
                    {input: `$${params.queryField1}`,
                    as: 'item',
                    cond: {
                     $in: [ params.contidition, `$$item.${params.queryField2}`]
                    }
                    }
                  }
                }
              }], (e, d) => {
              if (e) {
                reject (e);
              } else {
                resolve(d);
              }
            });
          } else if (action === MongoActions.INSERT_ONE) {
            // @ts-ignore
            collection.insertOne((params as any), (e, d) => {
              if (e) {
                reject(e);
              } else {
                resolve(d);
              }
            });
          } else if (action === MongoActions.DELETE_ONE) {
            collection.deleteOne(params, (e) => {
              if (e) {
                reject(e);
              } else {
                resolve('deleted');
              }
            });
          } else if (action === MongoActions.FIND_WITH_PASSWORD) {
            collection.findOne(params)
                      .select('password')
                      .exec((e, d) => {
                        if (e) {
                          reject(e);
                        } else {
                          resolve(d);
                        }
                      });
          }
    });
}
