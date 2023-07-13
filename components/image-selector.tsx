import { Dialog, Transition } from '@headlessui/react';
import { PhotographIcon } from '@heroicons/react/outline';
import classNames from 'classnames';
import React, {
  ChangeEvent,
  Fragment,
  useCallback,
  useRef,
  useState,
} from 'react';
import AvatarEditor from 'react-avatar-editor';
import { useDropzone } from 'react-dropzone';
import {
  FieldValues,
  UseControllerProps,
  useController,
} from 'react-hook-form';

const ImageSelector = ({ control, name }: UseControllerProps<any>) => {
  const [selectedImage, setSelectedImage] = useState<File | null>();
  const [scale, setScale] = useState<number>(1.5);
  const ref = useRef<AvatarEditor>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { field }: any = useController({
    name,
    control,
  });

  const onDropAccepted = useCallback((acceptedFiles: File[]) => {
    setSelectedImage(acceptedFiles[0]);
    setIsModalOpen(true);
  }, []);
  const { getRootProps, getInputProps, isDragAccept } = useDropzone({
    onDropAccepted,
    accept: {
      'image/png': [],
      'image/jpeg': [],
    },
  });

  const handleScaleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setScale(parseFloat(e.target.value));
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const getCroppedImage = () => {
    const image = ref.current?.getImage();
    const canvas: any = document.createElement('canvas');

    canvas.width = 80;
    canvas.height = 80;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(image!, 0, 0, 80, 80);

    field.onChange(canvas.toDataURL('image/png'));
    closeModal();
  };
  return (
    <div>
      <div
        className={classNames(
          'w-40 border-slate-600 relative rounded-full hover:cursor-pointer hover:bg-blue-100 grid content-center border-2 overflow-hidden border-dashed aspect-square',
          isDragAccept && 'bg-blue-100',
        )}
        {...getRootProps()}
      >
        {field.value && (
          <img
            src={field.value as string}
            className="absolute w-full h-full block top-0 left-0"
            alt=""
          />
        )}
        <div className="text-center z-5 relative">
          <PhotographIcon className="mx-auto w-10 h-10 text-slate-400" />
          <p className="text-slate-400 text-sm">画像を選択</p>
        </div>
        <input className="hidden" {...getInputProps} />
      </div>
      {field.value && (
        <button
          className="text-slate-600 text-sm mt-2"
          onClick={() => field.onChange('')}
        >
          削除
        </button>
      )}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  {selectedImage && (
                    <div>
                      <AvatarEditor
                        ref={ref}
                        image={selectedImage}
                        width={250}
                        height={250}
                        borderRadius={125}
                        border={50}
                        color={[255, 255, 255, 0.6]} // RGBA
                        scale={scale}
                        rotate={0}
                      />
                      <input
                        type="range"
                        defaultValue={1.5}
                        min={1}
                        max={2}
                        step={0.1}
                        onChange={handleScaleChange}
                      />
                    </div>
                  )}
                  <div className="flex space-x-4 justify-end">
                    <button
                      className="px-3 rounded-full bg-slate-200 py-2"
                      onClick={closeModal}
                    >
                      閉じる
                    </button>
                    <button
                      onClick={getCroppedImage}
                      className="px-3 rounded-full bg-blue-500 text-white py-2"
                    >
                      保存
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default ImageSelector;
