/*
 * Copyright (C) 2005 - 2022 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 *
 * Unless you have purchased a commercial license agreement from Jaspersoft,
 * the following license terms apply:
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */


/**
 * @version: $Id$
 */

/* global alert*/
import {Draggables, Draggable, Droppables} from 'dragdropextra';
import {Template} from 'prototype';
import dynamicTree from './dynamicTree.treenode';
import layoutModule from '../core/core.layout';
import designerBase from './dynamicTree.designerBase';
import {
    matchMeOrUp,
    isSupportsTouch,
    isIPad,
    isMetaHeld,
    isShiftHeld,
    isRightClick,
    isIE7,
    isIE,
    matchAny
} from '../util/utils.common';
import TouchController from '../util/touch.controller';
import {JRS} from "../namespace/namespace";
import jQuery from 'jquery';

dynamicTree.Tree.
    addVar('NODE_PATTERN', ".node").                //node itself
    addVar('NODE_WRAPPER_PATTERN', ".node > .wrap").
    addVar('NODE_ICON_PATTERN', ".node > .wrap .icon").
    addVar('NODE_CUSTOM_PATTERNS', []);

dynamicTree.Tree.
    addVar('LEAF_PATTERN', ".leaf").                //leaf itself
    addVar('LEAF_WRAPPER_PATTERN', ".leaf > .wrap").
    addVar('LEAF_ICON_PATTERN', ".leaf > .wrap .icon").
    addVar('LEAF_CUSTOM_PATTERNS', []);

dynamicTree.Tree.addVar('draggables', []);
dynamicTree.Tree.addVar('isMouseClick', false);
/**
 *
 */
dynamicTree.Tree.addMethod('getTreeNodeByEvent', function(event) {
    var element = Event.element(event); //event.originalTarget || event.srcElement;
    return this.getTreeNodeByElement(element);
});
dynamicTree.Tree.addMethod('getTreeNodeByElement', function(element) {
    while(element && element.readAttribute && jQuery(element).attr('id') !== this.id) {
        var node = element.treeNode;
        if (node && node.getTreeId() === this.getId()) {
            return node;
        } else {
            element = jQuery(element.parentNode)[0];
        }
    }
    return null;
});
/**
 *
 */
dynamicTree.Tree.addMethod('isNodeEvent', function(event) {
    //var element = Event.element(event);//event.originalTarget || event.srcElement;

    //var patterns = [this.NODE_PATTERN, this.NODE_WRAPPER_PATTERN, this.NODE_ICON_PATTERN];
    //if (isArray(this.NODE_CUSTOM_PATTERNS)) { patterns = patterns.concat(this.NODE_CUSTOM_PATTERNS); }

    var listItem = matchMeOrUp(event.element().parentNode,'LI');
    return listItem && jQuery(listItem).hasClass(layoutModule.NODE_CLASS);
});

/**
 *
 */
dynamicTree.Tree.addMethod('isLeafEvent', function(event) {
//    var element = Event.element(event);//event.originalTarget || event.srcElement;
//
//    var patterns = [this.LEAF_PATTERN, this.LEAF_WRAPPER_PATTERN, this.LEAF_ICON_PATTERN];
//    if (isArray(this.LEAF_CUSTOM_PATTERNS)) { patterns = patterns.concat(this.LEAF_CUSTOM_PATTERNS); }
//
//    return matchAny(element, patterns) != null;

    var listItem = matchMeOrUp(event.element().parentNode,'LI');
    return listItem && jQuery(listItem).hasClass(layoutModule.LEAF_CLASS);
});
/**
 *
 */
dynamicTree.Tree.addMethod('isIconEvent', function(event) {
//    var element = Event.element(event);//event.originalTarget || event.srcElement;
//
//    return matchAny(element,[this.NODE_ICON_PATTERN, this.LEAF_ICON_PATTERN], true) != null;
    return jQuery(event.element()).hasClass(layoutModule.ICON_CLASS);
});
/**
 *
 */
