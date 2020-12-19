const Observable = require("tns-core-modules/data/observable").Observable;
const application = require("tns-core-modules/application");
const utilsModule = require("tns-core-modules/utils/utils");

var context;
let framePage;

exports.onLoaded = function(args) {
    framePage = args.object.frame; 
};

exports.onNavigatingTo = function(args) {
    const page = args.object;
    context = new Observable();

    application.android.on(application.AndroidApplication.activityBackPressedEvent, (args) => {
        args.cancel = true;
        framePage.goBack();        
    });

    page.bindingContext = context;
};

exports.onBackButtonTap = function(){
    framePage.goBack();
};

exports.ratenow = function(){
    utilsModule.openUrl("https://play.google.com/store/apps/details?id=com.kang.cahya.SimpleQRCodeScanner");
};

exports.donate = function(){
    utilsModule.openUrl("https://www.paypal.com/paypalme/dyazincahya");
};

exports.privacy = function(){
    utilsModule.openUrl("https://github.com/dyazincahya/pages/wiki/Privacy-Policy---Simple-QR-Scanner");
};

exports.pro = function(){
    utilsModule.openUrl("https://play.google.com/store/apps/details?id=com.kang.cahya.SimpleQRCodeScanner");
};