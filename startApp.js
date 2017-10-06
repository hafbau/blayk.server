// Start app.
const app = require("./index.js");
(function start(app) {
    app.listen({
        port: 4000
    },
    () => {
        const server = this;
        
        const handleError = (err) => {
            console.log((err && err.stack) || err)
            
            // Restart server.
            this.close();
            start(app);
        }
        // Handle exceptions.
        process.once("uncaughtException", handleError);
        process.once("unhandledRejection", handleError);
        
        // Notify pm2 we are online.
        if (process.send) process.send('online')
        console.log("Started Blayk API");
    });
})(app);
