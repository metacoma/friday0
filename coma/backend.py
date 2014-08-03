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
            self.virtualEnv.runAs(username, "git config --global user.email " + username + "@coma", [ 0 ] )
            self.virtualEnv.runAs(username, "git config --global user.name " + username, [ 0 ] )
            self.virtualEnv.runAs(username, "cd ~" + username + "; ln -s ../../3x3 . && git add 3x3 && git commit -m 'init'", [ 0 ] )


    def readDir(self, username, path):
        return self.virtualEnv.read("/read " + self.virtualEnv.prefix() + path, "", username)
