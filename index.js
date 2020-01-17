const Queue = require('bull');

// Assumed to have a Redis instance running locally
// See README for docker command
const testQueue = new Queue('test', {
    redis: {
        host: '127.0.0.1',
        port: 6380,
    },
});

// This is the variable that will let us know if
// the queue waited for the process to complete or not.
let processComplete = false;

// This process takes 10 seconds to complete
testQueue.process('jobA', async (job) => {
    console.log(`Process started for Job ${job.id}`);
    return new Promise(resolve => {
        setTimeout(() => {
            console.log(`Process done for Job ${job.id}!`);
            processComplete = true;
            resolve();
        }, 10000); // 10 seconds
    });
});

// This process does nothing
// Comment this process out to see the difference.
testQueue.process('jobB', async () => {});

// Add a job to the queue
testQueue.add('jobA', {});

// ----------
// Graceful shutdown logic from here on
const signals = ['SIGHUP','SIGINT','SIGQUIT','SIGILL','SIGTRAP','SIGABRT','SIGBUS','SIGFPE','SIGSEGV','SIGUSR2','SIGTERM'];

// Just in case, setup listeners for every type of interup signals
signals.forEach(signal => {
    process.on(signal, async () => {
        console.log(`${signal} received, closing Queue now...`);

        await testQueue.close();

        if (processComplete) {
            console.log('Queue waited for process to complete like a good boi 👍');
        } else {
            console.log(`Queue closed before process completed 👎
            Try commenting out line 30`);
        }

        process.exit(0);
    });
});

console.log('Press ^C now to begin a graceful shutdown');
