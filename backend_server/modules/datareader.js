function dbQuery (collection, params, action) {
  return new Promise( (resolve, reject) => {
    if (action === 'findOne') {
      collection.findOne(params,  (e, d) => {
        if (e) reject(e);
        else resolve(d);
      })
    }
    else if (action === 'updateOne') {
      collection.updateOne(params.query, params.objNew,  (e, d) => {
        if (e) reject(e);
        else resolve(d);
      })
    }
    else if (action === 'update') {
      collection.update(params.query, params.objNew, params.multi,  (e, d) => {
        if (e) reject(e);
        else resolve(d);
      })
    }
    else if (action === 'updateMany') {
      collection.updateMany(params.query, params.objNew,  (e, d) => {
        if (e) reject(e);
        else resolve(d);
      })
    }
    else if (action === 'find') {
      collection.find(params,  (e, d) => {
        if (e) reject(e);
        else resolve(d);
      })
    }
    else if (action === 'findExField') { // это тоже самое, что и findElementMatch
      collection.find(params.query1, params.query2,  (e, d) => {
        if (e) reject(e);
        else resolve(d);
      })
    }
    else if (action === 'findById') {
      collection.findById(params, (e, d) => {
        if (e) reject(e);
        else resolve(d);
      })
    }
    else if (action === 'findElementMatch') {
      collection.find(params.query, params.elementMatch,(e, d) => {
        if (e) reject(e);
        else resolve(d)
      })
    }
    else if (action === 'findOneElementMatch') {
      collection.findOne(params.query, params.elementMatch, (e, d) => {
        if (e) reject(e);
        else resolve(d);
      })
    }
    else if (action === 'save') {
      collection.save((e, d) => {
        if (e) reject(e);
        else resolve(d);
      })
    }
    else if (action === 'deleteOne') {
      collection.deleteOne((e, d) => {
        if (e) reject(e);
        else resolve(d);
      })
    }
    else if (action === 'arrayFilter') {
      const query = params.queryField1;
      const condition = params.contidition;
      collection.aggregate([{$match: params.query}, {$project: {query: {$filter: {input: `$${params.queryField1}`, as: 'item', cond: {$eq:[`$$item.${params.queryField2}`, params.contidition]}}}}}], (e, d) => {
        if (e) reject (e);
        else resolve(d);
      })
    }
    else if (action === 'insertOne') {
      collection.insertOne(params, (e, d) => {
        if (e) reject(e);
        else resolve(d);
      })
    }

    else if (action === 'findWithPassword') {
      collection.findOne(params)
                .select('password')
                .exec((e, d) => {
                  if (e) reject(e);
                  else resolve(d);
                })
    }
   
  })
}

module.exports = dbQuery;