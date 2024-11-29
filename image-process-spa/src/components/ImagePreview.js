import Image from "next/image";

const ImagePreview = ({ images }) => (
    <div className="bg-white w-full rounded-md p-3 mt-1 flex">
        {images.map((item, index) => (
            <div key={index} className="p-2">
                <h5>{item.filter}</h5>
                <Image
                    src={`data:image/png;base64,${item.image}`}
                    alt={`Filtered Result ${index}`}
                    width={200}
                    height={200}
                    unoptimized
                />
            </div>
        ))}
    </div>
);

export default ImagePreview;