dynamicTree.Tree.addMethod('_registerEvents', function() {
    this._cleanUpListeners();
    this._registerClickEvents();
    this._registerCustomEvents(); // focus and blur
    this._registerKeyEvents();
    this._registerMouseEvents();
});
/**
 *
 */
dynamicTree.Tree.addMethod('_cleanUpListeners', function() {
    var treeContainer = this._getElement();

    treeContainer.stopObserving('click');
    treeContainer.stopObserving('dblclick');

    if (isSupportsTouch()) {
        treeContainer.stopObserving('touchstart');
        treeContainer.stopObserving('drag:touchstart');
        treeContainer.stopObserving('touchend');
    } else {
        treeContainer.stopObserving('mousedown');
        treeContainer.stopObserving('drag:mousedown');
        treeContainer.stopObserving('mouseup');
    }
    treeContainer.stopObserving('mouseover');
    treeContainer.stopObserving('mouseout');
});
/**
 *
 */
dynamicTree.Tree.addMethod('_registerClickEvents', function() {
    var treeContainer = this._getElement();

    treeContainer.observe('click', function(event) {
        var node = matchMeOrUp(event.element(), layoutModule.BUTTON_PATTERN) && this.getTreeNodeByEvent(event);
        if (!node) {return;}

        var isNode = this.isNodeEvent(event);
        var isLeaf = this.isLeafEvent(event);

        if (isNode) {
            treeContainer.fire('nodeIcon:click', {targetEvent: event, node: node});
            treeContainer.fire('node:click', {targetEvent: event, node: node});
        } else if (isLeaf) {
            treeContainer.fire('nodeIcon:click', {targetEvent: event, node: node});
            treeContainer.fire('leaf:click', {targetEvent: event, node: node});
        }

        if (!isIPad() && isNode) {
            node.handleNode(event);
        }

    }.bindAsEventListener(this));

    treeContainer.observe('dblclick', function(event) {
        var node = matchMeOrUp(event.element(), layoutModule.BUTTON_PATTERN) && this.getTreeNodeByEvent(event);
        if (!node) {return;}

        var isIcon = this.isIconEvent(event);
        var isNode = this.isNodeEvent(event);
        var isLeaf = this.isLeafEvent(event);

        if (isNode) {
            isIcon && treeContainer.fire('nodeIcon:dblclick', {targetEvent: event, node: node});
            treeContainer.fire('node:dblclick', {targetEvent: event, node: node})
        } else if (isLeaf) {
            isIcon && treeContainer.fire('leafIcon:dblclick', {targetEvent: event, node: node});
            treeContainer.fire('leaf:dblclick', {targetEvent: event, node: node})
        }

        if (this.handleNodeOnDblclick && (isNode || isLeaf) && !isIcon) {
            node.handleNode(event);
        }
    }.bindAsEventListener(this));

});

