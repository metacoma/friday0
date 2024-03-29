var default2dRectProps = {
    draggable: false,
    bodyOffsetX: 15,
    bodyOffsetY: 15
}

function present2dRectAllIntersections(container, pos) {
    var intersection = container.present._kObjects.layer.getIntersection(pos);
    return (intersection) ? intersection.getAttr('sceneObject') : null
}

function Object2dRect(sceneObj) {
    Object2d.call(this, sceneObj);


    for (var key in default2dRectProps) {
        this.props.assign(key, default2dRectProps[key]);
    }

    this.dragStartPosition = new present2dCoord()
    this.dragStartPosition.x = this.dragStartPosition.y = 0;
    this.tween = this.stage = null
}


Object2dRect.prototype = new Object2d;


Object2dRect.prototype.getLabel = function() {
    if (this.props.isSet('textLabel')) {
        return this.props.get('textLabel')
    }
    return this.sceneObject.nodeName
}


Object2dRect.prototype.drawLabel = function() {

        var absolutePosition = this.drawAbsolutePosition()

        var r = new Kinetic.Text({
            x: absolutePosition.x - this.getLabel().length / 1.8,
            y: absolutePosition.y + 10,
            width: absolutePosition.width,
            text: this.getLabel(),
            fill: "#000000",
            align: "center",
            fontFamily: 'Arial',
            fontSize: 18
        });

        this.bodyOffsetY += r.height() + 15;


        return r;
}

Object2dRect.prototype.drawAbsolutePosition = function() {
    var x = this.coord.x1,
        y = this.coord.y1,
        height = this.coord.height,
        width = this.coord.width,
        sceneParent = this.sceneObject.parent;

    if (width == null && height == null) {
        width = 120
        height = 60
    }

    if (x == null && y == null) {
        y = x = 0
    }

    if (sceneParent != null) {
        var requestedSpace = sceneParent.present.requestSpace(x, y, width, height);
        //console.dir(requestedSpace)
        var offsetX = sceneParent.present._kObjects.shape.x() + requestedSpace.x
        var offsetY = sceneParent.present._kObjects.shape.y() + requestedSpace.y


        x = offsetX
        y = offsetY

    } else {
        y = x = 0
    }

    return {
        x: x,
        y: y,
        width: width,
        height: height
    }

}

Object2dRect.prototype.reDraw = function() {
    return this._kObjects.layer.draw()
}

Object2dRect.prototype.toDown = function() {
    if (('layerTop' in this._kObjects)) {
        this.scene.dragLayer().remove(this._kObjects.layerTop)
     //   console.log("DESTROY LAYER DRAG");
    }
}

Object2dRect.prototype.toTop = function() {
    //return this._kObjects.layer.moveToTop()
    if (!('layerTop' in this._kObjects)) {
        /*
        this._kObjects.layerTop = new Kinetic.Layer()
        this._kObjects.layerTop.add(this._kObjects.group);
        this.stage.add(this._kObjects.layerTop)
        */
        this.scene.dragLayer().add(this._kObjects.group);
        //console.log("CREATE LAYER DRAG");

    }
}

Object2dRect.prototype.shadow = function(trigger) {


    if (trigger) {
        this._kObjects.shape.setAttrs({
	    shadowColor: 'black',
	    shadowBlur: 10,
	    shadowOffset: {x:5,y:5},
	    shadowOpacity:  0.6
	});
    } else {
	this._kObjects.shape.setAttrs({
	    shadowColor: 'black',
	    shadowBlur: 10,
	    shadowOffset: {x:5,y:5},
	    shadowOpacity:  0
        });
    }

}

Object2dRect.prototype.tweenScale = function(x, y) {
	//var node = this._kObjects.shape
	["shape", "label"].forEach(function(i) {

		var node = this._kObjects[i]
		new Kinetic.Tween({
                    node: node,
                    duration: 0.1,
                    scaleX: x,
                    scaleY: y,
                    easing: Kinetic.Easings.ElasticEaseInOut
		}).play();

	}, this)

}

Object2dRect.prototype.scale = function(x, y) {

    ["shape", "label"].forEach(function(i) {
        this._kObjects[i].setAttrs({
            scale: {
                x: x,
                y: y
            }
        })
    }, this)

    this.reDraw()

}

Object2dRect.prototype.cleanup = function() {
    this.bodyOffsetY = this.bodyOffsetX = 0
}

