class backendNotImplement(BaseException):
    pass

class backendInternalError(BaseException):
    pass

class backendUsageError(BaseException):
    pass

class backendInitError(BaseException):
    pass

class backendUserBasic():
    config = None

    def __init__(self, config):

        if (config == None):
            raise backendUsageError()

        self.config = config
        self.backendInit()

    def new(self, username):
        raise backendNotImplement()

    def remove(self, username):
        raise backendNotImplement()

    def exists(self, username):
        raise backendNotImplement()

    def get(self, username):
        raise backendNotImplement()
