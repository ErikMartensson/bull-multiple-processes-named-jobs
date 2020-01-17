### Run test

Install Bull from package.json
```bash
npm install
```

Edit `index.js` to connect to your Redis instance. See docker command below to run your own temporary container.

Then start the script and follow the log output
```bash
npm start
```

### Run Redis container

This will start a temporary container of Redis that will be deleted once stopped.
Change port "6380" to whatever port you want. I'll leave it as "6380" since I already have another Redis instance running locally.

```bash
docker run --rm -p 6380:6379 redis:5-alpine
```
