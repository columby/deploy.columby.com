'use strict';

/**
 *
 * Dependencies
 *
 */
var models = require('../models/index');


/**
 *
 * Get list of Tags
 *
 */
exports.index = function(req, res) {
  console.log('index tags', req.query);
  console.log(req.params);
  var filter = {};
  if (req.query.tagId){
    filter.id= req.query.tagId
  } else if(req.query.text){
    filter.text= req.query.text
  }

  // Include contenttype
  var include=[];
  if (req.query.contentType && req.query.contentType==='dataset'){
    include.push({
      model: models.Dataset,
      as: 'tags',
      include: [
        {model: models.Account, as:'account'}
      ]
    });
  }

  models.Tag.findAll({
    where: filter,
    include: include
  }).then(function(models) {
    return res.json(models);
  }).catch(function(err){
    return handleError(res, err);
  });
};

/**
 *
 * Get a single tag
 *
 * @param req
 * @param res
 *
 */
exports.show = function(req, res) {
  models.Tag.find({
    where: {
      slug: req.params.slug
    },
    include: [{
      model: models.Dataset,
      as: 'tags'}]
    }).then(function(tag){

    // add datasets

    res.json(tag);
  }).catch(function(err){
    return handleError(res,err);
  });
};


/**
 *
 * Create a new Tag
 *
 * @param req
 * @param res
 */
exports.create = function(req,res){
  console.log('Creating tag, ', req.body);
  models.Tag.find({where:{text:req.body.text}}).then(function(model) {
    if (model && model.id){
      console.log('existing term', model.dataValues);
      return res.json(model);
    } else {
      models.Tag.create({text: req.body.text}).then(function(model) {
        console.log('new term', model.id);
        return res.json(model);
      }).catch(function(err){
        return handleError(res,err);
      });
    }
  }).catch(function(err){
    return handleError(res,err);
  });
};





function handleError(res, err) {
  console.log('Vocabulary controller error: ',err);
  return res.send(500, err);
}
