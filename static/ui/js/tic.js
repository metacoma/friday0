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

        var login = new metaContainer({ "parents": [ this.pumpHouse ], "nodeName": "login" });

        var pGeometry = this.pumpHouse.present.geometry

        var loginWidth = pGeometry.width * 30 / 100

        login.present.geometry = {
            x: pGeometry.width / 2 - loginWidth / 2,
            y: pGeometry.height / 2 - 150 - ((pGeometry.height / 2) * 35 / 100),
            width: loginWidth,
            height: 200
        }

        /*
        new metaContainer({ "parents": [ this.pumpHouse ], "nodeName": "Player 1" });
        new metaContainer({ "parents": [ this.pumpHouse ], "nodeName": "Player 2" });
        new metaContainer({ "parents": [ this.pumpHouse ], "nodeName": "Game" });

        this.mainSceneInit(width, height)

        var pGeometry = this.pumpHouse.present.geometry


        this.pumpHouse.path("Game").present.geometry = {
            x: pGeometry.width / 2 - 250,
            y: 120,
            width: 500,
            height: 300
        }

        this.pumpHouse.path("Player 1").present.geometry = {
            x: 0,
            y: 0,
            width: pGeometry.width / 2 - (pGeometry.width * 30 / 100),
            height: pGeometry.height - (pGeometry.height * 60 / 100)
        }


        var x = pGeometry.width / 2 + (pGeometry.width * 20 / 100);

        this.pumpHouse.path("Player 2").present.geometry = {
            x: x,
            y: 0,
            width: this.pumpHouse.path("Player 1").present.geometry.width,
            height: this.pumpHouse.path("Player 1").present.geometry.height
        }

        for (i = 0; i < 5; i++) {
            var x = new metaContainer({ "parents": [ this.pumpHouse.path("Player 1") ], "nodeName": "X" + i.toString() });
            x.props.set("gameBox");
            x.present.props.set("draggable");
        }

        for (i = 0; i < 5; i++) {
            var y = new metaContainer({ "parents": [ this.pumpHouse.path("Player 2") ], "nodeName": "O" + i.toString() });
            y.props.set("gameBox");
            y.present.props.set("draggable");
        }

        for (i = 0; i <= 8; i++) {
            var y = new metaContainer({ "parents": [ this.pumpHouse.path("Game") ], "nodeName": "F" + i.toString() });
        }
        */


    }

    this.show = function() {
        this.scene = new Scene2d(this.pumpHouse, this.tag);
        return this.scene.show()
    }

    return this.init(this.tag);

}

