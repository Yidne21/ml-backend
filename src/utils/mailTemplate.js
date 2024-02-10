import { appName } from '../config/environments';

export const ActivateAccount = (link) => `<html>
<head>
  <style>
    body {
      background-color: #e5e5e5;
      font-family: 'Quicksand', sans-serif;
      font-weight: 400;
    }
    .container {
      max-width: 665px;
      margin: 0 auto;
      background-color: #ffffff;
      color: #0f1212;
      overflow: hidden;
    }
    .header_text {
      color: #ffffff;
      font-size: 32px;
      font-weight: 700;
      line-height: 40px;
      padding-left: 50px;
    }
    .header_text span {
      font-weight: 400;
    }
    .content {
      background-color: #ffffff;
      padding: 30px 50px;
    }
    .content h3 {
      font-weight: 600;
      font-size: 16px;
      line-height: 30px;
    }
    .content-text {
      color: #000;
      font-size: 16px;
      line-height: 1.6;
      margin-bottom: 40px;
    }
    .content-text h2 {
      color: #000;
      font-size: 20px;
      line-height: 30px;
      font-weight: 600;
    }
    .content-text p {
      font-weight: 400;
      font-size: 14px;
      line-height: 30px;
      color: #0f1212;
    }
    .button {
      font-weight: lighter;
      text-decoration: none;
      color: #fff;
      padding: 10px; 
      transition: background-color 0.3s ease;
      display: inline-block;
    }
    .button:hover {
      background-color: #E4FDD3;
    }
    .btnDiv {h                      
      background-color: #35E825;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 57px;
      width: 100%;
      border-radius: 5px;
      margin-bottom: 30px;
    }
    .link {
      width: 530px;
      overflow-wrap: break-word;
    }
    .link a {
      color: #35E825;
      font-size: 12px;
      font-weight: 400;
      text-decoration: underline;
    }
    .help-feedback {
      font-family: 'Inter';
      font-weight: 200;
      line-height: 20px;
      font-size: 14px;
      width: 361px;
      margin: 0 auto;
      text-align: center;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .content p {
      font-weight: 400;
      font-size: 14px;
      line-height: 20px;
      text-align: justify;
    }
    .help-feedback a {
      color: #FCE300;
      text-decoration: none;
    }
    h3 {
      font-weight: normal;
    }
    .footer {
      padding: 20px;
      color: #000;
      font-size: 14px;
      margin-bottom: 30px;
    }
    .copyright {
      font-weight: 300;
      font-size: 12px;
      line-height: 20px;
      text-align: center;
      color: #0f1212;
    }
    .copyright span {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="content">
      <h3>Hi there 👋</h3>
      <div class="content-text">
        <h2>Confirm your email address</h2>
        <p>
          To successfully register your account, please click the activate account button to activate your account.
        </p>
      </div>
      <div class="btnDiv">
        <a class="button" href="${link}" target="_blank">Verify Email</a>
      </div>
      <p style="margin-bottom: 7px; font-weight: 600;">
        In case the above button doesn't work, you can copy-paste the following URL in your browser window:
      </p>
      <div class="link">
        <a href="${link}" target="_blank"> ${link} </a>
      </div>
    </div>

    <div class="help-feedback">
      <p>
        If you have any questions on how it works, please contact our
        team at
        <a href="mailto:info@medicinelocatorsystem.tech" target="_blank" style="color: cadetblue">support@medicinelocatorsystem.com</a>.
      </p>
    </div>
    
    <div class="footer">
      <p>@2024 <span>MedicineLocator</span>. All rights reserved</p>
    </div>
  </div>
</body>
</html>
`;

export const ForgotPassword = (link) => `<html>
<head>
  <style>
    body {
      font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    }
    .container {
      max-width: 500px;
      margin: 0 auto;
    }

    .banner {
      margin-bottom: 20px;
    }
    
    .banner img {
      max-width: 500px;
    }

    .content {
      background-color: #f5f4f4;
      padding: 30px;
    }
    .content-text {
      color: #000;
      font-size: 16px;
      line-height: 1.6;
      margin-bottom: 20px;
    }
    .button {
      font-weight: lighter;
      text-decoration: none;
      background-color: #35E825;
      color: #fff;
      padding: 10px 30px;
      border-radius: 10px;
      display: inline-block;
      transition: background-color 0.3s ease;
    }
    .button:hover {
      background-color: #35E825;
    }
    .help-feedback {
      padding: 20px;
      text-align: center;
      font-size: 14px;
    }
    .help-feedback a {
      color: #fcd307;
      text-decoration: none;
    }
    h3 {
      font-weight: normal;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="content">
      <h3>Hi there 👋,</h3>
      <h2>Confirm your email address</h2>
      <p class="content-text">
        You requested to reset the password for your account. Please click reset password button inorder to reset your
        account. If you haven't requested anything ignore it.
      </p>
      <a style="none" class="button" href="${link}" target="_blank">Verify Email</a>
      <p class="content-text">
        In case the above button doesn't work, you can copy-paste the
        following URL in your browser window:
      </p>
      <a class="link" href="${link}" target="_blank" style="color: cadetblue"
        >${link}</a
      >
    </div>

    <div class="help-feedback">
      <p>
        Need help? Contact our support team or hit us on
        <a
          href="mailto:info@medicinelocatorsystem.tech"
          target="_blank"
          style="color: cadetblue"
          >Email</a
        >.
      </p>
    </div>

    <div style="text-align: center; font-size: small; margin-top: 20px">
      <p>&copy; 2024 Medicine Locator. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;
