const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
      _id: "5a422a851b54a676234d17f7",
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
      __v: 0
    },
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0
    },
    {
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0
    },
    {
      _id: "5a422b891b54a676234d17fa",
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      likes: 10,
      __v: 0
    },
    {
      _id: "5a422ba71b54a676234d17fb",
      title: "TDD harms architecture",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
      likes: 0,
      __v: 0
    },
    {
      _id: "5a422bc61b54a676234d17fc",
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2,
      __v: 0
    }
]

const initialUsers = [
    {
        _id: "5a92bf6b3fe9f0362c325723",
        username: "user",
        name: "User",
        adult: true,
        passwordHash: "$2a$10$6UC8.S2py.qi/yEQ3OhMb.IPf6QX9cMQck/7A1FjCLK87IkxMidB2",
        blogs: [],
        __v: 0
    },
    {
        _id: "5a92c20f0244e832f8d11a09",
        username: "pasmpasm",
        name: "Pavel Smirnov",
        adult: true,
        passwordHash: "$2a$10$pbMMtw.JpIRCuNdS0afw6ufkmpMKlpbxtBob.6f.9q2g/9uK71Av2",
        blogs: [],
        __v: 0
    }
]

const formatBlog = (blog) => {
    return {
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blog.likes
    }
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(formatBlog)
}

const formatUser = (user) => {
    return {
        username: user.username,
        name: user.name,
        adult: user.adult
    }
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(formatUser)
}

module.exports = {
    initialBlogs, formatBlog, blogsInDb, initialUsers, usersInDb
}