app.directive('ngIfPermissionDirective', function($animate){
  return {
    multiElement: true,
    transclude: 'element',
    priority: 600,
    terminal: true,
    restrict: 'A',
    $$tlb: true,
    link: function($scope, $element, $attr, ctrl, $transclude) {
      console.log("I am here");
      var block, childScope, previousElements;
      
        console.log("I am there"); 
        $scope.$watch($attr.ngIfPermissionDirective, function ngIfWatchAction(value) {
        if(value) {
            if (!childScope) {
              $transclude(function(clone, newScope) { 
                childScope = newScope;
                clone[clone.length++] = document.createComment(' end ngIfPermission: ' + $attr.ngIfPermission + ' ');
                // Note: We only need the first/last node of the cloned nodes.
                // However, we need to keep the reference to the jqlite wrapper as it might be changed later
                // by a directive with templateUrl when its template arrives.
                 previousElements = getBlockNodes(clone);
                 $animate.enter(clone, $element.parent(), $element);
              });
            }
          }else {
            if (previousElements) {
              previousElements.remove();
              previousElements = null;
            }
            if (childScope) {
              childScope.$destroy();
              childScope = null;
            }
        }
        });
    }
  };
});

/**
 * Return the DOM siblings between the first and last node in the given array.
 * @param {Array} array like object
 * @returns {Array} the inputted object or a jqLite collection containing the nodes
 */
function getBlockNodes(nodes) {
  // TODO(perf): update `nodes` instead of creating a new object?
  var node = nodes[0];
  var endNode = nodes[nodes.length - 1];
  var blockNodes;

  for (var i = 1; node !== endNode && (node = node.nextSibling); i++) {
    if (blockNodes || nodes[i] !== node) {
      if (!blockNodes) {
        blockNodes = jqLite(slice.call(nodes, 0, i));
      }
      blockNodes.push(node);
    }
  }

  return blockNodes || nodes;
}