dynamicTree.Tree.addMethod('_registerMouseEvents', function() {
    var treeContainer = this._getElement();
    treeContainer.observe(isSupportsTouch() ? 'touchstart' : 'mousedown', function(event) {
    	var element = event.element();

        var node = matchMeOrUp(element, layoutModule.BUTTON_PATTERN) && this.getTreeNodeByEvent(event);
        if (!node) return;

        event.treeEvent = true;

        var isIcon = this.isIconEvent(event);
        var isNode = this.isNodeEvent(event);
        var isLeaf = this.isLeafEvent(event);

        if(isSupportsTouch()){
        	if(!JRS.vars.ajax_in_progress){
	            this.twofingers = false;
	            if(event.touches.length == 2) {
	            	this.twofingers = true;
	            	this._selectOrEditNode(event, node, isMetaHeld(event), isShiftHeld(event), isRightClick(event), { shouldFocus: true});
	            	if(node.isSelected() || (designerBase && designerBase.isInSelection(node))){
		            	var li = jQuery(element).parents('li:first');
                        jQuery(li).hasClass('selected') && document.fire(layoutModule.ELEMENT_CONTEXTMENU, {targetEvent: event, node: element});
		            	return;
	            	}
	            }
        	} else {
            	alert('please wait');
            }
        }

        if(!isSupportsTouch() || !JRS.vars.ajax_in_progress) {
            if (this.selectOnMousedown && (!isSupportsTouch() || event.touches.length == 1)) {
                this._selectOrEditNode(event, node, isMetaHeld(event), isShiftHeld(event), isRightClick(event), { shouldFocus: true });
            }

            if (isNode) {
                isIcon && treeContainer.fire('nodeIcon:mousedown', {targetEvent: event, node: node});
                treeContainer.fire('node:mousedown', {targetEvent: event, node: node})
            } else if (isLeaf) {
                isIcon && treeContainer.fire('leafIcon:mousedown', {targetEvent: event, node: node});
                treeContainer.fire('leaf:mousedown', {targetEvent: event, node: node})
            }
        }

    }.bindAsEventListener(this));

    //scriptaculous stopped mousedown event but we made it throw this instead
    treeContainer.observe(isSupportsTouch() ? 'drag:touchstart' :'drag:mousedown', function(e) {
        this.isMouseClick = true;
        var event = e.memo.targetEvent;

        var node = matchMeOrUp(event.element(), layoutModule.BUTTON_PATTERN) && this.getTreeNodeByEvent(event);
        if (!node) {return;}

        event.treeEvent = true;

        var isIcon = this.isIconEvent(event), isNode = this.isNodeEvent(event), isLeaf = this.isLeafEvent(event);

        if (this.selectOnMousedown && !isRightClick(event)) {
            this._selectOrEditNode(event, node, isMetaHeld(event), isShiftHeld(event), isRightClick(event), { shouldFocus: true});
        }

        //var eventNames = [];

        if (isNode) {
            isIcon && treeContainer.fire('nodeIcon.drag:mousedown', {targetEvent: event, node: node});
            treeContainer.fire('node.drag:mousedown', {targetEvent: event, node: node})
        } else if (isLeaf) {
            isIcon && treeContainer.fire('leafIcon.drag:mousedown', {targetEvent: event, node: node});
            treeContainer.fire('leaf.drag:mousedown', {targetEvent: event, node: node})
        }

    }.bindAsEventListener(this));

    treeContainer.observe(isSupportsTouch() ? 'touchend' : 'mouseup', function(event) {
        this.isMouseClick = true;
        var node = matchMeOrUp(event.element(), layoutModule.BUTTON_PATTERN) && this.getTreeNodeByEvent(event);
        if (!node) {return;}

        event.treeEvent = true;

        var isIcon = this.isIconEvent(event), isNode = this.isNodeEvent(event), isLeaf = this.isLeafEvent(event);

        if(this.twofingers) {
            event.isEmulatedRightClick = true;
        }
        if(isSupportsTouch() && !this.twofingers) {
	    	if(this.clickid == node.id) {
	    		if(!JRS.vars.ajax_in_progress && event.timeStamp - this.clicktime < 700) {
	    			if (isNode) {
	    	            isIcon && treeContainer.fire('nodeIcon:dblclick', {targetEvent: event, node: node});
	    	            treeContainer.fire('node:dblclick', {targetEvent: event, node: node})
	    	        } else if (isLeaf) {
	    	            isIcon && treeContainer.fire('leafIcon:dblclick', {targetEvent: event, node: node});
	    	            treeContainer.fire('leaf:dblclick', {targetEvent: event, node: node})
	    	        }

	    	        if (this.handleNodeOnDblclick && (isNode || isLeaf) && !isIcon) {
	    	            node.handleNode(event);
	    	        }
	    		}
	    	}
	        this.clicktime = event.timeStamp;
	        this.clickid = node.id;
    	}
        if(!isSupportsTouch() || !JRS.vars.ajax_in_progress) {
        	if (!this.selectOnMousedown && !TouchController.element_scrolled && (!isSupportsTouch() || event.changedTouches.length == 1)) {
                this._selectOrEditNode(event, node, isMetaHeld(event), isShiftHeld(event), isRightClick(event), { shouldFocus: true });
            }
            this._deselectOthers(event, node, isMetaHeld(event), isShiftHeld(event), isRightClick(event));

            if (isNode) {
                isIcon && treeContainer.fire('nodeIcon:mouseup', {targetEvent: event, node: node});
                treeContainer.fire('node:mouseup', {targetEvent: event, node: node})
            } else if (isLeaf) {
                isIcon && treeContainer.fire('leafIcon:mouseup', {targetEvent: event, node: node});
                treeContainer.fire('leaf:mouseup', {targetEvent: event, node: node})
            }

            if (isSupportsTouch() && isNode && isIcon && !TouchController.element_scrolled) {
                node.handleNode(event);
            }
        }

    }.bindAsEventListener(this));

    if ('createTouch' in document) {
    	/*_*\
        document.observe('touchmove', function(e) {
            var event = e.targetEvent ? e.targetEvent : e;
            var touch =  event.changedTouches[0];
            var element = $(document.elementFromPoint(touch.pageX, touch.pageY));
            var node = matchMeOrUp(element, layoutModule.BUTTON_PATTERN) && this.getTreeNodeByElement(element);
            if (node) {
                var draggable = this.createDraggableIfNeeded(event, node);
                draggable && draggable.initDrag(event);
                if (node != treeContainer.lastHoveredNode) {
                    treeContainer.lastHoveredNode && treeContainer.fire('tree:mouseout', { targetEvent: event, node: node });
                    treeContainer.lastHoveredNode = node;
                    treeContainer.fire('tree:mouseover', {targetEvent: event, node: node});
                }
            }
        }.bindAsEventListener(this));
        */
    } else {
        treeContainer.observe('mouseover', function(event) {
        	var el = event.element();
            var node = matchMeOrUp(el, layoutModule.BUTTON_PATTERN) && this.getTreeNodeByEvent(event);

            if (!node) {return;}

            this.createDraggableIfNeeded(event, node);
            !isIE7() && treeContainer.fire('tree:mouseover', {targetEvent: event, node: node});
        }.bindAsEventListener(this));

        if (!isIE7()) {
            treeContainer.observe('mouseout', function(event){
                var node = matchMeOrUp(event.element(), layoutModule.BUTTON_PATTERN) && this.getTreeNodeByEvent(event);
                if (!node) {return;}
                treeContainer.fire('tree:mouseout', {
                    targetEvent: event,
                    node: node
                });
            }.bindAsEventListener(this));
        }
    }

    //register default drop zone on tree
    Droppables.add(treeContainer,{
        accept: this.dropClasses,
        onDrop: (function(dragging){
            this.elementDropped = dragging;
        }).bind(this)
    });
});