Object2dRect.prototype.requestSpace = function(x, y, requestWidth, requestHight) {
    if (this.bodyOffsetX + this.props.get("marginLeft") +  requestWidth > this.coord.width) {
        this.bodyOffsetY += 70
        this.bodyOffsetX = 0
    } else {
        this.bodyOffsetX + requestWidth
    }
    //console.log("BODYOFFSETX " + (x + this.bodyOffsetX + this.props.get("marginLeft")))

    return {
        x: x + this.bodyOffsetX + this.props.get("marginLeft"),
        y: y + this.bodyOffsetY + this.props.get("marginTop"),
        width: requestWidth,
        height: requestHight
    }
}

Object2dRect.prototype.allocateRowSpace = function(width) {
    this.bodyOffsetX += width;
}

Object2dRect.prototype.up = function() {
    this.props.assign("deepLevelBeforeUp", this.sceneObject.deepLevel);
    this.props.set("up");
    this.shadow(true);
    this.tweenScale(1.2, 1.2)
    this.toTop()
}

Object2dRect.prototype.updateLayer = function() {
    var deepLevel = null
    /*
    if (this.props.get("deepLevelBeforeUp")) {
        deepLevel = this.props.get("deepLevelBeforeUp");
    } else {
        deepLevel = this.sceneObject.deepLevel;
    }
    */

    deepLevel = this.sceneObject.deepLevel;

    this._kObjects.layer.setZIndex(deepLevel);
    this._kObjects.layer.draw()
}

Object2dRect.prototype.down = function() {
    this.props.unset("up");
    this.tweenScale(1, 1)
    this.shadow(false);
    this.toDown();
    this.updateLayer()
}

Object2dRect.prototype.draggableOff = function() {
    this.props.unset("draggable");
    for (i in this._kObjects) {
        //console.log("DISABLE DRAGGABLE FOR " + i);
        this._kObjects[i].setDraggable(false);
    }
}

Object2dRect.prototype.group = function() {
        var r = new Kinetic.Group({
             'draggable': this.props.isSet("draggable"),
             'listening': true,
             'dragOnTop': false
        })

        if (this.props.isSet("draggable") == false) {
            r.on("mousedown", function(evt) {
                var sceneObject = this.getAttr("sceneObject")
                if ("mousedown" in sceneObject.inEvents) {
                    sceneObject.out(sceneObject.nodeName);
                }
            })
        }


        if (this.props.isSet("draggable")) {

            r.on("mousedown", function(evt){
                var sceneObject = this.getAttr("sceneObject")
                var present = sceneObject.present
                sceneObject.log(logLevel.DEBUG, "mousedown");

                if (present.tween) {
                    //present.tween.pause();
                    present.tween.destroy();
                    present.tween = null
                }

            });

            r.on("dragstart", function(evt) {
                var sceneObject = this.getAttr("sceneObject")
                var present = sceneObject.present

                sceneObject.log(logLevel.DEBUG, "dragstart");

            })

            r.on("dragend", function(evt) {

                var sceneObject = this.getAttr("sceneObject")
                var present = sceneObject.present
                var stage = sceneObject.present._kObjects.group.getStage()
                var dragNode = evt.dragEndNode.getAttr("sceneObject");
                var scene = present.scene
                var endDrag = null


                var pos = { x: evt.offsetX, y: evt.offsetY }
		var maxLevel = -1;

                var collidingContainers = scene.feach(present2dRectAllIntersections, pos);

                if (collidingContainers.length) {
                    for (var i = 0; i < collidingContainers.length; i++) {
                        var sceneContainer = collidingContainers[i];

                        // skip himlsef
                        if (sceneContainer.nodeName == dragNode.nodeName)
                            continue;

			if (sceneContainer.deepLevel >= maxLevel) {
		            endDrag = sceneContainer
			    maxLevel = sceneContainer.deepLevel
			}
                    }
                }



		if (endDrag != null) {
		    if (endDrag.metaIn != null) {
		        if (endDrag.metaIn(dragNode.parent, dragNode) == false) {
		            endDrag = null
		        }
		    } else {
		        // default policy is deny
		        endDrag = null
		    }
		}

		if (endDrag != null) {
	            /* we have new parent! */

                    var prev = dragNode.parent

		    dragNode.parent = endDrag

		    dragNode.present.dragStartPosition.x = evt.dragEndNode.x()
		    dragNode.present.dragStartPosition.y = evt.dragEndNode.y()

                    if (dragNode.inEvents['newparent'] && (prev && prev != endDrag)) {
                        dragNode.log(logLevel.DEBUG, "new parent action");
                        sceneObject.out(endDrag);
                    }

                    if (endDrag.inEvents['newchild']) {
                        endDrag.out(sceneObject);
                    }

                    present.down();
		} else {
                    sceneObject.log(logLevel.DEBUG, "bad parent container, going back");

		    present.tween = new Kinetic.Tween({
		    	    node: dragNode.present._kObjects.group,
			    x: dragNode.present.dragStartPosition.x,
                            y: dragNode.present.dragStartPosition.y,
			    rotation: 0,
			    duration: 3,
                            onFinish:function(){
                                present.down();
                                present.tween.destroy()
                                present.tween = null
                                sceneObject.log(logLevel.DEBUG, "tween finish");
                            }
                    });
                    present.tween.play()
                }


            });

        }




        return r;
}

