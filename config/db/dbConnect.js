const mongoose = require('mongoose');
// require("dotenv").config()
const dbConnect=async ()=>{ 
	try {
        await mongoose.connect(       
			process.env.MONGODB_URL_CLOUD ,
			{
				useUnifiedTopology: true,
				useNewUrlParser: true, 
			}
		);
        console.log('Db is connected Successfully');
    } catch (error) {
        console.log(`Error ${error.message}`);  
    }
}

module.exports = dbConnect;