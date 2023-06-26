import { Dialog, Transition } from '@headlessui/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';

const items = [
  {
    label: 'ホーム',
    href: '/',
  },
  {
    label: '検索',
    href: '/search',
  },
  {
    label: 'このサイトについて',
    href: '/about',
  },
];

const subItems = [
  {
    label: '会社概要',
    href: '/company',
  },
  {
    label: '利用規約',
    href: '/terms',
  },
  {
    label: 'プライバシーポリシー',
    href: '/privacy',
  },
  {
    label: 'サポート',
    href: '/support',
  },
  {
    label: 'お問い合わせ',
    href: '/contact',
  },
  {
    label: 'ヘルプ',
    href: '/help',
  },
];

const Sidebar = ({
  isOpen,
  closeModal,
}: {
  isOpen: boolean;
  closeModal: VoidFunction;
}) => {
  const router = useRouter();
  useEffect(() => {
    router.events.on('hashChangeStart', closeModal);
    return () => router.events.off('hashChangeStart', closeModal);
  }, []);
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="fixed z-index inset-0" onClose={closeModal}>
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

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 -translate-x-full"
            enterTo="opacity-100 translate-x-0 "
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-x-0"
            leaveTo="opacity-0 -translate-x-full"
          >
            <Dialog.Panel className="w-80 overflow-y-auto fixed left-0 inset-y-0 bg-white p-6 z-20">
              <Link href="/">
                <a className="flex mb-6">
                  <Image
                    src="/logo.svg"
                    width={160}
                    height={32}
                    alt="Logoipsn"
                  />
                </a>
              </Link>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href}>
                      <a className="py-1 block hover:text-blue-500">
                        {item.label}
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
              <hr className="my-6" />
              <ul className="space-y-2">
                {subItems.map((subItem) => (
                  <li key={subItem.label}>
                    <Link href={subItem.href}>
                      <a className="text-slate-600">{subItem.label}</a>
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-slate-500">© tomo.</p>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
};
export default Sidebar;
