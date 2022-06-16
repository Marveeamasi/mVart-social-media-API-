const mongoose = require('mongoose') 

const url = mongodb+srv://MarveeAmasi:vee120!!!@cluster0.zxaeg.mongodb.net/?retryWrites=true&w=majority

const connectionParams = { useNewUrlParser: true, 
                         useCreateIndex: true, 
                         useUnifiedTopology: true 
} 

mongoose.connect(url,connectionParams) 
     .then( () => { console.log('Connected to database ')
     }) 
     .catch( (err) => { console.error(`${err}`);
     })