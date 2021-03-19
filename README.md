# Awesome Project API Built with

-Typescript
-expressjs
-mongodb

---

## ref

---

400 Bad Request Error:
Used when user fails to include a field (like no credit card information in a payment form)
Also used when user enters incorrect information (Example: Entering different passwords in a password field and password confirmation field).
401 Unauthorized Error: Used when user enters incorrect login information (like username, email or password).
403 Forbidden Error: Used when user is not allowed access the endpoint.
404 Not Found Error: Used when the endpoint cannot be found.
500 Internal Server Error: Used the request sent by the frontend is correct, but there was an error from the backend.

HTTP 4xx Errors:
Bad Request (400)
Unauthorized (401)
Payment Required (402)
Forbidden (403)
Not Found (404)
Method Not Allowed (405)
Not Acceptable (406)
Proxy Auth Required (407)
Client Timeout (408)
Conflict (409)
Resource Gone (410)
Length Required (411)
Precondition Failed (412)
Entity Too Large (413)
URI Too Long (414)
Unsupported Media Type (415)
Range Not Satisfiable (416)
Expectation Failed (417)
Teapot (418)
Bad Data (422)
Locked (423)
Failed Dependency (424)
Precondition Required (428)
Too Many Requests (429)
Illegal (451)
HTTP 5xx Errors:
Bad Implementation (500)
Not Implemented (501)
Bad Gateway (502)
Server Unavailable (503)
Gateway Timeout (504)

## todo

<!-- TODO -->

packages to use : winston logger http-status-codes,swagger swagger-ui-express

- Use gzip compression.
- Don’t use synchronous functions.
0 Do logging correctly (for debugging, use a special module like debug, for app activity use winston or bunyan).
- Handle exceptions properly, using try-catch or promises.
- Ensure your app automatically restarts by using a process manager or use an init system like systemd or upstart.
- Run your app in a cluster. You can increase the performance of a Node.js app greatly by launching a cluster of processes (a cluster runs multiple instances of the app, distributing the load and tasks among the instances).
- Cache request results, so that your app does not repeat the operation to serve the same request repeatedly.
- Use a load balancer to run multiple instances of it and distribute the traffic, like Nginx or HAProxy.
- Use a reverse proxy that performs supporting operations on the requests. It can handle error pages, compression, caching, serving files, and load balancing among other things.

### HTTPS

1.Generate a self-signed certificate

```bash
openssl req -nodes -new -x509 -keyout server.key -out server.cert

```

2.Enable HTTPS in Express

```javascript
var express = require('express')
var fs = require('fs')
var https = require('https')
var app = express()

app.get('/', function (req, res) {
  res.send('hello world')
})

https.createServer({
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
}, app)
.listen(process.env.PORT, function () {
  console.log('Example app listening on port 3000! Go to https://localhost:3000/')
})

```

### reference

- shutdown prosses <https://blog.heroku.com/best-practices-nodejs-errors>
- package to do that <https://github.com/godaddy/terminus>
