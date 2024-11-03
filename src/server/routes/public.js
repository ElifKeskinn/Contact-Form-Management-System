const express = require("express");
const router = express.Router();

import React from "react";
import ReactDOMServer from "react-dom/server";

import App from "../../App";

router.get("*",(req,res)=>{
    const content = ReactDOMServer.renderToString(<App currentPath={req.path}/>);

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content = "IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>FullStackCoder</title>
    </head>
    <body>
        <div id= "fullstackcoder__root">${content}</div>
        <script src = "client_bundle.js"><script/>
        </body>
    </html>    
    `;
    res.send(html);
});
module.exports=router;