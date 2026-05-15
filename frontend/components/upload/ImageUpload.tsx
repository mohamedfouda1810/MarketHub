import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X, GripVertical } from 'lucide-react';
import Image from 'next/image';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useUploadProductImagesMutation } from '../../lib/api/productApi';
import toast from 'react-hot-toast';

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
}

const SortableImageItem = ({ image, onRemove }: { image: UploadedImage, onRemove: (id: string) => void }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group border rounded-md overflow-hidden h-32 w-32 bg-gray-50 flex items-center justify-center">
      <div {...attributes} {...listeners} className="absolute top-1 left-1 bg-white/80 p-1 rounded cursor-grab opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <GripVertical size={16} className="text-gray-700" />
      </div>
      <button 
        onClick={(e) => { e.preventDefault(); onRemove(image.id); }} 
        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
      >
        <X size={14} />
      </button>
      <Image src={image.preview} alt="preview" fill className="object-cover" />
    </div>
  );
};

export const ImageUpload = ({ productId }: { productId?: string }) => {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [uploadImages, { isLoading }] = useUploadProductImagesMutation();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newImages = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substring(7),
      file,
      preview: URL.createObjectURL(file)
    }));
    setImages(prev => [...prev, ...newImages]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxSize: 5 * 1024 * 1024 // 5MB
  });

  const handleRemove = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setImages((items) => {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleUpload = async () => {
    if (images.length === 0) return;
    if (!productId) {
      toast.error('Product ID is missing');
      return;
    }

    const formData = new FormData();
    images.forEach(img => formData.append('images', img.file));

    try {
      await uploadImages({ id: productId, data: formData }).unwrap();
      toast.success('Images uploaded successfully');
      setImages([]);
    } catch (error) {
      toast.error('Failed to upload images');
    }
  };

  return (
    <div className="space-y-4">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50'}`}
      >
        <input {...getInputProps()} />
        <UploadCloud className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-sm text-gray-600">Drag & drop some images here, or click to select files</p>
        <p className="text-xs text-gray-500 mt-2">Max size: 5MB per image. Formats: JPG, PNG, WEBP.</p>
      </div>

      {images.length > 0 && (
        <div className="bg-white p-4 rounded-lg border">
          <h4 className="text-sm font-medium mb-3">Reorder images (drag)</h4>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={images.map(i => i.id)} strategy={rectSortingStrategy}>
              <div className="flex flex-wrap gap-4">
                {images.map(img => (
                  <SortableImageItem key={img.id} image={img} onRemove={handleRemove} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
          
          <div className="mt-6 flex justify-end">
             <button 
                onClick={handleUpload} 
                disabled={isLoading}
                className="bg-black text-white px-4 py-2 rounded text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
             >
                {isLoading ? 'Uploading...' : `Upload ${images.length} Image(s)`}
             </button>
          </div>
        </div>
      )}
    </div>
  );
};
