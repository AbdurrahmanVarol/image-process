from services.IService import IService
from skimage.restoration import wiener
from skimage.util import img_as_float, img_as_ubyte
from skimage import exposure
import numpy as np


class WienerService(IService):

    def getFilterName(self):
        return "Wiener"

    def filterImage(self, img):
        img = img_as_float(img)
        psf = np.ones((5, 5)) / 25
        filtered_img = wiener(img, psf=psf, balance=0.1)
        equalized_img = exposure.equalize_hist(filtered_img)
        filtered_img_uint8 = img_as_ubyte(equalized_img)

        return filtered_img_uint8
