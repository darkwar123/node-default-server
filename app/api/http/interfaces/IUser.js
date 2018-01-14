const router = require('express').Router();

router.get('/GetUserData/v1', (req, res, next) => {
	return res.json({ success: 1 });
});

module.exports = router;