import { Router } from 'express';
import { handleRequest } from '../dispatch/sorter.js'

const router = Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

// button submit
router.post('/', handleRequest);

export default router;