dynamicTree.Tree.addMethod('_registerKeyEvents', function() {
    var treeContainer = this._getElement();

    let enterOrSpaceHandler = () => {
        return (event) => {
            const $el = jQuery('#resultsList').find('.selected')[0];
            const isElFoldersTree = jQuery(event.target).closest('.list.collapsible.folders').attr('id') === 'foldersTree';
            this.isMouseClick = false;
            if (isElFoldersTree) {
                document.body.style.cursor !== 'wait' && $el && $el.focus();
            } else {
                const node = this.getTreeNodeByEvent(event);
                if (dynamicTree.treeNodeEdited === node) {
                    return;
                }
                node && this._expandOrCollapse(node, event.memo.targetEvent);
            }
        }
    }

    treeContainer.observe('key:enter', enterOrSpaceHandler().bindAsEventListener(this));
    treeContainer.observe('key:space', enterOrSpaceHandler().bindAsEventListener(this));

    treeContainer.observe('key:home', function(event) {
        var node = this.getTreeNodeByEvent(event);
        this.isMouseClick = false;
        node && this._selectFirstVisibleNode(node, event.memo.targetEvent);
    }.bindAsEventListener(this));

    treeContainer.observe('key:end', function(event) {
        var node = this.getTreeNodeByEvent(event);
        this.isMouseClick = false;
        node && this._selectLastVisibleNode(node, event.memo.targetEvent);
    }.bindAsEventListener(this));

    treeContainer.observe('key:down', function(event) {
        event.memo.targetEvent.preventDefault();
        var node = this.getTreeNodeByEvent(event);
        this.isMouseClick = false;
        if (dynamicTree.treeNodeEdited === node) {
            return;
        }
        node && this._selectNextNode(node, event.memo.targetEvent);
    }.bindAsEventListener(this));

    treeContainer.observe('key:up', function(event) {
        event.memo.targetEvent.preventDefault();
        var node = this.getTreeNodeByEvent(event);
        this.isMouseClick = false;
        if (dynamicTree.treeNodeEdited === node) {
            return;
        }
        node && this._selectPreviousNode(node, event.memo.targetEvent);
    }.bindAsEventListener(this));

    treeContainer.observe('key:right', function(event) {
        var node = this.getTreeNodeByEvent(event);
        this.isMouseClick = false;
        if (dynamicTree.treeNodeEdited === node) {
            return;
        }
        node && this._selectInwards(node, event.memo.targetEvent);
    }.bindAsEventListener(this));

    treeContainer.observe('key:left', function(event) {
        var node = this.getTreeNodeByEvent(event);
        this.isMouseClick = false;
        if (dynamicTree.treeNodeEdited === node) {
            return;
        }
        node && this._selectOutwards(node, event.memo.targetEvent);
    }.bindAsEventListener(this));

    treeContainer.observe('key:contextMenu', function(event) {
        this.isMouseClick = false;
        var node = this.getTreeNodeByEvent(event);
        if (!node) {return;}
        event.treeEvent = true;

        treeContainer.fire('tree:contextMenu', {targetEvent: event, node: node, focused: event.memo.node});
    }.bindAsEventListener(this));
});

