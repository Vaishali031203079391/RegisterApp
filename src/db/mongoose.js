const mongoose = require('mongoose')

// MONGODB_URL=mongodb+srv://VaishaliSharath:kjEbNRLWLveI7LV5@cluster0.ocr2e.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
// JWT_SECRET=kuttikilichukiBaluPukiFriend
// SENDGRID_API_KEY=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

// mongoose.connect(process.env.MONGODB_URL, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false
// })

mongoose.connect(process.env.MONGODB_URL)



