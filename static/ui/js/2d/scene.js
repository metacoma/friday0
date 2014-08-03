S = null

function fixZIndex(container, index) {
	//return container.present.updateLayer()
}

function Scene2d(scene, tag) {
    var present = scene.present
    var stage = null
    var sceneContainer = scene
    var _dragLayer = new Kinetic.Layer()

    var cursor = new present2dCoord()

    // TODO getter && setter
    this.tag = tag;


    this.init = function() {
        return this.setStage()
    }

    this.feach = function(func, args) {
        return sceneContainer.feach(func, args);
    }

    this.setStage = function() {

		stage = new Kinetic.Stage({
                // 4 calls for geometry, nice!
        	x: present.geometry.x,
        	y: present.geometry.y,
        	container: tag,
        	width: present.geometry.width,
        	height: present.geometry.height,
      	});

        stage.on('mousemove', function(e) {
            cursor.x = e.evt.offsetX || e.evt.layerX
            cursor.y = e.evt.offsetY || e.evt.layerY;
            //$('#pumpDebug').html('position mouse on canvas: '+'x: ' + cursor.x + ', y: ' +  cursor.y);
        });

        return this
    }

    this.dragLayer = function() {
        return _dragLayer
    }

    this.show = function() {
        console.log("XXX DRAW")
        //stage.add(_dragLayer);
        sceneContainer.show(this, stage)
	//this.feach(fixZIndex, 0);
        stage.draw();
    }

    return this.init()
}
