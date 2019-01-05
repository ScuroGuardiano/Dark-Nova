import * as express from 'express';

const router = express.Router();

export default router;

router.get(['login', 'register'], (req, res) => {
    res.redirect('/');
});

