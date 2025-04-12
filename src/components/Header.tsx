import { SignOutButton } from '@/SignOutButton'
import { Authenticated } from 'convex/react'
import { Cart } from './Cart'
import { Notifications } from './Notifications'
import { VendorRegistration } from './VendorRegistration'

const Header = () => {
      return (
            <header className="sticky top-0 z-10 bg-white shadow-sm p-4">
                  <div className="container mx-auto flex justify-between items-center">
                        <div className="flex items-center gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                              </svg>
                              <h2 className="text-2xl font-bold text-gray-800">Fresh Market</h2>
                        </div>
                        <div className="flex items-center gap-6">
                              <Authenticated>
                                    <div className="flex items-center gap-4">
                                          <VendorRegistration />
                                          <Notifications />
                                          <Cart />
                                    </div>
                              </Authenticated>
                              <SignOutButton />
                        </div>
                  </div>
            </header>
      )
}

export default Header