dynamicTree.Tree.addMethod('_registerCustomEvents', function() {
    var treeContainer = this._getElement();

    treeContainer.observe('mousedown', function(event) {
        if (!dynamicTree.activeTreeId || dynamicTree.activeTreeId !== this.getId()) {
            treeContainer.fire('tree:blur', {targetEvent: event, tree: dynamicTree.getActiveTree()});

            dynamicTree.activeTreeId = this.getId();
            treeContainer.fire('tree:focus', {targetEvent: event, tree: dynamicTree.getActiveTree()});
        }
    }.bindAsEventListener(this));

    treeContainer.observe('mouseover', function(event) {
        var node = this.getTreeNodeByEvent(event);

        if (!node) {
            treeContainer.fire('tree:mouseover', {targetEvent: event, tree: this});
        }
    }.bindAsEventListener(this));

    treeContainer.observe('mouseout', function(event) {
        var node = this.getTreeNodeByEvent(event);

        if (!node) {
            treeContainer.fire('tree:mouseout', {targetEvent: event, tree: this});
        }
    }.bindAsEventListener(this));

    treeContainer.observe('focusin', function(event) {
        const $el = jQuery(event.target).closest('.list.collapsible.folders');
        $el.attr('tabindex', -1);
        $el.find("[tabindex='0']").attr('tabindex', -1);
        $el.find('.selected').attr('tabindex', 0);
        var node = this.getTreeNodeByEvent(event);
        if (node) {
            if (!this.isMouseClick) {
                node.keydownSubFocus = true;
            }
            node.focus();
            node.refreshStyle();
        } else {
            $el.find('.selected').focus();
        }

        if ($el.find("[tabindex='0']").length === 0){
            $el.attr('tabindex', 0);
        }
    }.bindAsEventListener(this));

    treeContainer.observe('focus', function(event) {
        this.isMouseClick = false;
    }.bindAsEventListener(this));

    treeContainer.observe('focusout', function(event) {
        var node = this.getTreeNodeByEvent(event);
        if (node) {
            node.keydownSubFocus = false;
            node.refreshStyle();
        }
        const $el = jQuery(event.target).closest('.list.collapsible.folders');
        $el.find("[tabindex='0']").attr('tabindex', -1);
        $el.attr('tabindex', 0);
    }.bindAsEventListener(this));
});


dynamicTree.Tree.addMethod('fireOpenEvent', function(node, event) {
    var treeContainer = this._getElement();
    treeContainer.fire('node:open', {node: node, targetEvent: event});
});

