from coma import backend
from coma import backendVirtualEnvSchroot
from coma import backendUserUnix


class ComaBackendUnix(backend.ComaBackendBasic):

    def backendInit(self):
        self.virtualEnv = backendVirtualEnvSchroot.ComaBackendVirtualEnvSchroot( {"sessionName": "coma", "schrootName": "ttt" } )
        self.userManager = backendUserUnix.ComaBackendUserUnix({ "runCmd": self.virtualEnv.run} )
