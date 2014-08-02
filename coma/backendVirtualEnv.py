class comaBackendVirtualEnvUsageError(BaseException):
    pass

class comaBackendVirtualEnvNotImplement(BaseException):
    pass

class ComaBackendVirtualEnvBasic():

    config = None

    def __init__(self, config):

        if (config == None):
            raise comaBackendVirtualEnvUsageError()

        self.config = config
        self.backendInit()

    def run(self, command, acceptableExitCodes):
        raise comaBackendVirtualEnvNotImplement()

    def suCommandStr(self, username, command):
        return "su -l " + username + " sh -c '" + command + "'"

    def runAs(self, username, command, acceptableExitCodes):
        return self.run(self.suCommandStr(username, command), acceptableExitCodes)
