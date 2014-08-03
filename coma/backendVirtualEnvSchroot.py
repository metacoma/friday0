from coma import backendVirtualEnv
import subprocess
import json

class ComaBackendVirtualEnvSchroot(backendVirtualEnv.ComaBackendVirtualEnvBasic):

    def __chrootEnvStr(self):
        return "sudo schroot -r -c " + self.sessionId + " -- "

    def prefix(self):
        return self.__prefix

    def backendInit(self):
        try:
            self.sessionId = self.config['sessionName']
            self.schrootId = self.config['schrootName']
            self.__prefix = self.config['prefix']

            if (self.__shellExecute("sudo schroot --list -c session:" + self.sessionId + \
                " || sudo schroot -b -n " + self.sessionId + "  -c " + self.schrootId, [ 0, 1 ]).returncode == 1):
                raise backendUser.backendInitError()

        except KeyError:
            raise backendUsageError()

    def run(self, command, validExitCodes):
        return self.__shellChrootExecute(command, validExitCodes)


    #def suCommandStr(self, username, command):
    #    return "su -l " + username + " sh -c '" + command + "'"

    #def runAs(self, username, command, acceptableExitCodes):
    #    return self.run(self.suCommandStr(username, command), acceptableExitCodes)

    def read(self, path, env, user):

        if not user:
            user = "root"

        path = self.prefix() + "/" + path
        command = self.__chrootEnvStr() + "su -l " + user + " sh -c \"" + env + " " + path + "\""
        print command
        data = subprocess.check_output(command, shell=True)
        return json.loads(data)


    def __shellExecute(self, command, validExitCodes):

        if not command:
            raise backendInternalError()

        print command

        proc = subprocess.Popen(command, shell=True ,stdout=subprocess.PIPE)
        streamData = proc.communicate()[0]
        proc.wait()

        if (validExitCodes and proc.returncode not in validExitCodes):
            raise comaBackendRuntimeError()

        return proc

    def __shellChrootExecute(self, command, validExitCodes):

        if not command:
            raise backendInternalError()

        return self.__shellExecute(self.__chrootEnvStr() + " " + command, validExitCodes)
