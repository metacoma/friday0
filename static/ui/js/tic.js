S = null

function PlayGround(tag) {

    this.pumpHouse = null;
    this.source = null;
    this.destination = null;
    this.tag = tag;
    this.scene = null

    this.mainSceneInit = function(width, height) {
        this.pumpHouse.present.geometry = { "x" : 0, "y": 0, "width": width, "height": height }
    }

    this.init = function(tag) {

        var canvas = document.getElementById(this.tag);
        var width  = canvas.offsetWidth;
        var height = canvas.offsetHeight;

        this.pumpHouse = new metaContainer({ "parents": [], "nodeName": "Friday challenge #2" });
        this.mainSceneInit(width, height)


    }

    this.show = function() {
        this.scene = new Scene2d(this.pumpHouse, this.tag);
        return this.scene.show()
    }

    return this.init(this.tag);

}

