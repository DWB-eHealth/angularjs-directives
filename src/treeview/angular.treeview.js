/*
    @license Angular Treeview version 0.1.6
    ⓒ 2013 AHN JAE-HA http://github.com/eu81273/angular.treeview
    License: MIT


    [TREE attribute]
    angular-treeview: the treeview directive
    tree-id : each tree's unique id.
    tree-model : the tree model on $scope.
    node-id : each node's id
    node-label : each node's label
    node-children: each node's children

    <div
        data-angular-treeview="true"
        data-tree-id="tree"
        data-tree-model="roleList"
        data-node-id="roleId"
        data-node-label="roleName"
        data-node-children="children" >
    </div>
*/

(function(angular) {
    'use strict';

    angular.module('angularTreeview', []).directive('treeview', ['$compile',
        function($compile) {
            return {
                restrict: 'E',
                scope: {
                    'treeModel': '=',
                    'nodeLabel': '@',
                    'nodeId': '@',
                    'nodeChildren': '@',
                    'onNodeSelect': '&?',
                    'state': '=?',
                },
                link: function(scope, element, attrs) {
                    scope.nodeId = scope.nodeId || 'id';
                    scope.nodeLabel = scope.nodeLabel || 'label';
                    scope.nodeChildren = scope.nodeChildren || 'children';
                    scope.onNodeSelect = scope.onNodeSelect || function() {};
                    scope.state = scope.state || {};

                    var template =
                        '<ul>' +
                        '<li ng-repeat="node in treeModel">' +
                        '<span ng-class="{collapsed: node[nodeChildren].length && node.collapsed, expanded: node[nodeChildren].length && !node.collapsed, normal: !node[nodeChildren].length}"  ng-click="selectNodeHead(node)"></span>' +
                        '<span ng-class="node.selected" data-ng-click="selectNodeLabel(node)">{{node[nodeLabel]}}</span>' +
                        '<treeview ng-hide="node.collapsed" tree-model="node[nodeChildren]" node-id="{{nodeId}}"' +
                        ' node-label="{{nodeLabel}}" node-children="{{nodeChildren}}" on-node-select="onNodeSelect" state="state" />' +
                        '</li>' +
                        '</ul>';

                    // if (attrs.angularTreeview) {
                    scope.selectNodeHead = function(selectedNode) {
                        selectedNode.collapsed = !selectedNode.collapsed;
                    };

                    scope.selectNodeLabel = function(selectedNode) {
                        if (scope.state.currentNode && scope.state.currentNode.selected) {
                            scope.state.currentNode.selected = undefined;
                        }

                        //set highlight to selected node
                        selectedNode.selected = 'selected';

                        //set currentNode
                        scope.state.currentNode = selectedNode;
                        scope.onNodeSelect(selectedNode);
                    };
                    // }

                    //Rendering template.
                    element.html('').append($compile(template)(scope));
                }
            };
        }
    ]);
})(angular);