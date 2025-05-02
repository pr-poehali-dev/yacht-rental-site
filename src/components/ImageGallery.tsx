
import { useState } from 'react';
import { Dialog, DialogContent } from './ui/dialog';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  name: string;
}

const ImageGallery = ({ images, name }: ImageGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const openLightbox = (index: number) => {
    setSelectedImage(index);
    setIsOpen(true);
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {/* Main Image */}
        <div className="md:col-span-2 aspect-[16/9] overflow-hidden rounded-lg cursor-pointer" onClick={() => openLightbox(0)}>
          <img
            src={images[0]}
            alt={`${name} - основное изображение`}
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
          />
        </div>
        
        {/* Thumbnail Grid */}
        {images.slice(1).map((image, index) => (
          <div key={index} className="aspect-[4/3] overflow-hidden rounded-lg cursor-pointer" onClick={() => openLightbox(index + 1)}>
            <img
              src={image}
              alt={`${name} - изображение ${index + 2}`}
              className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
            />
          </div>
        ))}
      </div>

      {/* Lightbox Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-5xl p-0 bg-black/90">
          <button 
            onClick={() => setIsOpen(false)} 
            className="absolute right-4 top-4 z-10 text-white hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
          
          <div className="relative h-[80vh] flex items-center justify-center">
            <img
              src={images[selectedImage]}
              alt={`${name} - галерея`}
              className="max-h-full max-w-full object-contain"
            />
            
            <button 
              onClick={(e) => { e.stopPropagation(); prevImage(); }} 
              className="absolute left-4 text-white hover:text-gray-300 p-2 rounded-full bg-black/30"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
            
            <button 
              onClick={(e) => { e.stopPropagation(); nextImage(); }} 
              className="absolute right-4 text-white hover:text-gray-300 p-2 rounded-full bg-black/30"
            >
              <ChevronRight className="h-8 w-8" />
            </button>
            
            <div className="absolute bottom-4 text-white text-sm">
              {selectedImage + 1} / {images.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImageGallery;
