from abc import ABC, abstractmethod


class IService(ABC):

    @abstractmethod
    def getFilterName(self):
        pass

    @abstractmethod
    def filterImage(self, img):
        pass
