from services.IService import IService
from skimage import exposure
import cv2
import numpy as np


class MedianService(IService):

    def getFilterName(self):
        return "Median"

    def filterImage(self, img):
        filtered = cv2.medianBlur(img, 5)
        equalized_img = exposure.equalize_hist(filtered)
        equalized_img_uint8 = (equalized_img * 255).astype(np.uint8)

        return equalized_img_uint8
