const sgMail = require('@sendgrid/mail')


sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
            to: email,
            from: 'utauhosina2001@gmail.com',
            subject: 'Một chiếc mail iu thưng!',
            text: `Đây là mail tự động gửi bằng code, ${name}. Pé Giang iu anh nhìu nhìu:3.`
        }).then(() => {
            console.log('Email sent');
        })
        .catch((error) => {
            console.error(error);
        })
}

const sendCancelationEmail = (email, name) => {
    sgMail.send({
            to: email,
            from: 'utauhosina2001@gmail.com',
            subject: 'Thanks for all!',
            text: `Hello, ${name}. Let me know why you leave.`
        }).then(() => {
            console.log('Email sent');
        })
        .catch((error) => {
            console.error(error);
        })
}



module.exports = {
        sendWelcomeEmail,
        sendCancelationEmail
    }
    // const msg = {
    //     to: 'baodakmil123@gmail.com',
    //     from: 'utauhosina2001@gmail.com', // Change to your verified sender
    //     subject: 'Hello đũy pẻo',
    //     text: 'mail tự động rep lại là con chó',
    //     html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    // }
    // sgMail
    //     .send(msg)
    //     .then(() => {
    //         console.log('Email sent')
    //     })
    //     .catch((error) => {
    //         console.error(error)
    //     })

// sgMail.send({
//     to: 'baodakmil123@gmail.com',
//     form: 'utauhosina2001@gmail.com',
//     subject: 'HELLO DUY DIEN',
//     text: 'Hello dduyx dien'
// })