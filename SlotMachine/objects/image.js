var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var objects;
(function (objects) {
    // BUTTON CLASS +++++++++++++++++++++++++++++
    var image = (function (_super) {
        __extends(image, _super);
        // CONSTRUCTOR +++++++++++++++++++++++++++
        function image(imageString, x, y, centered) {
            _super.call(this, imageString);
            if (centered) {
                this.regX = this.getBounds().width * 0.5;
                this.regY = this.getBounds().height * 0.5;
            }
            this.x = x;
            this.y = y;
        }
        return image;
    })(createjs.Bitmap);
    objects.image = image;
})(objects || (objects = {}));
//# sourceMappingURL=image.js.map