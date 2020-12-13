const Observable = require("tns-core-modules/data/observable").Observable;
const ObservableArray = require("tns-core-modules/data/observable-array").ObservableArray;
const TimerModule = require("tns-core-modules/timer");
const ldHelper = require('./../localdb_helper');
const LoadingIndicatorModule = require("@nstudio/nativescript-loading-indicator").LoadingIndicator;
const Xloading = new LoadingIndicatorModule();
const snackBarModule = require("@nstudio/nativescript-snackbar").SnackBar;
const snackbar = new snackBarModule();

var context;
let framePage;
var datalist = new ObservableArray([]);

function dataFound(x=true){
    if(x){
        context.set("isFound", true);
        context.set("isNotFound", false);
    } else {
        context.set("isFound", false);
        context.set("isNotFound", true);
    }
}

function loadData(){
    let db = ldHelper.get();
    datalist.splice(0);
    if(db.success){
        let data = db.data;
        if(data.length > 0){
            dataFound();
            for (let i = 0; i < data.length; i++) {
                var scantime = data[i].scantime.split(" ");
                var scantime_date = scantime[0] +" "+ scantime[1] +" "+ scantime[2] +" "+ scantime[3];

                let scantime_result = data[i].scantime;
                if(scantime_date.toLowerCase() === ldHelper.dateNow("date").toLowerCase()){
                    scantime_result = "Today, " + scantime[4]; 
                }
                datalist.push({
                    scantime : scantime_result,
                    qrdata : data[i].qrdata
                });
                
            }
        } else {
            dataFound(false);
            datalist.push([]);
        }
    } else {
        dataFound(false);
        datalist.push([]);
    }
    context.set("items", datalist);
}

exports.onLoaded = function(args) {
    framePage = args.object.frame; 
};

exports.onNavigatingTo = function(args) {
    const page = args.object;
    context = new Observable();

    Xloading.show(gConfig.loadingOption);
    TimerModule.setTimeout(() => {
        loadData();
        Xloading.hide();
    }, 500);   

    page.bindingContext = context;
};

exports.refreshPageTap = function(){
    Xloading.show(gConfig.loadingOption);
    TimerModule.setTimeout(() => {
        loadData();
        Xloading.hide();
    }, 1000);
};

exports.clearAllTap = function(){
    confirm({
        title: "Clear History Data",
        message: "Are you sure?",
        okButtonText: "Yes",
        neutralButtonText: "No"
    }).then((result) => {
        if(result) {
            let db = ldHelper.drop();
            if(db.success){
                Xloading.show(gConfig.cleaningOption);
                TimerModule.setTimeout(() => {
                    loadData();
                    Xloading.hide();
                    snackbar.action({
                        actionText: "OKE",
                        actionTextColor: '#FFEB3B',
                        snackText: "All history data been cleared :)",
                        textColor: '#FFFFFF',
                        hideDelay: 5000,
                        backgroundColor: '#333',
                        maxLines: 15, // Optional, Android Only
                        isRTL: false
                    });
                }, 1000);
            } else {
                Xloading.show(gConfig.cleaningOption);
                TimerModule.setTimeout(() => {
                    loadData();
                    Xloading.hide();
                    snackbar.action({
                        actionText: "OKE",
                        actionTextColor: '#FFEB3B',
                        snackText: "Data is empty!.",
                        textColor: '#FFFFFF',
                        hideDelay: 3500,
                        backgroundColor: '#333',
                        maxLines: 15, // Optional, Android Only
                        isRTL: false
                    });
                }, 1000);
            }
        }
    });
};

exports.onItemTap = (args) => {
    let itemTap = args.view;
    let itemTapData = itemTap.bindingContext;
    
    framePage.navigate({
        moduleName: "riwayat/riwayat-detail-page",
        context: { data: itemTapData },
        animated: true,
        transition: {
            name: "slide",
            duration: 200,
            curve: "ease"
        }
    });
};

exports.onBackButtonTap = function(){
    framePage.goBack();
};