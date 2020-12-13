const timerModule = require("tns-core-modules/timer");
const Observable = require("tns-core-modules/data/observable").Observable;
const clipboard = require("nativescript-clipboard");
const LoadingIndicatorModule = require("@nstudio/nativescript-loading-indicator").LoadingIndicator;
const Xloading = new LoadingIndicatorModule();
const snackBarModule = require("@nstudio/nativescript-snackbar").SnackBar;
const snackbar = new snackBarModule();
const ldHelper = require('./../localdb_helper');

let context;
let framePage;
let ndata;

exports.onLoaded = function(args) {
    framePage = args.object.frame; 
};

exports.onNavigatingTo = function(args) {
    const page = args.object;
    ndata = page.navigationContext;
    context = new Observable();

    var scantime = ndata.data.scantime.split(" ");
    var scantime_date = scantime[0] +" "+ scantime[1] +" "+ scantime[2] +" "+ scantime[3];

    let scantime_result = ndata.data.scantime;
    if(scantime_date.toLowerCase() === ldHelper.dateNow("date").toLowerCase()){
        scantime_result = "Today, " + scantime[4]; 
    }

    timerModule.setTimeout(() => {
        context.set("scantime", scantime_result);
        context.set("qrdata", ndata.data.qrdata);
    }, 150);

    page.bindingContext = context;
};

exports.onBackButtonTap = function(){
    framePage.goBack();
};

exports.copytext = function(){
    Xloading.show(gConfig.loadingOption);
    clipboard.setText(ndata.data.qrdata).then(function() {
        Xloading.hide();
        snackbar.action({
            actionText: "OKE",
            actionTextColor: '#FFEB3B',
            snackText: "OK, copied to the clipboard",
            textColor: '#FFFFFF',
            hideDelay: 5000,
            backgroundColor: '#333',
            maxLines: 15, // Optional, Android Only
            isRTL: false
        });
    });
};