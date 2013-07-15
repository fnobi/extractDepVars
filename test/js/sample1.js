var hoge = function (callback) {
    (function () {
        callback(moge);
    });

    var moge = 1;
};