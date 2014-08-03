from coma import backend
from coma import backendVirtualEnvSchroot
from coma import backendUserUnix


class ComaBackendUnix(backend.ComaBackendBasic):

    def backendInit(self):
        self.prefix = "/var/tmp"

        self.virtualEnv = backendVirtualEnvSchroot.ComaBackendVirtualEnvSchroot({
            "sessionName": "coma",
            "schrootName": "ttt",
            "prefix": self.prefix
        })

        self.userManager = backendUserUnix.ComaBackendUserUnix({
            "runCmd": self.virtualEnv.run,
            "prefix": self.prefix
        })
