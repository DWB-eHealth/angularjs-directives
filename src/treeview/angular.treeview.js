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
                    'onNodeSelect': '=',
                    'state': '=?',
                    'selectedNodes': '=',
                    'allowMultiSelection': '=?'
                },
                link: function(scope, element, attrs) {
                    scope.nodeId = scope.nodeId || 'id';
                    scope.nodeLabel = scope.nodeLabel || 'label';
                    scope.nodeChildren = scope.nodeChildren || 'children';
                    scope.onNodeSelect = scope.onNodeSelect || function() {};
                    scope.state = scope.state || {};
                    scope.selectedNodes = scope.selectedNodes || [];
                    scope.allowMultiSelection = scope.allowMultiSelection || false;

                    if (scope.state.currentNode && scope.state.currentNode.selected && scope.selectedNodes.indexOf(scope.state.currentNode) < 0) {
                        scope.selectedNodes.push(scope.state.currentNode);
                    }

                    var template =
                        '<ul>' +
                        '<li ng-repeat="node in treeModel">' +
                        '<span ng-class="{collapsed: node[nodeChildren].length && node.collapsed, expanded: node[nodeChildren].length && !node.collapsed, normal: !node[nodeChildren].length}"  ng-click="selectNodeHead(node)"></span>' +
                        '<span ng-class="{selected: node.selected}" data-ng-click="selectNodeLabel(node, $event)">{{node[nodeLabel]}}</span>' +
                        '<treeview ng-hide="node.collapsed" tree-model="node[nodeChildren]" node-id="{{nodeId}}" selected-nodes="selectedNodes" allow-multi-selection="allowMultiSelection"' +
                        ' node-label="{{nodeLabel}}" node-children="{{nodeChildren}}" on-node-select="onNodeSelect" state="state" />' +
                        '</li>' +
                        '</ul>';

                    scope.selectNodeHead = function(selectedNode) {
                        selectedNode.collapsed = !selectedNode.collapsed;
                    };

                    scope.selectNodeLabel = function(selectedNode, $event) {
                        if (scope.allowMultiSelection && ($event.ctrlClick || $event.shiftKey || $event.metaKey)) {
                            // set highlight to selected node
                            selectedNode.selected = !selectedNode.selected;

                            if (selectedNode.selected) {
                                scope.selectedNodes.push(selectedNode);
                            } else {
                                var index = scope.selectedNodes.indexOf(selectedNode);
                                if (index > -1) scope.selectedNodes.splice(index, 1);
                            }
                        } else {
                            for (var i = 0; i < scope.selectedNodes.length; i++) {
                                scope.selectedNodes[i].selected = undefined;
                            }
                            scope.selectedNodes.splice(0, scope.selectedNodes.length);

                            if (scope.state.currentNode && scope.state.currentNode.selected) {
                                scope.state.currentNode.selected = false;
                            }

                            //set highlight to selected node
                            selectedNode.selected = true;
                            scope.selectedNodes.push(selectedNode);
                        }

                        //set currentNode
                        scope.state.currentNode = selectedNode;
                        scope.onNodeSelect(selectedNode);
                    };

                    //Rendering template.
                    element.html('').append($compile(template)(scope));
                }
            };
        }
    ]);
})(angular);