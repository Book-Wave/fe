import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from '@headlessui/react';
import {
  ArrowPathIcon,
  ChartPieIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  SquaresPlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import {
  ChevronDownIcon,
  PhoneIcon,
  PlayCircleIcon,
} from '@heroicons/react/20/solid';
import { AuthContext } from '../../context/AuthContext';
import { handleLogout } from '../../services/AuthService';
import { removeAccessToken } from '../../utils/TokenUtil';
import Button from './Button';

const products = [
  {
    name: 'Analytics',
    description: 'Get a better understanding of your traffic',
    href: '#!',
    icon: ChartPieIcon,
  },
  {
    name: 'Engagement',
    description: 'Speak directly to your customers',
    href: '#!',
    icon: CursorArrowRaysIcon,
  },
  {
    name: 'Security',
    description: "Your customers' data will be safe and secure",
    href: '#!',
    icon: FingerPrintIcon,
  },
  {
    name: 'Integrations',
    description: 'Connect with third-party tools',
    href: '#!',
    icon: SquaresPlusIcon,
  },
  {
    name: 'Automations',
    description: 'Build strategic funnels that will convert',
    href: '#!',
    icon: ArrowPathIcon,
  },
];

const callsToAction = [
  { name: 'Watch demo', href: '#!', icon: PlayCircleIcon },
  { name: 'Contact sales', href: '#!', icon: PhoneIcon },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  const logout = async () => {
    try {
      await handleLogout();
      setIsLoggedIn(false);
      removeAccessToken();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleScroll = () => {
    if (window.scrollY > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      className={`shadow-md ${isScrolled ? "bg-white z-10" : ""}`}
    >
      <div
        className={`flex justify-between items-center px-6 py-4 max-w-screen-xl mx-auto`}
      >
        <div className="text-2xl font-bold">
          <Link to="/" className="text-blue-500">
            <img alt="" src="/bookwave.png" className="h-20 w-30" />
          </Link>
        </div>

        <div className="flex-grow max-w-lg mx-4 flex items-center space-x-2">
          <select className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="title">책 제목</option>
            <option value="author">저자</option>
            <option value="publisher">출판사</option>
            <option value="seller">판매자</option>
          </select>
          <input
            type="text"
            placeholder="Search..."
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button>검색</Button>
        </div>

        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              <Link to="/myshop" className="text-gray-700 hover:text-blue-500">
                MyShop
              </Link>
              <Link to="/mychat" className="text-gray-700 hover:text-blue-500">
                MyChat
              </Link>
              <Link to="/myitem" className="text-gray-700 hover:text-blue-500">
                MyItem
              </Link>
              <button
                onClick={logout}
                className="text-gray-700 hover:text-blue-500"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="text-gray-700 hover:text-blue-500">
              Login
            </Link>
          )}
        </div>
      </div>

      <nav
        aria-label="Global"
        className={`mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8 ${
          isScrolled ? 'bg-white' : ''
        }`}
      >
        <PopoverGroup className="hidden lg:flex lg:gap-x-12">
          <Popover className="relative">
            <PopoverButton className="flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900">
              Product
              <ChevronDownIcon
                aria-hidden="true"
                className="size-5 flex-none text-gray-400"
              />
            </PopoverButton>
            <PopoverPanel className="absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5">
              <div className="p-4">
                {products.map((item) => (
                  <div
                    key={item.name}
                    className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm/6 hover:bg-gray-50"
                  >
                    <div className="flex size-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                      <item.icon
                        aria-hidden="true"
                        className="size-6 text-gray-600 group-hover:text-indigo-600"
                      />
                    </div>
                    <div className="flex-auto">
                      <Link
                        to={item.href}
                        className="block font-semibold text-gray-900"
                      >
                        {item.name}
                      </Link>
                      <p className="mt-1 text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </PopoverPanel>
          </Popover>

          <Link
            to="/features"
            className="text-sm/6 font-semibold text-gray-900"
          >
            Features
          </Link>
          <Link
            to="/marketplace"
            className="text-sm/6 font-semibold text-gray-900"
          >
            Marketplace
          </Link>
          <Link to="/company" className="text-sm/6 font-semibold text-gray-900">
            Company
          </Link>
        </PopoverGroup>
      </nav>

      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link to="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img alt="" src="/bookwave.png" className="h-8 w-auto" />
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                <Disclosure as="div" className="-mx-3">
                  <DisclosureButton className="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">
                    Product
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="size-5 flex-none"
                    />
                  </DisclosureButton>
                  <DisclosurePanel className="mt-2 space-y-2">
                    {[...products, ...callsToAction].map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className="block rounded-lg py-2 pl-6 pr-3 text-sm/7 font-semibold text-gray-900 hover:bg-gray-50"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </DisclosurePanel>
                </Disclosure>
                <Link
                  to="/features"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                >
                  Features
                </Link>
                <Link
                  to="/marketplace"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                >
                  Marketplace
                </Link>
                <Link
                  to="/company"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                >
                  Company
                </Link>
              </div>
              <div className="py-6">
                <Link
                  to="/login"
                  className="-mx-3 block rounded-lg py-2.5 px-3 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                >
                  Log in
                </Link>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
