import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '../context/auth';
import Sidebar from './sidebar';
import UserMenu from './user-menu';
import { useState } from 'react';
import { MenuIcon } from '@heroicons/react/outline';

const Header = () => {
  const { user, isLoading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  if (isLoading) {
    return null;
  }
  const closeModal = () => {
    setIsSidebarOpen(false);
  };
  const openModal = () => {
    setIsSidebarOpen(true);
  };
  return (
    <>
      <header className="py-4">
        <div className="flex items-center h-14 border-b container">
          <button className="p-2 mr-1" onClick={openModal}>
            <MenuIcon className="w-6 h-6" />
          </button>
          <Link href="/">
            <a className="flex">
              <Image src="/logo.svg" width={160} height={32} alt="Logoipsn" />
            </a>
          </Link>
          <span className="flex-1" />
          {user ? (
            <UserMenu />
          ) : (
            <Link href="/login">
              <a>ログイン</a>
            </Link>
          )}
        </div>
      </header>
      <Sidebar isOpen={isSidebarOpen} closeModal={closeModal} />
    </>
  );
};

export default Header;
