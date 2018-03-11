if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

let port = process.env.PORT
let mongoUrl = process.env.MONGODB_URI
let secret = process.env.SECRET

if (process.env.NODE_ENV === 'test') {
    port = process.env.TEST_PORT
    mongoUrl = process.env.TEST_MONGODB_URI
    secret = 'secret'
}

module.exports = {
    mongoUrl,
    port,
    secret
}