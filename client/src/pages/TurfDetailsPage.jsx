import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getTurfById } from "../features/turfs/turfSlice";
import { createBooking } from "../features/bookings/bookingSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const TurfDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [bookingDate, setBookingDate] = useState(new Date());
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [hours, setHours] = useState(1);

  const { turf, loading, error } = useSelector((state) => state.turfs);
  const { userInfo } = useSelector((state) => state.auth);
  const { loading: loadingBooking, success: successBooking } = useSelector(
    (state) => state.bookings
  );

  useEffect(() => {
    dispatch(getTurfById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (successBooking) {
      navigate("/my-bookings");
    }
  }, [successBooking, navigate]);

  const calculateHours = (start, end) => {
    const [startHour, startMinute] = start.split(":").map(Number);
    const [endHour, endMinute] = end.split(":").map(Number);

    let totalHours = endHour - startHour;
    let totalMinutes = endMinute - startMinute;

    if (totalMinutes < 0) {
      totalHours -= 1;
      totalMinutes += 60;
    }

    return totalHours + totalMinutes / 60;
  };

  const handleTimeChange = (type, value) => {
    if (type === "start") {
      setStartTime(value);
    } else {
      setEndTime(value);
    }

    const calculatedHours = calculateHours(
      type === "start" ? value : startTime,
      type === "end" ? value : endTime
    );

    setHours(calculatedHours);
  };

 const submitHandler = async (e) => {
  e.preventDefault();

  if (!userInfo) {
    navigate('/login');
    return;
  }
  
  const confirmed = window.confirm('You need to pay ₹300 as an advance payment. Do you want to continue?');
  if (!confirmed) return;

  try {
    const res = await fetch('/api/payments/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        turfId: id,
        userId: userInfo._id,
        amount: 300,
        bookingDate,
        startTime,
        endTime,
      }),
    });

    // First check if the response is OK (status 200-299)
    if (!res.ok) {
      const errorData = await res.text(); // Try to read as text first
      try {
        // If it might be JSON, try to parse
        const jsonError = JSON.parse(errorData);
        throw new Error(jsonError.message || 'Payment failed');
      } catch {
        throw new Error(errorData || 'Payment failed');
      }
    }

    // If response is OK, try to parse as JSON
    const data = await res.json();

    if (data.url) {
      window.location.href = data.url; // Redirect to Stripe Checkout
    } else {
      throw new Error('No URL received from server');
    }
  } catch (error) {
    console.error('Stripe checkout error:', error);
    alert(`Payment failed: ${error.message}`);
  }
};

  if (loading) return <Loader />;
  if (error) return <Message variant="danger">{error}</Message>;
  if (!turf) return <Message variant="info">Turf not found</Message>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <img
            src={turf?.image || ""}
            alt={turf?.name || "Turf"}
            className="w-full h-auto rounded-lg shadow-md"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-4">{turf?.name || "Turf"}</h1>
          <p className="text-gray-600 mb-2">
            <span className="font-semibold">Location:</span>{" "}
            {turf?.location || "Not specified"}
          </p>
          <p className="text-green-700 font-bold text-xl mb-4">
            ₹{turf?.pricePerHour || 0} / hour
          </p>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-700">
              {turf?.description || "No description available"}
            </p>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Facilities</h2>
            <ul className="grid grid-cols-2 gap-2">
              {(turf?.facilities || []).map((facility, index) => (
                <li key={index} className="flex items-center">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {facility}
                </li>
              ))}
              {(!turf?.facilities || turf.facilities.length === 0) && (
                <li className="text-gray-500">No facilities listed</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-12 bg-gray-50 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Book This Turf</h2>

        <form onSubmit={submitHandler}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Booking Date
              </label>
              <DatePicker
                selected={bookingDate}
                onChange={(date) => setBookingDate(date)}
                minDate={new Date()}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time
              </label>
              <select
                value={startTime}
                onChange={(e) => handleTimeChange("start", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              >
                {Array.from({ length: 13 }, (_, i) => {
                  const hour = i + 8;
                  return `${hour.toString().padStart(2, "0")}:00`;
                }).map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Time
              </label>
              <select
                value={endTime}
                onChange={(e) => handleTimeChange("end", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              >
                {Array.from({ length: 13 }, (_, i) => {
                  const hour = i + 9;
                  return `${hour.toString().padStart(2, "0")}:00`;
                }).map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Hours
              </label>
              <input
                type="text"
                value={hours}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Amount:</span>
              <span className="text-xl font-bold">
                ₹{(hours * (turf?.pricePerHour || 0)).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={loadingBooking}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-md shadow-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              {loadingBooking ? "Processing..." : "Book Now"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TurfDetailsPage;