dynamicTree.Tree.addMethod('fireSelectEvent', function(node, event) {
    var treeContainer = this._getElement();
    treeContainer.fire(node.isParent() ? 'node:selected' : 'leaf:selected', {node: node, targetEvent: event});
});


dynamicTree.Tree.addMethod('fireUnSelectEvent', function(node, event) {
    var treeContainer = this._getElement();
    treeContainer.fire(node.isParent() ? 'node:unselected' : 'leaf:unselected', {node: node, targetEvent: event});
});


dynamicTree.Tree.addMethod('fireUnSelectAllEvent', function(event) {
    var treeContainer = this._getElement();
    treeContainer.fire('items:unselected', {targetEvent: event});
});

dynamicTree.Tree.addMethod('fireEditEvent', function(node, newVal) {
    var treeContainer = this._getElement();
    treeContainer.fire(node.isParent() ? 'node:edit' : 'leaf:edit', {node: node, newValue: newVal})
});

dynamicTree.Tree.addMethod('fireStartEditEvent', function(node, input) {
    var treeContainer = this._getElement();
    treeContainer.fire(node.isParent() ? 'node:startEdit' : 'leaf:startEdit', {node: node, input: input})
});

dynamicTree.Tree.addMethod('fireEndEditEvent', function(node) {
    var treeContainer = this._getElement();
    treeContainer.fire(node.isParent() ? 'node:endEdit' : 'leaf:endEdit', {node: node})
});
/**
 *
 */
dynamicTree.Tree.addMethod('observe', function(eventName, handler) {
    this._getElement().observe(eventName, handler);
});
/**
 *
 */
dynamicTree.Tree.addMethod('stopObserving', function(eventName, handler) {
    this._getElement().stopObserving(eventName, handler);
});
dynamicTree.Tree.addMethod('createDraggableIfNeeded', function(event, node) {
    /*
    Make draggable - test in this order - for efficiency
    test 1) does the tree have any drag patterns?
    test 2) is a draggable already created for the clicked element?
    test 3) does clicked element or its ancestors match any draggable patterns?
    test 4) is a draggable already created for the clicked element or matching ancestor?
    */
    var thisElem = event ? event.element() : node._getElement().children(this.dragPattern);
    var isCreated = this.draggables[thisElem.identify()];

    if (this.dragPattern && !isCreated) {
        var matchingElem = matchAny(thisElem, [this.dragPattern], true);
        if (matchingElem && thisElem.className.toLowerCase().indexOf('icon') < 0 && !this.draggables[matchingElem.identify()]) {
            this.draggables[matchingElem.identify()] =
            new Draggable(thisElem, {
                superghosting: true,
                mouseOffset: true,
                delay: (isIE() || isSupportsTouch() ? 200 : 0),
                onStart: this.setDragStartState.bind(this, node),
                onEnd: this.setDragEndState.bind(this, node)
            });

            return this.draggables[matchingElem.identify()];
        }
    }

    return null;
});

dynamicTree.Tree.addMethod('setDragStartState', function(node, draggable, event) {
    var templateClassName = node._getElement().templateClassName;
    if (templateClassName) { jQuery(draggable.element).addClass(templateClassName); }

    draggable.element.setStyle({width: null, height: null});
    jQuery(draggable.element).addClass(layoutModule.DRAGGING_CLASS).addClass(this.getId());
    // Customize draggable style
    if (this.dragClasses) {
        jQuery(draggable.element).addClass(this.dragClasses);
    }

    if (this.selectedNodes.length > 1) {
        draggable.element.update(new Template(this.TREE_NN_ITEMS_SELECTED).evaluate({count: this.selectedNodes.length}));
    }

    draggable.element.node = node;
    draggable.element.nodes = this.selectedNodes;

    draggable.options.scroll = this._getElement();
    draggable.options.scrollSensitivity = layoutModule.SCROLL_SENSITIVITY;
    Draggables.dragging = this.regionID || true;
});

dynamicTree.Tree.addMethod('setDragEndState', function(node, draggable, event) {
    Draggables.dragging = null;
});

export default dynamicTree;
