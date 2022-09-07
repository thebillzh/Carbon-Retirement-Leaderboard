package utils

type AccountVerify struct {

}

const (
	MailTemplateAccountVerifyHtml = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <title>[职涯星]请查收您的动态验证码</title>
  <style type="text/css" rel="stylesheet" media="all">
    /* Base ------------------------------ */
    *:not(br):not(tr):not(html) {
      font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
    }
  </style>
</head>
<body style="width: 100% !important; height: 100%; margin: 0; line-height: 1.4; background-color: #F5F7F9; color: #839197; -webkit-text-size-adjust: none;"><table width="100%" cellpadding="0" cellspacing="0" style="width: 100%; margin: 0; padding: 0; background-color: #F5F7F9;"><tr><td align="center"><table width="100%" cellpadding="0" cellspacing="0" style="width: 100%; margin: 0; padding: 0;"><tr><td style="padding: 25px 0; text-align: center;"><a style="font-size: 16px; font-weight: bold; color: #839197; text-decoration: none; text-shadow: 0 1px 0 white;">职涯星</a></td></tr><tr><td width="100%" style="width: 100%; margin: 0; padding: 0; border-top: 1px solid #E7EAEC; border-bottom: 1px solid #E7EAEC; background-color: #FFFFFF;"><table align="center" width="570" cellpadding="0" cellspacing="0" style="width: 570px; margin: 0 auto; padding: 0;"><tr><td style="padding: 35px;"><h1 style="margin-top: 0; color: #292E31; font-size: 19px; font-weight: bold; text-align: left;">以下为您请求的验证码：</h1><table align="center" width="100%" cellpadding="0" cellspacing="0" style="width: 100%; margin: 30px auto; padding: 0; text-align: center;"><tr><td align="center"><div><p style="display: inline-block; width: 200px; background-color: #414EF9; border-radius: 3px; color: #ffffff; font-size: 15px; line-height: 45px; text-align: center; text-decoration: none; -webkit-text-size-adjust: none;">{{ . }}</a></div></td></tr></table><table style="margin-top: 25px; padding-top: 25px; border-top: 1px solid #E7EAEC;"><tr><td><p style="margin-top: 0; color: #839197; font-size: 16px; line-height: 1.5em; text-align: left; font-size: 12px;">验证码有效期为5分钟。</p><p style="margin-top: 0; color: #839197; font-size: 16px; line-height: 1.5em; text-align: left; font-size: 12px;">邮件由系统自动发送，请勿回复。</p></td></tr></table></td></tr></table></td></tr><tr><td><table align="center" width="570" cellpadding="0" cellspacing="0" style="width: 570px; margin: 0 auto; padding: 0; text-align: center;"><tr><td style="padding: 35px;"><p style="margin-top: 0; color: #839197; font-size: 16px; line-height: 1.5em; text-align: left; font-size: 12px; text-align: center; color: #839197;">上海职涯星商务咨询有限公司<br>上海市黄浦区BFC外滩金融中心S2-822</p></td></tr></table></td></tr></table></td></tr></table></body>
</html>
`
)

