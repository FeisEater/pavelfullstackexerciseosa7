const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})
  
blogRouter.post('/', async (request, response) => {
    try {
        const token = request.token
        const decodedToken = jwt.verify(token, config.secret)
    
        if (!token || !decodedToken.id) {
          return response.status(401).json({ error: 'token missing or invalid' })
        }
    
        const user = await User.findById(decodedToken.id)
        const blog = new Blog({
            title: request.body.title,
            author: request.body.author,
            url: request.body.url,
            likes: request.body.likes,
            user: user === null ? null : user._id
        })
        if (blog.title === undefined)
            return response.status(400).json({ error: 'title missing' })
        if (blog.url === undefined)
            return response.status(400).json({ error: 'url missing' })
        if (blog.likes === undefined)
            blog.likes = 0
        const savedBlog = await blog.save()
        if (user !== null) {
            user.blogs = user.blogs.concat(savedBlog._id)
            await user.save()
        }
        response.status(201).json(blog)
    } catch (exception) {
        if (exception.name === 'JsonWebTokenError' ) {
            response.status(401).json({ error: exception.message })
        } else {
            console.log(exception)
            response.status(500).json({ error: 'something went wrong...' })
        }
    }
})

blogRouter.delete('/:id', async (request, response) => {
    try {
        const token = request.token
        const decodedToken = jwt.verify(token, config.secret)
        console.log(decodedToken)
        if (!token || !decodedToken.id) {
          return response.status(401).json({ error: 'token missing or invalid' })
        }

        const blogToDelete = await Blog.findById(request.params.id)
        console.log(blogToDelete)
        if (blogToDelete.user !== null && decodedToken.id.toString() !== blogToDelete.user.toString())
            return response.status(401).json({ error: 'not authorised to delete this' })
        await Blog.findByIdAndRemove(request.params.id)
        response.status(204).end()
    } catch (exception) {
        console.log(exception)
        response.status(400).send({ error: 'malformatted id' })
    }
})

blogRouter.put('/:id', async (request, response) => {
    const blog = {}
    if (request.body.title !== undefined)
        blog.title = request.body.title
    if (request.body.author !== undefined)
        blog.author = request.body.author
    if (request.body.url !== undefined)
        blog.url = request.body.url
    if (request.body.likes !== undefined)
        blog.likes = request.body.likes
    try {
        const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true } ).populate('user', { username: 1, name: 1 })
        response.json(updatedBlog)
    } catch (exception) {
        console.log(exception)
        response.status(400).send({ error: 'malformatted id' })
    }
})
  
module.exports = blogRouter