import cv2
import numpy as np
from skimage.util import img_as_float, img_as_ubyte
from skimage.restoration import denoise_nl_means, estimate_sigma
from services.IService import IService
from skimage import exposure


class DenoiseNlMeansService(IService):
    def getFilterName(self):
        return "DenoiseNlMeans"

    def filterImage(self, img):
        img_gaussian_noise = img_as_float(img)
        sigma_est = np.mean(estimate_sigma(img_gaussian_noise))
        denoised_img = denoise_nl_means(
            img_gaussian_noise,
            h=1.15 * sigma_est,
            fast_mode=True,
            patch_size=5,
            patch_distance=3,
        )
        equalized_img = exposure.equalize_hist(denoised_img)
        equalized_img_uint8 = img_as_ubyte(equalized_img)

        return equalized_img_uint8
