'use strict';

const { Router } = require('express');
const router = new Router();

router.get('/', (req, res, next) => {
  res.json({ beerFactory: 'all the beers' });
  
});



module.exports = router;


// exepriencia iupi
