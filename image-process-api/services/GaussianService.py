from services.IService import IService
from skimage.filters import gaussian
from skimage import exposure
import cv2
import numpy as np


class GaussianService(IService):

    def getFilterName(self):
        return "Gaussian"

    def filterImage(self, img):
        filtered = cv2.GaussianBlur(img, (5, 5), 0)
        equalized_img = exposure.equalize_hist(filtered)
        equalized_img_uint8 = np.uint8(equalized_img * 255)

        return equalized_img_uint8
