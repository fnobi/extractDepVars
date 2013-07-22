var UglifyJS = require('uglify-js'),
    _ = require('underscore'),
    Scope = require('./lib/Scope'),
    win = require('./lib/window.js');

var extractDepVars = function (code, opts) {
    opts = opts || {};

    var toplevel = UglifyJS.parse(code),
        scope = new Scope(toplevel);

    var walker = new UglifyJS.TreeWalker(function (node) {
        if (scope.end < node.end.endpos) {
            // console.log('[close: %d]', scope.depth());
            var undef = _.difference(scope.access, _.keys(scope.defined));
            scope = scope.parent;
            scope.access = _.union(scope.access, undef);
        }

        if (node instanceof UglifyJS.AST_Scope) {
            if (node instanceof UglifyJS.AST_Defun) {
                // console.log('[defun: %s on %d]', node.name.name, scope.depth());
                scope.defined[node.name.name] = true;

            }
            scope = scope.addChild(node);
            // console.log('[open: %d]', scope.depth());

            return;
        }

        if (node instanceof UglifyJS.AST_VarDef) {
            // console.log('[vardef: %s on %d]', node.name.name, scope.depth());
            scope.defined[node.name.name] = true;

        } else if (node instanceof UglifyJS.AST_VarDef) {
            // console.log('[vardef: %s on %d]', node.name.name, scope.depth());
            scope.defined[node.name.name] = true;

        } else if (node instanceof UglifyJS.AST_Symbol) {
            var name = node.name;

            while (name.name) {
                name = name.name;
            }

            if ('init' in node) {
                scope.defined[name] = true;
            }

            if (typeof name != 'string') {
                throw Error();
            }
            scope.access.push(name);
        } else if (node instanceof UglifyJS.AST_PropAccess && node.expression.name == 'window') {
            // windowを通してのアクセス
            var property = node.property;
            if (property.value) {
                property = property.value;
            }
            if (property.name) {
                property = property.name;
            }

            if (typeof property != 'string') {
                throw Error();
            }
            scope.access.push(property);
        }

        if (node.operator == '=') {
            // 定義をはさまない代入
            if (node.left.name) {
                name = node.left.name;
                if (name.value) {
                    name = name.value;
                }

                scope.defined[name] = true;
            }

            if (node.left.property) {
                property = node.left.property;
                if (property.value) {
                    property = property.value;
                }

                scope.defined[property] = true;
            }
        }
    });

    toplevel.walk(walker);

    while (scope.parent) {
        var undef = _.difference(scope.access, _.keys(scope.defined));
        scope = scope.parent;
        scope.access = _.union(scope.access, undef);
    }

    return _.difference(scope.access, _.keys(scope.defined), win);
};

module.exports = extractDepVars;