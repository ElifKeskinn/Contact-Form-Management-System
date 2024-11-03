const express = require("express");
var cors = require("cors");
const allRoutes = require("../routes/public");

function createServer() {
    const app = express();
    app.use(express.static("dist/client"));
    app.use(cors());
    app.use(express.json());
    app.use(function (err, req, res, next) {

        if (err instanceof SyntaxError && err.status ===400 && "body" in err){
            res
                .status(400)
                .json(
                    "the server did not receive a valid json please try checking for syntax errors"

                );
        }
    });
    app.use(allRoutes);
    return app;

}
module.exports=createServer;