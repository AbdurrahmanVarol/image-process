from factories.IFactory import IFactory
from services.IService import IService
from services.GaussianService import GaussianService
from services.MedianService import MedianService
from services.DenoiseBilateralService import DenoiseBilateralService
from services.DenoiseNlMeansService import DenoiseNlMeansService
from services.WienerService import WienerService


class FilterFactory(IFactory):
    def __init__(self) -> None:
        self.filterServices = {
            "Gaussian": GaussianService(),
            "Median": MedianService(),
            "Denoise-bilateral": DenoiseBilateralService(),
            "Denoise-nl-means": DenoiseNlMeansService(),
            "Wiener": WienerService(),
        }

    def createInstance(self, filterName: str) -> IService:
        return self.filterServices[filterName]

    def createInstances(self, *filterNames) -> list[IService]:
        instances: list[IService] = []
        for filterName in filterNames:
            if filterName not in self.filterServices:
                raise ValueError(f"Invalid filter name: {filterName}")
            instances.append(self.filterServices[filterName])
        return instances
