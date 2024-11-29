from abc import ABC,abstractmethod
from services.IService import IService

class IFactory(ABC):
    
    @abstractmethod
    def createInstance(self, *filterNames: str) -> list[IService]:
        pass