class comaBackendUsageError():
    pass


class ComaBackendBasic():

    config = None
    virtualEnv = None
    userManager = None

    def __init__(self, config):

        if (config == None):
            raise comaBackendUsageError()

        self.config = config
        self.backendInit()

    def login(self, username):
        if (self.userManager.exists(username) == False):
            self.userManager.new(username)
            self.virtualEnv.runAs(username, "git init ~", [ 0 ] )
