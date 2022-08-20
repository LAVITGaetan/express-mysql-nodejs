const express = require('express');
const cors = require('cors');
const app = express();
var corsOptions = {
    origin: "http://localhost:7070"
};

  app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.get('/',function(req,res){
    res.json({message : "Server running"});
  });

const PORT = process.env.PORT || 7070

require("./app/routes/adherent.routes.js")(app);
require("./app/routes/mandat.routes.js")(app);
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})