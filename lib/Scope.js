var _ = require('underscore');

var Scope = function (node, parent) {
    this.start = node.start.pos;
    this.end = node.end ? node.end.endpos : this.start;
    this.parent = parent;

    this.defined = {};
    this.access = [];
};

Scope.prototype.isDefined = function (name) {
    if (name in this.defined) {
        return true;
    }

    if (this.parent) {
        return this.parent.isDefined(name);
    }

    return false;
};

Scope.prototype.undefList = function () {
    if (this.parent) {
        return _.uniq(_.union(this.undef, this.parent.undefList()));
    }

    return _.uniq(this.undef);
};

Scope.prototype.addChild = function (node) {
    return new Scope(node, this);
};

Scope.prototype.depth = function () {
    if (!this.parent) {
        return 0;
    }

    return this.parent.depth() + 1;
};

module.exports = Scope;
