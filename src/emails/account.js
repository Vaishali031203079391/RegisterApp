const sgMail = require('@sendgrid/mail')
const sendgridAPIKey = process.env.SENDGRID_API_KEY

sgMail.setApiKey(sendgridAPIKey)

const sendWelcomeEmail = (email, name) => {
  const msg = {
    to: email,
      from: 'vaish.1231993.vaishali@gmail.com',
      subject: 'Thanks for joining in!',
      text: `Welcome ${name}, let me know how you get along the app`
  }

  sgMail.send(msg).then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error)
  })
}

module.exports = {
    sendWelcomeEmail
}
