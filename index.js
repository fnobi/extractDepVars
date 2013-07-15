var UglifyJS = require('uglify-js'),
    _ = require('underscore'),
    jsdom = require('jsdom'),
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

        } else if (node.name) {
            var name = node.name;

            if ('init' in node) {
                scope.defined[name] = true;
            }

            // console.log('[access: %s on %d]', name, scope.depth());

            scope.access.push(name);
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