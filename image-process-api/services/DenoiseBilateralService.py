from services.IService import IService
from skimage.restoration import denoise_bilateral
from skimage.util import img_as_float, img_as_ubyte
from skimage import exposure


class DenoiseBilateralService(IService):
    def getFilterName(self):
        return "DenoiseBilateral"

    def filterImage(self, img):
        img_float = img_as_float(img)
        denoised_img = denoise_bilateral(
            img_float,
            sigma_color=0.05,
            sigma_spatial=15,
            win_size=15,
        )
        equalized_img = exposure.equalize_hist(denoised_img)
        equalized_img_uint8 = img_as_ubyte(equalized_img)

        return equalized_img_uint8