Object2dRect.prototype.shape = function() {

        var autoAlign = (this.geometry.x == null && this.geometry.y == null) ? true : false;

        var absolutePosition = this.drawAbsolutePosition();
        //console.dir(absolutePosition);

        var r = new Kinetic.Rect({
            x: absolutePosition.x,
            y: absolutePosition.y,
            width: absolutePosition.width,
            height: absolutePosition.height,
            fill: '#AABBCC',
            stroke: '#000000',
            strokeWidth: 3,
        });

        if (this.sceneObject.parent && autoAlign) {
            this.sceneObject.parent.present.allocateRowSpace(absolutePosition.width + this.props.get("padding"));
        }

        r.on("mouseover mouseout", function(e) {
                var sceneObject = this.getAttr("sceneObject")
                var present = sceneObject.present


                if (sceneObject == null) {
                    console.log("scene object is not defined!");
                    return
                }

                if (e.type == "mouseover")
                    sceneObject.log(logLevel.DEBUG, "mouseover");

                if (present.props.isSet("draggable") && (present.tween == null)) {

                    if (e.type == "mouseout") {
                        present.down();
                    }

                    if (e.type == "mouseover") {
                        present.up();
                    }

                }

        })



        return r;
}

Object2dRect.prototype.draw = function(stage) {

        this._kObjects.label = this.drawLabel();

        var thisIsMainScene = (this.sceneObject.childs.length == 0 && this.sceneObject.parent == null)

        if (this.sceneObject.childs.length > 0 || thisIsMainScene) {
            this._kObjects.layer = new Kinetic.Layer();
        } else {
            if (this.sceneObject.parent) {
                this._kObjects.layer = this.sceneObject.parent.present._kObjects.layer
            }
        }

        this._kObjects.group = this.group()
        this._kObjects.shape = this.shape()

        this._kObjects.group.add(this._kObjects.shape);
        this._kObjects.group.add(this._kObjects.label);
        this._kObjects.layer.add(this._kObjects.group);

        // XXX hack
        if (this.sceneObject.nodeName == "login") {

            this._kObjects.username = new Kinetic.Text({
                x: this._kObjects.shape.x() + 5,
                y: this._kObjects.shape.y() + 70,
                width: 110,
                text: "username",
                fill: "#000000",
                align: "center",
                fontFamily: 'Arial',
                fontSize: 18
            });

                   this._kObjects.editable = new Kinetic.EditableText({

                        x: this._kObjects.shape.x() + 5 + 120  ,
                        y: this._kObjects.shape.y() + 70,

                        fontFamily: 'Courier',
                        fill: '#000000',

                        // pasteModal id to support ctrl+v paste.
                        //pasteModal: "pasteModalArea"
                    });

                   this._kObjects.editable.on("inputEnd", function(evt, inputData) {
                        var sceneObject = evt.getAttr("sceneObject")
                        var userInput = evt.tempText[0].partialText
                        // XXX rewrite to metaOut
                        sceneObject.out(userInput)

                   });

                   this._kObjects.layer.add(this._kObjects.username);
                   this._kObjects.layer.add(this._kObjects.editable);
                   this._kObjects.editable.focus();

                   this._kObjects.editable.setAttr("sceneObject", this.sceneObject);
        }


        for (key in this._kObjects) {
            this._kObjects[key].setAttr("sceneObject", this.sceneObject);
        }

        if (this.sceneObject.childs.length > 0 || thisIsMainScene) {
            stage.add(this._kObjects.layer);
        }
	this.updateLayer()
        this.stage = stage

        this.sceneObject.log(logLevel.DEBUG, "draw at " + this._kObjects.shape.x() + ":" + this._kObjects.shape.y()  + " width: " + this._kObjects.shape.width() + " height: " + this._kObjects.shape.height() + " deepLevel " + this.sceneObject.deepLevel );

        this._kObjects.layer.setZIndex(this.sceneObject.deepLevel);

}


Object2dRect.prototype.destroy = function(stage) {
    for (k in this._kObjects) {
        this._kObjects[k].destroy
    }
}
