import nodemailer from "nodemailer";

async function sendEmail({ to, cc, bcc, subject, html, attachments = [] } = {}) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL, 
            pass: process.env.GMAILPASS, 
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: `" Hello...Arwa" <${process.env.GMAIL}>`, // sender address
        to,
        cc,
        bcc,
        subject,
        html,
        attachments
    });

 
    return info.rejected.length ? false : true
}



export default sendEmail