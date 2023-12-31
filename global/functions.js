function isEmail(email) {
    return email.match(/[^\s@]+@[^\s@]+\.[^\s@]+/);
}

function isNumber(input) {
    return isNaN(input.value);
}

function transporterObj() {
    const nodemailer = require('nodemailer');
    // إنشاء ناقل بيانات لسيرفر SMTP مع إعداده 
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "drsolar.help@gmail.com",
            pass: "ocsumemqqrvtxfuh",
        }
    });
    return transporter;
}

function sendCodeToUserEmail(email) {
    // استدعاء مكتبة توليد شيفرة خاصة بإعادة ضبط كلمة السر
    let CodeGenerator = require('node-code-generator');
    const generator = new CodeGenerator();
    // توليد الكود المراد إرساله إلى الإيميل وفق نمط محدد
    const generatedCode = generator.generateCodes("###**#");
    // إعداد الرسالة قبل إرسالها
    const mailConfigurations = {
        from: "drsolar.help@gmail.com",
        to: email,
        subject: "رسالة التحقق من البريد الالكتروني الخاص بحسابك على موقع دكتور سولار",
        text: `مرحباً بك في خدمة التحقق من أنك صاحب البريد الالكتروني في دكتور سولار \n الكود هو: ${generatedCode}`,
    };
    return new Promise((resolve, reject) => {
        // إرسال رسالة الكود إلى الإيميل
        transporterObj().sendMail(mailConfigurations, function (error, info) {
            // في حالة حدث خطأ في الإرسال أرجع خطأ
            if (error) reject(error);
            // في حالة لم يحدث خطأ أعد الكود المولد
            resolve(generatedCode);
        });
    });
}

function sendEmail(data) {
    const fullRequestInfo = data[0];
    const senderRequestInfo = data[1];
    const text = `- service type: ${fullRequestInfo.serviceType}\n- subType type: ${fullRequestInfo.subType}\n- Address: ${fullRequestInfo.address}\n- preferred Date Of Visit: ${fullRequestInfo.preferredDateOfVisit}\n- preferred Time Of Visit: ${fullRequestInfo.preferredTimeOfVisit}\n- electricity Times: ${fullRequestInfo.electricityTimes}\n- is Wish Renew Subscription: ${fullRequestInfo.isWishRenewSubscription}\n ====================\n- first And Last Name: ${senderRequestInfo.firstAndLastName}\n- user email: ${senderRequestInfo.email}\n- mobile phone: ${senderRequestInfo.mobilePhone}\n- gender: ${senderRequestInfo.gender}\n- birthday: ${senderRequestInfo.birthday}\n- city: ${senderRequestInfo.city}\n- address: ${senderRequestInfo.address}`;
    let attachments = [];
    for (let i = 0; i < fullRequestInfo.files.length; i++) {
        attachments.push({
            path: fullRequestInfo.files[i],
        });
    }
    // إعداد الرسالة قبل إرسالها
    const mailConfigurations = {
        from: senderRequestInfo.email,
        to: "drsolar.help@gmail.com",
        subject: "New Request",
        text,
        attachments,
    };
    // إرسال البيانات إلى الإيميل وفق الإعدادات السابقة
    transporterObj().sendMail(mailConfigurations, function (error, info) {
        if (error) {
            // إرجاع الخطأ في حالة عدم نجاح عملية الإرسال
            console.log(err);
        }
        else {
            console.log("تم إرسال الإيميل بنجاح");
        };
    });
}

module.exports = {
    isEmail,
    sendCodeToUserEmail,
    isNumber,
    sendEmail,
}