from coma import backendUser
import subprocess
#import shlex

class comaBackendNotImplement(BaseException):
    pass

class comaBackendUserBadUsername(BaseException):
    pass

class comaBackendRuntimeError(BaseException):
    pass

class ComaBackendUserUnix(backendUser.backendUserBasic):
    runCmd = None

    def backendInit(self):
        self.runCmd = self.config['runCmd']

    def __check_username__(self, username):
        if not username:
            raise comaBackendUserBadUsername()

    def new(self, username):
        self.__check_username__(username)
        proc = self.runCmd("useradd -md /var/tmp/" + username + " " + username, [ 0 ])

    def remove(self, username):
        self.__check_username__(username)
        proc = self.runCmd("userdel -r " + username, [ 0 ])

    def exists(self, username):
        self.__check_username__(username)
        proc = self.runCmd("id " + username, [ 0, 1 ])
        return not proc.returncode

    #def get(self, username):
    #    self.__check_username__(username)
    #    proc = self.__shellExecute("userdel " + username, [ 0 ])
