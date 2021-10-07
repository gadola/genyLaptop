const nodemailer = require('nodemailer');


// configure option
const option = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.NODE_MAIL_USER,
        pass: process.env.NODE_MAIL_PASSWORD
    },
}

const transporter = nodemailer.createTransport(option)

// send mail
const sendEmail = async ({ to, subject, text, html, ...rest }) => {
    try {
        const res = await transporter.verify();
        if (res) {
            // config mail
            const mail = {
                // sender access
                from: '"Hỗ trợ" <no-reply-genylaptop@gmail.com>',
                // receiver access
                to,
                subject, // subject
                text, // content text
                html, //html
                ...rest // orther
            }

            // tiến hành gửi mail
            const info = await transporter.sendMail(mail)
            if (info) {
                return true
            }
        }
    } catch (error) {
        console.log('ERROR MAILER: ', error);
        return false
    }

}


const headerHtmlMail = `<h1 style="color: #4c649b; font-size: 48px; border-bottom: solid 2px #ccc;padding-bottom: 10px">
      GENY LAPTOP<br />
    </h1>`;
const footerHtmlVerifyMail = `<h3 style="color: red">
        Chú ý: Không đưa mã này cho bất kỳ ai,
        có thể dẫn đến mất tài khoản.<br />
        Mã chỉ có hiệu lực <i>10 phút </i> từ khi bạn nhận được mail.
    </h3>
    <h1>Cảm ơn.</h1>`;

// gửi mã xác nhận
const htmlSignupAccount = (token) => {
    return `<div>
      ${headerHtmlMail}
      <h2 style="padding: 10px 0; margin-bottom: 10px;">
          Xin chào anh (chị),<br />
          Mã xác nhận đăng ký tài khoản cho website GENY LAPTOP của anh (chị).<br />
          Cảm ơn vì đã ghé thăm GENY LAPTOP <3
      </h2>
      <h3 style="background: #eee;padding: 10px;">
        <i><b>${token}</b></i>
      </h3>
    ${footerHtmlVerifyMail}
    </div>`;
};


// gửi mã đổi mật khẩu
const htmlResetPassword = (token) => {
    return `<div>
      ${headerHtmlMail}
      <h2 style="padding: 10px 0; margin-bottom: 10px;">
          Xin chào anh (chị),<br />
          Cửa hàng GENY LAPTOP đã nhận được yêu cầu lấy lại mật khẩu từ quý khách.<br />
          Đừng lo lắng, hãy nhập mã này để khôi phục:
      </h2>
      <h1 style="background: #eee;padding: 10px;">
        <i><b>${token}</b></i>
      </h1>
      ${footerHtmlVerifyMail}
    </div>`;
};

module.exports = {
    sendEmail,
    htmlSignupAccount,
    htmlResetPassword,
};