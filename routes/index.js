var express = require('express');
var router = express.Router();

var uid2 = require('uid2')
var bcrypt = require('bcrypt');

var userModel = require('../models/users');
const req = require('express/lib/request');
var articlesModel = require('../models/myArticles')


router.post('/sign-up', async function(req,res,next){

  var error = []
  var result = false
  var saveUser = null
  var token = null

  const data = await userModel.findOne({
    email: req.body.emailFromFront
  })

  if(data != null){
    error.push('utilisateur déjà présent')
  }

  if(req.body.usernameFromFront == ''
  || req.body.emailFromFront == ''
  || req.body.passwordFromFront == ''
  ){
    error.push('champs vides')
  }


  if(error.length == 0){

    var hash = bcrypt.hashSync(req.body.passwordFromFront, 10);
    var newUser = new userModel({
      username: req.body.usernameFromFront,
      email: req.body.emailFromFront,
      password: hash,
      token: uid2(32),
      language: 'fr'
    })
  
    saveUser = await newUser.save()
  
    
    if(saveUser){
      result = true
      token = saveUser.token
    }
  }
  

  res.json({result, saveUser, error, token})
})

router.post('/sign-in', async function(req,res,next){

  var result = false
  var user = null
  var error = []
  var token = null
  
  if(req.body.emailFromFront == ''
  || req.body.passwordFromFront == ''
  ){
    error.push('champs vides')
  }

  if(error.length == 0){
    user = await userModel.findOne({
      email: req.body.emailFromFront,
    })
  
    
    if(user){
      if(bcrypt.compareSync(req.body.passwordFromFront, user.password)){
        result = true
        token = user.token
      } else {
        result = false
        error.push('mot de passe incorrect')
      }
      
    } else {
      error.push('email incorrect')
    }
  }
  
  res.json({result, user, error, token})

})

router.put('/language', async (req, res, next) => {
    
  console.log('req.body.token', req.body.token)
  console.log('req.body.language', req.body.language)
  const language = req.body.language;
  const token = req.body.token;

  await userModel.updateOne(
    { token: token},
    { language: language }
   ); 

  res.json({ result: true });
})

router.post('/user-language', async (req, res, next) => {

  const user = await userModel.findOne( { token: req.body.token } );
  console.log(user)

  let langue = null;

  if(user) {
    result = true;
    langue = user.language
  } else {
    result = false;
  }

  res.json({ result, langue });
})

router.post('/screenmyarticles', async function(req,res,next){

  console.log('/screenmyarticles req.body', req.body);

  const userFind = await userModel.findOne({
    token: req.body.token
  })
  console.log('userFind', userFind);

  var newArticle = new articlesModel({
    img: req.body.urlToImage,
    title: req.body.title,
    description: req.body.description,
    userId: userFind._id
  })
  console.log('newArticle', newArticle);
 
  var saveArticle = await newArticle.save()
  console.log('saveArticle', saveArticle);

  res.json({ saveArticle: saveArticle })
})

router.post('/articlestolist', async function(req,res,next){

  console.log('/articlestolist req.body', req.body);

  var userFind = await userModel.findOne({
    token: req.body.token
  })
  console.log('/articlestolist userFind', userFind);

  var userFindArticle = await articlesModel.find({ userId: userFind._id });
  console.log('/articlestolist userFindArticle', userFindArticle);

  res.json({userFind, userFindArticle: userFindArticle })
})



module.exports = router;
