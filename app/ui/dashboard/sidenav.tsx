import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-links';
import { PowerIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import { montserratAlternates } from '@/app/ui/fonts';

// import { signOut } from '@/auth';
export default function SideNav() {
  return (
    <div className='flex flex-col gap-8  md:h-screen bg-[#16275A] text-white p-4'>
      <div className='flex flex-row items-center justify-center mb-8 md:mb-18'>
        <AcademicCapIcon className=' w-20 md:w-30 mr-4' />
        <h1 className={`${montserratAlternates.className} font-bold mt-4 md:mt-0 text-3xl md:text-4xl`}>
          Learn Space 
        </h1>

      </div>
      <nav className='flex-grow flex flex-row md:flex-col gap-4'>
        <NavLinks />
      </nav>
      <div className='flex items-center justify-center mt-auto'>
        <Link href='/login' className='flex items-center gap-2 text-white hover:text-gray-300'>
          <PowerIcon className='w-6 h-6' />
          Logout
        </Link>
      </div>
    </div>
  );
}
