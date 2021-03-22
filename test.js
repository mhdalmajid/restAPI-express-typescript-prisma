const express = require('express')
const morgan = require('morgan')
const { PrismaClient } = require('@prisma/client')
const app = express()
const { compare, hash } = require('bcryptjs')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const cookieParser = require('cookie-parser')
// const bcryptjs = require("bcryptjs");
// const compare = bcryptjs.compare
// const hash = bcryptjs.hash
const PORT = 3000
const ACCESS_SECRET = 'access_secret'
const REFRESH_SECRET = 'refresh_secret'
const client = new PrismaClient()
const passportOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: ACCESS_SECRET,
}
passport.use(
    new JwtStrategy(passportOptions, async (jwtPayload, done) => {
        try {
            const user = await client.user.findUnique({
                where: {
                    id: jwtPayload.sub,
                },
                select: {
                    email: true,
                    name: true,
                    id: true,
                },
            })
            if (!user) throw new Error('no such user exists')
            return done(null, user)
        } catch (error) {
            console.error(error)
            return done(error, false)
        }
    }),
)
app.use(passport.initialize())
app.use(morgan('dev'))
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.get('/', (req, res) => {
    res.json({
        test: 'hello world',
    })
})
app.get('/locations', (req, res) => {
    client.location.findMany().then((locations) => {
        res.json(locations)
    })
})
app.get('/locations/:id', (req, res) => {
    const locationId = req.params.id
    client.location
        .findUnique({
            where: {
                id: Number(locationId),
            },
        })
        .then((location) => {
            res.json(location)
        })
})
app.post('/locations', (req, res) => {
    client.location
        .create({
            data: {
                country: req.body.country,
                state: req.body.state,
                city: req.body.city,
                bucketListItemId: req.body.bucketListItemId,
            },
        })
        .then((location) => {
            res.json(location)
        })
})
app.get('/bucketlistitems', (req, res) => {
    client.bucketListItem.findMany().then((bucketListItems) => {
        res.json(bucketListItems)
    })
})
app.get('/bucketlistitems/:id', (req, res) => {
    const bucketListId = req.params.id
    client.bucketListItem
        .findUnique({
            where: {
                id: Number(bucketListId),
            },
        })
        .then((item) => {
            client.bucketListItem
                .findUnique({
                    where: {
                        id: item.id,
                    },
                    include: {
                        location: true,
                    },
                })
                .then((listWithLocation) => {
                    res.json(listWithLocation)
                })
        })
})
app.post('/bucketlistitems', passport.authenticate('jwt', { session: false }), (req, res) => {
    client.bucketListItem
        .create({
            data: {
                title: req.body.title,
                authorId: Number(req.user.id),
            },
        })
        .then((bucketListItem) => {
            client.bucketListItem
                .findUnique({
                    where: {
                        id: bucketListItem.id,
                    },
                    include: {
                        author: true,
                    },
                })
                .then((listWithUser) => {
                    res.json(listWithUser)
                })
        })
})
app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
    console.log(req.user)
    client.user
        .findMany({
            select: {
                email: true,
                name: true,
                id: true,
            },
        })
        .then((users) => {
            res.json(users)
        })
})
app.get('/users/:id', (req, res) => {
    const userId = req.params.id
    client.user
        .findUnique({
            where: {
                id: Number(userId),
            },
        })
        .then((user) => {
            res.json(user)
        })
})
app.post('/refresh_token', async (req, res) => {
    // provide refresh token, receive access token AND new refresh token
    try {
        if (!req.cookies.rtok) throw new Error('no rtok')
        const jwtPayload = jwt.verify(req.cookies.rtok, REFRESH_SECRET)
        const user = await client.user.findUnique({
            where: {
                id: jwtPayload.sub,
            },
            select: {
                email: true,
                name: true,
                id: true,
            },
        })
        if (!user) throw new Error('no such user')
        const accessToken = jwt.sign({ sub: user.id }, ACCESS_SECRET, {
            expiresIn: '15m',
        })
        const refreshToken = jwt.sign({ sub: user.id }, REFRESH_SECRET, {
            expiresIn: '7d',
        })
        res.cookie('rtok', refreshToken, { httpOnly: true })
        res.json({ accessToken: accessToken })
    } catch (error) {
        res.status(401).json({ ok: false, error: error.message })
    }
})
app.post('/users', async (req, res) => {
    try {
        const hashedPassword = await hash(req.body.password, 10)
        const user = await client.user.create({
            data: {
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword,
            },
        })
        if (!user) throw new Error('Email taken')
        res.json({ ok: true })
    } catch (error) {
        console.error(error)
        res.status(401).json({ ok: false, error: error.message })
    }
})
app.post('/login', async (req, res) => {
    try {
        const user = await client.user.findUnique({
            where: {
                email: req.body.email,
            },
        })
        if (!user) throw new Error('No such user')
        const passwordsMatch = await compare(req.body.password, user.password)
        if (!passwordsMatch) throw new Error('Email or password invalid')
        const accessToken = jwt.sign({ sub: user.id }, ACCESS_SECRET, {
            expiresIn: '15m',
        })
        const refreshToken = jwt.sign({ sub: user.id }, REFRESH_SECRET, {
            expiresIn: '7d',
        })
        await client.user.update({
            where: {
                id: user.id,
            },
            data: {
                lastLogin: new Date(),
            },
        })
        res.cookie('rtok', refreshToken, { httpOnly: true })
        res.json({ accessToken: accessToken })
    } catch (error) {
        res.status(401).json({ ok: false, error: error.message })
    }
})
app.listen(PORT, () => {
    console.log(`listening on ${PORT}`)
})
