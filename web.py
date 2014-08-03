from coma import backendUnix

from flask import Flask, render_template
from flask.ext.socketio import SocketIO, emit, join_room
from flask import request

from pprint import pprint


app = Flask(__name__)
app.config['SECRET_KEY'] = 'metacoma'
socketio = SocketIO(app)

backend = backendUnix.ComaBackendUnix({})

def flaskEnv2ShellEnv():
    valid_keys = "REMOTE_ADDR"
    r = ""
    for key in request.environ:
        if key in valid_keys:
            r = r + key + "='" + request.environ[key] + "' "
    return r


@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('my event', namespace='/test')
def test_message(message):
    emit('my response', {'data': message['data']})

@socketio.on('my broadcast event', namespace='/test')
def test_message(message):
    emit('my response', {'data': message['data']}, broadcast=True)

@socketio.on('connect', namespace='/coma')
def coma_connect():
    print "client connect"

@socketio.on('ping', namespace='/coma')
def coma_pong(data):
    emit("pong")

@socketio.on('cd', namespace='/coma')
def coma_cd(data):
    roomName = data['dst']
    roomUser = data['user']
    print roomUser + " cd " + roomName
    #join_room(roomName);

    emit("action", {
        "data": [
            {
                "src": None,
                "type": "change",
                "dst": "/",
                "name": "/",
                "data": {
                    "title": roomName
                }
            }
        ]
    });

    emit("action", {
        "data": backend.readDir(roomUser, roomName)
    })

@socketio.on('run', namespace='/coma')
def coma_run(data):
    runFile = data['dst']
    user = data['user']


    emit("action", {
        "data": [
            { "dst": "/", "type": "change", "data": { "title" : runFile } },
            { "dst": "/", "type": "cleanup" },
        ]

    });


    emit("action", {
        "data":
            backend.virtualEnv.read(runFile, "", user)
    });






@socketio.on('/login', namespace='/coma')
def coma_clientHandshake(name):

    try:
        clientName = name['data']
        emit("welcome back", None)
        print "welcome back " + clientName
        backend.login(clientName);
        emit("action", {"data": \
            [
                {
                    "src": None,
                    "type": "out",
                    "dst": "/",
                    "name": "login"
                }
            ]
        });

    except KeyError:
        emit("action", {'data': [
            #{ "dst": "/", "type": "cleanup" },
            backend.virtualEnv.read("/login", flaskEnv2ShellEnv(), None)
           ]
        });


@socketio.on('disconnect', namespace='/test')
def test_disconnect():
    print('Client disconnected')


if __name__ == '__main__':
    socketio.run(app, host="0.0.0.0")
