const Observable = require("tns-core-modules/data/observable").Observable;
const BarcodeScanner = require("nativescript-barcodescanner").BarcodeScanner;
const clipboard = require("nativescript-clipboard");
const LoadingIndicatorModule = require("@nstudio/nativescript-loading-indicator").LoadingIndicator;
const Xloading = new LoadingIndicatorModule();
const snackBarModule = require("@nstudio/nativescript-snackbar").SnackBar;
const snackbar = new snackBarModule();

const ldHelper = require('./../localdb_helper');

var context;
let framePage;

exports.onLoaded = function(args) {
    framePage = args.object.frame; 
};

exports.onNavigatingTo = function(args) {
    const page = args.object;
    context = new Observable();

    context.set("isBeranda", true);
    context.set("isResult", false);
    
    page.bindingContext = context;
};

exports.scanqr = function() {
    context.set("isBeranda", true);
    context.set("isResult", false);
    
    var barcodescanner = new BarcodeScanner();
    barcodescanner.scan({
        formats: "QR_CODE,PDF_417, CODE_39, CODE_93, CODE_128, DATA_MATRIX, EAN_8, EAN_13, ITF, UPC_A, UPC_E, CODABAR, MAXICODE, RSS_14", // Pass in of you want to restrict scanning to certain types
        cancelLabel: "EXIT. Also, try the volume buttons!", // iOS only, default 'Close'
        cancelLabelBackgroundColor: "#333333", // iOS only, default '#000000' (black)
        message: "Use the volume buttons for extra light", // Android only, default is 'Place a barcode inside the viewfinder rectangle to scan it.'
        showFlipCameraButton: true, // default false
        preferFrontCamera: false, // default false
        showTorchButton: true, // default false
        beepOnScan: true, // Play or Suppress beep on scan (default true)
        fullScreen: true, // Currently only used on iOS; with iOS 13 modals are no longer shown fullScreen by default, which may be actually preferred. But to use the old fullScreen appearance, set this to 'true'. Default 'false'.
        torchOn: false, // launch with the flashlight on (default false)
        closeCallback: function() { console.log("Scanner closed"); }, // invoked when the scanner was closed (success or abort)
        resultDisplayDuration: 500, // Android only, default 1500 (ms), set to 0 to disable echoing the scanned text
        orientation: "portrait", // Android only, optionally lock the orientation to either "portrait" or "landscape"
        openSettingsIfPermissionWasPreviouslyDenied: true // On iOS you can send the user to the settings app if access was previously denied
    }).then(
        function(result) {
            context.set("isBeranda", false);
            context.set("isResult", true);

            context.set("qrdata", result.text.toString());
            let data = {
                scantime : ldHelper.dateNow(),
                qrdata : result.text.toString()
            };
            ldHelper.insert(data);
        },
        function(error) {
            snackbar.action({
                actionText: "OKE",
                actionTextColor: '#FFEB3B',
                snackText: "No scan: " + error,
                textColor: '#FFFFFF',
                hideDelay: 5000,
                backgroundColor: '#333',
                maxLines: 15, // Optional, Android Only
                isRTL: false
            });
            context.set("isBeranda", false);
            context.set("isResult", true);
        }
    );
};

exports.history = function() {
    framePage.navigate({
        moduleName: "riwayat/riwayat-page",
        animated: true,
        transition: { name: "fade"}
    });
};

exports.about = function() {
    framePage.navigate({
        moduleName: "informasi/informasi-page",
        animated: true,
        transition: { name: "fade"}
    });
};

exports.home = function() {
    context.set("isBeranda", true);
    context.set("isResult", false);
};

exports.dummy = function() {
    let result = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";
    context.set("qrdata", result);
    let data = {
        scantime : ldHelper.dateNow(),
        qrdata : result
    };
    ldHelper.insert(data);

    context.set("isBeranda", false);
    context.set("isResult", true);
};

exports.copytext = function(){
    Xloading.show(gConfig.loadingOption);
    clipboard.setText(context.qrdata).then(function() {
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