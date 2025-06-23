const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Cricket Turf Booking</h3>
            <p className="text-gray-400">
              Book your cricket turf slots easily and conveniently.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-400 hover:text-white">Home</a></li>
              <li><a href="/turfs" className="text-gray-400 hover:text-white">Turfs</a></li>
              <li><a href="/my-bookings" className="text-gray-400 hover:text-white">My Bookings</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Email: info@cricketturf.com</li>
              <li>Phone: +1 234 567 890</li>
              <li>Address: 123 Turf Street, Sports City</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Cricket Turf Booking. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;