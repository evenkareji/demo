import { Dialog, Transition } from '@headlessui/react';
import { PhotographIcon } from '@heroicons/react/outline';
import classNames from 'classnames';
import React, { ChangeEvent, Fragment, useCallback, useState } from 'react';
import AvatarEditor from 'react-avatar-editor';
import { useDropzone } from 'react-dropzone';

const ImageSelector = () => {
  const [selectedImage, setSelectedImage] = useState<File>();
  const [scale, setScale] = useState<number>(1.5);

  const onDropAccepted = useCallback((acceptedFiles: File[]) => {
    setSelectedImage(acceptedFiles[0]);
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
  return (
    <div>
      <div
        className={classNames(
          'w-40 border-slate-600 hover:cursor-pointer hover:bg-blue-100 grid content-center border-2 rounded-md border-dashed aspect-square',
          isDragAccept && 'bg-blue-100',
        )}
        {...getRootProps()}
      >
        <div className="text-center">
          <PhotographIcon className="mx-auto w-10 h-10 text-slate-400" />
          <p className="text-slate-400 text-sm">画像を選択</p>
        </div>
        <input className="hidden" {...getInputProps} />
      </div>
      <Transition appear show={!!selectedImage} as={Fragment}>
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"></Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      {selectedImage && (
        <div>
          <AvatarEditor
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
    </div>
  );
};

export default ImageSelector;
