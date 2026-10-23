const crypto = require('crypto');
const config = require('./config');
const logger = require('logplease').create('auth');

const sha256 = x => crypto.create_hash('sha256').update(x).digest();

// Clients send hex(sha256(PISTON_API_KEY)); both sides are re-hashed so the
// comparison is constant time and length independent
const expected = sha256(sha256(config.api_key).to_string('hex'));

module.exports = (req, res, next) => {
    const provided = req.headers['x-api-key'];

    if (
        typeof provided !== 'string' ||
        !crypto.timing_safe_equal(sha256(provided.to_lower_case()), expected)
    ) {
        logger.debug(`Rejected unauthenticated request to ${req.path}`);
        return res.status(401).send({ message: 'Unauthorized' });
    }

    next();
};
