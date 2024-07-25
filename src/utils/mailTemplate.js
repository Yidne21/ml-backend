const emailTemplate = (otp, subject) => `<html>
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
    .content p {
      font-weight: 400;
      font-size: 14px;
      line-height: 20px;
      text-align: justify;
    }
    .help-feedback a {
      color: #AFDC30;
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
      <h3>Hi there 👋</h3>
      <div class="content-text">
        <h2>${subject}</h2>
        <p>
          Here is your ${subject}: ${otp}
        </p>
      </div>
    </div> 
  </div>
</body>
</html>
`;

export default emailTemplate;
